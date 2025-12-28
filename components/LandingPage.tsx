'use client'

import { useState } from 'react'
import OnlineStats from './OnlineStats'

interface LandingPageProps {
    onStartChat: (interests: string[], findCommonInterests: boolean) => void
}

export default function LandingPage({ onStartChat }: LandingPageProps) {
    const [interests, setInterests] = useState<string[]>([])
    const [currentInterest, setCurrentInterest] = useState('')
    const [findCommonInterests, setFindCommonInterests] = useState(false)

    const addInterest = (interest: string) => {
        if (interest.trim() && !interests.includes(interest.trim())) {
            setInterests([...interests, interest.trim()])
            setCurrentInterest('')
        }
    }

    const removeInterest = (interest: string) => {
        setInterests(interests.filter(i => i !== interest))
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addInterest(currentInterest)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-5xl">

                {/* Mobile Notice */}
                <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 text-center">
                    <p className="text-gray-600 text-xs sm:text-sm">
                        You don&apos;t need an app to use Omegle on your phone or tablet! The web site works great on mobile.
                    </p>
                </div>

                {/* Main Intro Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Omegle - Talk to Strangers</h1>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Welcome to <strong>Omegle Web</strong> - resurrected from the legendary Omegle by a group of college kids who believed the magic of random connections shouldn&apos;t end. We&apos;ve brought back the <strong>anonymous, free spirit</strong> of the original Omegle, but with modern safety features. Connect instantly through <strong>random video chat</strong> or text chat - completely free, no registration, staying true to Omegle&apos;s roots while being a <strong>safer, monitored space</strong> for genuine conversations.
                    </p>

                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 mt-6 sm:mt-8">Why We&apos;re Different (And Better)</h2>
                    <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                        Look, we&apos;re not gonna pretend we invented random chat - Omegle did that. But we took what made it legendary and actually made it safe without killing the vibe. Think of us as <strong>Omegle&apos;s cooler younger sibling</strong> who learned from their mistakes but kept all the good parts.
                    </p>

                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">What You Get:</h3>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                            <span className="font-bold mr-2">•</span>
                            <span><strong>Actually Free</strong> - No &quot;upgrade to premium&quot; BS. Just free. Forever.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">•</span>
                            <span><strong>Zero Sign-Up</strong> - No email, no account, no verification code. Click and chat.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">•</span>
                            <span><strong>AI + Human Mods</strong> - We got both watching for creeps 24/7. Way less sketch than old Omegle.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">•</span>
                            <span><strong>Interest Matching</strong> - Type what you&apos;re into, get matched with people who actually vibe with that</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">•</span>
                            <span><strong>Works on Your Phone</strong> - No app download, just works in browser. iPhone, Android, whatever.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">•</span>
                            <span><strong>Anonymous AF</strong> - We don&apos;t track, store, or sell your data. Chat and ghost guilt-free.</span>
                        </li>
                    </ul>

                    <h3 className="text-xl font-bold mb-3">How to Use This Thing</h3>
                    <p className="text-gray-700 mb-2">It&apos;s literally this easy:</p>
                    <ol className="list-decimal ml-6 space-y-1 mb-6 text-gray-700">
                        <li>Pick text or video (your call)</li>
                        <li>Add interests if you want better matches (or don&apos;t, we&apos;re not your mom)</li>
                        <li>Hit start and boom - you&apos;re talking to a stranger</li>
                        <li>Skip button always there if they&apos;re boring/weird</li>
                    </ol>

                    <h3 className="text-xl font-bold mb-3">Good For:</h3>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                            <span className="font-bold mr-2">•</span>
                            <span><strong>Language Practice</strong> - Way better than Duolingo for actual conversation</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">•</span>
                            <span><strong>Meeting People from Everywhere</strong> - Like study abroad but from your couch</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">•</span>
                            <span><strong>Making Actual Friends</strong> - Shared interests = better convos = sometimes real friendships</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">•</span>
                            <span><strong>Killing Boredom</strong> - More entertaining than scrolling TikTok for the 47th time today</span>
                        </li>
                    </ul>
                </div>

                {/* The Safety Thing */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                    <h2 className="text-2xl font-bold mb-4">The Safety Thing (For Real Though)</h2>
                    <p className="text-gray-700 mb-4">
                        We&apos;re not gonna lie - the original Omegle had... issues. That&apos;s why we built this with AI monitoring, human mods watching streams, fake webcam detection, and instant reporting. Still anonymous and spontaneous, just way less Wild West energy. Our community guidelines aren&apos;t just there for show - we actually enforce them.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Thousands of people use OmegleWeb daily to meet strangers without the sketch factor. No registration, no app download, just instant connections with way better safety. Ready to actually <strong>talk to strangers</strong> without worrying about weirdos? Let&apos;s go.
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>BY USING THIS SERVICE, YOU MUST AGREE TO OUR TERMS AND CONDITIONS.</strong> See Omegle&apos;s <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> for more info. Parental control protections that may assist parents are commercially available and you can find more info at <a href="https://www.connectsafely.org/controls/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.connectsafely.org/controls/</a> as well as other sites.
                    </p>
                </div>

                {/* Chat Options Box */}
                <div className="bg-blue-100 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="bg-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-center">
                        <p className="text-base sm:text-lg font-bold">Chats are monitored. Keep it clean ⚠️</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Interests Section */}
                        <div>
                            <h3 className="text-lg font-bold mb-3">What do you wanna talk about?</h3>
                            <input
                                type="text"
                                value={currentInterest}
                                onChange={(e) => setCurrentInterest(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Add your interests (optional)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                            />
                            <div className="flex flex-wrap gap-2 mt-3">
                                {interests.map((interest, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {interest}
                                        <button
                                            onClick={() => removeInterest(interest)}
                                            className="hover:text-red-200 font-bold"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Start Chatting Section */}
                        <div>
                            <h3 className="text-lg font-bold mb-3">Start chatting:</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => onStartChat(interests, findCommonInterests)}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition text-lg"
                                >
                                    Text
                                </button>
                                <div className="text-center text-gray-600 font-semibold">or</div>
                                <button
                                    disabled
                                    className="w-full bg-blue-400 text-white font-bold py-3 px-6 rounded-md cursor-not-allowed text-lg opacity-50"
                                >
                                    Video
                                </button>
                                <div className="text-center text-gray-600 font-semibold">/</div>
                                <button
                                    disabled
                                    className="w-full bg-blue-300 text-white font-semibold py-3 px-6 rounded-md cursor-not-allowed opacity-50"
                                >
                                    Video (Unmonitored)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Online Stats */}
                <OnlineStats />

                {/* FAQ Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                    <h2 className="text-2xl font-bold mb-6">▼ Frequently Asked Questions (FAQs)</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Wait, is this actually free?</h3>
                            <p className="text-gray-700">Yup, 100% free! No credit card, no subscription BS, no &quot;free trial&quot; that charges you later. Just pure random chat vibes whenever you want.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">How&apos;s this different from the OG Omegle?</h3>
                            <p className="text-gray-700">We basically took everything cool about Omegle and made it safer. Got AI watching for weirdos, better matching based on interests, works great on mobile, and way less sketch overall. Think Omegle 2.0 but actually maintained lol.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Is it safe tho? Like actually safe?</h3>
                            <p className="text-gray-700">For real - we have AI + human mods watching 24/7, fake webcam detection, instant skip button, and you can report creeps. Way safer than old Omegle. Still anonymous but not a total wild west.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Do I need to download anything?</h3>
                            <p className="text-gray-700">Nah, works right in your browser! No app, no download, no installing random stuff. Just click and chat. Works on phone, laptop, tablet - whatever you got.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Does it work on mobile?</h3>
                            <p className="text-gray-700">Hell yeah! Works perfectly on iPhone and Android. Same experience as desktop, just tap and go. Perfect for chatting while you&apos;re bored in class or on the bus (we won&apos;t tell 😉).</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">What if someone&apos;s being weird?</h3>
                            <p className="text-gray-700">Hit that Skip button ASAP! We also have AI that auto-detects inappropriate stuff and kicks people. You can report them too. Don&apos;t waste your time with weirdos.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Can people see my info?</h3>
                            <p className="text-gray-700">Nope, you&apos;re totally anonymous. We don&apos;t save your convos, don&apos;t need your email or name, nothing. Chat and ghost, that&apos;s the whole point.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Why&apos;d I get randomly disconnected?</h3>
                            <p className="text-gray-700">Could be their internet died, they bailed, or our system caught something sketchy. Just start a new chat - there&apos;s always more people online.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Can I find someone I chatted with again?</h3>
                            <p className="text-gray-700">Nah, that&apos;s not how this works. Once you disconnect, they&apos;re gone. That&apos;s kinda the whole anonymous random chat vibe - keeps it spontaneous and private for everyone.</p>
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                    <h2 className="text-2xl font-bold mb-6">▼ Tips for Better Conversations</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Be specific with your interests</h3>
                            <p className="text-gray-700">Don&apos;t just put &quot;music&quot; - say &quot;lofi hip hop&quot; or &quot;metal&quot; or whatever you&apos;re actually into. Way better matches = way better convos. Generic interests = generic people.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Fix your lighting before video chat</h3>
                            <p className="text-gray-700">Nobody wants to talk to a shadow person lol. Sit near a window or turn on a lamp. First impressions matter even in random chat!</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Don&apos;t be a dick about cultural differences</h3>
                            <p className="text-gray-700">You&apos;re gonna meet people from literally everywhere. Different doesn&apos;t mean wrong. Ask questions, learn stuff, share your perspective. That&apos;s the whole point.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Skip the boring &quot;hi&quot; opener</h3>
                            <p className="text-gray-700">&quot;Hi&quot; = instant skip energy. Ask something interesting right away. &quot;What&apos;s the weirdest thing you&apos;ve eaten?&quot; hits different than &quot;hi how r u&quot;. Put in like 2% effort.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Don&apos;t trauma dump immediately</h3>
                            <p className="text-gray-700">Keep it light at first. Nobody wants your whole life story in the first 30 seconds. Build up to the deep stuff or save it for therapy (respectfully).</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">Use interests to filter out randos</h3>
                            <p className="text-gray-700">If you&apos;re getting too many weirdos, add more specific interests. It helps match you with actual humans who wanna chat about real stuff.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 mt-8">
                    <p>© 2024 Omegle. All rights reserved.</p>
                    <p className="mt-2">
                        <a href="#" className="hover:underline mx-2">Privacy Policy</a> |
                        <a href="#" className="hover:underline mx-2">Terms of Service</a> |
                        <a href="#" className="hover:underline mx-2">Community Guidelines</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
