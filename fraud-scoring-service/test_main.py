from fastapi.testclient import TestClient
import pytest
from main import app, load_model_artifacts

client = TestClient(app)

@pytest.fixture(autouse=True)
async def setup_model():
    # Load model before running tests
    await load_model_artifacts()
    yield

def test_predict_fraud_endpoint():
    # Test data that represents a transaction
    test_transaction = {
      "scaled_time": -1.996583, 
      "scaled_amount": 1.783274, 
      "V1": -1.359807, 
      "V2": -0.072781, 
      "V3": 2.536347, 
      "V4": 1.378155, 
      "V5": -0.338321, 
      "V6": 0.462388, 
      "V7": 0.239599, 
      "V8": 0.098698, 
      "V9": 0.363787, 
      "V10": 0.090794, 
      "V11": -0.551600, 
      "V12": -0.617801, 
      "V13": -0.991390, 
      "V14": -0.311169, 
      "V15": 1.468177, 
      "V16": -0.470401, 
      "V17": 0.207971, 
      "V18": 0.025791, 
      "V19": 0.403993, 
      "V20": 0.251412, 
      "V21": -0.018307, 
      "V22": 0.277838, 
      "V23": -0.110474, 
      "V24": 0.066928, 
      "V25": 0.128539, 
      "V26": -0.189115, 
      "V27": 0.133558, 
      "V28": -0.021053 
        }

    # Make POST request to /predict endpoint
    response = client.post("/predict", json=test_transaction)
    
    # Assert response status code is 200 (OK)
    assert response.status_code == 200
    
    # Assert response contains expected fields
    data = response.json()
    assert "is_fraud" in data
    assert "fraud_probability" in data
    assert "model_version" in data
    
    # Assert data types are correct
    assert isinstance(data["is_fraud"], int)
    assert isinstance(data["fraud_probability"], float)
    assert isinstance(data["model_version"], str)
    
    # Assert probability is between 0 and 1
    assert 0 <= data["fraud_probability"] <= 1
    
    # Assert is_fraud is either 0 or 1
    assert data["is_fraud"] in [0, 1]

def test_predict_fraud_invalid_input():
    # Test with invalid data (missing fields)
    invalid_transaction = {
        "scaled_time": 0.1,
        "scaled_amount": 0.5
        # Missing V1-V28
    }
    
    response = client.post("/predict", json=invalid_transaction)
    
    # Assert response status code is 422 (Unprocessable Entity)
    assert response.status_code == 422