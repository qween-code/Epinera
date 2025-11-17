'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  views_count: number;
  likes_count: number;
  replies_count: number;
  is_pinned: boolean;
  created_at: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'trending' | 'most_liked' | 'unanswered'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('forum_categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase
        .from('forum_posts')
        .select(
          `
          id,
          title,
          content,
          views_count,
          likes_count,
          replies_count,
          is_pinned,
          created_at,
          author:profiles!author_id (
            id,
            full_name,
            avatar_url
          ),
          category:forum_categories (
            id,
            name,
            slug
          )
        `
        )
        .eq('moderation_status', 'approved');

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      // Sort
      if (sortBy === 'latest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'trending') {
        query = query.order('likes_count', { ascending: false });
      } else if (sortBy === 'most_liked') {
        query = query.order('likes_count', { ascending: false });
      } else if (sortBy === 'unanswered') {
        query = query.eq('replies_count', 0).order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      // Sort pinned posts first
      const sortedPosts = (data || []).sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return 0;
      });

      setPosts(sortedPosts as ForumPost[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/community');
        return;
      }

      // TODO: Open create post modal or navigate to create post page
      router.push('/community/create');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: 'home', slug: 'all' },
    { id: 'games', label: 'Game Discussions', icon: 'sports_esports', slug: 'game-discussions' },
    { id: 'trading', label: 'Trading & Marketplace', icon: 'storefront', slug: 'trading' },
    { id: 'support', label: 'Support', icon: 'support_agent', slug: 'support' },
    { id: 'chat', label: 'General Chat', icon: 'chat', slug: 'general-chat' },
  ];

  const trendingTags = ['#ValorantSkins', '#TradingTips', '#Web3Gaming', '#EpinDeals', '#AccountSecurity'];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* SearchBar & Create Post */}
            <div className="space-y-4">
              <button
                onClick={handleCreatePost}
                className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
              >
                <span className="truncate">Create Post</span>
              </button>
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-full h-full">
                  <div className="text-neutral-500 dark:text-neutral-400 flex border-none bg-neutral-200 dark:bg-white/5 items-center justify-center pl-4 rounded-l-full border-r-0">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-full text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-neutral-200 dark:bg-white/5 h-full placeholder:text-neutral-500 dark:placeholder:text-neutral-400 px-4 pl-2 text-base font-normal leading-normal"
                    placeholder="Search community..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      fetchPosts();
                    }}
                  />
                </div>
              </label>
            </div>

            {/* SideNavBar */}
            <nav className="flex h-full flex-col justify-between bg-neutral-200/50 dark:bg-white/5 p-4 rounded-lg">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = selectedCategory === item.slug || (item.slug === 'all' && selectedCategory === 'all');
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCategory(item.slug)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-primary/20 dark:bg-primary/20 text-primary dark:text-primary'
                          : 'hover:bg-neutral-300/50 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-200'
                      }`}
                    >
                      <span className="material-symbols-outlined !text-2xl">{item.icon}</span>
                      <p className={`text-sm leading-normal ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</p>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Trending Tags */}
            <div className="bg-neutral-200/50 dark:bg-white/5 p-4 rounded-lg">
              <h3 className="text-black dark:text-white text-base font-bold leading-tight tracking-[-0.015em] px-2 pb-3">
                Trending Tags
              </h3>
              <div className="flex flex-col gap-2">
                {trendingTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/community?tag=${tag.substring(1)}`}
                    className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary text-sm font-medium px-2 py-1 rounded-md transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Column / Social Feed */}
          <div className="lg:col-span-9 space-y-6">
            {/* Chips for sorting */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[
                { id: 'latest', label: 'Latest' },
                { id: 'trending', label: 'Trending' },
                { id: 'most_liked', label: 'Most Liked' },
                { id: 'unanswered', label: 'Unanswered' },
              ].map((option) => {
                const isActive = sortBy === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id as any)}
                    className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors ${
                      isActive
                        ? 'bg-primary/20 dark:bg-primary/20 text-primary dark:text-primary'
                        : 'bg-neutral-200 dark:bg-white/5 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300/50 dark:hover:bg-white/10'
                    }`}
                  >
                    <p className={`text-sm leading-normal ${isActive ? 'font-bold' : 'font-medium'}`}>{option.label}</p>
                  </button>
                );
              })}
            </div>

            {/* Post Creation Card */}
            <div className="bg-neutral-200/50 dark:bg-white/5 p-4 rounded-lg flex items-start gap-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex-shrink-0"
                style={{
                  backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")',
                }}
              ></div>
              <div className="w-full">
                <textarea
                  className="form-textarea w-full min-h-[60px] resize-none overflow-hidden rounded text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-neutral-300/50 dark:bg-white/5 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 text-base font-normal"
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-2">
                    <button className="flex items-center justify-center size-8 rounded-full bg-neutral-300/50 dark:bg-white/5 hover:bg-neutral-400/50 dark:hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined !text-xl">image</span>
                    </button>
                    <button className="flex items-center justify-center size-8 rounded-full bg-neutral-300/50 dark:bg-white/5 hover:bg-neutral-400/50 dark:hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined !text-xl">gif</span>
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="truncate">Post</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            {loading ? (
              <div className="text-center py-16">
                <div className="text-neutral-500 dark:text-neutral-400">Loading posts...</div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">No posts yet</h2>
                <p className="text-neutral-500 dark:text-neutral-400">Be the first to start a discussion!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/post/${post.id}`}
                    className="block bg-neutral-200/50 dark:bg-white/5 p-5 rounded-lg hover:bg-neutral-300/50 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex-shrink-0"
                        style={{
                          backgroundImage: post.author.avatar_url
                            ? `url(${post.author.avatar_url})`
                            : 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.author.id + '")',
                        }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {post.is_pinned && (
                                <span className="material-symbols-outlined text-primary !text-base">push_pin</span>
                              )}
                              <h3 className="text-black dark:text-white text-lg font-bold leading-tight truncate">
                                {post.title}
                              </h3>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-300 text-sm line-clamp-2">{post.content}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                          <span className="font-medium">{post.author.full_name || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{getTimeAgo(post.created_at)}</span>
                          {post.category && (
                            <>
                              <span>•</span>
                              <span className="text-primary">{post.category.name}</span>
                            </>
                          )}
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined !text-base">visibility</span>
                            <span>{post.views_count}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined !text-base">favorite</span>
                            <span>{post.likes_count}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined !text-base">comment</span>
                            <span>{post.replies_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

