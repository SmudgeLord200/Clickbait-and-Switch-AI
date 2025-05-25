import pytest
from services.nlp import (
    _run_summarizer,
    _run_ner,
    _run_sentiment,
    _run_bias_classification,
    _run_topic_classification,
    analyse_article
)

def test_run_summarizer(mock_nlp_models):
    """Test article summarization"""
    with pytest.MonkeyPatch.context() as m:
        m.setattr('services.nlp.summarizer', mock_nlp_models['summarizer'])
        result = _run_summarizer("This is a test article that needs to be summarized.")
        assert result == "Test summary of the article."

def test_run_summarizer_short_text():
    """Test summarization with short text"""
    result = _run_summarizer("Too short")
    assert result == "Content too short to summarize."

def test_run_ner(mock_nlp_models):
    """Test named entity recognition"""
    with pytest.MonkeyPatch.context() as m:
        m.setattr('services.nlp.nlp_spacy', mock_nlp_models['spacy'])
        result = _run_ner("John Smith is a researcher.")
        assert "John Smith" in result
        assert len(result) == 1

def test_run_ner_empty_text():
    """Test NER with empty text"""
    result = _run_ner("")
    assert result == []

def test_run_sentiment(mock_nlp_models):
    """Test sentiment analysis"""
    with pytest.MonkeyPatch.context() as m:
        m.setattr('services.nlp.sentiment_analyser', mock_nlp_models['sentiment'])
        result = _run_sentiment("This is a positive test article.")
        assert result["label"] == "POSITIVE"
        assert result["score"] == 0.95

def test_run_sentiment_empty_text():
    """Test sentiment analysis with empty text"""
    result = _run_sentiment("")
    assert result["label"] == "NEUTRAL"
    assert result["score"] == 0.0

def test_run_bias_classification(mock_nlp_models):
    """Test bias classification"""
    with pytest.MonkeyPatch.context() as m:
        m.setattr('services.nlp.zero_shot_classifier', mock_nlp_models['classifier'])
        result = _run_bias_classification("This is an objective article.")
        assert result["labels"] == "objective"
        assert isinstance(result["scores"], float)

def test_run_bias_classification_empty_text():
    """Test bias classification with empty text"""
    result = _run_bias_classification("")
    assert result["labels"] == "N/A"
    assert result["scores"] == 0.0

def test_run_topic_classification(mock_nlp_models):
    """Test topic classification"""
    with pytest.MonkeyPatch.context() as m:
        m.setattr('services.nlp.zero_shot_classifier', mock_nlp_models['classifier'])
        result = _run_topic_classification("This is a technology article.")
        assert result["labels"] in ["politics", "entertainment", "climate", "technology", "business", "health", "objective"]
        assert isinstance(result["scores"], float)

def test_run_topic_classification_empty_text():
    """Test topic classification with empty text"""
    result = _run_topic_classification("")
    assert result["labels"] == "N/A"
    assert result["scores"] == 0.0

@pytest.mark.asyncio
async def test_analyse_article_integration(mock_article, mock_nlp_models):
    """Test full article analysis integration"""
    with pytest.MonkeyPatch.context() as m:
        m.setattr('services.nlp.Article', lambda x: mock_article)
        m.setattr('services.nlp.summarizer', mock_nlp_models['summarizer'])
        m.setattr('services.nlp.sentiment_analyser', mock_nlp_models['sentiment'])
        m.setattr('services.nlp.zero_shot_classifier', mock_nlp_models['classifier'])
        m.setattr('services.nlp.nlp_spacy', mock_nlp_models['spacy'])
        
        result = await analyse_article("https://test-article.com")
        
        assert result["title"] == "Test Article Title"
        assert result["summary"] == "Test summary of the article."
        assert "John Smith" in result["named_people"]
        assert result["sentiment"]["label"] == "POSITIVE"
        assert "bias_classification" in result
        assert "topic_classification" in result

@pytest.mark.asyncio
async def test_analyse_article_empty_text(mock_article, mock_nlp_models):
    """Test article analysis with empty article text"""
    mock_article.text = ""
    with pytest.MonkeyPatch.context() as m:
        m.setattr('services.nlp.Article', lambda x: mock_article)
        
        result = await analyse_article("https://test-article.com")
        
        assert result["title"] == "Test Article Title"
        assert result["summary"] == "Article content not available or too short."
        assert result["named_people"] == []
        assert result["sentiment"]["label"] == "NEUTRAL"
        assert result["bias_classification"]["labels"] == "N/A"
        assert result["topic_classification"]["labels"] == "N/A"
        assert "error" in result 