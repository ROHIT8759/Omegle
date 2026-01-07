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

    // Chatbot responses
    const botResponses = [
        "Hey! How's it going?",
        "What brings you here today?",
        "Nice to meet you! Where are you from?",
        "I'm just chilling, browsing around. You?",
        "Haha that's interesting!",
        "Tell me more about that",
        "Oh cool! What do you like to do for fun?",
        "Same here! That's awesome",
        "What kind of music do you listen to?",
        "Yeah, I totally get that",
        "Do you have any hobbies?",
        "That sounds fun! I wish I could do that",
        "lol yeah",
        "So what are you studying/working on?",
        "Nice! How long have you been doing that?",
        "I feel you",
        "That's really cool actually",
        "Got any plans for the weekend?",
        "What's your favorite movie or show?",
        "I've heard good things about that!",
        "Honestly same lol",
        "What's the best thing that happened to you recently?",
        "That's dope!",
        "Are you into gaming at all?",
        "What languages do you speak?",
        "Where would you like to travel?",
        "What's your favorite food?",
        "I'm more of a night owl tbh",
        "Do you prefer coffee or tea?",
        "What's something you're really passionate about?"
    ]

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
            
            // Activate bot after 10 seconds if no match found
            const timeout = setTimeout(() => {
                if (!isConnected) {
                    console.log('No users found, activating bot mode')
                    activateBotMode()
                }
            }, 10000) // 10 seconds
            setSearchTimeout(timeout)
        })

        return () => {
            console.log('Closing socket connection')
            if (searchTimeout) clearTimeout(searchTimeout)
            newSocket.close()
        }
    }, [showRules, isConnected])

    const activateBotMode = () => {
        setIsBotMode(true)
        setIsConnected(true)
        setIsSearching(false)
        setStrangerCountry('AI')
        setConnectionStatus("You're now chatting with a stranger!")
        setMessages([])
        
        // Send initial bot message
        setTimeout(() => {
            const greeting = botResponses[Math.floor(Math.random() * 3)] // First 3 are greetings
            setMessages(prev => [...prev, {
                text: greeting,
                sender: 'stranger',
                timestamp: Date.now()
            }])
        }, 1500)
    }

    const getBotResponse = (userMessage: string): string => {
        const msg = userMessage.toLowerCase()
        
        // Contextual responses
        if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
            return botResponses[Math.floor(Math.random() * 3)]
        }
        if (msg.includes('how are you') || msg.includes('how r u')) {
            return "I'm doing great! Thanks for asking. How about you?"
        }
        if (msg.includes('age') || msg.includes('old')) {
            return "I'm 22. You?"
        }
        if (msg.includes('from') || msg.includes('where')) {
            return "I'm from the US. How about you?"
        }
        if (msg.includes('bye') || msg.includes('gtg') || msg.includes('gotta go')) {
            return "Nice chatting with you! Take care!"
        }
        if (msg.includes('?')) {
            // Questions get specific responses
            const questionResponses = [
                "Hmm, good question! I'd say " + botResponses[Math.floor(Math.random() * botResponses.length)].toLowerCase(),
                "Let me think... " + botResponses[Math.floor(Math.random() * botResponses.length)],
                botResponses[Math.floor(Math.random() * botResponses.length)]
            ]
            return questionResponses[Math.floor(Math.random() * questionResponses.length)]
        }
        
        // Random response from pool
        return botResponses[Math.floor(Math.random() * botResponses.length)]
    }

    const handleNewChat = () => {
        if (searchTimeout) clearTimeout(searchTimeout)
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
                const responseDelay = 1000 + Math.random() * 2000 // 1-3 seconds
                setTimeout(() => {
                    const botReply = getBotResponse(message)
                    setMessages(prev => [...prev, {
                        text: botReply,
                        sender: 'stranger',
                        timestamp: Date.now()
                    }])
                    
                    // Random follow-up question 30% of the time
                    if (Math.random() < 0.3) {
                        setTimeout(() => {
                            const followUp = botResponses[Math.floor(Math.random() * botResponses.length)]
                            setMessages(prev => [...prev, {
                                text: followUp,
                                sender: 'stranger',
                                timestamp: Date.now()
                            }])
                        }, 2000 + Math.random() * 3000)
                    }
                }, responseDelay)
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
