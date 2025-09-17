// Emergency cache clearing script
// Run this in browser console if the website shows blank page

console.log('🧹 Starting emergency cache clear...');

// Clear all caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    console.log('Found caches:', cacheNames);
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName).then(() => {
        console.log('✅ Deleted cache:', cacheName);
      });
    });
  });
}

// Unregister all service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Found service workers:', registrations.length);
    registrations.forEach(registration => {
      registration.unregister().then(() => {
        console.log('✅ Unregistered service worker');
      });
    });
  });
}

// Clear localStorage
localStorage.clear();
console.log('✅ Cleared localStorage');

// Clear sessionStorage
sessionStorage.clear();
console.log('✅ Cleared sessionStorage');

// Force reload with cache bypass
setTimeout(() => {
  console.log('🔄 Reloading page...');
  window.location.reload(true);
}, 1000);
