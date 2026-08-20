/* Regional 17 — Biblioteca: vista previa visual de archivos */
(() => {
  'use strict';
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const client = () => window.supabase.createClient(window.RV_CONFIG.SUPABASE_URL, window.RV_CONFIG.SUPABASE_ANON_KEY);
  const close = () => document.querySelector('.r17-preview-overlay')?.remove();
  const mimeKind = (mime, name='') => {
    const m=(mime||'').toLowerCase(), n=name.toLowerCase();
    if(m.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(n)) return 'image';
    if(m==='application/pdf' || n.endsWith('.pdf')) return 'pdf';
    if(m.startsWith('video/')) return 'video';
    if(m.startsWith('audio/')) return 'audio';
    if(m.startsWith('text/') || /\.(txt|csv|json|md)$/i.test(n)) return 'text';
    return 'other';
  };
  async function preview(id){
    const sb=client();
    const r=await sb.from('library_resources').select('*').eq('id',id).single();
    if(r.error) return;
    const u=await sb.storage.from('library').createSignedUrl(r.data.storage_path,300);
    if(u.error) return;
    const url=u.data.signedUrl, kind=mimeKind(r.data.mime_type,r.data.file_name);
    const o=document.createElement('div'); o.className='overlay r17-preview-overlay';
    let body='';
    if(kind==='image') body=`<div class="r17-preview-media"><img src="${esc(url)}" alt="${esc(r.data.title||r.data.file_name)}"></div>`;
    else if(kind==='pdf') body=`<iframe class="r17-preview-frame" src="${esc(url)}" title="Vista previa de ${esc(r.data.file_name)}"></iframe>`;
    else if(kind==='video') body=`<video class="r17-preview-video" controls autoplay><source src="${esc(url)}" type="${esc(r.data.mime_type||'video/mp4')}"></video>`;
    else if(kind==='audio') body=`<div class="r17-preview-other"><div class="r17-preview-file-icon">🎧</div><audio controls autoplay src="${esc(url)}"></audio></div>`;
    else if(kind==='text') body=`<iframe class="r17-preview-frame r17-text-preview" src="${esc(url)}" title="Vista previa de ${esc(r.data.file_name)}"></iframe>`;
    else body=`<div class="r17-preview-other"><div class="r17-preview-file-icon">📄</div><h3>Vista previa no disponible</h3><p>Este formato puede abrirse o descargarse desde la biblioteca.</p><a class="btn primary" href="${esc(url)}" target="_blank" rel="noopener">Abrir archivo</a></div>`;
    o.innerHTML=`<div class="r17-preview-modal"><header><div><span class="r17-preview-kicker">VISTA PREVIA</span><h3>${esc(r.data.title||r.data.file_name)}</h3><small>${esc(r.data.file_name)}</small></div><div class="r17-preview-actions"><a class="btn secondary small" href="${esc(url)}" target="_blank" rel="noopener">Abrir</a><button class="icon-btn" data-preview-close aria-label="Cerrar">×</button></div></header><main>${body}</main></div>`;
    document.body.appendChild(o);
    o.querySelector('[data-preview-close]').onclick=close;
    o.addEventListener('click',e=>{if(e.target===o)close()});
    document.addEventListener('keydown',function escPreview(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',escPreview)}});
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-file]');
    if(!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    preview(b.dataset.file);
  },true);
  const css=document.createElement('style'); css.textContent=`.r17-preview-overlay{z-index:10000!important;background:rgba(3,14,27,.78)!important;backdrop-filter:blur(7px)}.r17-preview-modal{width:min(1100px,94vw);height:min(82vh,780px);background:#fff;border:1px solid #dfe8ef;border-radius:18px;box-shadow:0 25px 80px rgba(0,0,0,.28);overflow:hidden;display:flex;flex-direction:column}.r17-preview-modal header{min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:12px 16px 12px 20px;border-bottom:1px solid #e4ebf1;background:#fbfdff}.r17-preview-modal header h3{margin:2px 0 1px;color:#173b59;font-size:14px}.r17-preview-modal header small{color:#8291a0;font-size:9px}.r17-preview-kicker{font-size:7px;font-weight:800;letter-spacing:1.4px;color:#b07a1b}.r17-preview-actions{display:flex;align-items:center;gap:7px}.r17-preview-modal main{min-height:0;flex:1;background:#edf2f6;display:flex;align-items:center;justify-content:center;overflow:hidden}.r17-preview-frame{width:100%;height:100%;border:0;background:#fff}.r17-text-preview{padding:10px}.r17-preview-media{width:100%;height:100%;display:grid;place-items:center;padding:25px;overflow:auto}.r17-preview-media img{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.12)}.r17-preview-video{max-width:94%;max-height:94%;border-radius:10px;background:#000;box-shadow:0 10px 35px rgba(0,0,0,.2)}.r17-preview-other{text-align:center;padding:35px;color:#617384}.r17-preview-file-icon{font-size:48px;margin-bottom:8px}.r17-preview-other h3{color:#29465e;margin:4px 0}.r17-preview-other p{font-size:11px;margin:5px 0 17px}.r17-preview-other audio{width:min(480px,80vw)}@media(max-width:650px){.r17-preview-modal{width:96vw;height:88vh;border-radius:14px}.r17-preview-modal header{padding:11px}.r17-preview-modal header h3{font-size:12px}.r17-preview-actions .btn{display:none}}`; document.head.appendChild(css);
})();
