import pytest
from unittest.mock import patch
from fastapi import HTTPException

def test_analyse_endpoint_success(client, mock_article, mock_nlp_models):
    """Test successful article analysis endpoint"""
    with patch('services.nlp.Article', return_value=mock_article), \
         patch('services.nlp.summarizer', mock_nlp_models['summarizer']), \
         patch('services.nlp.sentiment_analyser', mock_nlp_models['sentiment']), \
         patch('services.nlp.zero_shot_classifier', mock_nlp_models['classifier']), \
         patch('services.nlp.nlp_spacy', mock_nlp_models['spacy']):
        
        response = client.post(
            "/analyse/",
            json={"url": "https://test-article.com"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "title" in data
        assert "summary" in data
        assert "named_people" in data
        assert "sentiment" in data
        assert "bias_classification" in data
        assert "topic_classification" in data
        
        assert data["title"] == "Test Article Title"
        assert data["summary"] == "Test summary of the article."
        assert "John Smith" in data["named_people"]
        assert data["sentiment"]["label"] == "POSITIVE"

def test_analyse_endpoint_invalid_url(client):
    """Test article analysis endpoint with invalid URL"""
    response = client.post(
        "/analyse/",
        json={"url": "not-a-valid-url"}
    )
    
    assert response.status_code == 500
    assert "detail" in response.json()

def test_analyse_endpoint_empty_url(client):
    """Test article analysis endpoint with empty URL"""
    response = client.post(
        "/analyse/",
        json={"url": ""}
    )
    
    assert response.status_code == 500  # Validation error

def test_analyse_endpoint_missing_url(client):
    """Test article analysis endpoint with missing URL"""
    response = client.post(
        "/analyse/",
        json={}
    )
    
    assert response.status_code == 422  # Validation error 