import chromadb
from chromadb.utils.embedding_functions.ollama_embedding_function import OllamaEmbeddingFunction

def get_vector_collection() -> chromadb.Collection:
    """Gets or creates a ChromaDB collection for vector storage."""
    ollama_ef = OllamaEmbeddingFunction(
        url="http://localhost:11434/api/embeddings",
        model_name="nomic-embed-text:latest",
    )
    chroma_client = chromadb.PersistentClient(path="./demo-rag-chroma")
    collection = chroma_client.get_or_create_collection(
        name="rag_app",
        embedding_function=ollama_ef,
        metadata={"hnsw:space": "cosine"},
    )
    print(f"Collection created: {collection.name}")  # Added log for collection creation
    return collection

def add_to_vector_collection(pdf_splits, file_name: str):
    """Adds document splits from a single PDF to a vector collection for semantic search."""
    collection = get_vector_collection()
    documents, metadatas, ids = [], [], []

    print("Adding chunks to the collection...")  # Log before adding

    for idx, split in enumerate(pdf_splits):
        # Ensure each chunk has page content, metadata, and a unique ID
        print(f"Processing split {idx}: {split}")  # Log each split to check structure
        documents.append(split['page_content'])  # Assuming 'page_content' is a key in split
        metadatas.append(split['metadata'])      # Assuming 'metadata' is a key in split
        ids.append(f"{file_name}_{idx}")          # Unique ID for each chunk

    # Log the length of the lists before upsert
    print(f"Preparing to upsert {len(documents)} chunks.")
    print(f"Documents: {documents[:3]}")  # Log first few documents to verify content
    print(f"Metadatas: {metadatas[:3]}")  # Log first few metadatas for verification
    print(f"IDs: {ids[:3]}")              # Log first few IDs for verification

    # Ensure lists are not empty
    if documents and metadatas and ids:
        try:
            collection.upsert(
                documents=documents,
                metadatas=metadatas,
                ids=ids,
            )
            print(f"Successfully added {len(documents)} chunks to the collection.")  # Log success
        except Exception as e:
            print(f"Error during upsert: {e}")  # Log any upsert errors
    else:
        print("Error: Empty lists detected. No data to upsert.")

def query_collection(prompt: str, n_results: int = 10):
    """Queries the vector collection with a given prompt to retrieve relevant documents."""
    collection = get_vector_collection()
    return collection.query(query_texts=[prompt], n_results=n_results)
