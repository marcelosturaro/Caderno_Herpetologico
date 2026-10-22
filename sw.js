/* ============================================================
   Caderno Herpetológico — Service Worker
   Estratégia:
   - Install: baixa e cacheia TODOS os arquivos essenciais
   - Navigation (HTML): network-first, cache como fallback
   - Assets: cache-first (rápido e funciona offline)
   - IBGE API: network-only (dados já salvos em localStorage)
   ============================================================ */

var CACHE = "caderno-herp-v2";

var ESSENCIAIS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

/* ---------- INSTALL: cacheia tudo de uma vez ---------- */
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) {
        // addAll falha inteiro se 1 falhar — usamos add individual
        return Promise.all(
          ESSENCIAIS.map(function (url) {
            return c.add(url).catch(function () {
              // ignora 404 de ícones opcionais
            });
          })
        );
      })
      .then(function () { return self.skipWaiting(); })
  );
});

/* ---------- ACTIVATE: limpa caches antigos ---------- */
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

/* ---------- FETCH ---------- */
self.addEventListener("fetch", function (e) {
  var req = e.request;

  // Só lida com GET
  if (req.method !== "GET") return;

  // Ignora esquemas não-HTTP (chrome-extension, etc.)
  if (!req.url.startsWith("http")) return;

  // API do IBGE — sempre rede (dados ficam em localStorage)
  if (req.url.indexOf("servicodados.ibge.gov.br") > -1) {
    return; // deixa o navegador resolver normalmente
  }

  // Requisições de navegação (HTML) → network-first
  var ehHTML = req.mode === "navigate" ||
               (req.headers.get("accept") || "").indexOf("text/html") > -1;

  if (ehHTML) {
    e.respondWith(
      fetch(req)
        .then(function (r) {
          var cp = r.clone();
          caches.open(CACHE).then(function (c) { c.put(req, cp); });
          return r;
        })
        .catch(function () {
          return caches.match(req).then(function (r) {
            return r || caches.match("./index.html");
          });
        })
    );
    return;
  }

  // Demais assets → cache-first
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (cached) {
      if (cached) return cached;

      return fetch(req).then(function (r) {
        // Cacheia só respostas válidas e do mesmo domínio
        if (r && r.status === 200 && r.type === "basic") {
          var cp = r.clone();
          caches.open(CACHE).then(function (c) { c.put(req, cp); });
        }
        return r;
      }).catch(function () {
        // Fallback offline: devolve index.html para navegação
        if (ehHTML) return caches.match("./index.html");
      });
    })
  );
});