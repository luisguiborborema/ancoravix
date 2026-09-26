# Ancoravix — Site institucional

Site estático (HTML + CSS + JS puros, sem build). Basta enviar os arquivos para a hospedagem.

## Rodar localmente

```bash
python3 -m http.server 5173
# abra http://localhost:5173
```

## Estrutura

```
index.html        Página única (seções: hero, serviços, processo, produtos, sobre, portfólio, FAQ, contato)
css/style.css     Design system (cores e fontes em :root) e todos os estilos
js/main.js        Menu, animações de scroll, contadores, filtros/lightbox, formulário → WhatsApp
assets/img/       Logo/favicon e, futuramente, fotos próprias
assets/video/     Vídeo opcional do hero
robots.txt, sitemap.xml
```

## Trocar mídias

As imagens atuais são placeholders do Unsplash. Para usar fotos próprias, salve em `assets/img/` e troque o `src`:

| Onde | O que trocar |
|---|---|
| Hero | `<img>` dentro de `.hero-media` e o `<link rel="preload">` no `<head>` |
| Vídeo do hero | Coloque o `.mp4` em `assets/video/` e preencha `data-src` do `<video class="hero-video">` (só carrega em telas ≥ 768px) |
| Serviços / Sobre / CTA | `<img>` de cada bloco |
| Portfólio | `src` (miniatura) e `data-full` (versão grande do lightbox) de cada `.g-btn` |
| Produtos | Troque o `<svg>` de cada `.product-art` por `<img src="assets/img/produtos/...">` |
| Compartilhamento | `og:image` no `<head>` (imagem 1200×630) |

## WhatsApp

O número principal fica em `js/main.js` (`WHATSAPP_NUMBER`). Todos os links com `data-wa` recebem esse número
e a mensagem pronta definida em `data-wa-msg`. O formulário de contato monta a mensagem e abre o WhatsApp.
