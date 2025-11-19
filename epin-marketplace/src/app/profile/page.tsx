'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AvatarUpload from '@/components/ui/avatar-upload';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        location: '',
        website: '',
        social_links: {
            twitter: '',
            github: '',
            linkedin: ''
        }
    });

    const supabase = createClient();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push('/login?redirect=/profile');
                return;
            }

            setUser(currentUser);

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                setFormData({
                    full_name: profileData.full_name || '',
                    bio: profileData.bio || '',
                    location: profileData.location || '',
                    website: profileData.website || '',
                    social_links: profileData.social_links || {
                        twitter: '',
                        github: '',
                        linkedin: ''
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    bio: formData.bio,
                    location: formData.location,
                    website: formData.website,
                    social_links: formData.social_links,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            fetchProfile();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
            <div className="relative flex w-full flex-col">
                <header className="flex items-center justify-between border-b border-white/10 px-4 sm:px-10 lg:px-20 py-3">
                    <Link href="/" className="text-white text-lg font-bold">Epin Marketplace</Link>
                    <Link href="/dashboard" className="text-white/70 hover:text-white">Back to Dashboard</Link>
                </header>

                <main className="px-4 sm:px-10 lg:px-20 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
                            <p className="text-white/70">Manage your account settings</p>
                        </div>

                        <div className="flex gap-4 border-b border-white/10 mb-8">
                            {['profile', 'security', 'preferences'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {message.text}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-white/5 rounded-xl p-6 space-y-6">
                                <div className="pb-6 border-b border-white/10">
                                    <AvatarUpload userId={user?.id || ''} currentAvatar={profile?.avatar_url} onUploadComplete={(url) => setProfile({ ...profile, avatar_url: url })} />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">Bio</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-white text-sm font-medium mb-2">Location</label>
                                            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="City, Country" />
                                        </div>
                                        <div>
                                            <label className="block text-white text-sm font-medium mb-2">Website</label>
                                            <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://yourwebsite.com" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-white font-bold mb-4">Social Links</h3>
                                        <div className="space-y-3">
                                            {Object.keys(formData.social_links).map((platform) => (
                                                <div key={platform}>
                                                    <label className="block text-white/70 text-sm mb-2 capitalize">{platform}</label>
                                                    <input
                                                        type="text"
                                                        value={formData.social_links[platform as keyof typeof formData.social_links]}
                                                        onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, [platform]: e.target.value } })}
                                                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
                                                        placeholder={platform === 'twitter' ? '@username' : 'username'}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-white/10">
                                    <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-white/5 rounded-xl p-6">
                                <h3 className="text-white font-bold mb-4">Security Settings</h3>
                                <p className="text-white/70 mb-6">Manage your account security and authentication methods.</p>
                                <Link href="/2fa" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                                    Configure 2FA
                                </Link>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="bg-white/5 rounded-xl p-6">
                                <h3 className="text-white font-bold mb-4">Preferences</h3>
                                <p className="text-white/70">Customize your experience (Coming soon)</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
