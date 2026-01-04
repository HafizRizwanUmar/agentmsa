import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Sparkles, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const isError = message.isError;

    // Formatting confidence score color
    const getConfidenceColor = (score) => {
        if (score >= 3.0) return 'text-primary';
        if (score >= 2.0) return 'text-yellow-400';
        return 'text-red-400';
    };

    const CodeBlock = ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <div className="rounded-md bg-black border border-gray-800 overflow-hidden my-4">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs text-gray-400">
                    <span className="font-mono">{match[1]}</span>
                </div>
                <div className="p-4 overflow-x-auto">
                    <code className={className} {...props}>{children}</code>
                </div>
            </div>
        ) : (
            <code className={clsx("bg-gray-800/50 px-1.5 py-0.5 rounded text-sm text-pink-300 font-mono", className)} {...props}>
                {children}
            </code>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                "w-full py-8 text-text border-b border-white/5"
            )}
        >
            <div className="max-w-3xl mx-auto flex gap-6 px-4 md:px-0">
                <div className={clsx(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg",
                    isUser ? "bg-white/10" : "bg-primary shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                )}>
                    {isUser ? <User size={18} className="text-white" /> : <Sparkles size={18} className="text-black" />}
                </div>

                <div className="flex-1 space-y-4 overflow-hidden">
                    <div className="prose prose-invert max-w-none text-sm leading-7">
                        {(!isUser && (message.structuredData || message.synthesis)) ? (
                            <div className="space-y-6">
                                {/* AI Synthesis Section */}
                                {message.synthesis && (
                                    <div className="prose prose-invert max-w-none bg-gradient-to-br from-primary/5 to-transparent p-5 rounded-2xl border border-primary/20 shadow-xl backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-primary font-bold mb-3 tracking-wide">
                                            <Sparkles size={16} />
                                            <span>AI Synthesis</span>
                                        </div>
                                        <ReactMarkdown components={{ code: CodeBlock }}>
                                            {message.synthesis}
                                        </ReactMarkdown>
                                    </div>
                                )}

                                {/* Sources Section */}
                                {message.structuredData && message.structuredData.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-bold text-primary uppercase tracking-widest pl-1 mb-2">Verified Sources</div>
                                        {message.structuredData.map((result, idx) => (
                                            <motion.div
                                                key={idx}
                                                whileHover={{ y: -2, scale: 1.01 }}
                                                className="bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 hover:bg-white/10 transition-all group cursor-pointer"
                                            >
                                                <div className="p-4 border-b border-white/5 flex justify-between items-start gap-4">
                                                    <a href={result.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary group-hover:text-white transition-colors text-lg decoration-2 underline-offset-4 hover:underline">
                                                        {result.title}
                                                    </a>
                                                    <div className="flex items-center gap-2 text-xs bg-black/40 px-2 py-1.5 rounded-md border border-white/5 shadow-inner flex-shrink-0">
                                                        <span className="text-gray-400">Trust:</span>
                                                        <span className={clsx("font-bold", getConfidenceColor(result.score))}>
                                                            {(result.score * 10).toFixed(1)}/10
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4 space-y-3">
                                                    <div className="text-sm text-gray-400 italic flex gap-3 leading-relaxed">
                                                        <div className="min-w-[3px] w-[3px] rounded-full bg-primary/50 self-stretch my-1" />
                                                        {result.summary}
                                                    </div>
                                                    <div className="text-[10px] text-gray-600 font-mono text-right uppercase tracking-wider">
                                                        {result.date}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {message.content && !message.structuredData?.length && !message.synthesis && (
                                    <p className="text-gray-400 italic">{message.content}</p>
                                )}
                            </div>
                        ) : (
                            // Standard Markdown View (User or Simple AI response)
                            <div className="whitespace-pre-wrap">
                                <ReactMarkdown components={{ code: CodeBlock }}>
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        )}

                        {isError && (
                            <div className="flex items-center gap-2 text-red-400 mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                <AlertCircle size={16} />
                                <span>Error processing request.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
