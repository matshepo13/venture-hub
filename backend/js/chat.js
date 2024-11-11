function createMessage(content, isUser = false) {
    const message = document.createElement('div');
    message.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    // If it's HTML content (like file preview), use innerHTML
    if (content.includes('<div')) {
        message.innerHTML = content;
        // Reinitialize Lucide icons for the new content
        lucide.createIcons({
            attrs: {
                class: "message-icon"
            }
        });
    } else {
        // For plain text messages
        message.textContent = content;
    }
    return message;
}

function createFilePreview(file) {
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileSize = (file.size / 1024).toFixed(0) + ' kB';
    
    return `
        <div class="file-preview">
            <div class="file-icon">
                <i data-lucide="${fileExt === 'pdf' ? 'file-text' : 'image'}" size="24"></i>
            </div>
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-details">${fileExt.toUpperCase()} • ${fileSize}</span>
            </div>
        </div>
    `;
}

function addMessageToChat(messageElement) {
    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.appendChild(messageElement);
    messageElement.scrollIntoView({ behavior: 'smooth' });
}

function hideWelcomeMessage() {
    const welcomeMessage = document.querySelector('.welcome-message');
    welcomeMessage.classList.add('hidden');
}

// Handle radio button selections
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', async (e) => {
        const label = document.querySelector(`label[for="${e.target.id}"]`).textContent;
        const category = e.target.name.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
        
        hideWelcomeMessage();
        
        // Create and add user message
        const userMessage = `Hello Venture-bot, please assist me with: ${label}`;
        addMessageToChat(createMessage(userMessage, true));
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Show bot response
        const botResponse = `I'll help you with ${label.toLowerCase()}. What specific aspects of ${category} would you like to explore?`;
        addMessageToChat(createMessage(botResponse, false));
    });
});

// Handle send button
const sendButton = document.querySelector('.send-button');
const textarea = document.querySelector('.input-container textarea');

sendButton.addEventListener('click', async () => {
    const message = textarea.value.trim();
    if (message) {
        hideWelcomeMessage();
        addMessageToChat(createMessage(message, true));
        textarea.value = '';
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Simulate bot response after 4 seconds
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Show bot response
        const botResponse = "I understand your request. Let me help you with that. What additional details can you provide?";
        addMessageToChat(createMessage(botResponse, false));
    }
});

// Handle enter key in textarea
textarea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendButton.click();
    }
});

// Add file upload functionality
const uploadButton = document.querySelector('.upload-button');
const fileInput = document.getElementById('fileInput');

if (uploadButton && fileInput) {
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const selectedRadio = document.querySelector('input[type="radio"]:checked');
            const context = selectedRadio ? selectedRadio.value : 'analyze';

            const formData = new FormData();
            formData.append('file', file);
            formData.append('context', context);

            try {
                // Show upload message with file preview
                const uploadMessage = `
                    <div class="upload-message">
                        ${createFilePreview(file)}
                        <p>Analyzing document...</p>
                    </div>
                `;
                addMessageToChat(createMessage(uploadMessage, true));
                
                // Show typing indicator
                const typingIndicator = showTypingIndicator();
                
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    body: formData
                });

                // Wait for 4 seconds before showing response
                await new Promise(resolve => setTimeout(resolve, 4000));
                
                // Remove typing indicator
                typingIndicator.remove();

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                // Show AI response
                addMessageToChat(createMessage(data.analysis, false));
            } catch (error) {
                addMessageToChat(createMessage(`Error: ${error.message}`, false));
            }

            // Clear the file input
            fileInput.value = '';
        }
    });
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <div class="bot-avatar-small">
            <i data-lucide="bot" size="18"></i>
        </div>
        <span class="typing-text">Venture-Bot is thinking</span>
        <div class="typing-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;
    
    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.appendChild(indicator);
    indicator.scrollIntoView({ behavior: 'smooth' });
    
    // Initialize the bot icon
    lucide.createIcons({
        attrs: {
            class: "message-icon"
        }
    });
    
    return indicator;
}