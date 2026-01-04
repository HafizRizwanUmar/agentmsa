
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Message from './Message';
import InputArea from './InputArea';
import AuthModal from './AuthModal';
import { Menu, ChevronDown, Monitor, Bot, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc
} from 'firebase/firestore';

function ChatPage() {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [chats, setChats] = useState([]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Listen for Chats list
    useEffect(() => {
        if (!currentUser) {
            setChats([]);
            return;
        }

        const q = query(
            collection(db, 'users', currentUser.uid, 'chats'),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setChats(chatList);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Handle Guest -> User Migration
    const hasMigratedRef = useRef(false);

    useEffect(() => {
        const migrateGuestChat = async () => {
            if (currentUser && !currentChatId && messages.length > 0 && !hasMigratedRef.current) {
                console.log("Migrating guest chat...");
                hasMigratedRef.current = true;

                try {
                    // 1. Create new Chat
                    const firstMsg = messages[0];
                    const title = firstMsg.content.substring(0, 30) + (firstMsg.content.length > 30 ? '...' : '');

                    const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'chats'), {
                        title: title,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        preview: title
                    });

                    const newChatId = docRef.id;

                    // 2. Add all local messages to Firestore
                    // We do this concurrently
                    const promises = messages.map(msg =>
                        addDoc(collection(db, 'users', currentUser.uid, 'chats', newChatId, 'messages'), {
                            ...msg,
                            timestamp: serverTimestamp()
                        })
                    );

                    await Promise.all(promises);

                    // 3. Switch to this chat
                    setCurrentChatId(newChatId);

                } catch (e) {
                    console.error("Migration failed:", e);
                }
            }
        };

        migrateGuestChat();
    }, [currentUser, messages]); // Runs when user logs in or messages change (if guest)

    // Listen for Messages in Current Chat
    useEffect(() => {
        // If logged out or no chat selected, DO NOT clear messages automatically.
        // Let handleNewChat or handleSelectChat do that explicitly.
        if (!currentUser || !currentChatId) {
            return;
        }

        const q = query(
            collection(db, 'users', currentUser.uid, 'chats', currentChatId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => doc.data());
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [currentUser, currentChatId]);

    const handleNewChat = () => {
        setCurrentChatId(null);
        setMessages([]);
        hasMigratedRef.current = false; // Reset migration flag for future logic if needed
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleSelectChat = (chatId) => {
        setMessages([]); // Clear immediately to show loading state or blank before snapshot
        setCurrentChatId(chatId);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const saveMessageToFirestore = async (chatId, msg) => {
        if (!currentUser) return;

        try {
            await addDoc(
                collection(db, 'users', currentUser.uid, 'chats', chatId, 'messages'),
                {
                    ...msg,
                    timestamp: serverTimestamp()
                }
            );

            // Update last updated
            await updateDoc(doc(db, 'users', currentUser.uid, 'chats', chatId), {
                updatedAt: serverTimestamp(),
                preview: msg.content.substring(0, 50) + "..."
            });
        } catch (error) {
            console.error("Error saving message:", error);
        }
    };

    const handleSend = async (queryText) => {
        const userMsg = { role: 'user', content: queryText };

        if (!currentUser) {
            // Guest mode: Local state only
            setMessages(prev => [...prev, userMsg]);
        }

        // Start or continue persistent chat
        let activeChatId = currentChatId;

        // If logged in and no chat selected, create one
        if (currentUser && !activeChatId) {
            try {
                const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'chats'), {
                    title: queryText.substring(0, 30) + (queryText.length > 30 ? '...' : ''),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    preview: queryText.substring(0, 50)
                });
                activeChatId = docRef.id;
                setCurrentChatId(activeChatId);
            } catch (error) {
                console.error("Error creating chat:", error);
            }
        }

        // Save User Message
        if (currentUser && activeChatId) {
            await saveMessageToFirestore(activeChatId, userMsg);
        }

        setIsLoading(true);

        try {
            // Vercel Production URL
            // const response = await axios.post('http://localhost:5000/api/ask', { query: queryText });
            const response = await axios.post('https://agent-msa-backend.vercel.app/api/ask', { query: queryText });

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

            if (currentUser && activeChatId) {
                await saveMessageToFirestore(activeChatId, botMsg);
            } else {
                setMessages(prev => [...prev, botMsg]);
            }

        } catch (error) {
            console.error("Error", error);
            const errorMsg = {
                role: 'assistant',
                content: "I apologize, but I encountered an error while processing your request. Please try again."
            };
            if (currentUser && activeChatId) {
                await saveMessageToFirestore(activeChatId, errorMsg);
            } else {
                setMessages(prev => [...prev, errorMsg]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-background text-text overflow-hidden font-primary selection:bg-primary/30">
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <Sidebar
                    chats={chats}
                    currentChatId={currentChatId}
                    onSelectChat={handleSelectChat}
                    onNewChat={handleNewChat}
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                />
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

                {/* Login Banner */}
                {!currentUser && messages.length > 0 && (
                    <div className="absolute top-16 left-0 right-0 z-20 flex justify-center px-4">
                        <div className="bg-surface/90 backdrop-blur border border-primary/20 text-text-muted px-4 py-2 rounded-full text-sm flex items-center gap-3 shadow-lg">
                            <span>Sign in to save this chat history</span>
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="text-primary font-semibold hover:underline flex items-center gap-1"
                            >
                                <LogIn size={14} /> Login
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col w-full relative overflow-hidden">
                    {messages.length === 0 && !isLoading ? (
                        <div className="flex-1 flex flex-col justify-center items-center px-4">
                            <div className="mb-8 p-4 bg-surface rounded-full animate-bounce">
                                <Monitor size={48} className="text-primary" />
                            </div>
                            <h1 className="text-3xl font-medium text-primary mb-2">Ready to explore?</h1>
                            <p className="text-text-muted/80 max-w-md text-center mb-6">
                                I'm ready to query Stack Overflow, DuckDuckGo, and more for you.
                            </p>
                            {!currentUser && (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="px-6 py-2 bg-surface hover:bg-surface-hover border border-primary/20 rounded-full text-sm text-primary transition-colors flex items-center gap-2"
                                >
                                    <LogIn size={16} /> Connect Account
                                </button>
                            )}
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
