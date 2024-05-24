import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBox.css";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    const savedChatHistory = localStorage.getItem("chatHistory");
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
    localStorage.setItem("chatHistory", JSON.stringify(history));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://164.52.215.147:5005/webhooks/rest/webhook",
        {
          sender: "test_user1",
          message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const formattedTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const updatedHistory = [
        ...chatHistory,
        { sender: "user", text: message, time: formattedTime },
      ];

      response.data.forEach((data) => {
        if (data.text) {
          updatedHistory.push({
            sender: "bot",
            text: data.text,
            time: formattedTime,
          });
        } else if (data.custom) {
          updatedHistory.push({
            sender: "bot",
            json: JSON.stringify(data.custom, null, 2),
            time: formattedTime,
          });
        }
      });

      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
      setMessage("");
    } catch (error) {
      console.error("Error fetching chat response:", error);
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
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            <div
              className={`message-bubble ${
                msg.sender === "user" ? "user" : "bot"
              }`}
            >
              {msg.text && <span className="message-text">{msg.text}</span>}
              {msg.json && <pre style={{ margin: 0 }}>{msg.json}</pre>}
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
          <MicButton onChange={(text) => setMessage(text)} />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

const MicButton = ({ onChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        onChange(finalTranscript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onChange]);

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      clearTimeout(timeoutRef.current);
    } else {
      recognitionRef.current.start();
      timeoutRef.current = setTimeout(() => {
        recognitionRef.current.stop();
      }, 3000);
    }
    setIsRecording(!isRecording);
  };

  return (
    <button
      type="button"
      className={`btn ${isRecording ? "btn-danger" : "btn-secondary"}`}
      onClick={handleMicClick}
    >
      {isRecording ? (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-mic-fill btn-danger"
        viewBox="0 0 16 16"
      >
        <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
      </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-mic-mute btn-secondary"
          viewBox="0 0 16 16"
        >
          <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4m3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3" />
          <path d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z" />
        </svg>
      )}
    </button>
  );
};

export default ChatBox;
