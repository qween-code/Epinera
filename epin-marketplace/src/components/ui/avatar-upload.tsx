'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AvatarUploadProps {
    userId: string;
    currentAvatar?: string | null;
    onUploadComplete?: (url: string) => void;
}

export default function AvatarUpload({ userId, currentAvatar, onUploadComplete }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentAvatar || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase
        await uploadAvatar(file);
    };

    const uploadAvatar = async (file: File) => {
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError, data } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);

            if (updateError) throw updateError;

            setPreview(publicUrl);
            if (onUploadComplete) {
                onUploadComplete(publicUrl);
            }
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            alert(error.message || 'Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-6">
            <div className="relative">
                <div
                    className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-white/10"
                    style={{
                        backgroundImage: preview
                            ? `url('${preview}')`
                            : 'url(\"https://via.placeholder.com/150\")'
                    }}
                />
                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-white font-bold mb-2">Profile Photo</h3>
                <p className="text-white/60 text-sm mb-3">
                    {uploading ? 'Uploading...' : 'JPG, PNG or GIF (max 5MB)'}
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {uploading ? 'Uploading...' : 'Upload New Photo'}
                </button>
            </div>
        </div>
    );
}
