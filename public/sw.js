const CACHE_NAME = 'data-analysis-file-hub-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/pages/Index.tsx',
  '/src/components/FileUpload.tsx',
  '/src/components/FileList.tsx',
  '/src/index.css',
  '/src/App.css',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For module scripts, always try network first to avoid MIME type issues
  if (event.request.destination === 'script' && event.request.url.includes('.js')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            // Cache successful responses
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Serving from cache:', event.request.url);
          return cachedResponse;
        }

        console.log('Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // Return a fallback page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            throw error;
          });
      })
  );
});

// Background sync for offline file uploads
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(
      // Handle offline file uploads when connection is restored
      handleOfflineUploads()
    );
  }
});

// Handle offline uploads
async function handleOfflineUploads() {
  try {
    // Get offline uploads from IndexedDB
    const offlineUploads = await getOfflineUploads();
    
    for (const upload of offlineUploads) {
      try {
        // Attempt to upload the file
        await uploadFile(upload);
        // Remove from offline storage if successful
        await removeOfflineUpload(upload.id);
      } catch (error) {
        console.error('Failed to upload offline file:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for offline storage
async function getOfflineUploads() {
  // This would integrate with IndexedDB to get stored uploads
  return [];
}

async function uploadFile(upload) {
  // This would handle the actual file upload
  console.log('Uploading file:', upload);
}

async function removeOfflineUpload(id) {
  // This would remove the upload from IndexedDB
  console.log('Removing offline upload:', id);
}

// Push notifications for upload completion
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon-192.png',
      badge: '/favicon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
