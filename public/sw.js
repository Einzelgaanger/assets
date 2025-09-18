const CACHE_NAME = 'data-analysis-file-hub-v4';
const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v4';

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
    // Clear ALL caches first (more aggressive approach)
    caches.keys().then((cacheNames) => {
      console.log('Clearing all existing caches:', cacheNames);
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Clear any remaining JavaScript files from cache
      return caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.keys().then((requests) => {
          const jsRequests = requests.filter(request => 
            request.url.includes('.js') && request.url.includes('assets')
          );
          console.log('Clearing JavaScript files from cache:', jsRequests.length);
          return Promise.all(jsRequests.map(request => cache.delete(request)));
        });
      });
    }).then(() => {
      // Then cache new static files (excluding JS files)
      return caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('Caching static files');
          return cache.addAll(STATIC_FILES);
        });
    }).then(() => {
      console.log('Static files cached successfully');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('Failed to cache static files:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    // Clear ALL caches except current ones
    caches.keys()
      .then((cacheNames) => {
        console.log('Found caches during activation:', cacheNames);
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache during activation:', cacheName);
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

  // For module scripts, completely bypass cache to avoid MIME type issues
  if (event.request.destination === 'script' && event.request.url.includes('.js')) {
    event.respondWith(
      fetch(event.request, { 
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
        .then((response) => {
          // Don't cache JavaScript files at all to avoid MIME issues
          return response;
        })
        .catch((error) => {
          console.error('Failed to fetch JavaScript file:', error);
          // Return a basic error response instead of cached content
          return new Response('JavaScript file not available', { 
            status: 404, 
            statusText: 'Not Found' 
          });
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
