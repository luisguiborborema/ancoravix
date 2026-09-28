# Ancoravix — Site institucional

Site estático (HTML + CSS + JS puros, sem build). Basta enviar os arquivos para a hospedagem.

## Publicar na Vercel (validação)

1. Em https://vercel.com → *Add New → Project* → importe `luisguiborborema/ancoravix`.
2. Framework: **Other**. Build command e output directory: deixe em branco. *Deploy*.

O `vercel.json` adiciona `noindex` em qualquer endereço `*.vercel.app` (o Google não indexa a versão de teste)
e o `.vercelignore` impede que prompts, README e `.htaccess` fiquem públicos.
Durante a validação, a imagem de preview de links (`og:image`) é servida pelo GitHub.

**No lançamento em ancoravix.com.br:** troque `og:image`/`twitter:image` para
`https://ancoravix.com.br/assets/img/og-cover.jpg` em `index.html` e `politica-de-privacidade.html`.

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

## Vídeos

Os originais (150–400 MB) ficam em `midia-originais/videos/`, **fora do Git e da Vercel**.
Para gerar as versões web, rode `bash scripts/processar-videos.sh` (requer `ffmpeg`):

| Arquivo | Uso | Tamanho |
|---|---|---|
| `assets/video/hero-drone-mobile.mp4` | Fundo do topo **no celular** (loop vai-e-volta, sem som). No desktop fica a foto. | ~2,3 MB |
| `assets/video/obra-drone-*.mp4` | Galeria de obras: tocam sem som quando visíveis e abrem no lightbox | ~2 MB cada |
| `assets/video/institucional-ancoravix.mp4` | Seção "Veja a Ancoravix em ação" — com som, carrega só ao clicar | ~15 MB |

Os vídeos não carregam para quem usa "economia de dados" ou prefere menos movimento.

## WhatsApp

O número principal fica em `js/main.js` (`WHATSAPP_NUMBER`). Todos os links com `data-wa` recebem esse número
e a mensagem pronta definida em `data-wa-msg`. O formulário de contato monta a mensagem e abre o WhatsApp.

Identidade visual: logo "Ancoravix Reformas Prediais" (azul-marinho #00235A + dourado #F2B233). Versões em alta
resolução, com fundo transparente, em `assets/brand/` (não publicadas).

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

### Política de privacidade (LGPD)

`politica-de-privacidade.html` é um **modelo** — revise com o jurídico e preencha os campos destacados em amarelo
(CNPJ, encarregado de dados e prazo de retenção). O rodapé tem os links "Política de privacidade" e
"Preferências de cookies" (este aparece só quando o GA está ativo). No GA4, ajuste a retenção de dados para
14 meses em *Administrador → Coleta e modificação de dados → Retenção de dados*.
