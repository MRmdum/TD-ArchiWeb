// self.addEventListener('fetch', (event) => {
//     if (event.request.url.match(/\.(jpe?g|png|gif|webp)$/)) {
//       // Handle image requests
//       event.respondWith(
//         caches.match(event.request).then((cachedResponse) => {
//           if (cachedResponse) {
//             return cachedResponse; // Return cached image if available
//           }
//           return fetch(event.request).then((response) => {
//             const clonedResponse = response.clone();
//             caches.open(CACHE_NAME).then((cache) => {
//               cache.put(event.request, clonedResponse); // Cache the image
//             });
//             return response;
//           });
//         })
//       );
//     } else {
//       // For other requests, continue with the default fetch behavior
//       event.respondWith(
//         caches.match(event.request).then((cachedResponse) => {
//           return cachedResponse || fetch(event.request);
//         })
//       );
//     }
//   });
  