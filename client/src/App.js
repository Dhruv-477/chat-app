import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch existing messages
    fetch('http://localhost:5000/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('Error fetching messages:', err));

    // Socket event listeners
    socket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('userJoined', (username) => {
      setMessages(prev => [...prev, {
        username: 'System',
        message: `${username} joined the chat`,
        timestamp: new Date(),
        isSystem: true
      }]);
    });

    socket.on('userLeft', (username) => {
      setMessages(prev => [...prev, {
        username: 'System',
        message: `${username} left the chat`,
        timestamp: new Date(),
        isSystem: true
      }]);
    });

    return () => {
      socket.off('newMessage');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
      socket.emit('join', username);
    }
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit('sendMessage', {
        username,
        message: inputMessage
      });
      setInputMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (!isUsernameSet) {
    return (
      <div className="App">
        <div className="username-container">
          <h2>Join Chat Room</h2>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              required
            />
            <button type="submit">Join Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Chat Room</h2>
          <span className="username-display">Welcome, {username}!</span>
        </div>
        
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.isSystem ? 'system-message' : ''} ${msg.username === username ? 'own-message' : ''}`}
            >
              <div className="message-header">
                <span className="username">{msg.username}</span>
                <span className="timestamp">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="message-content">{msg.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form" onSubmit={handleMessageSubmit}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            maxLength={500}
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
