from transformers import pipeline
import torch
import re
from typing import List



print("Carregando o modelo de IA... Este processo pode levar alguns minutos na primeira execução.")

# Define o dispositivo (CPU ou GPU)
device = 0 if torch.cuda.is_available() else -1
print(f"Device set to use {'gpu' if device == 0 else 'cpu'}")

try:
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli", device=device)
    generator = pipeline("text2text-generation", model="google/flan-t5-base", device=device)
    print("Modelos carregados com sucesso!")
except Exception as e:
    print(f"Erro ao carregar os modelos de IA: {e}")
    classifier = None
    generator = None
    
def preprocess_text(text: str) -> str:
    """Pré-processa o texto removendo elementos desnecessários"""
    # Remove emails e URLs
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'http\S+', '', text)
    
    # Remove caracteres especiais excessivos
    text = re.sub(r'[^\w\s\.,!?]', '', text)
    
    # Remove espaços extras
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def classify_email(text: str) -> str:
    # Adicionar pré-processamento
    processed_text = preprocess_text(text)
    
    if not classifier:
        raise RuntimeError("O modelo de classificação não está carregado.")
    
    labels = ["Produtivo", "Improdutivo"]
    result = classifier(processed_text, candidate_labels=labels)
    return result["labels"][0].lower()


def suggest_response(text: str, category: str) -> str:
    if not generator:
        raise RuntimeError("O modelo de geração de texto não está disponível.")
    
    if category.lower() == "produtivo":
        prompt = f'Gere uma resposta profissional curta para o seguinte email, informando que a solicitação foi recebida e será processada: "{text}"'
    else: 
        prompt = f'Gere uma resposta educada e curta de agradecimento para o seguinte email: "{text}"'

    try:
        response = generator(prompt, max_length=128, num_beams=5, early_stopping=True)
        return response[0]["generated_text"]
    except Exception as e:
        # Fallback para respostas padrão se a geração falhar
        if category.lower() == "produtivo":
            return "Prezado(a), recebemos sua solicitação e ela já está sendo analisada por nossa equipe. Agradecemos o contato."
        else:
            return "Obrigado pelo seu contato. Sua mensagem foi recebida."