'use client'

import { useState, useEffect } from 'react'

export default function OnlineStats() {
    const [onlineCount, setOnlineCount] = useState<number>(5000)
    const [baseCount] = useState<number>(() => 5000 + Math.floor(Math.random() * 500)) // Random base between 5000-5500

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/status')
                if (response.ok) {
                    const data = await response.json()
                    // Total online = base count + waiting users + (active connections * 2)
                    const realUsers = data.waitingUsers + (data.activeConnections * 2)
                    const randomVariation = Math.floor(Math.random() * 100) // Add 0-100 random variation
                    setOnlineCount(baseCount + realUsers + randomVariation)
                }
            } catch (error) {
                console.error('Error fetching stats:', error)
                const randomVariation = Math.floor(Math.random() * 100)
                setOnlineCount(baseCount + randomVariation)
            }
        }

        fetchStats()
        const interval = setInterval(fetchStats, 10000) // Update every 10 seconds

        return () => clearInterval(interval)
    }, [baseCount])

    return (
        <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full px-6 py-3 shadow-lg transform hover:scale-105 transition-all">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
                    </div>
                    <span className="text-white font-bold text-lg">
                        {onlineCount.toLocaleString()} <span className="font-normal">online now</span>
                    </span>
                </div>
            </div>
        </div>
    )
}
