const fs = require('fs');

async function check() {
  try {
    const envFile = fs.readFileSync('.env', 'utf-8');
    const apiKeyMatch = envFile.match(/GEMINI_API_KEY=["']?([^"'\n]+)["']?/);
    if (!apiKeyMatch) {
       console.log("No API key found in .env");
       return;
    }
    const apiKey = apiKeyMatch[1];
    
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    if(data.models) {
      console.log(JSON.stringify(data.models.map(m=>m.name), null, 2));
    } else {
      console.log("Error:", data);
    }
  } catch(e) {
    console.error(e);
  }
}
check();
