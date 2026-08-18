/* Regional 17 · Dashboard del Sistema de Evaluación */
(() => {
  'use strict';

  const ID = 'rv-evaluation-dashboard';
  const STYLE_ID = 'rv-evaluation-dashboard-style';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rv-eval-shell{position:fixed;inset:0;z-index:10050;background:rgba(7,27,53,.48);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:18px}
      .rv-eval-window{width:min(1080px,100%);max-height:min(760px,94vh);overflow:auto;background:#f7f9fc;border:1px solid #dfe6f0;border-radius:20px;box-shadow:0 24px 70px rgba(7,27,53,.25)}
      .rv-eval-head{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;gap:16px;align-items:center;padding:22px 24px;background:#fff;border-bottom:1px solid #e7edf5}
      .rv-eval-kicker{margin:0 0 5px;color:#2463c7;font-size:10px;font-weight:800;letter-spacing:.11em;text-transform:uppercase}
      .rv-eval-head h2{margin:0;color:#102a54;font-size:21px}
      .rv-eval-head p{margin:5px 0 0;color:#718096;font-size:12px}
      .rv-eval-close{width:36px;height:36px;border:1px solid #dfe6f0;background:#fff;border-radius:10px;cursor:pointer;font-size:21px;color:#64748b}
      .rv-eval-body{padding:22px 24px 26px}
      .rv-eval-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:20px}
      .rv-eval-stat{padding:15px;background:#fff;border:1px solid #e1e8f2;border-radius:14px}
      .rv-eval-stat span{display:block;color:#7a879b;font-size:11px}.rv-eval-stat strong{display:block;margin-top:5px;color:#142d55;font-size:24px}
      .rv-eval-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
      .rv-eval-module{display:flex;align-items:flex-start;gap:14px;padding:17px;background:#fff;border:1px solid #e1e8f2;border-radius:15px;cursor:pointer;text-align:left;transition:transform .16s,box-shadow .16s,border-color .16s}
      .rv-eval-module:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(7,27,53,.08);border-color:#c9d8ef}
      .rv-eval-icon{width:44px;height:44px;flex:0 0 44px;display:grid;place-items:center;border-radius:12px;background:#eaf2ff;color:#1858c7;font-weight:900;font-size:18px}
      .rv-eval-module strong{display:block;color:#172b4d;font-size:14px}.rv-eval-module p{margin:5px 0 0;color:#718096;font-size:11px;line-height:1.4}.rv-eval-module em{display:block;margin-top:8px;color:#2463c7;font-size:10px;font-style:normal;font-weight:700}
      .rv-eval-template{margin-top:20px;padding:18px;background:#fff;border:1px solid #e1e8f2;border-radius:15px}.rv-eval-template h3{margin:0;color:#172b4d;font-size:14px}.rv-eval-template p{margin:5px 0 14px;color:#718096;font-size:11px}
      .rv-eval-criteria{display:grid;grid-template-columns:1fr auto;gap:8px 18px;font-size:11px}.rv-eval-criteria div{padding:7px 0;border-bottom:1px solid #edf1f6}.rv-eval-criteria b{text-align:right;color:#2463c7}
      @media(max-width:760px){.rv-eval-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.rv-eval-grid{grid-template-columns:1fr}.rv-eval-head,.rv-eval-body{padding:16px}.rv-eval-head h2{font-size:18px}}
    `;
    document.head.appendChild(style);
  }

  function close() {
    document.getElementById(ID)?.remove();
  }

  function open() {
    close();
    injectStyles();
    const overlay = document.createElement('div');
    overlay.id = ID;
    overlay.className = 'rv-eval-shell';
    overlay.innerHTML = `
      <section class="rv-eval-window" role="dialog" aria-modal="true" aria-labelledby="rv-eval-title">
        <header class="rv-eval-head">
          <div><div class="rv-eval-kicker">Sistemas PLERD · Regional 17</div><h2 id="rv-eval-title">Sistema de Evaluación Regional 17</h2><p>Centro de gestión para evaluaciones, participantes, evaluadores y resultados.</p></div>
          <button class="rv-eval-close" type="button" aria-label="Cerrar">×</button>
        </header>
        <div class="rv-eval-body">
          <div class="rv-eval-stats">
            <div class="rv-eval-stat"><span>Evaluaciones activas</span><strong>—</strong></div>
            <div class="rv-eval-stat"><span>Participantes</span><strong>—</strong></div>
            <div class="rv-eval-stat"><span>Evaluadores</span><strong>—</strong></div>
            <div class="rv-eval-stat"><span>Evaluaciones realizadas</span><strong>—</strong></div>
          </div>
          <div class="rv-eval-grid">
            <button class="rv-eval-module" type="button" data-module="evaluaciones"><span class="rv-eval-icon">▣</span><span><strong>Evaluaciones</strong><p>Crear, activar, cerrar y consultar procesos de evaluación.</p><em>Próximo módulo →</em></span></button>
            <button class="rv-eval-module" type="button" data-module="plantillas"><span class="rv-eval-icon">◫</span><span><strong>Plantillas y criterios</strong><p>Diseñar categorías, criterios y puntuaciones sin modificar el código.</p><em>Plantilla inicial: 100 puntos →</em></span></button>
            <button class="rv-eval-module" type="button" data-module="comisiones"><span class="rv-eval-icon">⌂</span><span><strong>Comisiones</strong><p>Organizar las comisiones de cada modelo y sus participantes.</p><em>Próximo módulo →</em></span></button>
            <button class="rv-eval-module" type="button" data-module="participantes"><span class="rv-eval-icon">♙</span><span><strong>Participantes</strong><p>Consultar delegaciones, participantes y estado de evaluación.</p><em>Próximo módulo →</em></span></button>
            <button class="rv-eval-module" type="button" data-module="evaluadores"><span class="rv-eval-icon">✓</span><span><strong>Evaluadores</strong><p>Gestionar evaluadores y sus permisos dentro del sistema.</p><em>Próximo módulo →</em></span></button>
            <button class="rv-eval-module" type="button" data-module="asignaciones"><span class="rv-eval-icon">↔</span><span><strong>Asignaciones</strong><p>Asignar evaluadores a comisiones y participantes.</p><em>Próximo módulo →</em></span></button>
            <button class="rv-eval-module" type="button" data-module="resultados"><span class="rv-eval-icon">↗</span><span><strong>Resultados y ranking</strong><p>Consolidar puntuaciones, promedios y posiciones finales.</p><em>Próximo módulo →</em></span></button>
            <button class="rv-eval-module" type="button" data-module="nueva"><span class="rv-eval-icon">+</span><span><strong>Nueva evaluación</strong><p>Crear una evaluación personalizada con sus propios criterios.</p><em>Constructor dinámico →</em></span></button>
          </div>
          <section class="rv-eval-template">
            <h3>Plantilla inicial · MINUME XVIII — Regional 17</h3>
            <p>La primera plantilla oficial queda preparada con una puntuación máxima de 100 puntos.</p>
            <div class="rv-eval-criteria">
              <div>Investigación y análisis crítico</div><b>30 pts</b>
              <div>Comunicación y lenguaje</div><b>30 pts</b>
              <div>Negociación y resolución de conflictos</div><b>20 pts</b>
              <div>Liderazgo y colaboración</div><b>20 pts</b>
            </div>
          </section>
        </div>
      </section>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.rv-eval-close').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelectorAll('[data-module]').forEach(btn => btn.addEventListener('click', () => {
      const name = btn.querySelector('strong')?.textContent || 'Módulo';
      const toast = document.createElement('div');
      toast.className = 'toast info';
      toast.textContent = `${name}: este módulo se habilitará en la siguiente etapa.`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2600);
    }));
  }

  window.addEventListener('rv-open-evaluation', open);
  window.RV_EVALUATION_DASHBOARD = { open, close };
})();
