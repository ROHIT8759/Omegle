'use client'

import { useState, useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'
import OnlineStats from './OnlineStats'

interface Message {
    text: string
    sender: 'stranger' | 'you'
    timestamp: number
    image?: string
    imageExpiry?: number // Timestamp when image should expire
}

interface ChatInterfaceProps {
    onBackToHome?: () => void
}

export default function ChatInterface({ onBackToHome }: ChatInterfaceProps) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [strangerCountry, setStrangerCountry] = useState<string>('')
    const [connectionStatus, setConnectionStatus] = useState<string>('Click "Skip" to start chatting')
    const [message, setMessage] = useState('')
    const [showRules, setShowRules] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [imageTimer, setImageTimer] = useState<number>(30) // Default 30 seconds
    const [currentTime, setCurrentTime] = useState(Date.now())
    const [isBotMode, setIsBotMode] = useState(false)
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Chatbot responses - more natural and diverse
    const botResponses = {
        greetings: [
            "Hey! How's it going?",
            "Hi there! What's up?",
            "Hello! Nice to meet you",
            "Yo! How are you doing?",
            "Hey hey! What brings you here?"
        ],
        questions: [
            "What do you like to do for fun?",
            "What kind of music are you into?",
            "Got any hobbies?",
            "What are you studying/working on?",
            "What's your favorite movie or show?",
            "Are you into gaming at all?",
            "What languages do you speak?",
            "Where would you like to travel?",
            "What's your favorite food?",
            "Do you prefer coffee or tea?",
            "What's something you're really passionate about?",
            "Do you play any sports?",
            "What's your dream job?",
            "Are you a morning person or night owl?",
            "What's the last book you read?",
            "Do you have any pets?",
            "What's your favorite season?",
            "Are you into any TV series right now?"
        ],
        acknowledgments: [
            "Oh cool! That's awesome",
            "Haha that's interesting!",
            "Yeah, I totally get that",
            "That sounds fun!",
            "lol yeah",
            "I feel you",
            "That's really cool actually",
            "Honestly same lol",
            "That's dope!",
            "Nice! I've heard good things about that",
            "Oh wow, that's impressive!",
            "Damn, that's actually really cool",
            "No way! That's sick",
            "For real? That's crazy",
            "Relatable af",
            "Facts tho"
        ],
        followUps: [
            "Tell me more about that",
            "How long have you been doing that?",
            "What got you into that?",
            "That must be interesting!",
            "Would you recommend it?",
            "What's the best part about it?",
            "Have you been doing that for long?",
            "What's your favorite thing about it?"
        ],
        casual: [
            "Same here tbh",
            "I wish I could do that",
            "I'm just chilling, browsing around",
            "Got any plans for the weekend?",
            "What's the best thing that happened to you recently?",
            "I'm more of a night owl tbh",
            "Been meaning to try that",
            "Sounds chill ngl",
            "Lowkey jealous lol",
            "That's on my bucket list"
        ]
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Timer to update current time and remove expired images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now())
            // Remove expired images from messages
            setMessages(prev => prev.map(msg => {
                if (msg.image && msg.imageExpiry && Date.now() > msg.imageExpiry) {
                    return { ...msg, image: undefined, imageExpiry: undefined }
                }
                return msg
            }))
        }, 1000) // Update every second

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (showRules) return // Don't connect until rules are accepted

        const newSocket = io({
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        })
        setSocket(newSocket)

        newSocket.on('connect', () => {
            console.log('Connected to server with ID:', newSocket.id)
            newSocket.emit('find-stranger')
            setIsSearching(true)
            setConnectionStatus('Looking for someone you can chat with...')
        })

        newSocket.on('connect_error', (err) => {
            console.error('Connection error:', err)
            setConnectionStatus('Connection error. Retrying...')
        })

        newSocket.on('matched', (data: any) => {
            console.log('Matched with a stranger!', data)
            // Clear timeout when real match is found
            if (searchTimeout) {
                clearTimeout(searchTimeout)
                setSearchTimeout(null)
            }
            setIsBotMode(false) // Ensure bot mode is off
            setIsConnected(true)
            setIsSearching(false)
            const country = data?.country || 'Unknown'
            setStrangerCountry(country)
            setConnectionStatus(`You're now chatting with a stranger from ${country}!`)
            setMessages([])
        })

        newSocket.on('message', (data: any) => {
            console.log('Message received:', data)
            const messageData = typeof data === 'string' ? { text: data, image: undefined } : data
            setMessages(prev => [...prev, {
                text: messageData.text,
                sender: 'stranger',
                timestamp: Date.now(),
                image: messageData.image
            }])
        })

        newSocket.on('stranger-disconnected', () => {
            console.log('Stranger disconnected')
            setIsConnected(false)
            setStrangerCountry('')
            setConnectionStatus('Stranger has disconnected.')
        })

        newSocket.on('searching', () => {
            console.log('Searching for a stranger...')
            setIsSearching(true)
            setConnectionStatus('Looking for someone you can chat with...')

            // Clear any existing timeout
            if (searchTimeout) {
                clearTimeout(searchTimeout)
            }

            // Activate bot after 15 seconds if no match found
            const timeout = setTimeout(() => {
                console.log('Checking if connected:', isConnected)
                if (!isConnected && !isBotMode) {
                    console.log('No users found after 15s, activating bot mode')
                    activateBotMode()
                }
            }, 15000) // 15 seconds
            setSearchTimeout(timeout)
        })

        return () => {
            console.log('Closing socket connection')
            if (searchTimeout) clearTimeout(searchTimeout)
            newSocket.close()
        }
    }, [showRules, isConnected])

    const activateBotMode = () => {
        console.log('Activating bot mode')
        setIsBotMode(true)
        setIsConnected(true)
        setIsSearching(false)
        setStrangerCountry('Unknown')
        setConnectionStatus("You're now chatting with a stranger!")
        setMessages([])

        // Send initial bot message
        setTimeout(() => {
            const greeting = botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)]
            setMessages(prev => [...prev, {
                text: greeting,
                sender: 'stranger',
                timestamp: Date.now()
            }])
        }, 1500)
    }

    const getBotResponse = (userMessage: string): string => {
        const msg = userMessage.toLowerCase().trim()

        // Track conversation context
        const lastMessages = messages.slice(-3).map(m => m.text.toLowerCase())

        // Greetings
        if (msg.match(/^(hi|hello|hey|yo|sup|hola|hii+|hey+)/)) {
            return botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)]
        }

        // How are you variations
        if (msg.match(/(how are you|how r u|how ru|hru|wyd|what.*doing|wassup|sup)/)) {
            const responses = [
                "I'm doing great! Thanks for asking. How about you?",
                "Pretty good! Just hanging out. You?",
                "Not bad! Kinda bored tbh. What about you?",
                "Good good! Just vibing. Wbu?"
            ]
            return responses[Math.floor(Math.random() * responses.length)]
        }

        // Age questions
        if (msg.match(/(how old|your age|age\?|u\s*\d+)/)) {
            const ages = [19, 20, 21, 22, 23]
            return `I'm ${ages[Math.floor(Math.random() * ages.length)]}. You?`
        }

        // Location questions
        if (msg.match(/(where.*from|where.*live|your country|which country|location)/)) {
            const places = ['the US', 'Canada', 'UK', 'Australia']
            return `I'm from ${places[Math.floor(Math.random() * places.length)]}. How about you?`
        }

        // Gender questions (deflect)
        if (msg.match(/(gender|boy|girl|male|female|guy|girl|asl|a\/s\/l)/)) {
            return "Does it really matter? Let's just chat!"
        }

        // Goodbye
        if (msg.match(/(bye|gtg|gotta go|have to go|see ya|later|goodbye)/)) {
            return "Nice chatting with you! Take care!"
        }

        // Compliments
        if (msg.match(/(cool|awesome|nice|great|amazing|interesting)/)) {
            return botResponses.acknowledgments[Math.floor(Math.random() * botResponses.acknowledgments.length)]
        }

        // Hobbies/interests mentioned
        if (msg.match(/(gaming|games|play|music|sports|reading|movies|tv|netflix|anime|coding|programming)/)) {
            return botResponses.followUps[Math.floor(Math.random() * botResponses.followUps.length)]
        }

        // Short responses
        if (msg.length < 10) {
            const shortResponses = [
                ...botResponses.acknowledgments,
                ...botResponses.questions.slice(0, 5)
            ]
            return shortResponses[Math.floor(Math.random() * shortResponses.length)]
        }

        // Questions get engaging responses
        if (msg.includes('?')) {
            const allResponses = [
                ...botResponses.acknowledgments,
                ...botResponses.questions,
                ...botResponses.followUps
            ]
            return allResponses[Math.floor(Math.random() * allResponses.length)]
        }

        // Vary responses based on message count to avoid repetition
        const responseType = Math.random()
        if (responseType < 0.4) {
            return botResponses.acknowledgments[Math.floor(Math.random() * botResponses.acknowledgments.length)]
        } else if (responseType < 0.7) {
            return botResponses.questions[Math.floor(Math.random() * botResponses.questions.length)]
        } else {
            return botResponses.casual[Math.floor(Math.random() * botResponses.casual.length)]
        }
    }

    const handleNewChat = () => {
        console.log('Starting new chat, clearing bot mode')
        // Clear any existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout)
            setSearchTimeout(null)
        }
        setIsBotMode(false)
        if (socket) {
            setMessages([])
            setIsConnected(false)
            setIsSearching(true)
            setStrangerCountry('')
            socket.emit('find-stranger')
        }
    }

    const handleStopChat = () => {
        if (socket) {
            socket.emit('disconnect-chat')
            setIsConnected(false)
            setIsSearching(false)
            setConnectionStatus('You have disconnected.')
        }
    }

    const handleSendMessage = () => {
        if (isConnected && (message.trim() || selectedImage)) {
            const imageExpiry = selectedImage ? Date.now() + (imageTimer * 1000) : undefined

            // Add user message
            setMessages(prev => [...prev, {
                text: message || '📷 Image',
                sender: 'you',
                timestamp: Date.now(),
                image: selectedImage || undefined,
                imageExpiry
            }])

            // Send to socket if not bot mode
            if (!isBotMode && socket) {
                const messageData = selectedImage ? { text: message || '📷 Image', image: selectedImage, imageExpiry } : message
                socket.emit('message', messageData)
            }

            // Get bot response if in bot mode
            if (isBotMode && message.trim()) {
                const responseDelay = 1500 + Math.random() * 2500 // 1.5-4 seconds
                setTimeout(() => {
                    const botReply = getBotResponse(message)
                    setMessages(prev => [...prev, {
                        text: botReply,
                        sender: 'stranger',
                        timestamp: Date.now()
                    }])

                    // Ask follow-up question 40% of the time after acknowledgments
                    if (Math.random() < 0.4 && botReply.length < 50) {
                        setTimeout(() => {
                            const followUp = botResponses.questions[Math.floor(Math.random() * botResponses.questions.length)]
                            setMessages(prev => [...prev, {
                                text: followUp,
                                sender: 'stranger',
                                timestamp: Date.now()
                            }])
                        }, 2500 + Math.random() * 2500)
                    }

                    setMessage('')
                    setSelectedImage(null)
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                    }
                }
    }

            const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0]
                if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                        alert('Image size must be less than 5MB')
                        return
                    }
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        setSelectedImage(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                }
            }

            const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                }
            }

            const handleAgreeRules = () => {
                setShowRules(false)
            }

            return (
                <div className="flex flex-col h-screen bg-white">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-300 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
                                <circle cx="24" cy="24" r="22" fill="#0099ff" fillOpacity="0.2" />
                                <text x="24" y="32" fontSize="24" fill="#0099ff" fontWeight="bold" textAnchor="middle">O</text>
                            </svg>
                            <div>
                                <h1 className="text-2xl font-bold" style={{ color: '#ff6600' }}>omegle</h1>
                                <p className="text-sm text-gray-600">Talk to strangers!</p>
                            </div>
                        </div>
                        <OnlineStats />
                    </header>

                    {/* Rules Modal */}
                    {showRules && (
                        <div className="absolute inset-0 bg-white z-50 flex items-start justify-center pt-20 px-4">
                            <div className="bg-white max-w-2xl w-full">
                                <div className="mb-6">
                                    <p className="text-blue-500 text-sm mb-4">
                                        <span className="font-bold">omegleweb.io</span>: Talk to strangers!
                                    </p>
                                    <h2 className="text-xl font-bold mb-4">Welcome to OmegleWeb.io, please read the rules below:</h2>
                                    <p className="text-red-600 font-bold mb-3">You must be at least 18 years old</p>
                                    <ul className="space-y-2 text-gray-700 mb-6">
                                        <li>No nudity, hate speech, or harassment</li>
                                        <li>Do not ask for gender. This is not a dating site</li>
                                        <li>Respect others and be kind</li>
                                        <li>Violators will be banned</li>
                                    </ul>
                                    <button
                                        onClick={handleAgreeRules}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
                                    >
                                        I Agree
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Status */}
                    <div className="bg-gray-100 px-4 py-2 text-sm text-gray-700 border-b border-gray-300">
                        {connectionStatus}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-white">
                        {messages.length === 0 && !isSearching && (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <p>Start chatting by clicking Skip to find a stranger!</p>
                            </div>
                        )}

                        {messages.map((msg, index) => {
                            const timeRemaining = msg.imageExpiry ? Math.max(0, Math.floor((msg.imageExpiry - currentTime) / 1000)) : null

                            return (
                                <div key={index} className="mb-2">
                                    <span className="font-bold text-sm" style={{ color: msg.sender === 'you' ? '#0000FF' : '#FF0000' }}>
                                        {msg.sender === 'you' ? 'You' : 'Stranger'}:
                                    </span>
                                    {msg.image && (
                                        <div className="ml-2 mt-1 inline-block relative">
                                            <img
                                                src={msg.image}
                                                alt="Shared image"
                                                className="max-w-xs h-auto rounded cursor-pointer hover:opacity-90 border border-gray-300"
                                                onClick={() => window.open(msg.image, '_blank')}
                                            />
                                            {timeRemaining !== null && timeRemaining > 0 && (
                                                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-bold">
                                                    ⏱️ {timeRemaining}s
                                                </div>
                                            )}
                                            {timeRemaining === 0 && (
                                                <div className="absolute inset-0 bg-gray-200 bg-opacity-90 flex items-center justify-center rounded">
                                                    <span className="text-gray-600 text-sm font-semibold">🔒 Image expired</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {msg.text && msg.text !== '📷 Image' && (
                                        <span className="ml-2 text-sm text-black">{msg.text}</span>
                                    )}
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Control Panel */}
                    <div className="border-t border-gray-300 bg-white">
                        {/* Image Preview */}
                        {selectedImage && (
                            <div className="p-3 bg-gray-50 border-b border-gray-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded border border-gray-300" />
                                        <span className="text-sm text-gray-600">Image ready to send</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedImage(null)
                                            if (fileInputRef.current) fileInputRef.current.value = ''
                                        }}
                                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                                {/* Timer selector */}
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-600">Image expires in:</span>
                                    <select
                                        value={imageTimer}
                                        onChange={(e) => setImageTimer(Number(e.target.value))}
                                        className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={15}>15 seconds</option>
                                        <option value={30}>30 seconds</option>
                                        <option value={60}>1 minute</option>
                                        <option value={120}>2 minutes</option>
                                        <option value={300}>5 minutes</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="p-2 flex items-center space-x-2">
                            <button
                                onClick={handleNewChat}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded text-lg min-w-[120px]"
                            >
                                Skip
                                <div className="text-xs font-normal">Esc</div>
                            </button>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                disabled={!isConnected}
                                className="hidden"
                                id="image-upload"
                            />

                            {/* Image upload button */}
                            <label
                                htmlFor="image-upload"
                                className={`cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded text-2xl ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Upload image"
                            >
                                📎
                            </label>

                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                disabled={!isConnected}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                            />

                            <button
                                onClick={handleSendMessage}
                                disabled={!isConnected || (!message.trim() && !selectedImage)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded disabled:bg-gray-300 disabled:cursor-not-allowed text-lg min-w-[120px]"
                            >
                                Send
                                <div className="text-xs font-normal">Enter</div>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
