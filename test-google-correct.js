require('dotenv').config({ path: '.env.local' });

async function testGoogleCorrect() {
  console.log('Testing Google with correct model names...');
  console.log('API Key present:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log('❌ No API key found');
    return;
  }

  const models = [
    'models/gemini-flash-latest',
    'models/gemini-pro-latest',
    'models/gemini-2.5-flash-lite',
    'gemini-flash-latest',
    'gemini-pro-latest'
  ];

  for (const model of models) {
    try {
      console.log(`\nTesting model: ${model}`);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Hello, how are you?"
            }]
          }]
        })
      });
      
      const result = await response.json();
      console.log(`Result for ${model}:`, result);
      
      if (result.candidates && result.candidates.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        console.log(`✅ SUCCESS with ${model}! Response:`, text);
        return; // Exit on first success
      }
      
      // If we get a quota error, it means the model exists but we're rate limited
      if (result.error && result.error.code === 429) {
        console.log(`⏳ Model ${model} exists but rate limited`);
      }
      
    } catch (error) {
      console.log(`❌ Error with ${model}:`, error.message);
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testGoogleCorrect();