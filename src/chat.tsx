import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Heart, Brain, Trash2, Moon, Sun, Palette, X } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const PsychologyChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello, how can I assist you?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] = useState({
    userMessageBg: '#000000',
    botMessageBg: '#ffffff',
    userAvatarBg: '#000000',
    botAvatarBg: '#000000',
    sendButtonBg: '#6b7280',
    headerBg: '#ffffff',
    inputBg: '#ffffff'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
         // Update colors based on theme
           if (newDarkMode) {
        setCustomColors({
          userMessageBg: '#000000',
          botMessageBg: '#374151',
          userAvatarBg: '#000000',
          botAvatarBg: '#ffffff',
          sendButtonBg: '#1f2937',
          headerBg: '#111827',
          inputBg: '#374151'
        });
      } else {
        setCustomColors({
          userMessageBg: '#000000',
          botMessageBg: '#ffffff',
          userAvatarBg: '#000000',
          botAvatarBg: '#000000',
          sendButtonBg: '#6b7280',
          headerBg: '#ffffff',
          inputBg: '#ffffff'
        });
      }
  };

  const updateColor = (element: string, color: string) => {
    setCustomColors(prev => ({
      ...prev,
      [element]: color
    }));
  };

           const resetColors = () => {
      if (isDarkMode) {
        setCustomColors({
          userMessageBg: '#000000',
          botMessageBg: '#374151',
          userAvatarBg: '#000000',
          botAvatarBg: '#ffffff',
          sendButtonBg: '#1f2937',
          headerBg: '#111827',
          inputBg: '#374151'
        });
      } else {
       setCustomColors({
         userMessageBg: '#000000',
         botMessageBg: '#ffffff',
         userAvatarBg: '#000000',
         botAvatarBg: '#000000',
         sendButtonBg: '#6b7280',
         headerBg: '#ffffff',
         inputBg: '#ffffff'
       });
     }
   };

  const getPsychologyPrompt = (userMessage: string, conversationHistory: Message[]) => {
    const historyText = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map((msg: Message) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    return `You are a professional, empathetic psychology assistant. You provide supportive, non-judgmental responses to help users with their mental health concerns.

IMPORTANT GUIDELINES:
- Be warm, empathetic, and supportive
- Use active listening techniques to show understanding
-  Ask thoughtful follow-up questions that help the user reflect on their relationships, goals, and challenges
- Provide coping strategies when appropriate
- ALWAYS respond in the same language and style that the user is using
- If user mixes languages (like Hinglish), respond in the same mixed language style
- Match the user's communication style and formality level
- Maintain professional boundaries while being approachable and friendly
- Never give medical or clinical diagnoses
- Encourage self-awareness, personal growth, and seeking professional help when needed
- Keep responses concise but meaningful (2-4 sentences)

CONVERSATION HISTORY:
${historyText}

USER'S CURRENT MESSAGE: ${userMessage}

Respond as a caring psychology assistant. If the user is speaking Hindi/Punjabi, respond in the same language. Be supportive and helpful:`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const prompt = getPsychologyPrompt(input, messages);
      
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: data.candidates[0]?.content?.parts[0]?.text || "मुझे खुशी होगी अगर आप अपनी बात दोबारा कह सकें। मैं यहाँ आपकी मदद के लिए हूँ।",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "माफ करें, मुझे कुछ technical problem हो रही है। कृपया थोड़ी देर बाद try करें। आपकी mental health मेरे लिए important है।",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello, how can I assist you?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  return (
         <div className={`w-full h-screen flex flex-col transition-colors duration-300 ${
       isDarkMode 
         ? 'bg-black' 
         : 'bg-white'
     }`}>
      {/* Header */}
             <div className={`shadow-lg border-b transition-colors duration-300 ${
         isDarkMode 
           ? `border-gray-700` 
           : 'border-gray-200'
       } p-4`} style={{ backgroundColor: isDarkMode ? customColors.headerBg : '#ffffff' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
                         <div className="flex items-center space-x-2">
               <Brain className={`h-8 w-8 ${isDarkMode ? 'text-white' : 'text-black'}`} />
               <Heart className={`h-6 w-6 ${isDarkMode ? 'text-white' : 'text-black'}`} />
             </div>
            <div>
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>SilentSpace</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
                             className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                 isDarkMode 
                   ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                   : 'bg-gray-100 hover:bg-gray-200 text-black'
               }`}
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </>
              )}
            </button>
                         <button
               onClick={() => setShowColorPicker(!showColorPicker)}
               className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                 isDarkMode 
                   ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                   : 'bg-gray-100 hover:bg-gray-200 text-black'
               }`}
             >
               <Palette className="h-4 w-4" />
               <span>Colors</span>
             </button>
             <button
               onClick={clearChat}
               className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                 isDarkMode 
                   ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                   : 'bg-gray-100 hover:bg-gray-200 text-black'
               }`}
             >
               <Trash2 className="h-4 w-4" />
               <span>Clear Chat</span>
             </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-3 max-w-3xl ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
                             <div
                 className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                   message.sender === 'user'
                     ? 'text-white'
                     : isDarkMode ? 'text-black' : 'text-white'
                 }`}
                 style={{ backgroundColor: message.sender === 'user' ? customColors.userAvatarBg : customColors.botAvatarBg }}
               >
                {message.sender === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
                             <div
                 className={`px-4 py-3 rounded-lg transition-colors duration-300 ${
                   message.sender === 'user'
                     ? 'text-white rounded-br-none shadow-lg'
                     : isDarkMode 
                       ? 'text-white rounded-bl-none shadow-lg' 
                       : 'text-black rounded-bl-none border border-gray-200 shadow-sm'
                 }`}
                 style={{ backgroundColor: message.sender === 'user' ? customColors.userMessageBg : customColors.botMessageBg }}
               >
                <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                                 <p className={`text-xs mt-2 transition-colors duration-300 ${
                   message.sender === 'user' 
                     ? 'opacity-70' 
                     : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                 }`}>
                  {message.timestamp.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-3xl">
                             <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                 isDarkMode ? 'text-black' : 'text-white'
               }`} style={{ backgroundColor: customColors.botAvatarBg }}>
                <Bot className="h-4 w-4" />
              </div>
                             <div className={`text-gray-800 rounded-lg rounded-bl-none border px-4 py-3 transition-colors duration-300 ${
                 isDarkMode 
                   ? 'text-white shadow-lg' 
                   : 'border-gray-200'
               }`} style={{ backgroundColor: customColors.botMessageBg }}>
                <div className="flex space-x-2">
                                     <div className={`w-2 h-2 rounded-full animate-bounce ${
                     isDarkMode ? 'bg-white' : 'bg-black'
                   }`}></div>
                   <div className={`w-2 h-2 rounded-full animate-bounce ${
                     isDarkMode ? 'bg-white' : 'bg-black'
                   }`} style={{animationDelay: '0.1s'}}></div>
                   <div className={`w-2 h-2 rounded-full animate-bounce ${
                     isDarkMode ? 'bg-white' : 'bg-black'
                   }`} style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
             <div className={`border-t transition-colors duration-300 ${
         isDarkMode 
           ? 'border-gray-700' 
           : 'border-gray-200'
       } p-4`} style={{ backgroundColor: isDarkMode ? customColors.headerBg : '#ffffff' }}>
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="type......"
                             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none transition-colors duration-300 ${
                 isDarkMode 
                   ? 'border-gray-600 text-white placeholder-gray-400' 
                   : 'border-gray-300'
               }`}
               style={{ backgroundColor: isDarkMode ? customColors.inputBg : '#ffffff' }}
              rows={2}
              disabled={isLoading}
            />
          </div>
                     <button
             onClick={sendMessage}
             disabled={!input.trim() || isLoading}
                          className={`px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2 ${
                isDarkMode 
                  ? 'text-white hover:bg-gray-200' 
                  : 'text-white hover:bg-gray-800'
              }`}
              style={{ backgroundColor: customColors.sendButtonBg }}
           >
             <Send className="h-4 w-4" />
             <span>Send</span>
           </button>
        </div>

        {/* Privacy Notice */}
        <div className={`mt-3 text-xs text-center transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          🔒 Your conversations are private and secure. For serious mental health concerns, please consult a professional.
                 </div>
       </div>

       {/* Color Picker Panel */}
       {showColorPicker && (
         <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
           <div className={`p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
             isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
           }`}>
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold">Customize Colors</h3>
               <button
                 onClick={() => setShowColorPicker(false)}
                 className="p-1 hover:bg-gray-200 rounded"
               >
                 <X className="h-5 w-5" />
               </button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-2">User Message Background</label>
                 <input
                   type="color"
                   value={customColors.userMessageBg}
                   onChange={(e) => updateColor('userMessageBg', e.target.value)}
                   className="w-full h-10 rounded border"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-2">Bot Message Background</label>
                 <input
                   type="color"
                   value={customColors.botMessageBg}
                   onChange={(e) => updateColor('botMessageBg', e.target.value)}
                   className="w-full h-10 rounded border"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-2">User Avatar Background</label>
                 <input
                   type="color"
                   value={customColors.userAvatarBg}
                   onChange={(e) => updateColor('userAvatarBg', e.target.value)}
                   className="w-full h-10 rounded border"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-2">Bot Avatar Background</label>
                 <input
                   type="color"
                   value={customColors.botAvatarBg}
                   onChange={(e) => updateColor('botAvatarBg', e.target.value)}
                   className="w-full h-10 rounded border"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-2">Send Button Background</label>
                 <input
                   type="color"
                   value={customColors.sendButtonBg}
                   onChange={(e) => updateColor('sendButtonBg', e.target.value)}
                   className="w-full h-10 rounded border"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-2">Header Background</label>
                 <input
                   type="color"
                   value={customColors.headerBg}
                   onChange={(e) => updateColor('headerBg', e.target.value)}
                   className="w-full h-10 rounded border"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-2">Input Background</label>
                 <input
                   type="color"
                   value={customColors.inputBg}
                   onChange={(e) => updateColor('inputBg', e.target.value)}
                   className="w-full h-10 rounded border"
                 />
               </div>
               
               <div className="flex space-x-2 pt-4">
                 <button
                   onClick={resetColors}
                   className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                     isDarkMode 
                       ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                       : 'bg-gray-100 hover:bg-gray-200 text-black'
                   }`}
                 >
                   Reset Colors
                 </button>
                 <button
                   onClick={() => setShowColorPicker(false)}
                   className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                     isDarkMode 
                       ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                       : 'bg-gray-100 hover:bg-gray-200 text-black'
                   }`}
                 >
                   Done
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default PsychologyChatbot;
