from llama_cpp import Llama
from pretrait import load_csv_data

llm = Llama(model_path="models/llama-2-7b-chat.gguf", n_ctx=2048)

def ask_question(csv_path, question):
    data = load_csv_data(csv_path)
    prompt = f"""
Tu es un assistant intelligent. Voici un tableau des données des machines :

{data}

Question : {question}
Réponse :
"""
    output = llm(prompt=prompt, max_tokens=256)
    return output['choices'][0]['text'].strip()
