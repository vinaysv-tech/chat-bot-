require('dotenv').config({ path: '.env.local' });

async function testChatbot() {
  console.log('Testing chatbot API...');
  
  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Hello, how are you?'
          }
        ],
        model: 'models/gemini-flash-latest'
      })
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Chatbot API is working! Response:', data.substring(0, 200));
    } else {
      const error = await response.text();
      console.log('❌ Chatbot API failed:', error);
    }
    
  } catch (error) {
    console.log('❌ Chatbot API test failed:', error.message);
  }
}

testChatbot();