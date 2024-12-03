import React, { useState } from 'react';
import axios from 'axios';
import './image_api_call.css';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const onTestApiClick = async () => {
    if (!prompt) {
      alert('請輸入提示文字（Prompt）！');
      return;
    }
    setLoading(true);
    setImageUrl(null);
    try {
      const {
        data: { message, image_url },
      } = await axios.get('/api/generate_image', {
        params: {
          prompt,
        },
      });

      console.log(`Message: ${message}`);
      if (image_url) {
        console.log(`Generated Image URL: ${image_url}`);
        setImageUrl(image_url);
      } else {
        alert('Image generation failed. No URL returned.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('An error occurred while generating the image. Check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-generator-container">
      <div className="input-section">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your image prompt here..."
          className="prompt-input"
        />
        <button 
          onClick={onTestApiClick}
          disabled={loading}
          className="generate-button"
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      <div className="image-section">
        {loading && <div className="loading">Generating image...</div>}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Generated" 
            className="generated-image"
          />
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
