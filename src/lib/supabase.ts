import { createClient } from '@supabase/supabase-js';
import { PhotoRequest } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

type PhotoRequestRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  setting_id: string;
  setting_title: string;
  timestamp: string;
  privacy_accepted: boolean;
  status: PhotoRequest['status'];
  notes: string | null;
};

const toPhotoRequest = (row: PhotoRequestRow): PhotoRequest => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
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
  setting_id: request.settingId,
  setting_title: request.settingTitle,
  timestamp: request.timestamp,
  privacy_accepted: request.privacyAccepted,
  status: request.status,
  notes: request.notes || null
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
