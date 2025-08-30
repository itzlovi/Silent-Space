# SilentSpace - AI Psychology Chatbot

A modern, responsive AI-powered psychology chatbot built with React, TypeScript, and Tailwind CSS. This application provides empathetic mental health support through conversational AI.

## Features

- 🤖 **AI-Powered Conversations**: Powered by Google's Gemini AI for intelligent, empathetic responses
- 🌙 **Dark/Light Theme**: Toggle between dark and light modes for comfortable viewing
- 🎨 **Customizable Colors**: Personalize the interface with a comprehensive color picker
- 💬 **Real-time Chat**: Smooth, responsive chat interface with message timestamps
- 🔒 **Privacy Focused**: Secure conversations with privacy notices
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Modern UI**: Built with Tailwind CSS for a clean, professional appearance

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini API
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Gemini API key:
   - Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a `.env` file in the root directory
   - Add your API key: `REACT_APP_GEMINI_API_KEY=your_actual_api_key_here`

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Usage

1. **Start a Conversation**: Type your message in the input field and press Enter or click Send
2. **Switch Themes**: Use the Light/Dark toggle button in the header
3. **Customize Colors**: Click the Colors button to open the color picker and personalize the interface
4. **Clear Chat**: Use the Clear Chat button to start a new conversation

## Security

⚠️ **Important Security Notes:**
- Never commit your `.env` file to version control
- The `.env` file is already added to `.gitignore` to prevent accidental commits
- Keep your API keys private and secure
- If you accidentally expose your API key, immediately regenerate it in Google AI Studio

## Important Notes

- This is a supportive AI assistant, not a replacement for professional mental health care
- For serious mental health concerns, please consult a qualified professional
- Conversations are processed through Google's Gemini AI API
- The application is designed for educational and supportive purposes only

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is for educational purposes. Please ensure compliance with Google's Gemini API terms of service.
