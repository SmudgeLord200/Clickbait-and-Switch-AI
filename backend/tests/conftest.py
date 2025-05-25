import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
import sys
from pathlib import Path

# Add the parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))
from main import app

@pytest.fixture
def client():
    """Test client fixture for FastAPI application"""
    return TestClient(app)

@pytest.fixture
def mock_article():
    """Mock article fixture for testing"""
    mock = MagicMock()
    mock.title = "Test Article Title"
    mock.text = """
    This is a test article about technology and artificial intelligence. 
    John Smith, a renowned AI researcher, discussed the future of machine learning.
    The article presents a balanced view on the impact of AI on society.
    """
    return mock

@pytest.fixture
def mock_nlp_models():
    """Mock NLP models for testing"""
    # Mock summarizer
    mock_summarizer = MagicMock()
    mock_summarizer.return_value = [{"summary_text": "Test summary of the article."}]
    
    # Mock sentiment analyzer
    mock_sentiment = MagicMock()
    mock_sentiment.return_value = [{"label": "POSITIVE", "score": 0.95}]
    
    # Mock zero-shot classifier
    mock_classifier = MagicMock()
    mock_classifier.return_value = {
        "labels": ["objective", "biased"],
        "scores": [0.8, 0.2]
    }
    
    # Mock spaCy model
    mock_spacy = MagicMock()
    mock_doc = MagicMock()
    mock_ent = MagicMock()
    mock_ent.text = "John Smith"
    mock_ent.label_ = "PERSON"
    mock_doc.ents = [mock_ent]
    mock_spacy.return_value = mock_doc
    
    return {
        "summarizer": mock_summarizer,
        "sentiment": mock_sentiment,
        "classifier": mock_classifier,
        "spacy": mock_spacy
    } 