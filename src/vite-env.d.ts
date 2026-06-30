/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTOMATION_URL?: string;
  readonly VITE_NOTIFICATION_EMAIL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly NEXT_PUBLIC_SUPABASE_URL?: string;
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;
