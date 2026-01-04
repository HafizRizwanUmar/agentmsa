import React from 'react';
import { Edit, User } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: Edit, label: 'New chat', active: true },
    ];

    return (
        <div className="w-64 h-full bg-surface border-r border-primary/20 flex flex-col font-primary bg-black">
            {/* Header Area */}
            <div className="p-3 flex justify-between items-center group">
                <button className="flex items-center gap-2 px-2 py-2 hover:bg-surface-hover rounded-lg transition-colors w-full text-left">
                    <div className="w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4Z" fill="currentColor" />
                            {/* Simple circle logo for now, can be replaced with actual SVG later */}
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-white">New chat</span>
                    <Edit size={16} className="ml-auto text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
                <div className="space-y-1">
                    {navItems.map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors group ${item.active ? 'bg-surface-hover text-primary' : 'text-primary/60 hover:bg-surface-hover hover:text-primary'}`}>
                            <item.icon size={18} strokeWidth={2} />
                            <span className="flex-1 text-left truncate">{item.label}</span>
                            {item.badge && (
                                <span className="text-[10px] font-medium bg-surface text-text-muted px-1.5 py-0.5 rounded border border-border group-hover:bg-black group-hover:border-transparent transition-colors">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Your chats section */}
                <div className="mt-6 px-3">
                    <div className="text-xs font-medium text-text-muted/70 mb-2">Your chats</div>
                    <div className="space-y-1">
                        {["Microservices Agent with RAG", "Blurry Desktop App Icons", "Student Achievement Annou...", "Decision Tree Clarification"].map((chat, i) => (
                            <button key={i} className="w-full text-left px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors truncate">
                                {chat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Profile Footer */}
            <div className="p-2 border-t border-transparent mt-auto">
                <button className="w-full flex items-center gap-3 px-2 py-3 hover:bg-surface-hover rounded-lg transition-colors text-text text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-xs font-bold">
                        HA
                    </div>
                    <div className="flex flex-col items-start leading-none gap-0.5">
                        <span className="font-bold">Hafiz Rizwan ...</span>
                        <span className="text-xs text-text-muted">Pro Plan</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
