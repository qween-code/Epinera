'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';

interface Notification {
  id: string;
  type: 'order' | 'price_alert' | 'recommendation' | 'campaign' | 'security' | 'community' | 'moderation_approved' | 'moderation_rejected' | 'moderation_appeal';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/notifications');
          return;
        }

        // Fetch from notifications table
        const { data: notificationsData, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Error fetching notifications:', error);
          // Fallback to empty array if table doesn't exist yet
          setNotifications([]);
        } else {
          const mappedNotifications: Notification[] = (notificationsData || []).map((notif) => ({
            id: notif.id,
            type: notif.type as Notification['type'],
            title: notif.title,
            message: notif.message,
            isRead: notif.is_read || false,
            createdAt: notif.created_at,
            link: notif.link || undefined,
          }));
          setNotifications(mappedNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [supabase, router]);

  const filteredNotifications = notifications.filter((notif) => {
    if (filter !== 'all' && notif.type !== filter) return false;
    if (searchQuery && !notif.title.toLowerCase().includes(searchQuery.toLowerCase()) && !notif.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const getTypeCount = (type: string) => {
    if (type === 'all') return unreadCount;
    return notifications.filter((n) => n.type === type && !n.isRead).length;
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      order: 'package_2',
      price_alert: 'sell',
      recommendation: 'lightbulb',
      campaign: 'campaign',
      security: 'security',
      community: 'groups',
      moderation_approved: 'check_circle',
      moderation_rejected: 'cancel',
      moderation_appeal: 'gavel',
    };
    return icons[type] || 'notifications';
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const navItems = [
    { id: 'all', label: 'All Notifications', icon: 'notifications' },
    { id: 'order', label: 'Order Updates', icon: 'package_2' },
    { id: 'price_alert', label: 'Price Alerts', icon: 'sell' },
    { id: 'recommendation', label: 'Recommendations', icon: 'lightbulb' },
    { id: 'campaign', label: 'Campaigns', icon: 'campaign' },
    { id: 'security', label: 'Security Alerts', icon: 'security' },
    { id: 'community', label: 'Community', icon: 'groups' },
  ];

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
        <Header />
        <main className="flex flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <Header />
      <main className="flex flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex w-full gap-8">
          {/* SideNavBar (Left Column) */}
          <aside className="w-64 shrink-0 hidden md:block">
            <div className="flex h-full flex-col justify-between p-2">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const count = getTypeCount(item.id);
                    const isActive = filter === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                          ? 'bg-primary/20 text-primary'
                          : 'hover:bg-gray-500/10 text-gray-600 dark:text-gray-300'
                          }`}
                      >
                        <span
                          className="material-symbols-outlined text-2xl"
                          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {item.icon}
                        </span>
                        <p className="text-sm font-medium leading-normal flex-1 text-left">{item.label}</p>
                        {count > 0 && (
                          <span
                            className={`text-xs font-semibold size-5 flex items-center justify-center rounded-full ${item.id === 'security'
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-500/20 text-gray-500 dark:text-gray-400'
                              }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-8">
                <Link
                  href="/wallet"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-500/10 transition-colors text-gray-600 dark:text-gray-300"
                >
                  <span className="material-symbols-outlined text-2xl">settings</span>
                  <p className="text-sm font-medium leading-normal">Settings</p>
                </Link>
              </div>
            </div>
          </aside>

          {/* Notifications Content (Right Column) */}
          <div className="flex-1 flex flex-col gap-6">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
                Notifications Center
              </h1>
              <button
                onClick={markAllAsRead}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-500/10 hover:bg-gray-500/20 text-sm font-bold leading-normal tracking-[0.015em] transition-colors text-gray-700 dark:text-gray-300"
              >
                <span className="truncate">Mark all as read</span>
              </button>
            </div>

            {/* SearchBar */}
            <div className="px-0 py-0">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-gray-400 dark:text-gray-500 flex bg-gray-500/10 items-center justify-center pl-4 rounded-l-lg">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-inset border-none bg-gray-500/10 h-full placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-3 text-base font-normal leading-normal"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>

            {/* Notifications List */}
            <div className="flex flex-col gap-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔔</div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No notifications</h2>
                  <p className="text-gray-500 dark:text-gray-400">You're all caught up!</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex gap-4 p-4 rounded-xl border transition-colors ${notification.isRead
                      ? 'bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-800'
                      : 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30'
                      }`}
                  >
                    <div
                      className={`flex items-center justify-center size-12 rounded-lg shrink-0 ${notification.type === 'security'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-primary/10 text-primary'
                        }`}
                    >
                      <span className="material-symbols-outlined text-3xl">{getTypeIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{notification.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">{notification.message}</p>
                        </div>
                        <div className="flex items-start gap-2 shrink-0">
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-primary hover:text-primary/80 transition-colors"
                              title="Mark as read"
                            >
                              <span className="material-symbols-outlined text-xl">circle</span>
                            </button>
                          )}
                        </div>
                      </div>
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="mt-3 inline-block text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

