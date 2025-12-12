# Omegle Clone

A real-time chat application similar to Omegle, built with Next.js and Socket.IO.

## Features

- 🎲 Random stranger matching
- 💬 Real-time messaging
- � Country tracking with IP geolocation
- 📊 Chat history stored in Supabase
- 📸 Image sharing with Cloudinary
- 🎨 Clean, modern UI
- ⚡ Fast and responsive
- 🔄 Easy reconnection

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Socket.IO (integrated with Next.js)
- **Database**: Supabase (PostgreSQL)
- **Image Storage**: Cloudinary
- **Geolocation**: geoip-lite
- **Real-time Communication**: WebSockets

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account ([supabase.com](https://supabase.com))
- Cloudinary account ([cloudinary.com](https://cloudinary.com))

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd "d:\HACKATHONS\Omegle"
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Set up Supabase database:

Run the SQL schema in your Supabase SQL editor:

```bash
# Copy the contents of supabase-schema.sql and run it in Supabase SQL Editor
```

### Running the Application

Simply run one command to start both frontend and backend:

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:3000
```

## How to Use

1. Click the **"Text"** button on the landing page to start
2. Automatically searches for a stranger
3. Once matched, start chatting!
4. Share images (stored in Cloudinary)
5. Click **"Stop"** to end the current chat
6. Click **"New"** again to find another stranger
7. Click **"Back to Home"** to return to landing page

## Database Schema

The app stores the following data in Supabase:

- **user_connections**: Tracks user connections with country and IP
- **chat_sessions**: Stores chat sessions with both users' countries and duration
- **chat_messages**: Stores all messages with timestamps and image URLs

## Project Structure

```
omegle/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── LandingPage.tsx   # Landing page with options
│   ├── ChatInterface.tsx # Main chat interface
│   ├── Header.tsx        # Header component
│   ├── ChatBox.tsx       # Message display
│   └── ControlPanel.tsx  # Input and controls
├── lib/
│   ├── supabase.ts       # Supabase client & types
│   ├── cloudinary.js     # Cloudinary integration
│   └── geoLocation.js    # IP geolocation utilities
├── server.js             # Next.js + Socket.IO server
├── supabase-schema.sql   # Database schema
├── package.json
└── README.md
```

## Features Explained

- **Random Matching**: Users are randomly paired with strangers
- **Real-time Chat**: Messages are sent and received instantly using WebSockets
- **Country Tracking**: Automatically detects user's country from IP address
- **Data Persistence**: All chats, messages, and user connections stored in Supabase
- **Image Sharing**: Images uploaded to Cloudinary and stored with messages
- **Session Tracking**: Track chat duration and session details
- **Connection Status**: Visual feedback for searching, connected, and disconnected states
- **Clean UI**: Modern, responsive design inspired by Omegle

## Data Tracked

The application tracks:

- 🌍 User's country (via IP geolocation)
- 💬 All chat messages
- 📸 Images shared in chats
- ⏱️ Chat session duration
- 🔗 Connection/disconnection times
- 📊 User statistics by country

## Safety Note

⚠️ This is a demo application. In a production environment, you should implement:

- User authentication
- Content moderation
- Rate limiting
- Reporting system
- Age verification
- Terms of service

## License

MIT License - feel free to use this project for learning purposes.
