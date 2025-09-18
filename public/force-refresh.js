// Force refresh script - Run this in browser console to completely clear everything
console.log('🔄 FORCE REFRESH - Starting complete cache clear...');

// Clear all caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    console.log('Found caches to clear:', cacheNames);
    return Promise.all(
      cacheNames.map(cacheName => {
        console.log('🗑️ Deleting cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
  }).then(() => {
    console.log('✅ All caches cleared!');
  });
}

// Unregister all service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Found service workers to unregister:', registrations.length);
    return Promise.all(
      registrations.map(registration => {
        console.log('🗑️ Unregistering service worker');
        return registration.unregister();
      })
    );
  }).then(() => {
    console.log('✅ All service workers unregistered!');
  });
}

// Clear all storage
localStorage.clear();
sessionStorage.clear();
console.log('✅ All storage cleared!');

// Clear any remaining cache entries
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  });
}

// Force reload with complete cache bypass
setTimeout(() => {
  console.log('🔄 Reloading page with complete cache bypass...');
  // Use location.replace to avoid back button issues
  window.location.replace(window.location.href + '?v=' + Date.now());
}, 2000);
