from transformers import pipeline
import torch
import os
import random
from typing import Dict

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
    Implementação melhorada para maior precisão na classificação.
    """
    text_lower = text.lower()
    
    # Palavras-chave mais específicas e amplas para produtivo
    productive_indicators = {
        'trabalho_negocio': ['reunião', 'meeting', 'projeto', 'project', 'negócio', 'business', 'empresa', 'company', 'contrato', 'contract'],
        'solicitacoes': ['pedido', 'solicitação', 'request', 'orçamento', 'budget', 'proposta', 'proposal', 'cotação'],
        'urgencia': ['urgente', 'urgent', 'importante', 'important', 'prioridade', 'priority', 'deadline', 'prazo'],
        'comercial': ['venda', 'sale', 'compra', 'buy', 'cliente', 'customer', 'fornecedor', 'supplier'],
        'colaboracao': ['colaboração', 'partnership', 'parceria', 'trabalhar juntos', 'work together'],
        'problemas': ['problema', 'issue', 'erro', 'error', 'bug', 'falha', 'failure', 'suporte', 'support'],
        'documentos': ['documento', 'document', 'relatório', 'report', 'planilha', 'spreadsheet', 'arquivo', 'file']
    }
    
    # Palavras-chave que indicam email improdutivo
    unproductive_indicators = {
        'pessoal': ['parabéns', 'congratulations', 'feliz aniversário', 'happy birthday', 'felicidades'],
        'social': ['convite', 'invitation', 'festa', 'party', 'evento social', 'social event'],
        'spam': ['promoção', 'promotion', 'desconto', 'discount', 'oferta especial', 'special offer', 'newsletter'],
        'casual': ['como vai', 'how are you', 'oi', 'hi', 'olá', 'hello', 'tchau', 'bye'],
        'agradecimento': ['obrigado', 'thank you', 'thanks', 'agradecimento']
    }
    
    if not classifier:
        # Contagem de indicadores produtivos
        productive_score = 0
        for category, keywords in productive_indicators.items():
            matches = sum(1 for keyword in keywords if keyword in text_lower)
            if category in ['urgencia', 'trabalho_negocio', 'solicitacoes']:
                productive_score += matches * 2  # Peso maior para categorias importantes
            else:
                productive_score += matches
        
        # Contagem de indicadores improdutivos
        unproductive_score = 0
        for category, keywords in unproductive_indicators.items():
            matches = sum(1 for keyword in keywords if keyword in text_lower)
            if category == 'spam':
                unproductive_score += matches * 2  # Peso maior para spam
            else:
                unproductive_score += matches
        
        # Análise adicional de contexto
        if len(text.split()) < 5:  # Mensagens muito curtas tendem a ser improdutivas
            unproductive_score += 1
        
        # Verifica se contém perguntas ou chamadas para ação (indicativo de produtivo)
        if any(char in text for char in ['?', '!']) and productive_score > 0:
            productive_score += 1
        
        # Decisão final
        if productive_score > unproductive_score:
            return "produtivo"
        elif unproductive_score > productive_score:
            return "improdutivo"
        else:
            # Em caso de empate, analisa o comprimento e estrutura
            if len(text.split()) > 20:  # Emails longos tendem a ser mais produtivos
                return "produtivo"
            return "improdutivo"
    
    # Usando IA com prompts mais específicos
    enhanced_text = f"""
    Analise este email e determine se é PRODUTIVO ou IMPRODUTIVO.
    
    PRODUTIVO: Emails que requerem ação, resposta ou seguimento profissional. Incluem:
    - Solicitações de trabalho, reuniões, projetos
    - Questões comerciais, vendas, contratos
    - Problemas técnicos que precisam de solução
    - Pedidos, orçamentos, propostas
    - Assuntos urgentes ou importantes
    
    IMPRODUTIVO: Emails que não requerem ação profissional imediata. Incluem:
    - Mensagens pessoais, cumprimentos, felicitações
    - Spam, newsletters, promoções
    - Conversas casuais sem objetivo específico
    - Agradecimentos simples
    
    Email para analisar: "{text}"
    
    Classifique como: PRODUTIVO ou IMPRODUTIVO
    """
    
    labels = ["PRODUTIVO", "IMPRODUTIVO"]
    result = classifier(enhanced_text, candidate_labels=labels)
    return result["labels"][0].lower()

def suggest_response(text: str, category: str, style: str = "padrao", sender_name: str = None) -> str:
    """
    Gera uma sugestão de resposta personalizada para o email usando IA.
    Focado apenas em emails produtivos e improdutivos.
    
    Args:
        text: Conteúdo do email
        category: Categoria do email (produtivo ou improdutivo)
        style: Estilo da resposta (padrao, formal, informal, detalhada, objetiva)
        sender_name: Nome do remetente para personalização
    """
    
    # Templates de resposta organizados por categoria e estilo
    templates = {
        "produtivo": {
            "padrao": [
                f"{'Prezado(a) ' + sender_name if sender_name else 'Prezado(a)'}, recebemos sua solicitação e ela já está sendo analisada por nossa equipe. Agradecemos o contato e retornaremos em breve.",
                f"{'Olá ' + sender_name if sender_name else 'Olá'}, sua mensagem foi recebida e encaminhada para o departamento responsável. Em breve você receberá um retorno.",
                f"{'Prezado(a) ' + sender_name if sender_name else 'Prezado(a)'}, agradecemos seu contato. Sua solicitação está sendo processada e retornaremos com informações detalhadas."
            ],
            "formal": [
                f"{'Prezado(a) Sr(a). ' + sender_name if sender_name else 'Prezado(a) Sr(a).'}, agradecemos seu contato. Sua solicitação está sendo processada pela equipe competente e retornaremos com informações em breve.",
                f"{'Ilustríssimo(a) ' + sender_name if sender_name else 'Ilustríssimo(a)'}, recebemos sua demanda e ela está sendo tratada com a devida atenção por nossa equipe especializada.",
                f"{'Prezado(a) Sr(a). ' + sender_name if sender_name else 'Prezado(a) Sr(a).'}, sua solicitação foi devidamente recebida e encontra-se em análise pelo departamento responsável."
            ],
            "informal": [
                f"{'Oi ' + sender_name if sender_name else 'Oi'}! Recebemos sua mensagem e já estamos trabalhando nisso. Te atualizamos logo!",
                f"{'E aí ' + sender_name if sender_name else 'E aí'}! Valeu pela mensagem. Já passei pro pessoal aqui e eles vão te responder rapidinho!",
                f"{'Olá ' + sender_name if sender_name else 'Olá'}! Sua solicitação chegou aqui e já está sendo analisada. Em breve te mandamos um retorno!"
            ],
            "detalhada": [
                f"{'Prezado(a) ' + sender_name if sender_name else 'Prezado(a)'}, muito obrigado pelo seu contato! Sua solicitação foi recebida e está sendo analisada detalhadamente por nossa equipe. Faremos uma avaliação completa e retornaremos com uma resposta abrangente dentro de 2-3 dias úteis. Caso surjam dúvidas durante o processo, entraremos em contato para esclarecimentos.",
                f"{'Olá ' + sender_name if sender_name else 'Olá'}, agradecemos imensamente sua mensagem. Sua solicitação foi registrada e está sendo processada por nossa equipe especializada. Você receberá atualizações regulares sobre o andamento e uma resposta completa em breve. Estamos à disposição para qualquer esclarecimento adicional.",
                f"{'Prezado(a) ' + sender_name if sender_name else 'Prezado(a)'}, recebemos sua importante solicitação e ela já está sendo tratada pela nossa equipe. Realizaremos uma análise completa e detalhada, considerando todos os aspectos mencionados. Retornaremos com informações precisas e próximos passos em até 48 horas."
            ],
            "objetiva": [
                f"{'Recebido, ' + sender_name if sender_name else 'Recebido'}. Em análise. Retorno em breve.",
                f"Solicitação registrada. Equipe notificada. Retorno em até 48h.",
                f"{'OK, ' + sender_name if sender_name else 'OK'}. Processando. Aguarde retorno."
            ]
        },
        "improdutivo": {
            "padrao": [
                f"{'Obrigado ' + sender_name if sender_name else 'Obrigado'} pelo seu contato. Sua mensagem foi recebida.",
                f"{'Olá ' + sender_name if sender_name else 'Olá'}, agradecemos sua mensagem. Ela foi recebida e será considerada.",
                f"{'Prezado(a) ' + sender_name if sender_name else 'Prezado(a)'}, agradecemos o contato. Sua mensagem foi devidamente recebida."
            ],
            "formal": [
                f"{'Prezado(a) ' + sender_name if sender_name else 'Prezado(a)'}, agradecemos seu contato. Sua mensagem foi devidamente recebida e arquivada.",
                f"{'Ilustríssimo(a) ' + sender_name if sender_name else 'Ilustríssimo(a)'}, recebemos sua correspondência. Agradecemos pela gentileza do contato.",
                f"{'Prezado(a) Sr(a). ' + sender_name if sender_name else 'Prezado(a) Sr(a).'}, sua mensagem foi recebida. Agradecemos a cordialidade."
            ],
            "informal": [
                f"{'Oi ' + sender_name if sender_name else 'Oi'}! Valeu pela mensagem! Foi legal receber seu contato.",
                f"{'E aí ' + sender_name if sender_name else 'E aí'}! Obrigado por escrever. Recebemos sua mensagem!",
                f"{'Olá ' + sender_name if sender_name else 'Olá'}! Que bacana receber sua mensagem. Valeu pelo contato!"
            ],
            "detalhada": [
                f"{'Prezado(a) ' + sender_name if sender_name else 'Prezado(a)'}, muito obrigado pela sua mensagem. É sempre um prazer receber contatos como o seu. Sua mensagem foi recebida e, caso seja necessário algum retorno específico, entraremos em contato. Agradecemos pela gentileza e pelo tempo dedicado a nos escrever.",
                f"{'Olá ' + sender_name if sender_name else 'Olá'}, agradecemos imensamente seu contato. É gratificante saber que você pensou em nós para compartilhar sua mensagem. Ela foi devidamente recebida e, se houver necessidade de acompanhamento, faremos contato. Mais uma vez, obrigado pela consideração.",
                f"{'Caro(a) ' + sender_name if sender_name else 'Caro(a)'}, recebemos sua mensagem com muito apreço. Agradecemos por ter dedicado seu tempo para entrar em contato conosco. Sua correspondência foi registrada e, caso seja pertinente algum retorno, não hesitaremos em responder."
            ],
            "objetiva": [
                f"{'Recebido, ' + sender_name if sender_name else 'Recebido'}. Obrigado.",
                f"Mensagem registrada. Agradecemos o contato.",
                f"{'OK, ' + sender_name if sender_name else 'OK'}. Mensagem recebida."
            ]
        }
    }
    
    # Se não há modelo de IA, usa templates
    if not generator:
        category_templates = templates.get(category.lower(), templates["improdutivo"])
        style_templates = category_templates.get(style, category_templates["padrao"])
        return random.choice(style_templates)
    
    # Prompts específicos para produtivo e improdutivo
    if category.lower() == "produtivo":
        if style == "formal":
            prompt = f'Gere uma resposta formal e profissional para esta solicitação de trabalho: "{text}". Demonstre que estamos processando e retornaremos.'
        elif style == "informal":
            prompt = f'Gere uma resposta informal e amigável para esta solicitação: "{text}". Seja descontraído mas profissional.'
        elif style == "detalhada":
            prompt = f'Gere uma resposta profissional, cordial e detalhada para esta solicitação: "{text}". Inclua próximos passos e prazos.'
        elif style == "objetiva":
            prompt = f'Gere uma resposta breve e direta para esta solicitação: "{text}". Seja conciso.'
        else:  # padrao
            prompt = f'Gere uma resposta profissional padrão para esta solicitação: "{text}". Confirme recebimento e processamento.'
    else:  # improdutivo
        if style == "formal":
            prompt = f'Gere uma resposta formal e educada para esta mensagem: "{text}". Seja cordial mas simples.'
        elif style == "informal":
            prompt = f'Gere uma resposta informal e amigável para esta mensagem: "{text}". Seja descontraído.'
        elif style == "detalhada":
            prompt = f'Gere uma resposta educada e calorosa para esta mensagem: "{text}". Demonstre apreço pelo contato.'
        elif style == "objetiva":
            prompt = f'Gere uma resposta breve e educada para esta mensagem: "{text}". Seja simples.'
        else:  # padrao
            prompt = f'Gere uma resposta educada padrão para esta mensagem: "{text}". Agradeça pelo contato.'
    
    if sender_name:
        prompt += f' Inclua o nome "{sender_name}" na resposta de forma natural.'

    try:
        response = generator(prompt, max_length=128, num_beams=4, temperature=0.7)
        generated_text = response[0]["generated_text"]
        
        # Se a resposta gerada for muito curta, use template como fallback
        if len(generated_text.strip()) < 15:
            category_templates = templates.get(category.lower(), templates["improdutivo"])
            style_templates = category_templates.get(style, category_templates["padrao"])
            return random.choice(style_templates)
        
        return generated_text
    except Exception as e:
        # Fallback para templates em caso de erro
        category_templates = templates.get(category.lower(), templates["improdutivo"])
        style_templates = category_templates.get(style, category_templates["padrao"])
        return random.choice(style_templates)

def get_email_insights(text: str) -> Dict:
    """
    Retorna insights sobre o email focado nas categorias produtivo/improdutivo.
    """
    category = classify_email(text)
    
    insights = {
        "categoria": category,
        "confianca": "alta",
        "palavras_chave": [],
        "tom": "neutro",
        "urgencia": "normal"
    }
    
    # Análise de palavras-chave para produtivo
    if category == "produtivo":
        productive_words = ['urgente', 'importante', 'prazo', 'reunião', 'projeto', 'contrato', 'negócio', 'proposta']
        insights["palavras_chave"] = [word for word in productive_words if word in text.lower()]
    else:
        casual_words = ['obrigado', 'parabéns', 'feliz', 'convite', 'pessoal']
        insights["palavras_chave"] = [word for word in casual_words if word in text.lower()]
    
    # Análise de urgência
    if any(word in text.lower() for word in ['urgente', 'imediato', 'asap', 'prioritário']):
        insights["urgencia"] = "alta"
    elif any(word in text.lower() for word in ['quando possível', 'sem pressa', 'qualquer hora']):
        insights["urgencia"] = "baixa"
    
    # Análise de tom
    if any(word in text.lower() for word in ['por favor', 'obrigado', 'agradeço', 'grato']):
        insights["tom"] = "cordial"
    elif any(word in text.lower() for word in ['urgente', 'imediato', 'rápido']):
        insights["tom"] = "urgente"
    elif any(word in text.lower() for word in ['problema', 'erro', 'falha']):
        insights["tom"] = "preocupado"
    elif any(word in text.lower() for word in ['parabéns', 'feliz', 'excelente']):
        insights["tom"] = "positivo"
    
    return insights