/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTOMATION_URL?: string;
  readonly VITE_NOTIFICATION_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
