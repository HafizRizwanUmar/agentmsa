import React from 'react';
import { Edit, User, MessageSquare, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ chats = [], currentChatId, onSelectChat, onNewChat, onOpenAuth }) => {
    const { currentUser, logout } = useAuth();

    const handleNewChatClick = () => {
        onNewChat();
    };

    return (
        <div className="w-64 h-full bg-surface border-r border-primary/20 flex flex-col font-primary bg-black">
            {/* Header Area */}
            <div className="p-3 flex justify-between items-center group">
                <button
                    onClick={handleNewChatClick}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-surface-hover rounded-lg transition-colors w-full text-left"
                >
                    <div className="w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4Z" fill="currentColor" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-white">New chat</span>
                    <Edit size={16} className="ml-auto text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-2 py-2">

                {/* Your chats section */}
                <div className="mt-2 px-3">
                    <div className="text-xs font-medium text-text-muted/70 mb-2">Your chats</div>

                    {!currentUser ? (
                        <div className="text-sm text-text-muted/50 italic px-2 py-4 text-center border border-dashed border-white/10 rounded-lg">
                            Sign in to view history
                        </div>
                    ) : chats.length === 0 ? (
                        <div className="text-sm text-text-muted/50 italic px-2">
                            No chats yet
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => onSelectChat(chat.id)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors truncate flex items-center gap-2 ${currentChatId === chat.id ? 'bg-surface-hover text-primary' : 'text-text-muted hover:text-text hover:bg-surface-hover'}`}
                                >
                                    <MessageSquare size={14} className="shrink-0" />
                                    <span className="truncate">{chat.title || 'Untitled Chat'}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* User Profile / Auth Footer */}
            <div className="p-2 border-t border-transparent mt-auto">
                {currentUser ? (
                    <div className="group relative">
                        <button className="w-full flex items-center gap-3 px-2 py-3 hover:bg-surface-hover rounded-lg transition-colors text-text text-sm">
                            <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-xs font-bold uppercase">
                                {currentUser.email.substring(0, 2)}
                            </div>
                            <div className="flex flex-col items-start leading-none gap-0.5 overflow-hidden">
                                <span className="font-bold truncate w-32">{currentUser.email.split('@')[0]}</span>
                                <span className="text-xs text-text-muted">Member</span>
                            </div>
                            <LogOut
                                size={16}
                                className="ml-auto text-text-muted hover:text-red-400 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    logout();
                                }}
                            />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onOpenAuth}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface hover:bg-surface-hover border border-primary/20 rounded-xl transition-all text-primary text-sm font-semibold"
                    >
                        <LogIn size={18} />
                        <span>Sign In</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
