(() => {
  const css = `
    .library-shell{max-width:1250px;margin:auto}
    .library-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
    .library-card{background:#fff;border:1px solid var(--line);border-radius:15px;padding:16px;display:flex;gap:13px;min-height:220px;transition:transform .15s,box-shadow .15s,border-color .15s}
    .library-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px #0d315d12;border-color:#cfd9e6}
    .library-icon{width:48px;height:48px;border-radius:13px;background:#edf4fb;display:grid;place-items:center;font-size:23px;flex:none}
    .library-card h3{font-size:14px;margin:9px 0 6px;color:var(--ink);line-height:1.35}
    .library-card p{font-size:10px;color:var(--muted);line-height:1.55;margin:0 0 9px}
    .library-meta{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .library-meta small,.library-file{font-size:9px;color:var(--muted)}
    .library-tags{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0}
    .library-file{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
    .library-card .card-actions{margin-top:12px;flex-wrap:wrap}
    @media(max-width:1050px){.library-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:700px){.library-grid{grid-template-columns:1fr}.library-card{min-height:0}.library-shell .toolbar{align-items:stretch}.library-shell .toolbar .search{min-width:100%}.library-shell .toolbar select,.library-shell .toolbar button{width:100%}}
  `;
  if (!document.getElementById('r17-library-styles')) {
    const style = document.createElement('style'); style.id='r17-library-styles'; style.textContent=css; document.head.appendChild(style);
  }
})();
