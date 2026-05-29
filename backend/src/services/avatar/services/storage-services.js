import crypto from 'crypto';
import supabase from '../../../utils/supabase.js';

export async function uploadAvatar(file) {
  const extension = file.originalname.split('.').pop();

  const filename = `avatars/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from('avatar')
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(error.message);
  }

  return filename;
}

export async function deleteAvatar(path) {
  if (!path) return;

  const { error } = await supabase.storage.from('avatar').remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}

export function getAvatarPublicUrl(path) {
  const { data } = supabase.storage.from('avatar').getPublicUrl(path);

  return data.publicUrl;
}
