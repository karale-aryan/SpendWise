import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../../services/api';
import { MessageCircle, X, Send, Minimize2, Maximize2, Sparkles, User, Bot } from 'lucide-react';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I\'m your SpendWise assistant. How can I help you manage your finances today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare messages for API (exclude initial greeting if backend doesn't handle it, 
            // but usually we just send history. Here we send all history including user's new message)
            // Note: We filter out the default greeting if we want, but keeping it is fine as it's "assistant" role.

            const apiMessages = [...messages, userMessage].map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await aiAPI.chat({ messages: apiMessages });

            const botMessage = { role: 'assistant', content: response.data.message };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat failed', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 z-50 flex items-center justify-center group"
            >
                <Sparkles size={24} className="animate-pulse" />
                <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Chat with AI
                </span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col transition-all z-50 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl text-white">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                        <Sparkles size={16} />
                    </div>
                    <h3 className="font-semibold">SpendWise AI</h3>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                                        <Bot size={16} className="text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-sm'
                                    }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                                        <User size={16} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                                    <Bot size={16} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your budget, savings..."
                                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none dark:text-white text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default AIChatWidget;
