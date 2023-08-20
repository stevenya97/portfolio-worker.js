  /* CONFIGURATION STARTS HERE */
  
  /* Step 1: enter your domain name like fruitionsite.com */
  const MY_DOMAIN = 'stevenyang.co';
  
  /*
   * Step 2: enter your URL slug to page ID mapping
   * The key on the left is the slug (without the slash)
   * The value on the right is the Notion page ID
   */
  const SLUG_TO_PAGE = {
    '': '706ce2001fe34ea788f5f9f1fa12da0e',
    'about': 'baa726a004054b21a8ea58e3cc2414d1',
    'portfolio': 'c599cd48081d4fa092991167afad3be2',
    'blog': 'b07ea20e11224c07b6940f69181cb1b9',
    'gallery': '066bbe11970248d9a9b63ec25da6af37',
    'gogh': 'a6d4e57855214b99b2ab1d8cbdcd1ece',
    'apps': 'b1e154a4fce2409f9362a6ca56cb8ff8',
  };
  
  /* Step 3: enter your page title and description for SEO purposes */
  const PAGE_TITLE = 'Steven Yang';
  const PAGE_DESCRIPTION = 'Personal website of Steven Y';
  const PAGE_LOGO = 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6b849e77-ab81-4546-8514-4cf0ec67eb28/d5f89acf8c3bfbdfe271e9ace851c063.jfif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220925%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220925T202936Z&X-Amz-Expires=86400&X-Amz-Signature=dfecdb41a05210a674fc672b01e8b54f6170ada9de6970a6252abf8a7b5a03e5&X-Amz-SignedHeaders=host&x-id=GetObject';
  
  /* Step 4: enter a Google Font name, you can choose from https://fonts.google.com */
  const GOOGLE_FONT = 'Comfortaa';
  
  /* Step 5: enter any custom scripts you'd like */
  const CUSTOM_SCRIPT = 
  `
  <!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YEFRJ9FVTC"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-YEFRJ9FVTC');
</script>
  `;
  
  const CUSTOM_CSS = 
  `
  
  /* Remove header elements and fix bottom padding */
  
  //div.notion-topbar-mobile > div:nth-child(1) { padding: 0px 10px !important; }
  
  /* background border */
  .notion-page-content {
    padding-bottom: 0rem !important;
    padding-top: 3rem !important;
    background: rgba(128, 128, 128, 0.075);
    border-radius: 1rem;
    margin-top: 0rem;
    margin-right: 0;
    margin-bottom: 5rem ;
    margin-left: 0;
  }

  .notion-page-content { padding-bottom: 0vh !important; margin-bottom: 0vh !important; }
  /* Center social links and pull them down off the bottom of page */
  div.notion-selectable.notion-transclusion_container-block {
      text-align: center;
      justify-content: center !important;
      //margin-bottom: -12.5rem !important;
  }
  div.notion-selectable.notion-transclusion_reference-block {
      text-align: center;
      justify-content: center !important;
      //margin-bottom: -12.5rem !important;
  }
  /* Center breadcrumb in footer */
  .notion-breadcrumb-block {
    display: flex !important;
    justify-content: center !important;
  }
  /* Hide icons for all sub-pages in footer breadcrumb */
  .notion-breadcrumb-block > div > div > div:not(:first-child) .notion-record-icon {
    display: none !important;
  }
  /* Standardize border radius of all images and turn off image preview */
.notion-image-block img {
    pointer-events: none !important;
    border-radius: 0.5rem !important;
}
.notion-image-block {
    //pointer-events: none !important;
    border-radius: 0.5rem !important;
}



  `;
  /* CONFIGURATION ENDS HERE */
  
  const PAGE_TO_SLUG = {};
  const slugs = [];
  const pages = [];
  Object.keys(SLUG_TO_PAGE).forEach(slug => {
    const page = SLUG_TO_PAGE[slug];
    slugs.push(slug);
    pages.push(page);
    PAGE_TO_SLUG[page] = slug;
  });
  
  addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request));
  });

  function generateSitemap() {
    let sitemap = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    slugs.forEach(
      (slug) =>
        (sitemap +=
          '<url><loc>https://' + MY_DOMAIN + '/' + slug + '</loc></url>')
    );
    sitemap += '</urlset>';
    return sitemap;
  }
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  function handleOptions(request) {
    if (request.headers.get('Origin') !== null &&
      request.headers.get('Access-Control-Request-Method') !== null &&
      request.headers.get('Access-Control-Request-Headers') !== null) {
      // Handle CORS pre-flight request.
      return new Response(null, {
        headers: corsHeaders
      });
    } else {
      // Handle standard OPTIONS request.
      return new Response(null, {
        headers: {
          'Allow': 'GET, HEAD, POST, PUT, OPTIONS',
        }
      });
    }
  }
  
  async function fetchAndApply(request) {
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }
    let url = new URL(request.url);
    url.hostname = 'www.notion.so';
    if (url.pathname === '/robots.txt') {
      return new Response('Sitemap: https://' + MY_DOMAIN + '/sitemap.xml');
    }
    if (url.pathname === '/sitemap.xml') {
      let response = new Response(generateSitemap());
      response.headers.set('content-type', 'application/xml');
      return response;
    }
    let response;
    if (url.pathname.endsWith('js')) {
      response = await fetch(url.toString());
      let body = await response.text();
      response = new Response(body.replace(/www.notion.so/g, MY_DOMAIN).replace(/notion.so/g, MY_DOMAIN), response);
      response.headers.set('Content-Type', 'application/x-javascript');
      return response;
    } else if ((url.pathname.startsWith('/api'))) {
      // Forward API
      response = await fetch(url.toString(), {
        body: url.pathname.startsWith('/api/v3/getPublicPageData') ? null : request.body,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
        },
        method: 'POST',
      });
      response = new Response(response.body, response);
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    } else if (slugs.indexOf(url.pathname.slice(1)) > -1) {
      const pageId = SLUG_TO_PAGE[url.pathname.slice(1)];
      return Response.redirect('https://' + MY_DOMAIN + '/' + pageId, 301);
    } else if (
    pages.indexOf(url.pathname.slice(1)) === -1 && url.pathname.slice(1).match(/[0-9a-f]{32}/)) {
      return Response.redirect('https://' + MY_DOMAIN, 301);
    } else {
      response = await fetch(url.toString(), {
        body: request.body,
        headers: request.headers,
        method: request.method,
      });
      response = new Response(response.body, response);
      response.headers.delete('Content-Security-Policy');
      response.headers.delete('X-Content-Security-Policy');
    }
  
    return appendJavascript(response, SLUG_TO_PAGE);
  }
  
  class MetaRewriter {
    element(element) {
      if (PAGE_TITLE !== '') {
        if (element.getAttribute('property') === 'og:title'
          || element.getAttribute('name') === 'twitter:title') {
          element.setAttribute('content', PAGE_TITLE);
        }
        if (element.tagName === 'title') {
          element.setInnerContent(PAGE_TITLE);
        }
      }
      if (element.getAttribute('property') === 'og:image'
          || element.getAttribute('name') === 'twitter:image') {
          element.setAttribute('content', PAGE_LOGO);
        }
      if (PAGE_DESCRIPTION !== '') {
        if (element.getAttribute('name') === 'description'
          || element.getAttribute('property') === 'og:description'
          || element.getAttribute('name') === 'twitter:description') {
          element.setAttribute('content', PAGE_DESCRIPTION);
        }
      }
      if (element.getAttribute('property') === 'og:url'
        || element.getAttribute('name') === 'twitter:url') {
        element.setAttribute('content', MY_DOMAIN);
      }
      if (element.getAttribute('name') === 'apple-itunes-app'
          || element.getAttribute('name') === 'twitter:site'
          || element.getAttribute('property') === 'og:site_name') {
          element.remove();
      }
      if ((element.getAttribute('name') === 'twitter:image'
          || element.getAttribute('property') === 'og:image')
          && element.getAttribute('content') === 'https://www.notion.so/images/meta/default.png') {
          // TODO: update content based on input field for the sharing image
          element.remove();
      }
    }
  }
  
  class HeadRewriter {
    element(element) {
      if (GOOGLE_FONT !== '') {
        element.append(`<link href="https://fonts.googleapis.com/css?family=${GOOGLE_FONT.replace(' ', '+')}:Regular,Bold,Italic&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
        <style>* { font-family: "${GOOGLE_FONT}" !important; }</style>`, {
          html: true
        });
      }
      element.append(`<style>
      div.notion-topbar > div > div:nth-child(3) { display: none !important; }
      div.notion-topbar > div > div:nth-child(4) { display: none !important; }
      div.notion-topbar > div > div:nth-child(5) { display: none !important; }
      div.notion-topbar > div > div:nth-child(6) { display: none !important; }
      div.notion-topbar-mobile > div:nth-child(3) { display: none !important; }
      div.notion-topbar-mobile > div:nth-child(4) { display: none !important; }
      div.notion-topbar-mobile > div:nth-child(5) { display: none !important; }
      div.notion-topbar > div > div:nth-child(1n).toggle-mode { display: block !important; }
      div.notion-topbar-mobile > div:nth-child(1n).toggle-mode { display: block !important; }
      
      `, {
        html: true
      })
    }
  }
  
  class BodyRewriter {
    constructor(SLUG_TO_PAGE) {
      this.SLUG_TO_PAGE = SLUG_TO_PAGE;
    }
    element(element) {
      element.append(`
      <script>
      window.CONFIG.domainBaseUrl = 'https://${MY_DOMAIN}';
      const SLUG_TO_PAGE = ${JSON.stringify(this.SLUG_TO_PAGE)};
      const PAGE_TO_SLUG = {};
      const slugs = [];
      const pages = [];
      const el = document.createElement('div');
      let redirected = false;
      Object.keys(SLUG_TO_PAGE).forEach(slug => {
        const page = SLUG_TO_PAGE[slug];
        slugs.push(slug);
        pages.push(page);
        PAGE_TO_SLUG[page] = slug;
      });
      function getPage() {
        return location.pathname.slice(-32);
      }
      function getSlug() {
        return location.pathname.slice(1);
      }
      function updateSlug() {
        const slug = PAGE_TO_SLUG[getPage()];
        if (slug != null) {
          history.replaceState(history.state, '', '/' + slug);
        }
      }


      function enableConsoleEffectAndSetMode(mode) {
        if (__console && !__console.isEnabled) {
          __console.enable()
          window.location.reload()
        } else {
          __console.environment.ThemeStore.setState({ mode: mode })
        }
      }
      function onDark() {
        el.innerHTML =
          '<div title="Change to Light Mode" style="margin-left: auto; margin-right: 14px; min-width: 0px;"><div role="button" tabindex="0" style="user-select: none; transition: background 120ms ease-in 0s; cursor: pointer; border-radius: 44px;"><div style="display: flex; flex-shrink: 0; height: 14px; width: 26px; border-radius: 44px; padding: 2px; box-sizing: content-box; background: rgb(46, 170, 220); transition: background 200ms ease 0s, box-shadow 200ms ease 0s;"><div style="width: 14px; height: 14px; border-radius: 44px; background: white; transition: transform 200ms ease-out 0s, background 200ms ease-out 0s; transform: translateX(12px) translateY(0px);"></div></div></div></div>'
        document.body.classList.add('dark')
        enableConsoleEffectAndSetMode('dark')
      }
      function onLight() {
        el.innerHTML =
          '<div title="Change to Dark Mode" style="margin-left: auto; margin-right: 14px; min-width: 0px;"><div role="button" tabindex="0" style="user-select: none; transition: background 120ms ease-in 0s; cursor: pointer; border-radius: 44px;"><div style="display: flex; flex-shrink: 0; height: 14px; width: 26px; border-radius: 44px; padding: 2px; box-sizing: content-box; background: rgba(135, 131, 120, 0.3); transition: background 200ms ease 0s, box-shadow 200ms ease 0s;"><div style="width: 14px; height: 14px; border-radius: 44px; background: white; transition: transform 200ms ease-out 0s, background 200ms ease-out 0s; transform: translateX(0px) translateY(0px);"></div></div></div></div>'
        document.body.classList.remove('dark')
        enableConsoleEffectAndSetMode('light')
      }
      function toggle() {
        if (document.body.classList.contains('dark')) {
          onLight();
        } else {
          onDark();
        }
      }
      function addDarkModeButton(device) {
        const nav = device === 'web' ? document.querySelector('.notion-topbar').firstChild : document.querySelector('.notion-topbar-mobile');
        el.className = 'toggle-mode';
        el.addEventListener('click', toggle);
        nav.appendChild(el);
        //onLight();
                // enable smart dark mode based on user-preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            onDark();
        } else {
            onLight();
        }
        
        // try to detect if user-preference change
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            toggle();
            
        });
      }
      const observer = new MutationObserver(function() {
        if (redirected) return;
        const nav = document.querySelector('.notion-topbar');
        const mobileNav = document.querySelector('.notion-topbar-mobile');
        if (nav && nav.firstChild && nav.firstChild.firstChild
          || mobileNav && mobileNav.firstChild) {
          redirected = true;
          updateSlug();
          addDarkModeButton(nav ? 'web' : 'mobile');
          const onpopstate = window.onpopstate;
          window.onpopstate = function() {
            if (slugs.includes(getSlug())) {
              const page = SLUG_TO_PAGE[getSlug()];
              if (page) {
                history.replaceState(history.state, 'bypass', '/' + page);
              }
            }
            onpopstate.apply(this, [].slice.call(arguments));
            updateSlug();
          };
        }
      });
      observer.observe(document.querySelector('#notion-app'), {
        childList: true,
        subtree: true,
      });
      const replaceState = window.history.replaceState;
      window.history.replaceState = function(state) {
        if (arguments[1] !== 'bypass' && slugs.includes(getSlug())) return;
        return replaceState.apply(window.history, arguments);
      };
      const pushState = window.history.pushState;
      window.history.pushState = function(state) {
        const dest = new URL(location.protocol + location.host + arguments[2]);
        const id = dest.pathname.slice(-32);
        if (pages.includes(id)) {
          arguments[2] = '/' + PAGE_TO_SLUG[id];
        }
        return pushState.apply(window.history, arguments);
      };
      const open = window.XMLHttpRequest.prototype.open;
      window.XMLHttpRequest.prototype.open = function() {
        arguments[1] = arguments[1].replace('${MY_DOMAIN}', 'www.notion.so');
        return open.apply(this, [].slice.call(arguments));
      };
    </script>${CUSTOM_SCRIPT}<style>${CUSTOM_CSS}</style>`, {
        html: true
      });
    }
  }
  
  async function appendJavascript(res, SLUG_TO_PAGE) {
    return new HTMLRewriter()
      .on('title', new MetaRewriter())
      .on('meta', new MetaRewriter())
      .on('head', new HeadRewriter())
      .on('body', new BodyRewriter(SLUG_TO_PAGE))
      .transform(res);
  }