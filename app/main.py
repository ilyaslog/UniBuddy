import streamlit as st
from pdf_processor import process_document  # Assuming this function processes PDF to text chunks
from embedding import add_to_vector_collection, query_collection
from gemini_ai import query_gemini_ai  # This is your custom AI query function (adjust as needed)

def handle_query(pdf_file, query):
    """Handles the entire flow from PDF processing to AI response."""
    # Step 1: Process the PDF and split it into chunks
    document_splits = process_document(pdf_file)
    
    # Step 2: Add the document splits to the vector database
    add_to_vector_collection(document_splits, "uploaded_pdf")
    
    # Step 3: Query the vector database for relevant documents
    results = query_collection(query)
    document_text = "\n".join([doc['metadata']['text'] for doc in results['matches']])
    
    gemini_prompt = (
        f"You are an expert AI tutor skilled in explaining complex concepts clearly and concisely. "
        f"Using the following documents as your knowledge base, provide a thorough and accurate answer to the question. "
        f"When appropriate, include examples or explanations to ensure understanding.\n\n"
        f"Documents:\n{document_text}\n\n"
        f"Question:\n{query}\n\n"
        f"Your response should be well-structured and informative."
    )
    answer = query_gemini_ai(gemini_prompt)
    return answer

# Streamlit App
def main():
    st.title("AI-Powered PDF Query Processor")
    st.write("Upload a PDF document, enter your query, and let the AI provide a detailed response.")

    # File Upload
    uploaded_file = st.file_uploader("Upload your PDF file", type=["pdf"])
    
    # Query Input
    query = st.text_input("Enter your query", placeholder="E.g., 'Summarize the document'")

    # Submit Button
    if st.button("Submit Query"):
        if uploaded_file is not None and query.strip():
            with st.spinner("Processing your request..."):
                try:
                    # Call the query handler
                    response = handle_query(uploaded_file, query)
                    st.success("Query processed successfully!")
                    st.write("### AI Response:")
                    st.write(response)
                except Exception as e:
                    st.error(f"An error occurred: {str(e)}")
        else:
            st.warning("Please upload a PDF and enter a query.")

# Run the app
if __name__ == "__main__":
    main()
