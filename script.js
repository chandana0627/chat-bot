const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const ChatbotToggler = document.querySelector(".Chatbot-toggler");
const ChatbotCloseBtn = document.querySelector(".Close-btn");



let userMessage;


require('dotenv').config();

const API_KEY = process.env.API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;


const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p class="text"></p>`; // Add .text class for incoming messages
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = async(incomingChatLi)  => {
    const textElement = incomingChatLi.querySelector(".text");
    try {
        const messageElement = incomingChatLi.querySelector("p");
        const response = await fetch(API_URL,{
            method:"POST",
            Headers:{"Content-Type":" application/json"},
            body:JSON.stringify({
                contents :[{
                    role:"user",
                    parts: [{text:userMessage}]
                }]
            })
        });
        const data = await response.json();
        const apiResponse = data?.candidates[0].content.parts[0].text;
        if (textElement) {
            textElement.innerText = apiResponse;
        } else {
            console.error('textElement not found');
        }

    }catch(error) {
        console.log(error);
    } finally {
        incomingChatLi.classList.remove("Thinking....");
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}    


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value="";

    // Append outgoing message (user message)
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    // Clear the input field after sending the message
    chatInput.value = "";

    // Simulate a delay before appending the bot's response
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);

        generateResponse(incomingChatLi);
    }, 600);
}

sendChatBtn.addEventListener("click", handleChat);
ChatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-Chatbot"));
ChatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-Chatbot"));

