'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function OnlineStats() {
    const [onlineCount, setOnlineCount] = useState<number>(0)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get active connections (connected in last 5 minutes)
                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
                const { count: activeCount } = await supabase
                    .from('user_connections')
                    .select('*', { count: 'exact', head: true })
                    .gte('connected_at', fiveMinutesAgo)
                    .is('disconnected_at', null)

                setOnlineCount((activeCount || 0) + 5000)
            } catch (error) {
                console.error('Error fetching stats:', error)
            }
        }

        fetchStats()
        const interval = setInterval(fetchStats, 30000) // Update every 30 seconds

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
