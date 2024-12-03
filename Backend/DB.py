from chromadb.config import Settings
import chromadb
import os

def get_chromadb_client(persist_directory="./Store"):
    """
    Initialize and return a ChromaDB client with persistence.
    """
    client = chromadb.Client(
        Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory=persist_directory,
        )
    )
    return client


def get_or_create_collection(client, collection_name="personal_data"):
    """
    Get or create a collection in ChromaDB.
    """
    return client.get_or_create_collection(collection_name)
