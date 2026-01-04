
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const Message = ({ message }) => {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`group w-full text-text border-b border-black/10 dark:border-gray-900/50 ${isUser ? 'bg-transparent' : 'bg-transparent'}`}>
            <div className="text-base gap-4 md:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] p-4 md:py-6 flex lg:px-0 m-auto">
                <div className="flex-shrink-0 flex flex-col relative items-end">
                    <div className={`relative h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-transparent' : 'bg-transparent'}`}>
                        {isUser ? (
                            // Helper/User Icon
                            <div className="h-8 w-8 bg-surface-hover rounded-full flex items-center justify-center border border-border">
                                <User size={18} className="text-text-muted" />
                            </div>
                        ) : (
                            // Bot Icon
                            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                                <Bot size={18} className="text-black" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden">
                    <div className="font-semibold text-sm mb-1 opacity-90">
                        {isUser ? 'You' : 'AgentMSA'}
                    </div>

                    <div className="prose prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none break-words">
                        {isUser ? (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : (
                            <>
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <div className="relative">
                                                    <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 text-xs text-gray-200 rounded-t-md font-sans">
                                                        <span>{match[1]}</span>
                                                    </div>
                                                    <pre className="!mt-0 !rounded-t-none bg-zinc-950 p-4 overflow-x-auto">
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    </pre>
                                                </div>
                                            ) : (
                                                <code className={`${className} bg-surface-hover px-1.5 py-0.5 rounded-md text-sm before:content-[''] after:content-['']`} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>

                                {message.sources && message.sources.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <div className="grid gap-4">
                                            {message.sources.map((source, idx) => (
                                                <a href={source.link} target="_blank" rel="noopener noreferrer" key={idx} className="block bg-surface/50 hover:bg-surface-hover p-5 rounded-xl border border-border transition-all hover:scale-[1.01] hover:shadow-xl hover:border-primary/30 group">
                                                    <div className="flex items-start justify-between mb-3 gap-4">
                                                        <h4 className="font-semibold text-primary text-base leading-snug">
                                                            {source.title || 'Untitled Discussion'}
                                                        </h4>
                                                        {source.accepted && (
                                                            <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20 uppercase tracking-wider">
                                                                <Check size={12} strokeWidth={3} /> Verified
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-text-muted/90 text-sm leading-7 line-clamp-3 font-normal opacity-90">
                                                        {source.summary || source.answer || source.content}
                                                    </p>

                                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-muted/70">
                                                        <div className="flex items-center gap-1.5" title="Community Votes">
                                                            <div className="px-1.5 py-0.5 bg-white/10 rounded text-text font-medium text-[10px]">
                                                                ▲ {source.votes || 0}
                                                            </div>
                                                            <span>Votes</span>
                                                        </div>

                                                        {source.reputation > 0 && (
                                                            <div className="flex items-center gap-1.5" title="Author Reputation">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                                                <span>{source.reputation.toLocaleString()} Rep</span>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-1.5 ml-auto opacity-60">
                                                            <span>{source.date || 'Unknown Date'}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {!isUser && (
                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={handleCopy}
                                className="p-1 rounded-md hover:bg-surface-hover text-text-muted hover:text-text transition-colors"
                                title="Copy response"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
