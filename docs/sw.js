(()=>{"use strict";var e={913:()=>{try{self["workbox:core:6.5.3"]&&_()}catch(e){}},977:()=>{try{self["workbox:precaching:6.5.3"]&&_()}catch(e){}},80:()=>{try{self["workbox:routing:6.5.3"]&&_()}catch(e){}},873:()=>{try{self["workbox:strategies:6.5.3"]&&_()}catch(e){}}},t={};function s(a){var n=t[a];if(void 0!==n)return n.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,s),r.exports}(()=>{s(913);class e extends Error{constructor(e,t){super(((e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s})(e,t)),this.name=e,this.details=t}}const t={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},a=e=>[t.prefix,e,t.suffix].filter((e=>e&&e.length>0)).join("-"),n=e=>e||a(t.precache);function r(e,t){const s=t();return e.waitUntil(s),s}function i(t){if(!t)throw new e("add-to-cache-list-unexpected-type",{entry:t});if("string"==typeof t){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const{revision:s,url:a}=t;if(!a)throw new e("add-to-cache-list-unexpected-type",{entry:t});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(a,location.href),r=new URL(a,location.href);return n.searchParams.set("__WB_REVISION__",s),{cacheKey:n.href,url:r.href}}s(977);class c{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class o{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let h;function l(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class u{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const d=new Set;function f(e){return"string"==typeof e?new Request(e):e}s(873);class p{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new u,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(t){const{event:s}=this;let a=f(t);if("navigate"===a.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:s})}catch(t){if(t instanceof Error)throw new e("plugin-error-request-will-fetch",{thrownErrorMessage:t.message})}const r=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:r,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:n.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=f(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,r=await this.getCacheKey(t,"read"),i=Object.assign(Object.assign({},n),{cacheName:a});s=await caches.match(r,i);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:n,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(t,s){const a=f(t);await(0,new Promise((e=>setTimeout(e,0))));const n=await this.getCacheKey(a,"write");if(!s)throw new e("cache-put-with-no-response",{url:(r=n.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const i=await this._ensureResponseSafeToCache(s);if(!i)return!1;const{cacheName:c,matchOptions:o}=this._strategy,h=await self.caches.open(c),u=this.hasCallback("cacheDidUpdate"),p=u?await async function(e,t,s,a){const n=l(t.url,s);if(t.url===n)return e.match(t,a);const r=Object.assign(Object.assign({},a),{ignoreSearch:!0}),i=await e.keys(t,r);for(const t of i)if(n===l(t.url,s))return e.match(t,a)}(h,n.clone(),["__WB_REVISION__"],o):null;try{await h.put(n,u?i.clone():i)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of d)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:c,oldResponse:p,newResponse:i.clone(),request:n,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=f(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=Object.assign(Object.assign({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class g{constructor(e={}){this.cacheName=e.cacheName||a(t.runtime),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new p(this,{event:t,request:s,params:a}),r=this._getResponse(n,s,t);return[r,this._awaitComplete(r,n,s,t)]}async _getResponse(t,s,a){let n;await t.runCallbacks("handlerWillStart",{event:a,request:s});try{if(n=await this._handle(s,t),!n||"error"===n.type)throw new e("no-response",{url:s.url})}catch(e){if(e instanceof Error)for(const r of t.iterateCallbacks("handlerDidError"))if(n=await r({error:e,event:a,request:s}),n)break;if(!n)throw e}for(const e of t.iterateCallbacks("handlerWillRespond"))n=await e({event:a,request:s,response:n});return n}async _awaitComplete(e,t,s,a){let n,r;try{n=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:r}),t.destroy(),r)throw r}}class y extends g{constructor(e={}){e.cacheName=n(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(y.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){return await t.cacheMatch(e)||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(t,s){let a;const n=s.params||{};if(!this._fallbackToNetwork)throw new e("missing-precache-entry",{cacheName:this.cacheName,url:t.url});{const e=n.integrity,r=t.integrity,i=!r||r===e;a=await s.fetch(new Request(t,{integrity:"no-cors"!==t.mode?r||e:void 0})),e&&i&&"no-cors"!==t.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await s.cachePut(t,a.clone()))}return a}async _handleInstall(t,s){this._useDefaultCacheabilityPluginIfNeeded();const a=await s.fetch(t);if(!await s.cachePut(t,a.clone()))throw new e("bad-precaching-response",{url:t.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==y.copyRedirectedCacheableResponsesPlugin&&(a===y.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(y.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}y.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},y.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:t})=>t.redirected?await async function(t,s){let a=null;if(t.url&&(a=new URL(t.url).origin),a!==self.location.origin)throw new e("cross-origin-copy-response",{origin:a});const n=t.clone(),r={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},i=s?s(r):r,c=function(){if(void 0===h){const e=new Response("");if("body"in e)try{new Response(e.body),h=!0}catch(e){h=!1}h=!1}return h}()?n.body:await n.blob();return new Response(c,i)}(t):t};class w{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new y({cacheName:n(e),plugins:[...t,new o({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(t){const s=[];for(const a of t){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:t,url:n}=i(a),r="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==t)throw new e("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:t});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(t)&&this._cacheKeysToIntegrities.get(t)!==a.integrity)throw new e("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(t,a.integrity)}if(this._urlsToCacheKeys.set(n,t),this._urlsToCacheModes.set(n,r),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return r(e,(async()=>{const t=new c;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),n=this._urlsToCacheModes.get(t),r=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return r(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(t){const s=this.getCacheKeyForURL(t);if(!s)throw new e("non-precached-url",{url:t});return e=>(e.request=new Request(t),e.params=Object.assign({cacheKey:s},e.params),this.strategy.handle(e))}}let m;const _=()=>(m||(m=new w),m);s(80);const R=e=>e&&"object"==typeof e?e:{handle:e};class v{constructor(e,t,s="GET"){this.handler=R(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=R(e)}}class C extends v{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class b{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const a=s.origin===location.origin,{params:n,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:a,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return;let o;try{o=i.handle({url:s,request:e,event:t,params:n})}catch(e){o=Promise.reject(e)}const h=r&&r.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async a=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:n})}catch(e){e instanceof Error&&(a=e)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw a}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){const n=this._routes.get(s.method)||[];for(const r of n){let n;const i=r.match({url:e,sameOrigin:t,request:s,event:a});if(i)return n=i,(Array.isArray(n)&&0===n.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(n=void 0),{route:r,params:n}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,R(e))}setCatchHandler(e){this._catchHandler=R(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(t){if(!this._routes.has(t.method))throw new e("unregister-route-but-not-found-with-method",{method:t.method});const s=this._routes.get(t.method).indexOf(t);if(!(s>-1))throw new e("unregister-route-route-not-registered");this._routes.get(t.method).splice(s,1)}}let q;class U extends v{constructor(e,t){super((({request:s})=>{const a=e.getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:a=!0,urlManipulation:n}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(a){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(n){const e=n({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=a.get(n);if(t)return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}),e.strategy)}}var L;L=[{'revision':'57040e5677322118f6d56a1d9e43c5c6','url':'favicon.ico'},{'revision':'2ffbc23293ee8a797bc61e9c02534206','url':'icons/icons-192.png'},{'revision':'8bdcc486cda9b423f50e886f2ddb6604','url':'icons/icons-512.png'},{'revision':'6cb4145273d38f73d2d5a8a8e23162a6','url':'index.bundle.js'},{'revision':'a2ad55b8d07f1d1a3fcf55919fdf6a6a','url':'index.css'},{'revision':'371e740c08b7771b08d21b4524f33d5f','url':'index.html'},{'revision':'bf38d0c9760162342f12cd9b44fbf4ef','url':'manifest.json'},{'revision':'94a1441b30e728892e659c781f5586e7','url':'play.bundle.js'},{'revision':'bce522c56cb3f14ea2e70f00ad566f9d','url':'play.bundle.js.LICENSE.txt'},{'revision':'a2ad55b8d07f1d1a3fcf55919fdf6a6a','url':'play.css'},{'revision':'1bd4dfa94f4f2b680d5d76667f2f2d76','url':'play/assets/Atlas.png'},{'revision':'792b5a363986f507d965284a72e5d8ec','url':'play/assets/Buildings/buildings.png'},{'revision':'ecd73290281c0668f802d511c542d735','url':'play/assets/FX/Death Explosion.png'},{'revision':'77c45d405243972c121efc147d2a272d','url':'play/assets/Font/Font.png'},{'revision':'c7c1368c4542e1ef0f0ad13457c023ce','url':'play/assets/Mobs/Cactus/Cactus Back Sheet.png'},{'revision':'7010325f2be5a7d87bb49b020312cca7','url':'play/assets/Mobs/Cactus/Cactus Front Sheet.png'},{'revision':'5fb4af2e988b1e5af1fc5f5965a8dc05','url':'play/assets/Mobs/Cactus/Cactus Side Sheet.png'},{'revision':'5b39d7f2dce49c834701245bf71e3387','url':'play/assets/Mobs/Coffin/Coffin Back Sheet.png'},{'revision':'d0702eef0913f718b1e4b50e92ee3e24','url':'play/assets/Mobs/Coffin/Coffin Front Sheet.png'},{'revision':'839836e7074a8052f8f053697eef1a85','url':'play/assets/Mobs/Coffin/Coffin Side Sheet.png'},{'revision':'ca7f4762f031240e982963faec2aa4d3','url':'play/assets/Mobs/Coyote/Coyote Back Sheet.png'},{'revision':'acee16a41f44b83d9ba2e33573b85791','url':'play/assets/Mobs/Coyote/Coyote Front Sheet.png'},{'revision':'d08827a6f9579dd356f123492a8276da','url':'play/assets/Mobs/Coyote/Coyote Side Sheet.png'},{'revision':'488b6b613d3cf4308d55b5368b005070','url':'play/assets/NPC/NPC's.png'},{'revision':'221a1ff81fc7594ad7cdbdc18107f7dd','url':'play/assets/Player/Player Angle 2 Sheet.png'},{'revision':'f417af8650e9a909aceba12308da2e71','url':'play/assets/Player/Player Back Sheet.png'},{'revision':'fa2c3cc3ca4973ec240debebe2decf6c','url':'play/assets/Player/Player Front Sheet.png'},{'revision':'c6cb47bcdac8af6d31dd2f6c5060c380','url':'play/assets/Player/Player Side Sheet.png'},{'revision':'9a29707be392768fbd2daeba2e7ab7cc','url':'play/assets/Player/Unused Walk and Shoot.png'},{'revision':'e8a6f31541a9fbf7b69267b60357eb1c','url':'play/assets/Player/playerAngle1.png'},{'revision':'bfec4c9e0a0e48f351f7e15387810d66','url':'play/assets/bullet.png'},{'revision':'671dfaa933552f588d943ca39375807e','url':'play/assets/bunny.png'},{'revision':'90ae899573f7c1ea38c3bf71da83afd2','url':'play/assets/img/logo.png'},{'revision':'b887c333d5ec8274b78d0851e7b3337b','url':'play/assets/img/phaser-logo.png'},{'revision':'c379a77c2c8f404adf9073cf26a3a51b','url':'play/index.html'},{'revision':'16ad822b3347fdcd82808b6aaf0f6f75','url':'vendors.bundle.js'},{'revision':'fbc1173afdd4de88faa77d1382453c93','url':'vendors.bundle.js.LICENSE.txt'}],_().precache(L),function(t){const s=_();!function(t,s,a){let n;if("string"==typeof t){const e=new URL(t,location.href);n=new v((({url:t})=>t.href===e.href),s,a)}else if(t instanceof RegExp)n=new C(t,s,a);else if("function"==typeof t)n=new v(t,s,a);else{if(!(t instanceof v))throw new e("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});n=t}(q||(q=new b,q.addFetchListener(),q.addCacheListener()),q).registerRoute(n)}(new U(s,t))}(undefined)})()})();