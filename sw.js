const cacheVersion = 'v1.1.3'

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(cacheVersion);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  if (!request.url.startsWith('http')) return
  const cache = await caches.open(cacheVersion);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const cache = await caches.open(cacheVersion);
  let responseFromCache = await cache.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      '/altered/',
      '/altered/index.html',
      '/altered/simple.css',
      '/altered/style.css',
      '/altered/main.js',
	  
      '/altered/components/card.js',
      '/altered/components/control.js',
      '/altered/components/counter.js',
      '/altered/components/expedition-marker.js',
	  
      '/altered/img/forest.png',
      '/altered/img/mountain.png',
      '/altered/img/water.png',
	  
      '/altered/img/adventure-cards/ADV_CARD_1.png',
      '/altered/img/adventure-cards/ADV_CARD_2.png',
      '/altered/img/adventure-cards/ADV_CARD_3.png',
      '/altered/img/adventure-cards/ADV_CARD_4.png',
      '/altered/img/adventure-cards/ADV_CARD_5.png',
      '/altered/img/adventure-cards/ADV_CARD_BACK.png',
      '/altered/img/adventure-cards/ADV_CARD_BACK_2.jpg',
	  
      '/altered/img/expedition-markers/companion-axiom.png',
      '/altered/img/expedition-markers/companion-bravos.png',
      '/altered/img/expedition-markers/companion-lyra.png',
      '/altered/img/expedition-markers/companion-muna.png',
      '/altered/img/expedition-markers/companion-ordis.png',
      '/altered/img/expedition-markers/companion-yzmir.png',
      '/altered/img/expedition-markers/hero-axiom.png',
      '/altered/img/expedition-markers/hero-bravos.png',
      '/altered/img/expedition-markers/hero-lyra.png',
      '/altered/img/expedition-markers/hero-muna.png',
      '/altered/img/expedition-markers/hero-ordis.png',
      '/altered/img/expedition-markers/hero-yzmir.png',
	  
      '/altered/img/icon/android-chrome-192x192.png',
      '/altered/img/icon/android-chrome-512x512.png',
      '/altered/img/icon/apple-touch-icon.png',
      '/altered/img/icon/favicon-16x16.png',
      '/altered/img/icon/favicon-32x32.png',
      '/altered/img/icon/favicon.ico',
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: '/altered/img/icon/apple-touch-icon.png',
    })
  );
});
