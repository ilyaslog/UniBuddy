import pinecone
from pinecone import Pinecone, ServerlessSpec
import os
from sentence_transformers import SentenceTransformer

# Initialize Pinecone client
PINECONE_API_KEY = "your-api-key"  # Replace with your Pinecone API key
PINECONE_ENVIRONMENT = "your-environment"  # Replace with your Pinecone environment (e.g., 'us-west1-gcp')

# Define the index name
INDEX_NAME = "uploaded_pdf_index"

# Initialize Pinecone with the correct API key
pc = Pinecone(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)

# Check if the index exists, otherwise create a new one
if INDEX_NAME not in pc.list_indexes().names():
    # Create the index with a dimension of 768 and cosine similarity metric
    pc.create_index(
        name=INDEX_NAME,
        dimension=768,  # Adjust this if you're using a different embedding dimension
        metric="cosine",  # You can also use other metrics like "euclidean"
        spec=ServerlessSpec(  # Here we add the spec configuration
            cloud="aws",  # You can adjust the cloud provider if needed
            region="us-west-2"  # Adjust the region as per your need
        )
    )

# Initialize the model for text embeddings
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')  # You can use other models, adjust if needed

# Function to generate embeddings for a given text
def embed_text(text: str):
    """Generates embeddings for the provided text using a pre-trained model."""
    return model.encode(text).tolist()  # Return as a list for Pinecone

# Function to get the Pinecone collection (index)
def get_vector_collection() -> pinecone.Index:
    """Get the Pinecone index for storing vectors."""
    return pc.Index(INDEX_NAME)

def add_to_vector_collection(pdf_splits, file_name: str):
    """Adds document splits from a single PDF to the vector collection for semantic search."""
    collection = get_vector_collection()
    documents, metadatas, ids = [], [], []

    print("Adding chunks to the collection...")  # Log before adding

    for idx, split in enumerate(pdf_splits):
        print(f"Processing split {idx}: {split}")  # Log each split to check structure
        documents.append(split['page_content'])  # Assuming 'page_content' is a key in split
        metadatas.append(split['metadata'])      # Assuming 'metadata' is a key in split
        ids.append(f"{file_name}_{idx}")          # Unique ID for each chunk

    # Log the length of the lists before upsert
    print(f"Preparing to upsert {len(documents)} chunks.")

    # Ensure lists are not empty
    if documents and metadatas and ids:
        try:
            # Upsert the vectors into Pinecone
            collection.upsert(
                vectors=zip(ids, documents, metadatas),
            )
            print(f"Successfully added {len(documents)} chunks to the collection.")
        except Exception as e:
            print(f"Error during upsert: {e}")
    else:
        print("Error: Empty lists detected. No data to upsert.")

def query_collection(prompt: str, n_results: int = 10):
    """Queries the vector collection with a given prompt to retrieve relevant documents."""
    collection = get_vector_collection()
    query_vector = embed_text(prompt)  # Embed the query to get its vector
    results = collection.query(queries=[query_vector], top_k=n_results)

    # Return the documents of the results
    return results
