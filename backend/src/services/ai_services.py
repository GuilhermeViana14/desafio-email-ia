from transformers import pipeline
import torch
import os

print("Carregando o modelo de IA... Este processo pode levar alguns minutos na primeira execução.")

# Detecta se há GPU disponível (para Hugging Face Spaces)
device = 0 if torch.cuda.is_available() else -1
print(f"Device set to use {'cuda' if device == 0 else 'cpu'} (Hugging Face environment)")

try:
    # Usa modelos Hugging Face recomendados
    classifier = pipeline(
        "zero-shot-classification", 
        model="facebook/bart-large-mnli", 
        device=device,
        model_kwargs={"torch_dtype": torch.float32}
    )
    
    generator = pipeline(
        "text2text-generation", 
        model="google/flan-t5-small",
        device=device,
        model_kwargs={"torch_dtype": torch.float32}
    )
    
    print("Modelos carregados com sucesso!")
except Exception as e:
    print(f"Erro ao carregar os modelos de IA: {e}")
    classifier = None
    generator = None

def classify_email(text: str) -> str:
    """
    Classifica o texto do email como 'produtivo' ou 'improdutivo' usando IA.
    Se o modelo não estiver disponível, usa uma regra simples por palavras-chave.
    """
    if not classifier:
        productive_keywords = [
            'urgente', 'importante', 'negócio', 'proposta', 'reunião',
            'projeto', 'contrato', 'orçamento', 'pedido', 'solicitação'
        ]
        if any(word in text.lower() for word in productive_keywords):
            return "produtivo"
        return "improdutivo"
    
    labels = ["Produtivo", "Improdutivo"]
    result = classifier(text, candidate_labels=labels)
    return result["labels"][0].lower()

def suggest_response(text: str, category: str) -> str:
    """
    Gera uma sugestão de resposta para o email usando IA.
    Se o modelo não estiver disponível, retorna uma resposta padrão.
    """
    if not generator:
        if category.lower() == "produtivo":
            return "Prezado(a), recebemos sua solicitação e ela já está sendo analisada por nossa equipe. Agradecemos o contato."
        else:
            return "Obrigado pelo seu contato. Sua mensagem foi recebida."
    
    if category.lower() == "produtivo":
        prompt = f'Gere uma resposta profissional curta para: "{text}"'
    else: 
        prompt = f'Gere uma resposta educada para: "{text}"'

    try:
        response = generator(prompt, max_length=64, num_beams=2)
        return response[0]["generated_text"]
    except Exception as e:
        if category.lower() == "produtivo":
            return "Prezado(a), recebemos sua solicitação e ela já está sendo analisada por nossa equipe."
        else:
            return "Obrigado pelo seu contato. Sua mensagem foi recebida."