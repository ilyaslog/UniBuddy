import pyodbc
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import uuid
import json
import openai
from pinecone import Pinecone, ServerlessSpec
from azure_storage import upload_to_blob, download_from_blob
from pdf_processor import extract_pdf_chunks

app = Flask(__name__)
CORS(app)

# OpenAI API key
openai.api_key = 'Openaikey'

# Pinecone initialization
pc = Pinecone(api_key="pineconekey")
INDEX_NAME = 'unibuddy'

if INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
        name=INDEX_NAME,
        dimension=1536,
        metric='cosine',
        spec=ServerlessSpec(cloud='gcp', region='us-west1')
    )
index = pc.Index(INDEX_NAME)

# Azure SQL Configuration
AZURE_SQL_CONNECTION_STRING = (
    "Driver={ODBC Driver 18 for SQL Server};"
    "Server=unibuddy.database.windows.net;"
    "Database=unibuddy;"
    "Uid=adminuni;"
    "Pwd=Azerty123;"
    "Encrypt=yes;"
    "TrustServerCertificate=no;"
)

# Establish connection
def get_db_connection():
    return pyodbc.connect(AZURE_SQL_CONNECTION_STRING)

# User and session data storage
users = {}

def query_openai(messages: list, specialty: str) -> str:
    try:
        # Add specialty context to the system message
        system_message = f"You are an assistant specializing in {specialty}. Provide relevant and tailored responses."

        messages.insert(0, {"role": "system", "content": system_message})
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=700,
            temperature=0.7
        )
        return response['choices'][0]['message']['content'].strip()
    except openai.OpenAIError as e:
        return f"OpenAI API Error: {str(e)}"


def get_session_conversation(session_id):
    """
    Retrieve conversation history and specialty for a session ID.
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT role, content, filier
            FROM conversations
            WHERE session_id = ?
            ORDER BY timestamp ASC
        """, session_id)
        
        conversation = []
        specialty = None
        for row in cursor.fetchall():
            conversation.append({"role": row.role, "content": row.content})
            if specialty is None:
                specialty = row.filier
        
        return conversation, specialty

def save_message_to_db(session_id, username, role, content, specialty):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO conversations (id, session_id, username, role, content, filier)
            VALUES (NEWID(), ?, ?, ?, ?, ?)
        """, session_id, username, role, content, specialty)
        conn.commit()

def get_embedding(text):
    response = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response['data'][0]['embedding']

@app.route('/set_username', methods=['POST'])
def set_username():
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username is required."}), 400

    users[username] = {"sessions": {}}
    return jsonify({"message": f"Username '{username}' set successfully."}), 200

@app.route('/start_session', methods=['POST'])
def start_session():
    data = request.get_json()
    username = data.get("username")
    specialty = data.get("specialty")  # New field

    if not username or username not in users:
        return jsonify({"error": "Invalid or unconfigured username."}), 400

    if not specialty:
        return jsonify({"error": "Specialty is required."}), 400

    session_id = str(uuid.uuid4())
    users[username]["sessions"][session_id] = {"conversation": [], "specialty": specialty}
    save_message_to_db(session_id, username, "system", f"New session started with specialty '{specialty}'.", specialty)
    return jsonify({"message": f"New session '{session_id}' started.", "session_id": session_id}), 200


@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat interactions and retrieve or continue a session."""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON formatted."}), 400

    data = request.get_json()
    username = data.get("username")
    session_id = data.get("session_id")
    user_message = data.get("message")
    file_content = data.get("file")

    # Validate inputs
    if not username or username not in users:
        return jsonify({"error": "Invalid or unconfigured username."}), 400
    if not session_id:
        return jsonify({"error": "Session ID is required."}), 400

    # Get conversation history and specialty
    conversation, specialty = get_session_conversation(session_id)
    if not conversation:
        return jsonify({"error": "No conversation found for the provided session ID."}), 404

    # Process user message
    if user_message:
        conversation.append({"role": "user", "content": user_message})
        save_message_to_db(session_id, username, "user", user_message, specialty)

    # Handle file upload
    if file_content:
        try:
            pdf_data = base64.b64decode(file_content)
            file_name = f"{username}_uploaded_file.pdf"

            # Process PDF
            upload_to_blob(file_name, pdf_data)
            pdf_content = download_from_blob(file_name)
            pdf_text = extract_pdf_chunks(pdf_content)

            if "Error" not in pdf_text:
                embedding = get_embedding(pdf_text)
                index.upsert(vectors=[(
                    f"{username}_{file_name}",
                    embedding,
                    {"username": username, "content": pdf_text[:1000]}
                )])

                # Add system message with extracted PDF content for OpenAI
                pdf_message = f"The user uploaded a PDF. The extracted content is as follows: {pdf_text[:300]}..."
                conversation.append({"role": "system", "content": pdf_message})
                save_message_to_db(session_id, username, "system", pdf_message, specialty)

                # Add user message with file name
                file_message = f"The user uploaded a file named {file_name}."
                conversation.append({"role": "user", "content": file_message})
                save_message_to_db(session_id, username, "user", file_message, specialty)
            else:
                return jsonify({"error": f"PDF processing error: {pdf_text}"}), 500
        except Exception as e:
            return jsonify({"error": f"PDF processing error: {str(e)}"}), 500

    # Generate and save AI response
    response = query_openai(conversation, specialty)
    conversation.append({"role": "assistant", "content": response})
    save_message_to_db(session_id, username, "assistant", response, specialty)

    # Filter out 'system' messages before returning the conversation
    filtered_conversation = [msg for msg in conversation if msg["role"] != "system" and not msg["content"].startswith("The user uploaded a file named")]

    return jsonify({
        "response": response,
        "conversation": filtered_conversation,
        "specialty": specialty  # Include the specialty in the response
    })

@app.route('/list_sessions', methods=['POST'])
def list_sessions():
    """List all sessions for a given username."""
    data = request.get_json()
    username = data.get("username")

    if not username or username not in users:
        return jsonify({"error": "Invalid or unconfigured username."}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT session_id, MIN(timestamp) AS first_timestamp, filier
                FROM conversations
                WHERE username = ?
                GROUP BY session_id, filier
            """, (username,))
            sessions = [
               {"session_id": row[0], "timestamp": row[1], "filier": row[2]}
                for row in cursor.fetchall()
            ]
        return jsonify({"sessions": sessions})
    except Exception as e:
        return jsonify({"error": f"Error listing sessions: {str(e)}"}), 500

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    try:
        # Parse request body
        data = request.json
        session_id = data.get("session_id")
        if not session_id:
            return jsonify({"error": "session_id is required"}), 400

        # Fetch the conversation
        conversation, specialty = get_session_conversation(session_id)
        if not conversation:
            return jsonify({"error": "No conversation found"}), 404

        # Format conversation into text for OpenAI prompt
        chat_text = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in conversation])

        # Use OpenAI API to generate quiz
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[ 
                {
                    "role": "system",
                    "content": """Generate a quiz with 1 multiple choice question based on the pdf given 
                    Format as JSON array with structure:
                    {
                        "questions": [
                            {
                                "question": "question text",
                                "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
                                "correct": "A" // just the letter
                            }
                        ]
                    }"""
                },
                {
                    "role": "user",
                    "content": chat_text
                }
            ]
        )

        # Parse the quiz JSON string into a Python dictionary
        quiz = json.loads(response['choices'][0]['message']['content'])
        
        # Print the quiz output to the terminal
        print(f"Generated Quiz: {quiz}")
        
        # Return the parsed quiz
        return jsonify(quiz), 200

    except Exception as e:
        app.logger.error(f"Error in /generate_quiz: {e}")
        return jsonify({"error": "An internal error occurred"}), 500


        
@app.route('/check_answer', methods=['POST'])
def check_answer():
    """Check the user's answer to the current quiz question."""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON formatted."}), 400

    data = request.get_json()
    session_id = data.get("session_id")
    user_answer = data.get("answer")

    # Validate session ID and user answer
    if not session_id or not user_answer:
        return jsonify({"error": "Session ID and answer are required."}), 400

    # Retrieve the user's current quiz question index
    if session_id not in users or 'current_quiz_question' not in users[session_id]:
        return jsonify({"error": "No quiz in progress for this session."}), 400

    current_question_index = users[session_id]['current_quiz_question']
    conversation = get_session_conversation(session_id)

    # Generate quiz questions from the conversation
    questions = generate_quiz_from_conversation(conversation)

    if current_question_index >= len(questions):
        return jsonify({"message": "Quiz completed!"}), 200

    # Get the current question and check the answer
    correct_answer = questions[current_question_index]["correct_answer"]
    is_correct = user_answer == correct_answer

    # Update the user's current quiz question index
    users[session_id]['current_quiz_question'] += 1

    # Return the next question if available
    if users[session_id]['current_quiz_question'] < len(questions):
        next_question = questions[users[session_id]['current_quiz_question']]
        return jsonify({
            "is_correct": is_correct,
            "next_question": next_question,
            "question_number": users[session_id]['current_quiz_question'] + 1,
            "total_questions": len(questions)
        })
    else:
        return jsonify({
            "is_correct": is_correct,
            "message": "Quiz completed!"
        })


def generate_quiz_from_conversation(conversation):
    """Generate quiz questions based on conversation, with specific answers."""
    questions = []
    for i, message in enumerate(conversation):
        if message['role'] == 'assistant':
            # For simplicity, each assistant's message becomes a question
            question = {
                "question": f"What is the main idea of the following statement: {message['content']}",
                "answers": [
                    f"The user learned about: {message['content'][:50]}...",  # Shortened version of the answer
                    "Concept A",
                    "Concept B",
                    "Concept C"
                ],
                "correct_answer": f"The user learned about: {message['content'][:50]}..."  # Example answer
            }
            questions.append(question)
    return questions

    @app.route('/next_question', methods=['POST'])
    def next_question():
        """Retrieve the next question after the user answers."""
        if not request.is_json:
            return jsonify({"error": "Request must be JSON formatted."}), 400

        data = request.get_json()
        session_id = data.get("session_id")
        user_answer = data.get("answer")

    # Validate session ID and user answer
        if not session_id or not user_answer:
            return jsonify({"error": "Session ID and answer are required."}), 400

    # Retrieve the user's current quiz question index
    if session_id not in users or 'current_quiz_question' not in users[session_id]:
        return jsonify({"error": "No quiz in progress for this session."}), 400

    current_question_index = users[session_id]['current_quiz_question']
    conversation = get_session_conversation(session_id)

    # Generate quiz questions from the conversation
    questions = generate_quiz_from_conversation(conversation)

    if current_question_index >= len(questions):
        return jsonify({"message": "Quiz completed!"}), 200

    # Get the current question and check the answer
    correct_answer = questions[current_question_index]["correct_answer"]
    is_correct = user_answer == correct_answer

    # Update the user's current quiz question index
    users[session_id]['current_quiz_question'] += 1

    # Return the next question if available
    if users[session_id]['current_quiz_question'] < len(questions):
        next_question = questions[users[session_id]['current_quiz_question']]
        return jsonify({
            "is_correct": is_correct,
            "next_question": next_question,
            "question_number": users[session_id]['current_quiz_question'] + 1,
            "total_questions": len(questions)
        })
    else:
        return jsonify({
            "is_correct": is_correct,
            "message": "Quiz completed!"
        })


    @app.route('/start_quiz', methods=['POST'])
    def start_quiz():
        """Initialize the quiz for a session."""
        data = request.get_json()
        session_id = data.get("session_id")

        if not session_id:
            return jsonify({"error": "Session ID is required."}), 400

    # Retrieve the conversation for the session
        conversation = get_session_conversation(session_id)
        if not conversation:
            return jsonify({"error": "No conversation found."}), 404

    # Generate quiz questions
        quiz = generate_quiz_from_conversation(conversation)

    # Store the current quiz question index in the user's session
        users[session_id]['current_quiz_question'] = 0

    return jsonify({
        "quiz": quiz[0],  # Return the first question
        "question_number": 1,
        "total_questions": len(quiz)
    })


@app.route('/summarize_conversation', methods=['POST', 'OPTIONS'])
def summarize_conversation():
    """Summarize the entire chat conversation."""
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
        return ('', 204, headers)

    if not request.is_json:
        return jsonify({"error": "Request must be JSON formatted."}), 400

    data = request.get_json()
    session_id = data.get("session_id")
    username = data.get("username")

    if not session_id or not username:
        return jsonify({"error": "Session ID and username are required."}), 400

    try:
        # Get conversation history
        conversation, specialty = get_session_conversation(session_id)
        if not conversation:
            return jsonify({"error": "No conversation found"}), 404

        # Format conversation for summary
        chat_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation])

        # Generate summary using OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": "Please provide a well-structured and concise summary of the concepts discussed in this conversation, as well as any relevant content from the provided PDF documents. Highlight the key points, technical details, and actionable insights. Focus on summarizing the main ideas, problem-solving approaches, proposed solutions, and important contextual information. If there are any technical or practical steps discussed, ensure they are included clearly in the summary."
            }, {
                "role": "user",
                "content": chat_text
            }]
        )

        summary = response.choices[0].message.content

        return jsonify({"summary": summary})

    except Exception as e:
        app.logger.error(f"Error in /summarize_conversation: {e}")
        return jsonify({"error": f"Error summarizing conversation: {str(e)}"}), 500
def summarize_text(text):
    """Generate a summary of the provided text."""
    # You can use OpenAI to generate a summary
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Summarize the following text:\n{text}",
        max_tokens=200
    )
    return response.choices[0].text.strip()

if __name__ == '__main__':
    app.run(debug=True)

