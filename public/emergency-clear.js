// Emergency cache clearing script - Run this in browser console
console.log('🚨 EMERGENCY CACHE CLEAR - Starting...');

// Clear all caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    console.log('Found caches:', cacheNames);
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
    console.log('Found service workers:', registrations.length);
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

// Clear localStorage
localStorage.clear();
console.log('✅ localStorage cleared');

// Clear sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage cleared');

// Force reload with cache bypass
setTimeout(() => {
  console.log('🔄 Reloading page with cache bypass...');
  window.location.reload(true);
}, 2000);
