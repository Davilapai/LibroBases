/**
 * MarkdownRenderer — Transforma Markdown en HTML usando los componentes
 * y estilos del diseño existente del sitio educativo de Bases de Datos.
 *
 * Dependencia: marked.js v4+ (global `marked`)
 */
class MarkdownRenderer {
  constructor() {
    this.toc = [];
    this._openSection = false;
    this._sectionCount = 0;
  }

  /**
   * Renderiza un string Markdown a HTML con los estilos del sitio.
   * @param {string} markdownText
   * @returns {{ html: string, toc: Array<{level:number,text:string,id:string}> }}
   */
  render(markdownText) {
    this.toc = [];
    this._openSection = false;
    this._sectionCount = 0;
    const self = this;

    const renderer = new marked.Renderer();

    // ── HEADINGS ──────────────────────────────────────────────
    renderer.heading = function (text, level) {
      const id = self._slugify(text);
      if (level <= 3) {
        self.toc.push({ level, text: self._strip(text), id });
      }

      // h1 → chapter-header
      if (level === 1) {
        const parts = text.split('—');
        const title = parts[0].trim();
        const label = parts.length > 1 ? parts[1].trim() : 'Capítulo';
        return '<div class="chapter-header">' +
          '<div class="ch-label">' + self._esc(label) + '</div>' +
          '<h1 id="' + id + '">' + title + '</h1>' +
          '</div>\n';
      }

      // h2 → section
      if (level === 2) {
        self._sectionCount++;
        const close = self._openSection ? '</div>\n' : '';
        self._openSection = true;
        const cls = self._sectionClass(text);
        return close +
          '<div class="section' + (cls ? ' ' + cls : '') + '" id="' + id + '">' +
          '<h2>' + text + '</h2>\n';
      }

      return '<h' + level + ' id="' + id + '">' + text + '</h' + level + '>\n';
    };

    // ── CODE BLOCKS → CodeBlock ──────────────────────────────
    renderer.code = function (code, lang) {
      const language = (lang || '').toLowerCase().trim();
      const highlighted = self._highlight(code, language);
      const langLabel = language
        ? '<div class="code-lang-label">' + language.toUpperCase() + '</div>'
        : '';
      return '<div class="code-block-wrapper">' + langLabel +
        '<pre><code>' + highlighted + '</code></pre></div>\n';
    };

    // ── BLOCKQUOTE → Callout ─────────────────────────────────
    renderer.blockquote = function (body) {
      const type = self._calloutType(body);
      return '<div class="callout ' + type + '">' + body + '</div>\n';
    };

    // ── TABLE ────────────────────────────────────────────────
    renderer.table = function (header, body) {
      return '<div class="table-wrap"><table><thead>' +
        header + '</thead><tbody>' + body + '</tbody></table></div>\n';
    };

    // ── INLINE CODE ──────────────────────────────────────────
    renderer.codespan = function (text) {
      return '<code>' + text + '</code>';
    };

    // ── HR ────────────────────────────────────────────────────
    renderer.hr = function () {
      return '<hr style="border:none;border-top:1px solid var(--border);margin:32px 0">\n';
    };

    // ── Configure & parse ────────────────────────────────────
    marked.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: false,
      pedantic: false,
      smartLists: true,
      smartypants: false
    });

    var html = marked.parse(markdownText);

    if (this._openSection) {
      html += '</div>\n';
    }

    return { html: html, toc: this.toc.slice() };
  }

  // ── Helpers privados ─────────────────────────────────────

  _slugify(text) {
    return this._strip(text)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  _strip(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  _esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _sectionClass(heading) {
    var h = heading.toLowerCase();
    if (h.indexOf('preguntas') !== -1) return 'section-questions';
    if (h.indexOf('ejercicios') !== -1) return 'section-exercises';
    if (h.indexOf('concepto') !== -1) return 'section-concepts';
    if (h.indexOf('resumen') !== -1) return 'section-summary';
    if (h.indexOf('notas importantes') !== -1) return 'section-notes';
    if (h.indexOf('visualización') !== -1 || h.indexOf('visualizacion') !== -1) return 'section-visual';
    return '';
  }

  _calloutType(content) {
    if (content.indexOf('⚠️') !== -1 || content.indexOf('Regla de oro') !== -1) return 'danger';
    if (content.indexOf('Nota Oracle') !== -1 || content.indexOf('Nota:') !== -1) return 'warning';
    if (content.indexOf('💡') !== -1 || content.indexOf('Conclusión') !== -1) return 'tip';
    return 'info';
  }

  // ── Syntax Highlighting ──────────────────────────────────

  _highlight(code, lang) {
    var escaped = this._esc(code);
    if (lang === 'sql') return this._hlSQL(escaped);
    if (lang === 'java') return this._hlJava(escaped);
    if (lang === 'python') return this._hlPython(escaped);
    if (lang === 'c') return this._hlC(escaped);
    return escaped;
  }

  _hlSQL(code) {
    var KW = new Set([
      'SELECT','FROM','WHERE','AND','OR','NOT','IN','EXISTS','INSERT','INTO',
      'VALUES','UPDATE','SET','DELETE','CREATE','ALTER','DROP','TABLE','VIEW',
      'INDEX','TRIGGER','FUNCTION','PROCEDURE','RETURN','RETURNS','REPLACE',
      'BEGIN','END','DECLARE','IF','THEN','ELSE','ELSEIF','WHILE','DO',
      'REPEAT','UNTIL','FOR','LOOP','AS','IS','ON','WHEN','CASE','AFTER',
      'BEFORE','PRIMARY','KEY','FOREIGN','REFERENCES','CHECK','UNIQUE',
      'GROUP','BY','ORDER','HAVING','BETWEEN','LIKE','DISTINCT','JOIN',
      'INNER','LEFT','RIGHT','FULL','OUTER','NATURAL','USING','CROSS',
      'UNION','INTERSECT','EXCEPT','ALL','WITH','RECURSIVE','OVER',
      'PARTITION','ROWS','PRECEDING','FOLLOWING','UNBOUNDED','CURRENT',
      'ROLLUP','CUBE','GROUPING','SETS','PIVOT','GRANT','REVOKE','TO',
      'ROLE','NULL','DEFAULT','DESC','ASC','CASCADE','COMMIT','ROLLBACK',
      'REFERENCING','NEW','OLD','ROW','EACH','SIGNAL','HANDLER','EXIT',
      'CONDITION','ATOMIC','CALL','SOME','ANY','START','CONNECT','PRIOR',
      'LANGUAGE','EXTERNAL','NAME','TYPE','OF','INSTEAD','RAISE_APPLICATION_ERROR',
      'INTO','INSTEAD','OR'
    ]);
    var FN = new Set([
      'VARCHAR','INTEGER','INT','NUMERIC','NUMBER','REAL','FLOAT','CHAR',
      'DATE','TIME','TIMESTAMP','BOOLEAN','AVG','SUM','COUNT','MIN','MAX',
      'COALESCE','CAST','RANK','DENSE_RANK','ROW_NUMBER','NTILE',
      'PERCENT_RANK','CUME_DIST'
    ]);
    return this._tokenize(code, KW, FN, '--');
  }

  _hlJava(code) {
    var KW = new Set([
      'public','private','protected','static','void','class','import','try',
      'catch','finally','new','return','if','else','while','for','int','float',
      'double','String','boolean','throws','throw','extends','implements',
      'interface','package','final','abstract','null','true','false'
    ]);
    var FN = new Set([
      'System','Connection','Statement','PreparedStatement','ResultSet',
      'ResultSetMetaData','DatabaseMetaData','DriverManager','SQLException',
      'Exception','println','getConnection','createStatement','executeQuery',
      'executeUpdate','prepareStatement','next','getString','getFloat',
      'getInt','setString','setInt','setAutoCommit','commit','rollback',
      'getMetaData','getColumnCount','getColumnName','getColumnTypeName',
      'getColumns','close','out'
    ]);
    return this._tokenize(code, KW, FN, '//');
  }

  _hlPython(code) {
    var KW = new Set([
      'import','from','def','class','if','elif','else','for','while','try',
      'except','finally','return','with','as','in','not','and','or','True',
      'False','None','raise','pass','break','continue','lambda','is'
    ]);
    var FN = new Set([
      'print','connect','cursor','execute','commit','rollback','fetchall',
      'fetchone','close','format','len','range','str','int','float'
    ]);
    return this._tokenize(code, KW, FN, '#');
  }

  _hlC(code) {
    var KW = new Set([
      'void','int','float','double','char','long','short','return','if',
      'else','while','for','do','switch','case','break','continue',
      'typedef','struct','enum','const','static','extern','sizeof'
    ]);
    var FN = new Set([
      'printf','scanf','malloc','free','strlen','strcmp','strcpy',
      'SQLAllocEnv','SQLAllocConnect','SQLConnect','SQLAllocStmt',
      'SQLExecDirect','SQLBindCol','SQLFetch','SQLFreeStmt','SQLDisconnect',
      'SQLFreeConnect','SQLFreeEnv','HENV','HDBC','HSTMT','RETCODE',
      'SQL_NTS','SQL_SUCCESS','SQL_C_CHAR','SQL_C_FLOAT','SQL_DROP'
    ]);
    return this._tokenize(code, KW, FN, '//');
  }

  /**
   * Tokenizador genérico de resaltado de sintaxis.
   * Procesa carácter por carácter para evitar errores de anidamiento de spans.
   */
  _tokenize(code, keywords, functions, commentStart) {
    var lines = code.split('\n');
    var result = [];

    for (var li = 0; li < lines.length; li++) {
      var line = lines[li];
      var out = '';
      var i = 0;

      while (i < line.length) {
        // ── Comentario de línea
        if (commentStart === '--' && line[i] === '-' && line[i + 1] === '-') {
          out += '<span class="cm">' + line.substring(i) + '</span>';
          i = line.length;
          continue;
        }
        if (commentStart === '//' && line[i] === '/' && line[i + 1] === '/') {
          out += '<span class="cm">' + line.substring(i) + '</span>';
          i = line.length;
          continue;
        }
        if (commentStart === '#' && line[i] === '#') {
          out += '<span class="cm">' + line.substring(i) + '</span>';
          i = line.length;
          continue;
        }

        // ── Comentario bloque /* ... */
        if (line[i] === '/' && line[i + 1] === '*') {
          var endC = line.indexOf('*/', i + 2);
          var endIdx = endC !== -1 ? endC + 2 : line.length;
          out += '<span class="cm">' + line.substring(i, endIdx) + '</span>';
          i = endIdx;
          continue;
        }

        // ── String (comilla simple)
        if (line[i] === "'") {
          var j = i + 1;
          while (j < line.length && line[j] !== "'") j++;
          if (j < line.length) j++;
          out += '<span class="str">' + line.substring(i, j) + '</span>';
          i = j;
          continue;
        }

        // ── String (comilla doble)
        if (line[i] === '"') {
          var j2 = i + 1;
          while (j2 < line.length && line[j2] !== '"') {
            if (line[j2] === '\\') j2++;
            j2++;
          }
          if (j2 < line.length) j2++;
          out += '<span class="str">' + line.substring(i, j2) + '</span>';
          i = j2;
          continue;
        }

        // ── Palabra (identificador/keyword)
        if (/[a-zA-Z_]/.test(line[i])) {
          var word = '';
          var start = i;
          while (i < line.length && /[a-zA-Z_0-9%]/.test(line[i])) {
            word += line[i];
            i++;
          }
          var upper = word.toUpperCase();
          if (keywords.has(upper) || keywords.has(word)) {
            out += '<span class="kw">' + word + '</span>';
          } else if (functions.has(upper) || functions.has(word)) {
            out += '<span class="fn">' + word + '</span>';
          } else {
            out += word;
          }
          continue;
        }

        // ── Número
        if (/[0-9]/.test(line[i])) {
          var num = '';
          while (i < line.length && /[0-9.]/.test(line[i])) {
            num += line[i];
            i++;
          }
          out += '<span class="num">' + num + '</span>';
          continue;
        }

        // ── Otro carácter
        out += line[i];
        i++;
      }
      result.push(out);
    }
    return result.join('\n');
  }
}
