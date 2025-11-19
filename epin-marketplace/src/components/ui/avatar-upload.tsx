'use client';

import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AvatarUploadWithCropProps {
    userId: string;
    currentAvatar?: string;
    onUploadComplete: (url: string) => void;
}

export default function AvatarUploadWithCrop({ userId, currentAvatar, onUploadComplete }: AvatarUploadWithCropProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentAvatar || null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const supabase = createClient();

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const createCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return null;

        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => {
            image.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        return new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob!);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleUpload = async () => {
        if (!croppedAreaPixels) return;

        setUploading(true);
        try {
            const croppedImage = await createCroppedImage();
            if (!croppedImage) throw new Error('Failed to crop image');

            const fileName = `${userId}/${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, croppedImage, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);

            if (updateError) throw updateError;

            setPreview(publicUrl);
            setShowCropper(false);
            setImageSrc(null);
            onUploadComplete(publicUrl);
        } catch (error: any) {
            console.error('Upload error:', error);
            alert(error.message || 'Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {!showCropper ? (
                <>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-white/10 overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-white/40">person</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="cursor-pointer px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors inline-block">
                                {preview ? 'Change Avatar' : 'Upload Avatar'}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            <p className="text-white/60 text-sm mt-2">JPG, PNG or GIF. Max 5MB.</p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-4">
                    <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
                        <Cropper
                            image={imageSrc!}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white text-sm">Zoom</label>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Save Avatar'}
                        </button>
                        <button
                            onClick={() => {
                                setShowCropper(false);
                                setImageSrc(null);
                            }}
                            className="px-6 py-3 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
