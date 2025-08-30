// PWA Configuration for SilentSpace
export const PWA_CONFIG = {
  name: 'SilentSpace',
  shortName: 'SilentSpace',
  description: 'Your personal AI mental health companion',
  themeColor: '#000000',
  backgroundColor: '#ffffff',
  display: 'standalone',
  orientation: 'portrait-primary',
  scope: '/',
  startUrl: '/',
  
  // Icons configuration
  icons: [
    {
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: '/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
  ],
  
  // Categories for app stores
  categories: ['health', 'productivity', 'lifestyle'],
  
  // Language and direction
  lang: 'en',
  dir: 'ltr',
  
  // Screenshots for app stores
  screenshots: [
    {
      src: '/screenshot-wide.png',
      sizes: '1280x720',
      type: 'image/png',
      formFactor: 'wide'
    },
    {
      src: '/screenshot-narrow.png',
      sizes: '750x1334',
      type: 'image/png',
      formFactor: 'narrow'
    }
  ],
  
  // Service Worker configuration
  sw: {
    cacheName: 'silentspace-v1.0.0',
    urlsToCache: [
      '/',
      '/static/js/bundle.js',
      '/static/css/main.css',
      '/manifest.json',
      '/favicon.ico'
    ]
  }
};

// PWA Install prompt configuration
export const INSTALL_PROMPT_CONFIG = {
  showAfter: 30000, // Show after 30 seconds
  maxShowCount: 3,  // Show max 3 times
  dismissAfter: 10000, // Auto dismiss after 10 seconds
};

// Offline configuration
export const OFFLINE_CONFIG = {
  cacheStrategy: 'network-first',
  fallbackPage: '/offline.html',
  maxCacheAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
