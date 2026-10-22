# 🐸 Caderno Herpetológico

Aplicativo PWA (Progressive Web App) para coleta de dados de anfíbios e
répteis em campo. Funciona **offline**, guarda os dados no próprio aparelho
e exporta em CSV.

🔗 **App online:** https://marcelosturaro.github.io/Caderno_Herpetologico

---

## ✨ Recursos

- 📱 Instalável em Android, iOS e desktop
- 📡 Funciona 100% offline após o primeiro acesso
- 📍 Captura GPS automática
- 🐍 Autocomplete com 2.100+ espécies brasileiras (SBH 2023/2026)
- 🗺️ Autocomplete de estados e municípios (IBGE, com cache local)
- 💾 Persistência em `localStorage` do aparelho
- 📤 Exportação CSV para planilhas
- 🌙 Tema claro/escuro automático
- 🇧🇷 Interface em português

---

## 📲 Instalação

### Android (Chrome / Edge / Samsung Internet / Brave)
1. Abra o link do app.
2. Toque no botão **"Instalar aplicativo"** no topo
   *(ou menu ⋮ → "Instalar aplicativo")*.
3. Confirme em **Instalar**.

### iPhone / iPad (Safari)
1. Abra o link **no Safari**.
2. Toque em **Compartilhar** (quadrado com seta ↑).
3. Role e toque em **Adicionar à Tela de Início**.
4. Toque em **Adicionar**.

> O botão "Instalar aplicativo" no topo do app abre automaticamente um
> modal com essas instruções quando detecta iOS.

### Desktop (Chrome / Edge / Brave)
1. Abra o link.
2. Clique no ícone de instalação na barra de endereços
   *(ou no botão no topo da página)*.

---

## 📂 Estrutura

| Arquivo | Função |
|---|---|
| `index.html` | Aplicativo completo (UI + lógica + dados) |
| `manifest.webmanifest` | Metadados do PWA (nome, ícones, cores, `id`) |
| `sw.js` | Service Worker — cache offline |
| `icon-192.png` | Ícone 192×192 (Android) |
| `icon-512.png` | Ícone 512×512 (Android / splash) |
| `icon-maskable-512.png` | Ícone adaptativo (Android) |
| `.nojekyll` | Desativa Jekyll no GitHub Pages |
| `LICENSE` | Licença MIT |
| `README.md` | Este arquivo |
| `COMO_SUBMETER.md` | Guia passo a passo de publicação |

---

## 🚀 Publicar no GitHub Pages

Veja o guia completo em [`COMO_SUBMETER.md`](./COMO_SUBMETER.md).

Resumo:
```bash
git init
git add .
git commit -m "Versão inicial"
git branch -M main
git remote add origin https://github.com/marcelosturaro/Caderno_Herpetologico.git
git push -u origin main