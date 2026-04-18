// KAVI'S REQUIRE - Host this on GitHub raw
(async function() {
  // Check if already loaded
  if (window.KREQUIRE_LOADED) return;
  window.KREQUIRE_LOADED = true;
  
  const TOKEN_CDN = 'https://raw.githubusercontent.com/zhmguyalt/haha/main/other2/tokenz/';
  const cache = new Map();
  
  window.require = async function(token) {
    const cacheKey = `kreq_${token}`;
    
    // Check cache
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const module = eval(cached);
      cache.set(cacheKey, module);
      return module;
    }
    
    // Fetch from CDN by token number
    const url = `${TOKEN_CDN}${token}.js`;
    const response = await fetch(url);
    const code = await response.text();
    
    // Execute and cache
    const module = { exports: {} };
    const fn = new Function('module', 'exports', 'require', code);
    fn(module, module.exports, window.require);
    
    sessionStorage.setItem(cacheKey, JSON.stringify(module.exports));
    cache.set(cacheKey, module.exports);
    
    return module.exports;
  };
  
  // Shortcut
  window.kreq = window.require;
  
  console.log("require service made by kavikivi");
})();
