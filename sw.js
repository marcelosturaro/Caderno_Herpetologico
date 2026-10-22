/* ============================================================
   Caderno Herpetológico — Service Worker
   v5: ícones/manifest corrigidos; só armazena respostas válidas (200);
       HTML em "rede primeiro" com fallback offline; demais em cache primeiro.
   ============================================================ */

var CACHE = "caderno-herp-v5";

var ESSENCIAIS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./favicon-48.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) {
        return Promise.all(
          ESSENCIAIS.map(function (url) {
            return c.add(new Request(url, { cache: "reload" })).catch(function () {});
          })
        );
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys.filter(function (k) { return k !== CACHE; })
              .map(function (k) { return caches.delete(k); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;

  if (req.method !== "GET") return;
  if (req.url.indexOf("http") !== 0) return;
  if (req.url.indexOf("servicodados.ibge.gov.br") > -1) return;   // IBGE: cache próprio do app

  var ehHTML = req.mode === "navigate" ||
               (req.headers.get("accept") || "").indexOf("text/html") > -1;

  if (ehHTML) {
    e.respondWith(
      fetch(req)
        .then(function (r) {
          if (r && r.status === 200) {
            var cp = r.clone();
            caches.open(CACHE).then(function (c) { c.put(req, cp); });
          }
          return r;
        })
        .catch(function () {
          return caches.match(req, { ignoreSearch: true }).then(function (r) {
            return r || caches.match("./index.html") || caches.match("./");
          });
        })
    );
    return;
  }

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (r) {
        if (r && r.status === 200 && r.type === "basic") {
          var cp = r.clone();
          caches.open(CACHE).then(function (c) { c.put(req, cp); });
        }
        return r;
      });
    })
  );
});
