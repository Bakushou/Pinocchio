// Configure APIs
const OPENAI_API_KEY = "your-openai-api-key";
const SPEECH_TO_TEXT_API_KEY = "your-speech-to-text-api-key";

// Initialize Speech Recognition (Web Speech API for simplicity)
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;

document.getElementById("start").addEventListener("click", () => {
  recognition.start();
  document.getElementById("output").textContent = "Listening...";
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  document.getElementById("output").textContent = `You said: "${transcript}"`;

  // Send to AI for fact-checking
  const correction = await checkWithAI(transcript);
  if (correction) {
    document.getElementById("output").textContent = `Correction: ${correction}`;
    // Optional: Speak the correction
    speakText(correction);
  } else {
    document.getElementById("output").textContent = "No mistakes detected.";
  }
};

recognition.onerror = (err) => {
  document.getElementById("output").textContent = `Error: ${err.error}`;
};

// OpenAI API Fact-Checking
async function checkWithAI(statement) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a fact-checking assistant. Only respond if a statement is false. Do not respond to true statements.",
        },
        { role: "user", content: statement },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Optional: Text-to-Speech
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}
// Hitta knappen och sätt en eventlistener på den
document.getElementById('listenButton').addEventListener('click', function() {
  const button = document.getElementById('listenButton');
  // Om knappen har texten "Start Listening", ändra till "Stop Listening"
  if (button.textContent === 'Start Listening') {
    button.textContent = 'Stop Listening';
  } else {
    button.textContent = 'Start Listening'; // Annars ändra tillbaka
  }
});
