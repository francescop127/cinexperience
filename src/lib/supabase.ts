import { createClient } from '@supabase/supabase-js';
import { MovieSetting, PhotoRequest } from '../types';

declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

const supabaseUrl = (
  __SUPABASE_URL__ ||
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''
).trim();
const supabaseAnonKey = (
  __SUPABASE_ANON_KEY__ ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

type PhotoRequestRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  instagram_handle: string | null;
  setting_id: string;
  setting_title: string;
  timestamp: string;
  privacy_accepted: boolean;
  status: PhotoRequest['status'];
  notes: string | null;
};

type MovieSettingRow = {
  id: string;
  title: string;
  genre: string;
  description: string;
  image_url: string;
  overlay_label: string;
  prompt_hint: string;
};

const toPhotoRequest = (row: PhotoRequestRow): PhotoRequest => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  instagramHandle: row.instagram_handle || undefined,
  settingId: row.setting_id,
  settingTitle: row.setting_title,
  timestamp: row.timestamp,
  privacyAccepted: row.privacy_accepted,
  status: row.status,
  notes: row.notes || undefined
});

const toPhotoRequestRow = (request: PhotoRequest): PhotoRequestRow => ({
  id: request.id,
  first_name: request.firstName,
  last_name: request.lastName,
  email: request.email,
  instagram_handle: request.instagramHandle || null,
  setting_id: request.settingId,
  setting_title: request.settingTitle,
  timestamp: request.timestamp,
  privacy_accepted: request.privacyAccepted,
  status: request.status,
  notes: request.notes || null
});

const toMovieSetting = (row: MovieSettingRow): MovieSetting => ({
  id: row.id,
  title: row.title,
  genre: row.genre,
  description: row.description,
  imageUrl: row.image_url,
  overlayLabel: row.overlay_label,
  promptHint: row.prompt_hint
});

const toMovieSettingRow = (setting: MovieSetting): MovieSettingRow => ({
  id: setting.id,
  title: setting.title,
  genre: setting.genre,
  description: setting.description,
  image_url: setting.imageUrl,
  overlay_label: setting.overlayLabel,
  prompt_hint: setting.promptHint
});

export const fetchPhotoRequests = async (): Promise<PhotoRequest[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('photo_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as PhotoRequestRow[]).map(toPhotoRequest);
};

export const createPhotoRequest = async (request: PhotoRequest): Promise<void> => {
  if (!supabase) return;

  const { error } = await supabase
    .from('photo_requests')
    .insert(toPhotoRequestRow(request));

  if (error) throw error;
};

export const updatePhotoRequestStatus = async (
  id: string,
  status: PhotoRequest['status']
): Promise<void> => {
  if (!supabase) return;

  const { error } = await supabase
    .from('photo_requests')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
};

export const updatePhotoRequestNotes = async (
  id: string,
  notes: string
): Promise<void> => {
  if (!supabase) return;

  const { error } = await supabase
    .from('photo_requests')
    .update({ notes: notes || null })
    .eq('id', id);

  if (error) throw error;
};

export const deletePhotoRequest = async (id: string): Promise<void> => {
  if (!supabase) return;

  const { error } = await supabase
    .from('photo_requests')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const clearPhotoRequests = async (): Promise<void> => {
  if (!supabase) return;

  const { error } = await supabase
    .from('photo_requests')
    .delete()
    .neq('id', '');

  if (error) throw error;
};

export const fetchMovieSettings = async (): Promise<MovieSetting[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('movie_settings')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data as MovieSettingRow[]).map(toMovieSetting);
};

export const upsertMovieSetting = async (setting: MovieSetting): Promise<void> => {
  if (!supabase) return;

  const { error } = await supabase
    .from('movie_settings')
    .upsert(toMovieSettingRow(setting), { onConflict: 'id' });

  if (error) throw error;
};

export const replaceMovieSettings = async (settings: MovieSetting[]): Promise<void> => {
  if (!supabase) return;

  const rows = settings.map((setting, index) => ({
    ...toMovieSettingRow(setting),
    sort_order: index
  }));

  const { error: deleteError } = await supabase
    .from('movie_settings')
    .delete()
    .neq('id', '');

  if (deleteError) throw deleteError;

  const { error } = await supabase
    .from('movie_settings')
    .insert(rows);

  if (error) throw error;
};
