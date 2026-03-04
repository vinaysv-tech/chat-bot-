require('dotenv').config({ path: '.env.local' });

async function testGoogleFree() {
  console.log('Testing Google AI with free tier...');
  console.log('API Key present:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log('❌ No API key found');
    return;
  }

  try {
    // Try a simple fetch to see if we can access any models
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const data = await response.json();
    
    console.log('Available models from Google:');
    if (data.models) {
      data.models.forEach(model => {
        console.log(`- ${model.name}: ${model.displayName}`);
      });
    }
    
    // Try to find a working model
    const workingModels = data.models?.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    ) || [];
    
    if (workingModels.length > 0) {
      console.log('\nModels that support generateContent:');
      workingModels.forEach(model => {
        console.log(`- ${model.name}: ${model.displayName}`);
      });
      
      // Try the first working model
      const firstModel = workingModels[0];
      console.log(`\nTrying first model: ${firstModel.name}`);
      
      const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${firstModel.name}:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`, {
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
      
      const result = await testResponse.json();
      console.log('Test result:', result);
      
      if (result.candidates && result.candidates.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        console.log('✅ Success! Response:', text);
      } else {
        console.log('❌ No response generated');
      }
    }
    
  } catch (error) {
    console.log('❌ Google API Test failed:', error.message);
  }
}

testGoogleFree();