'use client';

import { useState } from 'react';

interface MultiImageUploadProps {
    maxFiles?: number;
    onUploadComplete: (urls: string[]) => void;
}

export default function MultiImageUpload({ maxFiles = 5, onUploadComplete }: MultiImageUploadProps) {
    const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = (files: File[]) => {
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) return false;
            if (file.size > 5 * 1024 * 1024) return false;
            return true;
        });

        const newImages = validFiles.slice(0, maxFiles - images.length).map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const moveImage = (fromIndex: number, toIndex: number) => {
        setImages(prev => {
            const updated = [...prev];
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, moved);
            return updated;
        });
    };

    const handleUpload = async () => {
        setUploading(true);
        try {
            // Simulated upload - replace with actual Supabase upload
            const urls = images.map((_, i) => `https://example.com/image-${i}.jpg`);
            onUploadComplete(urls);
            setImages([]);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-white/20 bg-white/5'
                    }`}
            >
                <span className="material-symbols-outlined text-5xl text-white/40 mb-4 block">
                    cloud_upload
                </span>
                <p className="text-white mb-2">Drag and drop images here</p>
                <p className="text-white/60 text-sm mb-4">or</p>
                <label className="cursor-pointer px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors inline-block">
                    Browse Files
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        disabled={images.length >= maxFiles}
                    />
                </label>
                <p className="text-white/60 text-sm mt-4">
                    Max {maxFiles} images, 5MB each. {images.length}/{maxFiles} selected
                </p>
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image.preview}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                {index > 0 && (
                                    <button
                                        onClick={() => moveImage(index, index - 1)}
                                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30"
                                        title="Move left"
                                    >
                                        <span className="material-symbols-outlined text-white text-sm">
                                            chevron_left
                                        </span>
                                    </button>
                                )}
                                {index < images.length - 1 && (
                                    <button
                                        onClick={() => moveImage(index, index + 1)}
                                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30"
                                        title="Move right"
                                    >
                                        <span className="material-symbols-outlined text-white text-sm">
                                            chevron_right
                                        </span>
                                    </button>
                                )}
                                <button
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500"
                                    title="Remove"
                                >
                                    <span className="material-symbols-outlined text-white text-sm">delete</span>
                                </button>
                            </div>
                            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                #{index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {images.length > 0 && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {uploading ? 'Uploading...' : `Upload ${images.length} Image(s)`}
                </button>
            )}
        </div>
    );
}
