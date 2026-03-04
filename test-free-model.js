require('dotenv').config({ path: '.env.local' });

async function testFreeModel() {
  console.log('Testing free model approach...');
  
  // Try with a simple HTTP request to a free service
  try {
    // Let's try using a free Hugging Face model or similar
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: "Hello, how are you?"
      })
    });
    
    const result = await response.json();
    console.log('Free model test result:', result);
    
    if (response.ok && result.generated_text) {
      console.log('✅ Free model works! Response:', result.generated_text);
    } else {
      console.log('❌ Free model failed or rate limited');
    }
    
  } catch (error) {
    console.log('❌ Free model test failed:', error.message);
  }
  
  // Alternative: Try to use Google with a different approach
  console.log('\nTrying Google with different model...');
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GOOGLE_GENERATIVE_AI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Hello"
          }]
        }]
      })
    });
    
    const result = await response.json();
    console.log('Google gemini-pro result:', result);
    
    if (result.candidates && result.candidates.length > 0) {
      console.log('✅ Google gemini-pro works!');
    }
    
  } catch (error) {
    console.log('❌ Google gemini-pro failed:', error.message);
  }
}

testFreeModel();