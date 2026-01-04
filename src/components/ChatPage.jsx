
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Message from './Message';
import InputArea from './InputArea';
import { Menu, ChevronDown, Monitor, Bot } from 'lucide-react';

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (query) => {
        const userMsg = { role: 'user', content: query };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/ask', { query });

            let botContent = '';
            let sources = [];

            if (response.data.synthesis) {
                botContent = response.data.synthesis;
                sources = response.data.results || [];
            } else if (response.data.message) {
                botContent = response.data.message;
            } else {
                botContent = "I received a response but couldn't process it correctly.";
            }

            const botMsg = {
                role: 'assistant',
                content: botContent,
                sources: sources
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Error", error);
            const errorMsg = {
                role: 'assistant',
                content: "I apologize, but I encountered an error while processing your request. Please try again."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-background text-text overflow-hidden font-primary selection:bg-primary/30">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col h-full relative w-full bg-background text-text">
                {/* Top Header/Nav */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 w-full bg-background/80 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-primary hover:text-primary-hover">
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-1 text-2xl font-serif font-bold text-white hover:bg-surface-hover px-3 py-1.5 rounded-lg cursor-pointer transition-colors tracking-tight">
                            AgentMSA <ChevronDown size={16} className="text-white relative top-[2px]" />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col w-full relative overflow-hidden">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col justify-center items-center px-4">
                            <div className="mb-8 p-4 bg-surface rounded-full animate-bounce">
                                <Monitor size={48} className="text-primary" />
                            </div>
                            <h1 className="text-3xl font-medium text-primary mb-2">Ready to explore?</h1>
                            <p className="text-text-muted/80 max-w-md text-center">
                                I'm ready to query Stack Overflow, DuckDuckGo, and more for you.
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto no-scrollbar pt-20 pb-40">
                            {messages.map((m, i) => (
                                <Message key={i} message={m} />
                            ))}
                            {isLoading && (
                                <div className="w-full text-text border-b border-black/10 dark:border-gray-900/50 bg-transparent">
                                    <div className="text-base gap-4 md:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] p-4 md:py-6 flex lg:px-0 m-auto">
                                        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                                            <Bot size={18} className="text-black" />
                                        </div>
                                        <div className="flex items-center gap-1 h-8">
                                            <span className="text-sm text-text-muted animate-pulse">Searching...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="w-full flex justify-center pb-8 px-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
                    <div className="w-full max-w-3xl">
                        <InputArea onSend={handleSend} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
