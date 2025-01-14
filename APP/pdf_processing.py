from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import uuid
import base64
from datetime import datetime
from azure.storage.blob import BlobServiceClient
from io import BytesIO

app = Flask(__name__)
CORS(app)

# OpenAI API key
openai.api_key = 'OpenaiKey'
# Azure Blob Storage Configuration
AZURE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=pdfunibuddy;AccountKey=accountkey;EndpointSuffix=core.windows.net"
AZURE_CONTAINER_NAME = "pdf"

# Initialize Azure Blob Service Client
blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)
container_client = blob_service_client.get_container_client(AZURE_CONTAINER_NAME)

# In-memory storage
sessions = {}
user_conversations = {}

def upload_to_blob(file_name, file_content):
    """Uploads a file to Azure Blob Storage."""
    try:
        blob_client = container_client.get_blob_client(file_name)
        blob_client.upload_blob(file_content, overwrite=True)
        return True, f"Blob {file_name} uploaded successfully."
    except Exception as e:
        return False, f"Error uploading to Azure Blob Storage: {str(e)}"

def download_from_blob(file_name):
    """Downloads a file from Azure Blob Storage."""
    try:
        blob_client = container_client.get_blob_client(file_name)
        blob_data = blob_client.download_blob()
        return True, BytesIO(blob_data.readall())
    except Exception as e:
        return False, f"Error downloading from Azure Blob Storage: {str(e)}"

def query_openai(messages, specialty=None):
    try:
        if specialty:
            system_message = f"You are a tutor specializing in {specialty}. Help the student learn about this topic."
            messages.insert(0, {"role": "system", "content": system_message})
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=700,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/set_username', methods=['POST'])
def set_username():
    data = request.json
    username = data.get('username')
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    return jsonify({'message': 'Username set successfully'})

@app.route('/start_session', methods=['POST'])
def start_session():
    data = request.json
    username = data.get('username')
    specialty = data.get('specialty')
    
    if not username or not specialty:
        return jsonify({'error': 'Username and specialty are required'}), 400
    
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        'username': username,
        'specialty': specialty,
        'created_at': datetime.now().isoformat()
    }
    
    user_conversations[session_id] = [{
        'role': 'system',
        'content': f'You are a tutor specializing in {specialty}. Help the student learn about this topic.'
    }]
    
    return jsonify({
        'session_id': session_id,
        'message': 'Session started successfully'
    })

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    session_id = data.get('session_id')
    message = data.get('message')
    file_content = data.get('file')  # Base64 encoded file content
    
    if not session_id or (not message and not file_content):
        return jsonify({'error': 'Session ID and either message or file are required'}), 400
    
    if session_id not in user_conversations:
        return jsonify({'error': 'Session not found'}), 404
    
    # Handle file content if present
    if file_content:
        try:
            # Decode base64 file content
            file_bytes = base64.b64decode(file_content)
            file_name = f"{sessions[session_id]['username']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            
            # Upload to Azure Blob Storage
            success, result = upload_to_blob(file_name, file_bytes)
            if not success:
                return jsonify({'error': result}), 500
            
            # Download the file to process it
            success, file_data = download_from_blob(file_name)
            if not success:
                return jsonify({'error': file_data}), 500
            
            # Add file information to conversation
            file_message = f"The user has uploaded a PDF file named {file_name}. Please analyze its contents."
            user_conversations[session_id].append({
                'role': 'system',
                'content': file_message
            })
            
        except Exception as e:
            return jsonify({'error': f'File processing error: {str(e)}'}), 500
    
    # Add user message if present
    if message:
        user_conversations[session_id].append({
            'role': 'user',
            'content': message
        })
    
    try:
        # Get response from OpenAI
        specialty = sessions[session_id].get('specialty')
        response = query_openai(user_conversations[session_id], specialty)
        
        # Add assistant response to conversation
        user_conversations[session_id].append({
            'role': 'assistant',
            'content': response
        })
        
        # Filter out system messages for the response
        filtered_conversation = [
            msg for msg in user_conversations[session_id] 
            if msg['role'] != 'system'
        ]
        
        return jsonify({
            'conversation': filtered_conversation
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    data = request.json
    session_id = data.get('session_id')
    
    if not session_id or session_id not in user_conversations:
        return jsonify({'error': 'Invalid session ID'}), 400
    
    try:
        # Get conversation history
        conversation = "\n".join([
            f"{msg['role']}: {msg['content']}" 
            for msg in user_conversations[session_id] 
            if msg['role'] != 'system'
        ])
        
        # Generate quiz using OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{
                'role': 'system',
                'content': 'Generate a quiz with 5 multiple choice questions based on the conversation. Format as JSON with questions array containing objects with question, options (array), and correct (letter A-D) fields.'
            }, {
                'role': 'user',
                'content': conversation
            }]
        )
        
        quiz_content = response.choices[0].message.content
        # Convert string to Python object and extract questions
        import json
        quiz_data = json.loads(quiz_content)
        
        return jsonify({'questions': quiz_data['questions']})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/summarize_conversation', methods=['POST'])
def summarize_conversation():
    data = request.json
    session_id = data.get('session_id')
    
    if not session_id or session_id not in user_conversations:
        return jsonify({'error': 'Invalid session ID'}), 400
    
    try:
        # Get conversation history
        conversation = "\n".join([
            f"{msg['role']}: {msg['content']}" 
            for msg in user_conversations[session_id] 
            if msg['role'] != 'system'
        ])
        
        # Generate summary using OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{
                'role': 'system',
                'content': 'Summarize the key points of this conversation in a clear and concise way.'
            }, {
                'role': 'user',
                'content': conversation
            }]
        )
        
        return jsonify({'summary': response.choices[0].message.content})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)