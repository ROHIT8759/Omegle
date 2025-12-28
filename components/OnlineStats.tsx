'use client'

import { useState, useEffect } from 'react'

export default function OnlineStats() {
    const [onlineCount, setOnlineCount] = useState<number>(0)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/status')
                if (response.ok) {
                    const data = await response.json()
                    // Total online = waiting users + (active connections * 2) since each connection has 2 users
                    const total = data.waitingUsers + (data.activeConnections * 2)
                    setOnlineCount(total)
                }
            } catch (error) {
                console.error('Error fetching stats:', error)
                setOnlineCount(0)
            }
        }

        fetchStats()
        const interval = setInterval(fetchStats, 10000) // Update every 10 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span><strong>{onlineCount}</strong> online now</span>
            </div>
        </div>
    )
}
