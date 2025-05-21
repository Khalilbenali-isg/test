import React from 'react';
import PlantRecognition from './PlantRecognition';
import NavbarClient from '@/items/NavbarClient';

const TestPlantRecognition = () => {
  const handlePrediction = (topPrediction) => {
    console.log('Top prediction:', topPrediction);
    alert(`Identified as: ${topPrediction.className} (${topPrediction.probability} confidence)`);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1250px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <NavbarClient />
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#4CAF50' }}>Plant Recognition Test</h1>
        <p>Upload an image to test your plant identification model</p>
      </div>
      
      <div style={{ 
        border: '2px dashed #4CAF50',
        padding: '25px',
        borderRadius: '8px',
        margin: '25px 0',
        
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <PlantRecognition onPrediction={handlePrediction} />
      </div>
      
      <div style={{ 
        
        padding: '15px', 
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0 }}>Testing Instructions:</h3>
        <ol style={{ paddingLeft: '20px' }}>
          <li>Wait for "Loading Model..." to change to "Upload Plant Image"</li>
          <li>Click the button and select a plant image</li>
          <li>View the recognition results below the image</li>
          <li>Check console (F12) for detailed logs if needed</li>
        </ol>
      </div>
    </div>
  );
};


export default TestPlantRecognition;