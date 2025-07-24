# MERN Chat Application

A real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.io for real-time communication.

## Features

- **Real-time messaging** with Socket.io
- **Persistent message storage** with MongoDB
- **User-friendly interface** with modern React components
- **Responsive design** that works on desktop and mobile
- **Username-based chat** with join/leave notifications
- **Message history** loaded on page refresh
- **Auto-scroll** to latest messages
- **Typing indicators** and user status

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **MongoDB** - Database for message persistence
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - Frontend framework
- **Socket.io-client** - Client-side real-time communication
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with flexbox and responsive design

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Dhruv-477/chat-app.git
cd chat-app
```

### 2. Install dependencies

Install root dependencies:
```bash
npm install
```

Install server dependencies:
```bash
npm run install-server
```

Install client dependencies:
```bash
npm run install-client
```

Or install all dependencies at once:
```bash
npm run install-all
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:
```bash
cd server
touch .env
```

Add the following environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
```

**For MongoDB Atlas (cloud database):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Get your connection string and update the `MONGODB_URI` in `.env`

## Running the Application

### Development Mode

To run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- React frontend on `http://localhost:3000`

### Individual Services

Run backend only:
```bash
npm run server
```

Run frontend only:
```bash
npm run client
```

### Production Build

Build the React app for production:
```bash
npm run build
```

## API Endpoints

### REST API
- `GET /api/messages` - Retrieve chat message history
- `POST /api/messages` - Send a new message (used internally)

### Socket.io Events

#### Client to Server
- `join` - User joins the chat room
- `sendMessage` - Send a new message
- `disconnect` - User leaves the chat room

#### Server to Client
- `newMessage` - Broadcast new message to all clients
- `userJoined` - Notify when a user joins
- `userLeft` - Notify when a user leaves

## Project Structure

```
chat-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main chat component
│   │   ├── App.css        # Styling
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server and Socket.io setup
│   ├── .env               # Environment variables
│   └── package.json
├── package.json           # Root package.json with scripts
└── README.md             # This file
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a username to join the chat room
3. Start sending messages in real-time
4. Open multiple browser tabs/windows to test real-time functionality
5. Messages are persistent and will load when you refresh the page

## Features in Detail

### Real-time Messaging
- Messages appear instantly without page refresh
- All connected users see messages in real-time
- Smooth auto-scrolling to new messages

### Message Persistence
- All messages are stored in MongoDB
- Message history loads when joining the chat
- Timestamps for all messages

### User Experience
- Clean, modern interface
- Responsive design for mobile devices
- Visual distinction between own messages and others
- System notifications for user join/leave events

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify network connectivity for MongoDB Atlas

**Port Already in Use:**
- Change the PORT in the server `.env` file
- Kill any processes using the default ports (3000, 5000)

**Socket.io Connection Issues:**
- Check that both frontend and backend are running
- Verify CORS settings in the backend
- Ensure the Socket.io client is connecting to the correct server URL

### Development Tips

- Use browser developer tools to monitor Socket.io connections
- Check the backend console for MongoDB connection status
- Use multiple browser windows to test real-time functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Enhancements

- [ ] User authentication and registration
- [ ] Private messaging between users
- [ ] File and image sharing
- [ ] Message reactions and emojis
- [ ] Typing indicators
- [ ] Online user list
- [ ] Message search functionality
- [ ] Dark mode theme
- [ ] Push notifications
- [ ] Message encryption

## Contact

For questions or support, please open an issue on GitHub or contact the repository owner.

---

**Happy Chatting! 🚀**