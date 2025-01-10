import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            'test-admin': 'test-admin/*'
        }
    },
    server: {
        host: true,
        port: 3000
    },
    base: './',
});