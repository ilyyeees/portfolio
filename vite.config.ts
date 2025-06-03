import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion', '@react-spring/web'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip'],
          query: ['@tanstack/react-query'],
          icons: ['lucide-react'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          // Separate chunks for heavy components
          'image-utils': ['@/utils/imageUtils', '@/components/OptimizedImage'],
        },
        // Optimize chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 800,
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Enable source maps for debugging in development
    sourcemap: mode === 'development',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', '@radix-ui/react-dialog'],
    // Exclude large libraries that should be bundled separately
    exclude: ['@tanstack/react-query'],
    // Force optimization of certain modules
    force: true,
  },
  // Additional performance optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: 'esnext',
    // Remove unnecessary metadata in production
    ...(mode === 'production' && {
      pure: ['console.log', 'console.info'],
      keepNames: false,
    }),
  },
}));
