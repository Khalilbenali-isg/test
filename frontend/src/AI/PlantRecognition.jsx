import { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

const PlantRecognition = ({ onPrediction }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const modelRef = useRef(null);

  // Load model when component mounts
  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      try {
        console.log('Loading model...');
        const modelURL = `${window.location.origin}/model/model.json`;
        const metadataURL = `${window.location.origin}/model/metadata.json`;
        
        console.log('Model URL:', modelURL);
        console.log('Metadata URL:', metadataURL);
        
        modelRef.current = await tmImage.load(modelURL, metadataURL);
        setModelLoaded(true);
        console.log('Model loaded successfully');
      } catch (err) {
        console.error('Model loading error:', err);
        setError(`Failed to load model: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !modelLoaded) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);

    // Analyze image
    await analyzeImage(file);
  };

  const analyzeImage = async (file) => {
    if (!modelRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const img = await createImageBitmap(file);
      const prediction = await modelRef.current.predict(img);
      
      const formattedPredictions = prediction.map(p => ({
        className: p.className,
        probability: (p.probability * 100).toFixed(2) + '%'
      }));

      setPredictions(formattedPredictions);
      
      if (onPrediction) {
        const topPrediction = formattedPredictions.reduce((prev, current) => 
          (parseFloat(prev.probability) > parseFloat(current.probability)) ? prev : current
        );
        onPrediction(topPrediction);
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError(`Error analyzing image: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="plant-recognition">
      {error && (
        <div className="error" style={{ color: 'red', marginBottom: '15px' }}>
          {error}
        </div>
      )}
      
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        disabled={isLoading || !modelLoaded}
      />
      
      <button 
        onClick={() => fileInputRef.current.click()}
        disabled={isLoading || !modelLoaded}
        style={{
          backgroundColor: '#4CAF50',
         
          padding: '10px 15px',
          border: 'none',
          borderRadius: '4px',
          cursor: modelLoaded && !isLoading ? 'pointer' : 'not-allowed',
          opacity: modelLoaded && !isLoading ? 1 : 0.7
        }}
      >
        {isLoading ? 'Processing...' : modelLoaded ? 'Upload Plant Image' : 'Loading Model...'}
      </button>
      
      {!modelLoaded && (
        <div style={{ width: '100%', height: '4px',  marginTop: '10px' }}>
          <div 
            style={{ 
              width: '30%', 
              height: '100%', 
              
              animation: 'loading 1.5s infinite ease-in-out'
            }} 
          />
        </div>
      )}
      
      {imagePreview && (
        <div className="image-preview">
          <img 
            src={imagePreview} 
            alt="Uploaded plant" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px', 
              marginTop: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} 
          />
        </div>
      )}
      
      {predictions.length > 0 && (
        <div className="predictions" style={{ 
          marginTop: '20px',
          
          padding: '15px',
          borderRadius: '8px' 
        }}>
          <h4 style={{ marginTop: 0 }}>Recognition Results:</h4>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {predictions.map((pred, index) => (
              <li key={index} style={{ 
                marginBottom: '8px',
                padding: '8px',
                
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <strong>{pred.className}:</strong> <span>{pred.probability}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlantRecognition;