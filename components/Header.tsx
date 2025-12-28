'use client'

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-50 animate-gradient bg-[length:200%_200%]"></div>

            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-5 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Logo SVG */}
                        <div className="relative group">
                            <svg
                                className="w-10 h-10 sm:w-12 sm:h-12 animate-float"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="24" cy="24" r="22" fill="white" fillOpacity="0.95" />
                                <circle cx="17" cy="20" r="3" fill="#0099ff" />
                                <circle cx="31" cy="20" r="3" fill="#EC4899" />
                                <path
                                    d="M 16 30 Q 24 35 32 30"
                                    stroke="#8B5CF6"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                                <path
                                    d="M 12 14 Q 17 10 22 14"
                                    stroke="#0099ff"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    fill="none"
                                    opacity="0.7"
                                />
                                <path
                                    d="M 26 14 Q 31 10 36 14"
                                    stroke="#EC4899"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    fill="none"
                                    opacity="0.7"
                                />
                            </svg>
                            <div className="absolute -inset-1 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </div>

                        <div className="flex flex-col">
                            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                                    Omegle
                                </span>
                            </div>
                            <div className="text-xs text-blue-100 font-medium tracking-wide hidden sm:block">
                                ✨ Talk to strangers!
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-6">
                        <a href="#" className="text-xs sm:text-sm font-medium hover:text-blue-200 transition-all hover:scale-105 flex items-center gap-1">
                            <svg className="w-4 h-4 hidden sm:block" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="hidden sm:inline">About</span>
                            <span className="sm:hidden">ℹ️</span>
                        </a>
                        <a href="#" className="text-xs sm:text-sm font-medium hover:text-blue-200 transition-all hover:scale-105 flex items-center gap-1">
                            <svg className="w-4 h-4 hidden sm:block" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="hidden sm:inline">Safety</span>
                            <span className="sm:hidden">🛡️</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}
