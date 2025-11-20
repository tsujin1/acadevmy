import { useState, useRef } from 'react';
import { userService } from '../services/userService';
import type { User } from '../services/authService';

export const useAvatarUpload = (user: User | null, onUpdate: (user: User) => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File, options: { maxWidth: number; maxHeight: number; quality: number }): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > options.maxWidth) {
          height = (height * options.maxWidth) / width;
          width = options.maxWidth;
        }

        if (height > options.maxHeight) {
          width = (width * options.maxHeight) / height;
          height = options.maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx!.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          'image/jpeg',
          options.quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && user) {
      try {
        setLoading(true);
        setError(null);

        const compressedImage = await compressImage(selectedFile, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 0.7
        });

        const base64Image = await fileToBase64(compressedImage);
        const response = await userService.uploadAvatar(base64Image);

        const updatedUser = { ...user, avatar: response.avatar };
        onUpdate(updatedUser);

        closeModal();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
  };

  return {
    isModalOpen,
    previewUrl,
    selectedFile,
    loading,
    error,
    fileInputRef,
    openModal,
    closeModal,
    handleFileSelect,
    handleUpload,
  };
};