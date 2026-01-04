import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const InputArea = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    return (
        <div className="w-full relative z-50">
            <div className="w-full">
                <form
                    onSubmit={handleSubmit}
                    className="relative flex items-end gap-2 bg-surface hover:bg-surface-hover backdrop-blur-xl rounded-[26px] p-2 transition-all duration-300 border-2 border-primary/20 focus-within:border-primary"
                >
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything"
                        className="flex-1 bg-transparent text-text placeholder-text-muted/60 resize-none focus:outline-none max-h-52 py-3 px-4 text-base font-primary leading-relaxed custom-scrollbar ml-2"
                        rows={1}
                        style={{ minHeight: '24px' }}
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-2 mr-1 mb-1 rounded-full bg-primary text-black hover:bg-primary-hover disabled:opacity-0 transition-all flex-shrink-0"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </form>
                {/* Footer Disclaimer */}
                <div className="text-center mt-3">
                    <p className="text-xs text-text-muted/60">
                        ChatGPT can make mistakes. Check important info.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InputArea;
