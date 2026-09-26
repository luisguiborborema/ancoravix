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
| Compartilhamento | Substitua `assets/img/og-cover.jpg` (1200×630) mantendo o nome |

## WhatsApp

O número principal fica em `js/main.js` (`WHATSAPP_NUMBER`). Todos os links com `data-wa` recebem esse número
e a mensagem pronta definida em `data-wa-msg`. O formulário de contato monta a mensagem e abre o WhatsApp.

## SEO, buscas por IA e Analytics

| Arquivo | Função |
|---|---|
| `index.html` (`<head>`) | Título/descrição, canonical, Open Graph, geolocalização e JSON-LD (empresa, serviços, site e FAQ) |
| `robots.txt` | Libera Google, Bing e robôs de IA (ChatGPT, Claude, Perplexity, Gemini, Apple, Meta etc.) |
| `llms.txt` | Resumo da empresa em Markdown para assistentes de IA (padrão llmstxt.org) |
| `sitemap.xml` | Mapa do site com imagens |
| `.htaccess` | HTTPS, www → sem www, compressão, cache e UTF-8 (Apache) |
| `assets/img/og-cover.jpg` | Imagem de compartilhamento 1200×630 |
| `js/analytics.js` | Google Analytics 4 com aviso de cookies (LGPD / Consent Mode v2) |

**Mantenha sincronizados:** o FAQ visível e o `FAQPage` do JSON-LD precisam ter o mesmo texto. Ao mudar
serviços, contatos ou endereço, atualize também o JSON-LD e o `llms.txt`.

### Ativar o Google Analytics

1. Em https://analytics.google.com crie uma propriedade GA4 e um fluxo "Web" para `ancoravix.com.br`.
2. Cole o ID (`G-XXXXXXXXXX`) em `GA_MEASUREMENT_ID` no início de `js/analytics.js`.
3. No GA4, em *Administrador → Eventos*, marque como **evento principal** (conversão):
   `generate_lead` (formulário enviado) e `whatsapp_click`.

Eventos enviados: `whatsapp_click`, `generate_lead`, `email_click`, `phone_click`, `social_click`,
`map_click` e `portfolio_filter` — com o parâmetro `link_location` indicando a seção do clique.

### Depois de publicar

- Cadastre o site no [Google Search Console](https://search.google.com/search-console) e no
  [Bing Webmaster Tools](https://www.bing.com/webmasters) e envie o `sitemap.xml` (o Bing alimenta o ChatGPT Search e o Copilot).
- Crie/atualize o **Perfil da Empresa no Google** com o mesmo nome, endereço e telefone do site.
- Quando o WordPress em `/site/` for desativado, ative o redirecionamento 301 no `.htaccess`.
