'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';

function MessagesList({ messages, currentUserId }: { messages: Message[]; currentUserId: string }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg: Message) => {
        const isSender = msg.sender_id === currentUserId;
        
        return (
          <div
            key={msg.id}
            className={`flex ${isSender ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}
          >
            <img
              className="h-10 w-10 rounded-full object-cover"
              alt={`Avatar of ${msg.sender.full_name}`}
              src={msg.sender.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.full_name)}&size=128&background=0ba3ea&color=fff`}
            />
            <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-md rounded-b-xl ${isSender ? 'rounded-tl-xl' : 'rounded-tr-xl'} p-3 ${
                  isSender
                    ? 'bg-primary/20 dark:bg-primary/30'
                    : 'bg-white dark:bg-slate-800'
                }`}
              >
                <p className="text-sm text-slate-800 dark:text-slate-200">{msg.content}</p>
              </div>
              <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  order_id?: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url?: string;
  };
  order?: {
    id: string;
  };
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived' | 'disputes'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/messages');
          return;
        }
        setCurrentUserId(user.id);

        // Fetch conversations (grouped by seller/order)
        const { data: messagesData, error } = await supabase
          .from('messages')
          .select(`
            id,
            sender_id,
            receiver_id,
            order_id,
            content,
            is_read,
            created_at,
            sender:profiles!sender_id(full_name, avatar_url),
            order:orders(id)
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group messages by conversation (seller or order)
        const conversationMap = new Map();
        (messagesData || []).forEach((msg) => {
          const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          const key = msg.order_id ? `order-${msg.order_id}` : `user-${otherUserId}`;
          
          if (!conversationMap.has(key)) {
            conversationMap.set(key, {
              id: key,
              otherUserId,
              orderId: msg.order_id,
              lastMessage: msg,
              unreadCount: 0,
              messages: [],
            });
          }
          
          const conv = conversationMap.get(key);
          conv.messages.push(msg);
          if (!msg.is_read && msg.receiver_id === user.id) {
            conv.unreadCount++;
          }
        });

        const conversationsList = Array.from(conversationMap.values())
          .map((conv) => ({
            ...conv,
            otherUser: conv.lastMessage.sender_id === user.id 
              ? null 
              : conv.lastMessage.sender,
          }))
          .sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());

        setConversations(conversationsList);
        if (conversationsList.length > 0 && !selectedConversation) {
          setSelectedConversation(conversationsList[0].id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [supabase, router, selectedConversation]);

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const conversationMessages = selectedConv?.messages || [];

  const filteredConversations = conversations.filter((conv) => {
    if (filter === 'unread' && conv.unreadCount === 0) return false;
    if (filter === 'archived') return false; // TODO: Implement archived
    if (filter === 'disputes' && !conv.orderId) return false;
    if (searchQuery && !conv.otherUser?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sendMessage = async (content: string) => {
    if (!selectedConv || !content.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedConv.otherUserId,
        order_id: selectedConv.orderId,
        content: content.trim(),
        is_read: false,
      });

      if (error) throw error;

      // Refresh conversations
      window.location.reload();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark">
      <Header />
      <div className="flex w-full pt-16">
        {/* Message List Panel */}
        <main className="flex w-96 flex-col border-r border-slate-200 bg-background-light dark:border-slate-800 dark:bg-background-dark">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h2>
            <div className="mt-4">
              <label className="flex flex-col h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-slate-400 dark:text-slate-500 flex border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <span className="material-symbols-outlined text-2xl">search</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                    placeholder="Search by seller, order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>
          </div>
          <div className="flex gap-2 p-3 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 ${
                filter === 'all'
                  ? 'bg-slate-200 dark:bg-slate-800'
                  : 'bg-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal">All</p>
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 ${
                filter === 'unread'
                  ? 'bg-slate-200 dark:bg-slate-800'
                  : 'bg-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <p className="text-sm font-medium leading-normal">Unread</p>
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 ${
                filter === 'archived'
                  ? 'bg-slate-200 dark:bg-slate-800'
                  : 'bg-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <p className="text-sm font-medium leading-normal">Archived</p>
            </button>
            <button
              onClick={() => setFilter('disputes')}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 ${
                filter === 'disputes'
                  ? 'bg-slate-200 dark:bg-slate-800'
                  : 'bg-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <p className="text-sm font-medium leading-normal">Disputes</p>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">Loading...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">No messages found</div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`relative flex gap-4 px-4 py-3 cursor-pointer ${
                    selectedConversation === conv.id
                      ? 'bg-primary/10 dark:bg-primary/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {selectedConversation === conv.id && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
                  )}
                  <div className="flex items-start gap-3 w-full">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      alt={`Avatar of ${conv.otherUser?.full_name || 'User'}`}
                      src={conv.otherUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.otherUser?.full_name || 'User')}&size=128&background=0ba3ea&color=fff`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                          {conv.otherUser?.full_name || 'Unknown User'}
                        </p>
                        <p className="text-primary text-xs font-medium">
                          {new Date(conv.lastMessage.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {conv.orderId && (
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">
                          Regarding Order #{conv.orderId.substring(0, 8)}
                        </p>
                      )}
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal truncate">
                        {conv.lastMessage.content}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="flex flex-col items-end justify-start gap-2 pt-1">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-[#50E3C2]"></span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Chat Panel */}
        <section className="flex flex-1 flex-col bg-white dark:bg-[#0b1418]">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <header className="border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0b1418]">
                <div className="flex items-center gap-3">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    alt={`Avatar of ${selectedConv.otherUser?.full_name || 'User'}`}
                    src={selectedConv.otherUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConv.otherUser?.full_name || 'User')}&size=128&background=0ba3ea&color=fff`}
                  />
                  <div>
                    <h3 className="text-base font-medium text-slate-900 dark:text-white">
                      {selectedConv.otherUser?.full_name || 'Unknown User'}
                    </h3>
                    {selectedConv.orderId && (
                      <Link
                        href={`/orders/${selectedConv.orderId}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Order #{selectedConv.orderId.substring(0, 8)}
                      </Link>
                    )}
                  </div>
                </div>
              </header>

              {/* Messages */}
              <MessagesList messages={conversationMessages} currentUserId={currentUserId} />

              {/* Message Composer */}
              <footer className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0b1418]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const content = formData.get('content') as string;
                    sendMessage(content);
                    e.currentTarget.reset();
                  }}
                >
                  <div className="relative">
                    <textarea
                      name="content"
                      className="form-textarea w-full resize-none rounded-lg border-slate-300 bg-slate-100 p-3 pr-28 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-500"
                      placeholder="Type your message..."
                      rows={3}
                    />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90"
                    >
                      Send
                      <span className="material-symbols-outlined text-xl">send</span>
                    </button>
                  </div>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
              Select a conversation to start messaging
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

