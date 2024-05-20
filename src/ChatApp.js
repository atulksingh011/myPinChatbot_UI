import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBox.css';

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const saveChatHistory = (history) => {
    localStorage.setItem('chatHistory', JSON.stringify(history));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://164.52.215.147:5005/webhooks/rest/webhook', {
        sender: "test_user1",
        message
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedHistory = [
        ...chatHistory,
        { sender: 'user', text: message, time: formattedTime },
      ];

      response.data.forEach(data => {

        if(data.text){
          updatedHistory.push({ sender: 'bot', text: data.text, time: formattedTime });
        }else if(data.custom) {
          updatedHistory.push({ sender: 'bot', json: JSON.stringify(data.custom, null, 2), time: formattedTime });
        }
      });
      
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
      setMessage('');
    } catch (error) {
      console.error('Error fetching chat response:', error);
    }
  };

  useEffect(() => {
    setChatHistory([]);
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header bg-primary">
        <h2>MyPin ChatBot</h2>
      </div>
      <div className="chat-history" ref={chatHistoryRef}>
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
            <div className={`message-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}>
              {msg.text && <span className="message-text">{msg.text}</span>}
              {msg.json && <pre style={{margin: 0}}>{msg.json}</pre>}
              <span className="message-time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <div className="input-group">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-control"
            placeholder="Type your message..."
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
