/**
 * ChapterApp — Lógica principal para la página de capítulos dinámicos.
 * Carga capítulos desde Markdown, renderiza con MarkdownRenderer,
 * construye sidebar, TOC y navegación prev/next.
 */
(function () {
  'use strict';

  var renderer = new MarkdownRenderer();
  var chaptersData = [];
  var currentChapter = null;

  // ══════════════════════════════════════════════════════════
  //  INICIALIZACIÓN
  // ══════════════════════════════════════════════════════════

  function init() {
    setupTheme();
    setupMenuToggle();
    setupScroll();

    loadJSON('content/chapters.json')
      .then(function (data) {
        chaptersData = data;
        var id = getChapterId() || getDefaultChapterId();
        currentChapter = chaptersData.find(function (c) { return c.id === id; });

        if (!currentChapter || currentChapter.type !== 'markdown') {
          showError('Capítulo no encontrado. Verifica la URL.');
          return;
        }

        ensureChapterUrl();

        buildSidebar();
        loadChapter();
      })
      .catch(function () {
        showError('No se pudo cargar la lista de capítulos (chapters.json).');
      });
  }

  function getChapterId() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id') || '';
  }

  function getDefaultChapterId() {
    var firstMarkdown = chaptersData.find(function (c) { return c.type === 'markdown'; });
    return firstMarkdown ? firstMarkdown.id : '';
  }

  function ensureChapterUrl() {
    if (!currentChapter) return;
    var params = new URLSearchParams(window.location.search);
    if (params.get('id')) return;

    params.set('id', currentChapter.id);
    var qs = params.toString();
    var nextUrl = window.location.pathname + (qs ? '?' + qs : '');
    window.history.replaceState({}, '', nextUrl);
  }

  function loadJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }

  // ══════════════════════════════════════════════════════════
  //  CARGA Y RENDERIZADO DEL CAPÍTULO
  // ══════════════════════════════════════════════════════════

  function loadChapter() {
    var contentEl = document.getElementById('content');

    fetch(currentChapter.file)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (markdown) {
        var result = renderer.render(markdown);

        // Insertar HTML renderizado
        contentEl.innerHTML = result.html;

        // Agregar navegación prev/next
        contentEl.insertAdjacentHTML('beforeend', buildChapterNav());

        // Construir TOC en sidebar
        buildTOC(result.toc);

        // Inicializar lógica de ejercicios tras inyectar el contenido
        if (window.QuizEngine && typeof window.QuizEngine.bootstrap === 'function') {
          window.QuizEngine.bootstrap();
        }

        // Actualizar títulos
        var titleText = 'Capítulo ' + currentChapter.number + ' — ' + currentChapter.title;
        document.getElementById('topbarTitle').textContent = titleText;
        document.title = 'Cap. ' + currentChapter.number + ' — ' + currentChapter.title + ' | Bases de Datos';

        // Scroll al tope
        window.scrollTo(0, 0);
      })
      .catch(function () {
        contentEl.innerHTML =
          '<div class="callout danger">' +
          '<strong>Error al cargar el capítulo</strong>' +
          '<p>No se pudo cargar el archivo: <code>' + currentChapter.file + '</code></p>' +
          '<p>Asegúrate de servir la página desde un servidor web local ' +
          '(ej: <code>npx serve</code> o <code>python -m http.server</code>). ' +
          'Los archivos locales no pueden cargarse directamente con <code>file://</code>.</p>' +
          '</div>';
      });
  }

  // ══════════════════════════════════════════════════════════
  //  SIDEBAR
  // ══════════════════════════════════════════════════════════

  function buildSidebar() {
    var nav = document.getElementById('sidebarNav');
    nav.innerHTML = '';

    chaptersData.forEach(function (ch) {
      var isActive = currentChapter && ch.id === currentChapter.id;
      var url = ch.type === 'markdown'
        ? 'capitulo.html?id=' + ch.id
        : ch.url;

      var div = document.createElement('div');
      div.className = 'nav-chapter' + (isActive ? ' open' : '');

      div.innerHTML =
        '<a class="nav-chapter-title' + (isActive ? ' active-chapter' : '') + '" ' +
        'href="' + url + '" style="text-decoration:none">' +
        '<span class="ch-num">' + ch.number + '</span>' +
        ch.title +
        (isActive ? '<span class="arrow">▶</span>' : '') +
        '</a>' +
        (isActive ? '<div class="nav-sections" id="tocContainer"></div>' : '');

      nav.appendChild(div);
    });
  }

  // ══════════════════════════════════════════════════════════
  //  TABLA DE CONTENIDOS AUTOMÁTICA
  // ══════════════════════════════════════════════════════════

  function buildTOC(tocItems) {
    var container = document.getElementById('tocContainer');
    if (!container) return;

    container.innerHTML = '';

    var items = tocItems && tocItems.length ? tocItems : inferTOCFromDOM();

    items.forEach(function (item) {
      if (item.level > 3) return;
      // Saltar el h1 (título del capítulo)
      if (item.level === 1) return;

      var btn = document.createElement('button');
      btn.className = 'nav-link' + (item.level === 3 ? ' toc-h3' : '');
      btn.textContent = item.text;
      btn.setAttribute('data-section-id', item.id);
      btn.addEventListener('click', function () {
        var el = document.getElementById(item.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Cerrar sidebar en mobile
        if (window.innerWidth <= 900) {
          document.getElementById('sidebar').classList.remove('open');
        }
      });
      container.appendChild(btn);
    });
  }

  function inferTOCFromDOM() {
    var list = [];
    var sections = document.querySelectorAll('#content .section');

    sections.forEach(function (section, idx) {
      var h2 = section.querySelector('h2');
      if (h2) {
        if (!h2.id) h2.id = section.id || ('section-' + (idx + 1));
        list.push({ level: 2, text: h2.textContent.trim(), id: h2.id });
      }

      var h3s = section.querySelectorAll('h3');
      h3s.forEach(function (h3, j) {
        if (!h3.id) h3.id = (h2 && h2.id ? h2.id : ('section-' + (idx + 1))) + '-h3-' + (j + 1);
        list.push({ level: 3, text: h3.textContent.trim(), id: h3.id });
      });
    });

    return list;
  }

  // ══════════════════════════════════════════════════════════
  //  NAVEGACIÓN PREV / NEXT
  // ══════════════════════════════════════════════════════════

  function buildChapterNav() {
    var idx = -1;
    for (var i = 0; i < chaptersData.length; i++) {
      if (chaptersData[i].id === currentChapter.id) { idx = i; break; }
    }

    var prev = idx > 0 ? chaptersData[idx - 1] : null;
    var next = idx < chaptersData.length - 1 ? chaptersData[idx + 1] : null;

    function getUrl(ch) {
      return ch.type === 'markdown'
        ? 'capitulo.html?id=' + ch.id
        : ch.url;
    }

    var html = '<div class="chapter-nav">';

    if (prev) {
      html += '<a class="chapter-nav-btn" href="' + getUrl(prev) + '">' +
        '<span class="nav-label">← Capítulo anterior</span>' +
        '<span class="nav-title">Cap. ' + prev.number + ' — ' + prev.title + '</span>' +
        '</a>';
    } else {
      html += '<div></div>';
    }

    if (next) {
      html += '<a class="chapter-nav-btn" href="' + getUrl(next) + '" style="text-align:right;margin-left:auto">' +
        '<span class="nav-label">Capítulo siguiente →</span>' +
        '<span class="nav-title">Cap. ' + next.number + ' — ' + next.title + '</span>' +
        '</a>';
    } else {
      html += '<div></div>';
    }

    html += '</div>';
    return html;
  }

  // ══════════════════════════════════════════════════════════
  //  TEMA CLARO / OSCURO
  // ══════════════════════════════════════════════════════════

  function setupTheme() {
    var btn = document.getElementById('themeToggle');

    function setTheme(dark) {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
      btn.textContent = dark ? '☀️' : '🌙';
      try { localStorage.setItem('db-theme', dark ? 'dark' : 'light'); } catch (e) { }
    }

    btn.addEventListener('click', function () {
      setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
    });

    try {
      if (localStorage.getItem('db-theme') === 'dark') setTheme(true);
    } catch (e) { }
  }

  // ══════════════════════════════════════════════════════════
  //  MENU TOGGLE
  // ══════════════════════════════════════════════════════════

  function setupMenuToggle() {
    var sidebar = document.getElementById('sidebar');
    document.getElementById('menuToggle').addEventListener('click', function () {
      if (window.innerWidth <= 900) {
        sidebar.classList.toggle('open');
      } else {
        sidebar.classList.toggle('closed');
      }
    });
  }

  // ══════════════════════════════════════════════════════════
  //  SCROLL HANDLERS
  // ══════════════════════════════════════════════════════════

  function setupScroll() {
    var scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('show', window.scrollY > 400);

      // Resaltar sección activa en TOC
      var sections = document.querySelectorAll('.section');
      var currentId = '';
      sections.forEach(function (s) {
        if (s.getBoundingClientRect().top < 120) currentId = s.id;
      });

      var links = document.querySelectorAll('#tocContainer .nav-link');
      links.forEach(function (l) { l.classList.remove('active'); });

      if (currentId) {
        // Activar el link cuyo data-section-id coincida
        links.forEach(function (l) {
          if (l.getAttribute('data-section-id') === currentId) {
            l.classList.add('active');
          }
        });
      }
    }, { passive: true });
  }

  // ══════════════════════════════════════════════════════════
  //  ERROR
  // ══════════════════════════════════════════════════════════

  function showError(msg) {
    document.getElementById('content').innerHTML =
      '<div style="padding:80px 20px;text-align:center">' +
      '<div class="callout danger"><strong>Error</strong><p>' + msg + '</p></div>' +
      '<p style="margin-top:20px"><a href="index.html">← Volver al inicio</a></p>' +
      '</div>';
  }

  // ══════════════════════════════════════════════════════════
  //  ARRANQUE
  // ══════════════════════════════════════════════════════════

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
