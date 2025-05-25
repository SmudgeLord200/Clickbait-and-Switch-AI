from newspaper import Article
from transformers import pipeline
import spacy
import asyncio
from fastapi.concurrency import run_in_threadpool

# Models are loaded globally - this is good!
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
zero_shot_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
sentiment_analyser = pipeline("sentiment-analysis")
nlp_spacy = spacy.load("en_core_web_sm")

# Helper functions to wrap synchronous blocking calls for run_in_threadpool
def _download_and_parse_article(url: str):
    article_obj = Article(url)
    article_obj.download()
    article_obj.parse()
    return article_obj

def _run_summarizer(text_input: str):
    # Ensure text_input is not empty and has reasonable length
    if not text_input or len(text_input) < 30: # min_length for summarizer
        return "Content too short to summarize."
    # Truncate input to model's max sequence length if necessary, 1024 for BART
    # The summarizer pipeline handles truncation, but explicit control can be better.
    # Here, we rely on the pipeline's truncation if text[:1000] is still too long.
    return summarizer(text_input[:1024], max_length=130, min_length=30, do_sample=False)[0]["summary_text"]

def _run_ner(text_input: str):
    if not text_input:
        return []
    doc = nlp_spacy(text_input)
    return list(set(ent.text for ent in doc.ents if ent.label_ == "PERSON"))

def _run_sentiment(text_input: str):
    if not text_input:
        return {"label": "NEUTRAL", "score": 0.0} # Default for empty
    # Sentiment models typically have a 512 token limit
    return sentiment_analyser(text_input[:512])[0]

def _run_bias_classification(text_input: str):
    if not text_input:
        return {"labels": "N/A", "scores": 0.0}
    bias_labels = ["objective", "biased", "factual", "propaganda"]
    # Truncate input if necessary
    result = zero_shot_classifier(text_input[:1024], candidate_labels=bias_labels)
    return {"labels": result["labels"][0], "scores": round(result["scores"][0], 3)}

def _run_topic_classification(text_input: str):
    if not text_input:
        return {"labels": "N/A", "scores": 0.0}
    topic_labels = ["politics", "entertainment", "climate", "technology", "business", "health"]
    result = zero_shot_classifier(text_input[:1024], candidate_labels=topic_labels)
    return {"labels": result["labels"][0], "scores": round(result["scores"][0], 3)}


async def analyse_article(url: str):
    # Step 0: Download and Parse Article (I/O and CPU bound)
    article = await run_in_threadpool(_download_and_parse_article, url)
    
    if not article.text:
        # Handle cases where article text could not be extracted
        # You might want to return a specific error or a limited response
        return {
            "title": article.title or "Title not found",
            "summary": "Article content not available or too short.",
            "named_people": [],
            "sentiment": {"label": "NEUTRAL", "score": 0.0},
            "bias_classification": {"labels": "N/A", "scores": 0.0},
            "topic_classification": {"labels": "N/A", "scores": 0.0},
            "error": "Could not extract article text."
        }
    
    text = article.text

    # Run NLP tasks concurrently
    summary_task = run_in_threadpool(_run_summarizer, text)
    ner_task = run_in_threadpool(_run_ner, text)
    sentiment_task = run_in_threadpool(_run_sentiment, text)
    bias_task = run_in_threadpool(_run_bias_classification, text)
    topic_task = run_in_threadpool(_run_topic_classification, text)

    # Await all tasks
    summary, people, sentiment, bias_result, topic_result = await asyncio.gather(
        summary_task,
        ner_task,
        sentiment_task,
        bias_task,
        topic_task
    )

    return {
        "title": article.title,
        "summary": summary,
        "named_people": people,
        "sentiment": sentiment,
        "bias_classification": bias_result,
        "topic_classification": topic_result,
    }

