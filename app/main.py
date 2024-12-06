# app/main.py
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
    
    # Print the structure of the results for debugging
    print("Results:", results)
    
    # Step 4: Generate the document text by joining the list of strings
    # Accessing results['documents'], which is a list of lists of strings
    document_text = "\n".join(["\n".join(doc) for doc in results['documents']])
    
    gemini_prompt = f"Given the following documents, answer the question:\n\n{document_text}\n\nQuestion: {query}"
    answer = query_gemini_ai(gemini_prompt)
    
    return answer


# app/main.py
if __name__ == "__main__":
    with open("Resume.pdf", "rb") as f:
        query = "What is this document about?"
        response = handle_query(f, query)
        print("AI Response:", response)
