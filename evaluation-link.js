(() => {
  'use strict';

  const EVALUATION_URL = 'https://plerd-evaluacion-scoreboard-five.vercel.app/';
  const BUTTON_ID = 'evaluation-project-link';
  const STYLE_ID = 'evaluation-style-loader';

  function loadEvaluationStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('link');
    style.id = STYLE_ID;
    style.rel = 'stylesheet';
    style.href = 'evaluation-style.css?v=1';
    document.head.appendChild(style);
  }

  function addEvaluationLink() {
    loadEvaluationStyle();
    const nav = document.querySelector('.sidebar nav');
    if (!nav || document.getElementById(BUTTON_ID)) return;

    const link = document.createElement('a');
    link.id = BUTTON_ID;
    link.className = 'nav-item';
    link.href = EVALUATION_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = '<span>★</span>Evaluación';
    link.title = 'Abrir proyecto de evaluación';

    nav.appendChild(link);
  }

  const observer = new MutationObserver(addEvaluationLink);
  observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
  addEvaluationLink();
})();
