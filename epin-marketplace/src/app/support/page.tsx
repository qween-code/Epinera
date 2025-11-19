'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';

interface SupportConversation {
  id: string;
  title: string;
  status: 'open' | 'closed';
  lastMessage: string;
  lastMessageTime: string;
  handledBy: 'ai' | 'agent';
}

export default function SupportPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/support');
          return;
        }

        // Fetch support conversations (using messages table with support flag or separate support_conversations table)
        // For now, we'll use mock data structure
        // Fetch support conversations
        const { data: tickets, error } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (tickets) {
          setConversations(tickets.map(ticket => ({
            id: ticket.id,
            title: ticket.subject,
            status: ticket.status,
            lastMessage: ticket.last_message_preview || 'No messages yet',
            lastMessageTime: new Date(ticket.updated_at).toLocaleDateString(),
            handledBy: 'agent' // Defaulting to agent for now
          })));

          if (tickets.length > 0 && !selectedConversation) {
            setSelectedConversation(tickets[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [supabase, router, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        const { data: ticketMessages } = await supabase
          .from('support_messages')
          .select('*')
          .eq('ticket_id', selectedConversation)
          .order('created_at', { ascending: true });

        if (ticketMessages) {
          setMessages(ticketMessages.map(msg => ({
            id: msg.id,
            sender: msg.sender_type === 'user' ? 'user' : 'ai',
            content: msg.content,
            timestamp: new Date(msg.created_at),
          })));
        }
      };
      fetchMessages();
    }
  }, [selectedConversation, supabase]);

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    try {
      const { data: newMessage, error } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: selectedConversation,
          content: message,
          sender_type: 'user'
        })
        .select()
        .single();

      if (newMessage) {
        setMessages((prev) => [...prev, {
          id: newMessage.id,
          sender: 'user',
          content: newMessage.content,
          timestamp: new Date(newMessage.created_at),
        }]);
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-zinc-900 dark:text-zinc-50">
      <Header />
      <div className="flex w-full pt-16">
        {/* Left Sidebar */}
        <aside className="w-[320px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-zinc-900 dark:text-white text-base font-bold leading-normal">Support History</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal leading-normal">Search past conversations</p>
          </div>
          {/* Search Bar */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <label className="flex flex-col w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-11">
                <div className="text-zinc-500 dark:text-zinc-400 flex bg-white dark:bg-background-dark items-center justify-center pl-3.5 rounded-l-lg border border-r-0 border-zinc-300 dark:border-zinc-700">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-zinc-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-l-0 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-background-dark h-full placeholder:text-zinc-500 dark:placeholder:text-zinc-400 px-4 rounded-l-none pl-2 text-sm font-normal leading-normal"
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
          </div>
          {/* Conversation History */}
          <div className="flex-1 overflow-y-auto p-2">
            <nav className="flex flex-col gap-1">
              {loading ? (
                <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">Loading...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">No conversations found</div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${selectedConversation === conv.id
                        ? 'bg-primary/20 dark:bg-primary/20'
                        : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                      }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${selectedConversation === conv.id
                          ? 'text-primary'
                          : 'text-zinc-500 dark:text-zinc-400'
                        }`}
                      style={{ fontVariationSettings: selectedConversation === conv.id ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      chat_bubble
                    </span>
                    <div className="flex-1">
                      <p className="text-zinc-900 dark:text-white text-sm font-medium leading-normal">{conv.title}</p>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                        {conv.handledBy === 'ai' ? 'AI' : 'Agent'}, {conv.lastMessageTime}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 capitalize">{conv.status}</span>
                  </button>
                ))
              )}
            </nav>
          </div>
          {/* New Conversation Button */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => {
                const newId = Date.now().toString();
                const newConv: SupportConversation = {
                  id: newId,
                  title: 'New Conversation',
                  status: 'open',
                  lastMessage: '',
                  lastMessageTime: 'now',
                  handledBy: 'ai',
                };
                setConversations([newConv, ...conversations]);
                setSelectedConversation(newId);
                setMessages([]);
              }}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
            >
              <span className="truncate">New Conversation</span>
            </button>
          </div>
        </aside>

        {/* Main Chat Panel */}
        <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
          {/* Chat Header */}
          <header className="flex justify-between items-center gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">smart_toy</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background-light dark:border-background-dark"></div>
              </div>
              <div>
                <h1 className="text-zinc-900 dark:text-white text-base font-bold leading-tight">AI Assistant</h1>
                <p className="text-green-600 dark:text-green-500 text-sm font-normal leading-normal flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                  Live Support Available
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">picture_in_picture_alt</span>
              </button>
              <button className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
          </header>

          {/* Chat Transcript Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
                </div>
                <div className="flex flex-col gap-2 max-w-lg">
                  <div className="bg-zinc-200/70 dark:bg-zinc-800 p-3.5 rounded-lg rounded-tl-none">
                    <p className="text-zinc-900 dark:text-zinc-50 text-sm leading-relaxed">
                      Hello! I'm your AI Assistant, here to help you 24/7. How can I assist you today? You can ask me about your orders, payments, or any technical issues.
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                      Order Status
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                      Payment Issues
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                      Account Help
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
                    </div>
                  )}
                  <div className={`flex flex-col gap-2 max-w-lg ${msg.sender === 'user' ? 'items-end' : ''}`}>
                    <div
                      className={`p-3.5 rounded-lg ${msg.sender === 'user'
                          ? 'bg-primary/20 dark:bg-primary/30 rounded-tr-none'
                          : 'bg-zinc-200/70 dark:bg-zinc-800 rounded-tl-none'
                        }`}
                    >
                      <p className="text-zinc-900 dark:text-zinc-50 text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Composer */}
          <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-background-dark p-4">
            <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea w-full resize-none rounded-lg border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 p-3 pr-28 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400 focus:border-primary focus:ring-primary"
                  placeholder="Type your message..."
                  rows={3}
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">attach_file</span>
                  </button>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">emoji_emotions</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  AI Assistant is available 24/7. For urgent issues, you can request to speak with a human agent.
                </p>
                <button
                  type="submit"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  Send
                  <span className="material-symbols-outlined text-xl">send</span>
                </button>
              </div>
            </form>
          </footer>
        </main>
      </div>
    </div>
  );
}

