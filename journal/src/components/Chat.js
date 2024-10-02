import React, { useState, useEffect, useRef } from 'react';
import { Feather } from 'lucide-react';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [typingText, setTypingText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Save messages to localStorage whenever messages change
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = { text: inputMessage, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('I\'m busy!! Byeee');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      typeWriterEffect(data.response);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { text: `Error: ${error.message}. Please try again.`, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const typeWriterEffect = (text) => {
    let i = 0;
    setTypingText('');
    const typing = setInterval(() => {
      if (i < text.length) {
        setTypingText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typing);
        setMessages((prevMessages) => [...prevMessages, { text, sender: 'bot' }]);
        setTypingText('');
      }
    }, 50);
  };

  const handleSessionEnd = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    // Combine all messages into one journal entry
    const entryContent = messages.map((msg) => `${msg.sender === 'user' ? 'User' : 'Diary'}: ${msg.text}`).join('\n');

    try {
      const response = await fetch('http://localhost:5000/save-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: entryContent }),
      });

      if (!response.ok) {
        throw new Error(`Error saving entry: ${response.statusText}`);
      }

      console.log('Entry saved successfully.');
    } catch (error) {
      console.error('Error saving session:', error);
    } finally {
      // Clear localStorage and reset chat
      localStorage.removeItem('chatMessages');
      setMessages([]);
    }
  };

  useEffect(() => {
    // Ensure the session is saved when the user navigates away
    const handleBeforeUnload = () => {
      handleSessionEnd();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [messages]);

  return (
    <div className="container">
      <div className="book">
        <div className="page left-page">
          <div className="page-content">
            {messages.map((message, index) => (
              <div key={index} className={message.sender === 'user' ? 'message user' : 'message bot'}>
                <span>{message.text}</span>
              </div>
            ))}
            {typingText && (
              <div className="message bot typing">
                <span>
                  {typingText}
                  <span className="cursor">|</span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="page right-page">
          <div className="input-container">
            <textarea
              className="input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Write your thoughts here..."
            />
            <button className="send-button" onClick={handleSendMessage}>
              <Feather size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
