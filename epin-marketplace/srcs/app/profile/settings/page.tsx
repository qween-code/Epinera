'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      }
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [router, supabase]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: e.currentTarget.fullName.value,
        phone: e.currentTarget.phone.value,
      })
      .eq('id', user.id);

    if (error) {
      alert('Error updating profile: ' + error.message);
    } else {
      alert('Profile updated successfully!');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
      <div className="bg-gray-800 p-8 rounded-xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <input id="email" type="email" value={profile?.email || ''} disabled className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name</label>
            <input id="fullName" type="text" defaultValue={profile?.full_name || ''} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
            <input id="phone" type="tel" defaultValue={profile?.phone || ''} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md" />
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 rounded-md font-semibold transition-colors">
            Update Profile
          </button>
        </form>
        <div className="border-t border-gray-700 mt-8 pt-6">
            <button
                onClick={handleSignOut}
                className="w-full py-3 px-4 bg-red-800 hover:bg-red-700 rounded-md font-semibold transition-colors"
            >
                Sign Out
            </button>
        </div>
      </div>
    </div>
  );
}
