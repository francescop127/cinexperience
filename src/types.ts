export interface MovieSetting {
  id: string;
  title: string;
  genre: string;
  description: string;
  imageUrl: string;
  overlayLabel: string;
  promptHint: string;
}

export type ProcessingStatus = 'da_elaborare' | 'in_lavorazione' | 'inviato';

export interface PhotoRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  instagramHandle?: string;
  settingId: string;
  settingTitle: string;
  timestamp: string;
  privacyAccepted: boolean;
  status: ProcessingStatus;
  notes?: string;
}
