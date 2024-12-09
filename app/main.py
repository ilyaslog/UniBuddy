from pdf_processor import process_document
from embedding import add_to_vector_collection, query_collection
from gemini_ai import query_gemini_ai
def handle_query(pdf_file, query):
    """Handles the entire flow from PDF processing to AI response."""
    # Step 1: Process the PDF and split it into chunks
    document_splits = process_document(pdf_file)
    
    # Step 2: Add the document splits to the vector database
    add_to_vector_collection(document_splits, "uploaded_pdf")
    
    # Step 3: Query the vector database for relevant documents
    results = query_collection(query)
    

    print("Results:", results)
    

    document_text = "\n".join(["\n".join(doc) for doc in results['documents']])
    
    gemini_prompt = f"You are an expert AI tutor skilled in explaining complex concepts clearly and concisely. Using the following documents as your knowledge base, provide a thorough and accurate answer to the question. When appropriate, include examples or explanations to ensure understanding.\n\nDocuments:\n{document_text}\n\nQuestion:\n{query}\n\nYour response should be well-structured and informative"
    answer = query_gemini_ai(gemini_prompt)
    
    return answer
# app/main.py
if __name__ == "__main__":
    with open("IoT-Chapitre1.pdf", "rb") as f: 
        query = "generate me a sumarry about this document?"
        response = handle_query(f, query)
        print("AI Response:", response)

