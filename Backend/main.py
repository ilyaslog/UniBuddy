import os
from dotenv import load_dotenv
from DB import get_chromadb_client, get_or_create_collection
from pdfLoader import load_pdfs_from_folder
from embeddings import generate_embedding

# Load environment variables
load_dotenv()

# Paths (you can define these in a .env file or hardcode for simplicity)
PDF_FOLDER_PATH = os.getenv("PDF_FOLDER_PATH", "./Documents")
CHROMADB_STORE_PATH = os.getenv("CHROMADB_STORE_PATH", "./Store")

# Initialize ChromaDB client and collection
client = get_chromadb_client(persist_directory=CHROMADB_STORE_PATH)
collection = get_or_create_collection(client, "personal_data")


def store_data_in_chromadb(collection, text):
    """
    Store text chunks and their embeddings into a ChromaDB collection.
    """
    chunks = text.split("\n\n")  # Split text into chunks
    for i, chunk in enumerate(chunks):
        embedding = generate_embedding(chunk)
        collection.add(
            embeddings=[embedding],
            metadatas=[{"chunk_index": i}],
            documents=[chunk]
        )


if __name__ == "__main__":
    # Load and combine text from PDFs
    combined_text = load_pdfs_from_folder(PDF_FOLDER_PATH)

    # Store in ChromaDB
    if combined_text.strip():  # Ensure there's text to process
        store_data_in_chromadb(collection, combined_text)
        print("Data successfully stored in ChromaDB!")
    else:
        print("No text extracted from PDFs.")
