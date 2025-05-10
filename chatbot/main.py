from flask import Flask, request, jsonify
import os
import pandas as pd
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import LlamaCpp
from langchain.chains import ConversationalRetrievalChain
from langchain.schema import Document
from langchain_community.document_loaders import CSVLoader
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load your CSV
loader = CSVLoader(file_path="data/Dataset.csv", encoding="latin-1", csv_args={'delimiter': ','})
data = loader.load()

# Split text into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
text_chunks = text_splitter.split_documents(data)

# Embeddings and FAISS
embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
if os.path.exists("vectorstore/db_fais"):
    print("Loading existing FAISS index...")
    docsearch = FAISS.load_local("vectorstore/db_fais", embeddings, allow_dangerous_deserialization=True)
    print("FAISS loaded ✅")
else:
    print("Creating FAISS index...")
    docsearch = FAISS.from_documents(text_chunks, embeddings)
    docsearch.save_local("vectorstore/db_fais")
    print("FAISS created and saved ✅")
# Load TinyLlama with llama-cpp
llm = LlamaCpp(
    model_path="models/mistral-7b-instruct-v0.1.Q4_K_M.gguf",  # Update path if needed
    temperature=0.1,
    max_tokens=512,
    top_p=0.95,
    n_ctx=2048,
    n_batch=256,
    n_gpu_layers=20,  # Adjust depending on GPU, 20 is OK for 950M
    f16_kv=True,
    verbose=False
)
print("model loaded")
# Set up retriever
retriever = docsearch.as_retriever(search_kwargs={"k": 5})

# Create the retrieval chain
qa = ConversationalRetrievalChain.from_llm(llm=llm, retriever=retriever)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    query = data['query']

    chat_history = []  # Optional: manage real history if needed
    result = qa.invoke({"question": query, "chat_history": chat_history})

    return jsonify({"answer": result['answer']})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
