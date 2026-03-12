/**
 * QuizEngine — Lógica interactiva de quizzes reutilizable.
 * Expone funciones globales para usar desde onclick en contenido HTML/Markdown.
 */
(function () {
  'use strict';

  var answered = {};
  var matchState = {};

  function getCardByQuizId(qid) {
    return document.querySelector('[data-quiz="' + qid + '"]');
  }

  function ensureProgressNodes() {
    return {
      pct: document.getElementById('progressPct'),
      fill: document.getElementById('progressFill')
    };
  }

  function updateProgress() {
    var total = document.querySelectorAll('.quiz-card').length;
    var done = Object.keys(answered).length;
    var pct = total > 0 ? Math.round((done / total) * 100) : 0;

    var nodes = ensureProgressNodes();
    if (nodes.pct) nodes.pct.textContent = pct + '%';
    if (nodes.fill) nodes.fill.style.width = pct + '%';
  }

  function calcScore() {
    var total = document.querySelectorAll('.quiz-card').length;
    var correct = Object.values(answered).filter(function (v) { return v === true; }).length;
    var score = document.getElementById('finalScore');
    if (score) score.textContent = correct + ' / ' + total;
  }

  function resetAll() {
    if (!window.confirm('¿Reiniciar todos los ejercicios?')) return;

    Object.keys(answered).forEach(function (k) { delete answered[k]; });
    Object.keys(matchState).forEach(function (k) { delete matchState[k]; });

    document.querySelectorAll('.quiz-opt').forEach(function (o) {
      o.classList.remove('selected', 'correct', 'incorrect');
    });
    document.querySelectorAll('.tf-btn').forEach(function (b) {
      b.classList.remove('selected', 'correct-answer', 'wrong-answer');
    });
    document.querySelectorAll('.quiz-feedback').forEach(function (f) {
      f.className = 'quiz-feedback';
      f.textContent = '';
    });
    document.querySelectorAll('.fill-input').forEach(function (i) {
      i.value = '';
      i.readOnly = false;
      i.classList.remove('correct', 'incorrect');
    });
    document.querySelectorAll('.code-editor').forEach(function (t) {
      t.value = '';
      t.style.borderColor = '';
    });
    document.querySelectorAll('.match-item').forEach(function (i) {
      i.classList.remove('matched', 'wrong', 'selected');
    });

    var score = document.getElementById('finalScore');
    if (score) score.textContent = '—';
    updateProgress();
  }

  function selectOpt(el) {
    var card = el.closest('.quiz-card');
    if (!card) return;

    var qid = card.dataset.quiz;
    if (answered[qid]) return;

    card.querySelectorAll('.quiz-opt').forEach(function (o) { o.classList.remove('selected'); });
    el.classList.add('selected');
  }

  function checkQuiz(qid, correct, correctMsg, wrongMsg) {
    if (answered[qid]) return;

    var card = getCardByQuizId(qid);
    if (!card) return;

    var selected = card.querySelector('.quiz-opt.selected');
    if (!selected) return;

    var fb = document.getElementById('fb-' + qid);
    var val = selected.dataset.val;

    answered[qid] = val === correct;
    if (val === correct) {
      selected.classList.add('correct');
      if (fb) {
        fb.className = 'quiz-feedback show correct';
        fb.textContent = '✓ ' + correctMsg;
      }
    } else {
      selected.classList.add('incorrect');
      var correctEl = card.querySelector('.quiz-opt[data-val="' + correct + '"]');
      if (correctEl) correctEl.classList.add('correct');
      if (fb) {
        fb.className = 'quiz-feedback show incorrect';
        fb.textContent = '✗ ' + wrongMsg;
      }
    }

    updateProgress();
  }

  function selectTF(el, qid) {
    if (answered[qid]) return;

    var card = el.closest('.quiz-card');
    if (!card) return;

    card.querySelectorAll('.tf-btn').forEach(function (b) { b.classList.remove('selected'); });
    el.classList.add('selected');
  }

  function checkTF(qid, correct, correctMsg, wrongMsg) {
    if (answered[qid]) return;

    var card = getCardByQuizId(qid);
    if (!card) return;

    var selected = card.querySelector('.tf-btn.selected');
    if (!selected) return;

    var val = selected.dataset.val;
    answered[qid] = val === correct;

    var fb = document.getElementById('fb-' + qid);
    card.querySelectorAll('.tf-btn').forEach(function (b) {
      if (b.dataset.val === correct) b.classList.add('correct-answer');
      else if (b.classList.contains('selected') && b.dataset.val !== correct) b.classList.add('wrong-answer');
    });

    if (fb) {
      if (val === correct) {
        fb.className = 'quiz-feedback show correct';
        fb.textContent = '✓ ' + correctMsg;
      } else {
        fb.className = 'quiz-feedback show incorrect';
        fb.textContent = '✗ ' + wrongMsg;
      }
    }

    updateProgress();
  }

  function checkFill(qid, inputIds) {
    if (answered[qid]) return;

    var allCorrect = true;
    inputIds.forEach(function (iid) {
      var inp = document.getElementById(iid);
      if (!inp) return;

      var answer = inp.dataset.answer || '';
      var val = inp.value.trim().toUpperCase();
      if (val === answer.toUpperCase()) {
        inp.classList.add('correct');
        inp.classList.remove('incorrect');
      } else {
        inp.classList.add('incorrect');
        inp.classList.remove('correct');
        allCorrect = false;
      }
      inp.readOnly = true;
    });

    answered[qid] = allCorrect;
    var fb = document.getElementById('fb-' + qid);

    if (fb) {
      if (allCorrect) {
        fb.className = 'quiz-feedback show correct';
        fb.textContent = '✓ ¡Todas las respuestas son correctas!';
      } else {
        fb.className = 'quiz-feedback show incorrect';
        fb.textContent = '✗ Algunas respuestas son incorrectas. Las respuestas correctas se muestran en verde.';
      }
    }

    if (!allCorrect) {
      inputIds.forEach(function (iid) {
        var inp = document.getElementById(iid);
        if (!inp) return;
        if (inp.classList.contains('incorrect')) {
          inp.value = inp.dataset.answer;
          inp.classList.remove('incorrect');
          inp.classList.add('correct');
        }
      });
    }

    updateProgress();
  }

  function checkSQL(qid, keywords) {
    if (answered[qid]) return;

    var textarea = document.getElementById(qid);
    if (!textarea) return;

    var val = textarea.value.trim().toLowerCase().replace(/\s+/g, ' ');
    var fb = document.getElementById('fb-' + qid);

    if (!val) {
      if (fb) {
        fb.className = 'quiz-feedback show incorrect';
        fb.textContent = '✗ Escribe tu consulta antes de verificar.';
      }
      return;
    }

    var matchCount = 0;
    keywords.forEach(function (kw) {
      var alternatives = kw.split('|');
      if (alternatives.some(function (alt) { return val.indexOf(alt.toLowerCase()) !== -1; })) {
        matchCount++;
      }
    });

    var ratio = keywords.length > 0 ? (matchCount / keywords.length) : 0;
    if (fb) {
      if (ratio >= 0.8) {
        answered[qid] = true;
        fb.className = 'quiz-feedback show correct';
        fb.textContent = '✓ ¡Excelente! Tu consulta contiene los elementos clave correctos.';
        textarea.style.borderColor = 'var(--green)';
      } else if (ratio >= 0.5) {
        fb.className = 'quiz-feedback show incorrect';
        fb.textContent = '✗ Tu consulta está parcialmente correcta, pero le faltan elementos clave. Revisa la respuesta modelo.';
      } else {
        fb.className = 'quiz-feedback show incorrect';
        fb.textContent = '✗ Tu consulta no parece correcta. Revisa la respuesta modelo haciendo clic en "Ver respuesta".';
      }
    }

    updateProgress();
  }

  function showAnswer(qid, answer) {
    var fb = document.getElementById('fb-' + qid);
    if (!fb) return;

    fb.className = 'quiz-feedback show correct';
    fb.innerHTML = '<strong>Respuesta modelo:</strong><pre style="margin:8px 0 0;background:transparent;border:none;padding:0;color:inherit">' + answer.replace(/</g, '&lt;') + '</pre>';
    answered[qid] = answered[qid] || false;
    updateProgress();
  }

  function selectMatch(el, exId) {
    if (!matchState[exId]) matchState[exId] = { left: null, right: null, pairs: [] };

    var side = el.dataset.match;
    var st = matchState[exId];

    if (el.classList.contains('matched')) return;

    var container = el.closest('.match-col');
    if (container) {
      container.querySelectorAll('.match-item').forEach(function (i) {
        if (!i.classList.contains('matched')) i.classList.remove('selected');
      });
    }

    el.classList.add('selected');
    st[side] = el;

    if (st.left && st.right) {
      st.pairs.push({ left: st.left, right: st.right });
      st.left.classList.remove('selected');
      st.right.classList.remove('selected');
      st.left.classList.add('matched');
      st.right.classList.add('matched');
      st.left = null;
      st.right = null;
    }
  }

  function checkMatch(exId) {
    var qid = exId;
    if (answered[qid]) return;

    var st = matchState[exId];
    if (!st) return;

    var fb = document.getElementById('fb-' + qid);
    var container = document.getElementById(exId);
    if (!container) return;

    var matchedItems = container.querySelectorAll('.match-item.matched');
    if (matchedItems.length === 0) {
      if (fb) {
        fb.className = 'quiz-feedback show incorrect';
        fb.textContent = '✗ Empareja elementos seleccionando uno de cada columna.';
      }
      return;
    }

    var allCorrect = true;
    st.pairs.forEach(function (p) {
      if (p.left.dataset.pair === p.right.dataset.pair) {
        p.left.classList.add('matched');
        p.right.classList.add('matched');
        p.left.classList.remove('wrong');
        p.right.classList.remove('wrong');
      } else {
        p.left.classList.add('wrong');
        p.right.classList.add('wrong');
        allCorrect = false;
      }
    });

    var leftItems = container.querySelectorAll('[data-match="left"]');
    if (st.pairs.length < leftItems.length) allCorrect = false;

    answered[qid] = allCorrect;
    if (fb) {
      if (allCorrect) {
        fb.className = 'quiz-feedback show correct';
        fb.textContent = '✓ ¡Todas las parejas son correctas!';
      } else {
        fb.className = 'quiz-feedback show incorrect';
        fb.textContent = '✗ Algunas parejas son incorrectas. Reinicia e inténtalo de nuevo.';
      }
    }

    updateProgress();
  }

  function resetMatch(exId) {
    var qid = exId;
    delete answered[qid];
    delete matchState[exId];

    var container = document.getElementById(exId);
    if (!container) return;

    container.querySelectorAll('.match-item').forEach(function (i) {
      i.classList.remove('matched', 'wrong', 'selected');
    });

    var fb = document.getElementById('fb-' + qid);
    if (fb) {
      fb.className = 'quiz-feedback';
      fb.textContent = '';
    }

    updateProgress();
  }

  function bootstrap() {
    updateProgress();
  }

  window.selectOpt = selectOpt;
  window.checkQuiz = checkQuiz;
  window.selectTF = selectTF;
  window.checkTF = checkTF;
  window.checkFill = checkFill;
  window.checkSQL = checkSQL;
  window.showAnswer = showAnswer;
  window.selectMatch = selectMatch;
  window.checkMatch = checkMatch;
  window.resetMatch = resetMatch;
  window.calcScore = calcScore;
  window.resetAll = resetAll;

  window.QuizEngine = {
    bootstrap: bootstrap,
    updateProgress: updateProgress,
    resetAll: resetAll,
    calcScore: calcScore
  };
})();