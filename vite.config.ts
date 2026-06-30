import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const firstDefinedEnv = (...values: Array<string | undefined>) =>
  values.find((value) => value?.trim())?.trim() || '';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = firstDefinedEnv(
    process.env.VITE_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
    env.VITE_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_URL
  );
  const supabaseAnonKey = firstDefinedEnv(
    process.env.VITE_SUPABASE_ANON_KEY,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.SUPABASE_ANON_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    env.VITE_SUPABASE_ANON_KEY,
    env.VITE_SUPABASE_PUBLISHABLE_KEY,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    env.SUPABASE_ANON_KEY,
    env.SUPABASE_PUBLISHABLE_KEY
  );

  return {
    base: './',
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: {
      __SUPABASE_URL__: JSON.stringify(supabaseUrl),
      __SUPABASE_ANON_KEY__: JSON.stringify(supabaseAnonKey),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: true,
    },
  };
});
