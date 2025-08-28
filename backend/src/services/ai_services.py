from transformers import pipeline
import torch
import os

print("Carregando o modelo de IA... Este processo pode levar alguns minutos na primeira execução.")

# Para Vercel, usar CPU sempre (GPU não disponível)
device = -1  # Força CPU
print(f"Device set to use cpu (Vercel environment)")

try:
    # Usar modelos menores para Vercel
    classifier = pipeline(
        "zero-shot-classification", 
        model="facebook/bart-large-mnli", 
        device=device,
        model_kwargs={"torch_dtype": torch.float32}  # Para compatibilidade
    )
    
    # Modelo menor para geração de texto
    generator = pipeline(
        "text2text-generation", 
        model="google/flan-t5-small",  # Modelo menor!
        device=device,
        model_kwargs={"torch_dtype": torch.float32}
    )
    
    print("Modelos carregados com sucesso!")
except Exception as e:
    print(f"Erro ao carregar os modelos de IA: {e}")
    classifier = None
    generator = None

def classify_email(text: str) -> str:
    if not classifier:
        # Fallback para classificação simples
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
    if not generator:
        # Fallback para respostas padrão
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
        # Fallback se a geração falhar
        if category.lower() == "produtivo":
            return "Prezado(a), recebemos sua solicitação e ela já está sendo analisada por nossa equipe."
        else:
            return "Obrigado pelo seu contato. Sua mensagem foi recebida."