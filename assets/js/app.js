(function(){
  const $ = (s, b=document) => b.querySelector(s);
  const $$ = (s, b=document) => Array.from(b.querySelectorAll(s));

  function hasFirebaseConfig(){
    const cfg = window.FIREBASE_CONFIG || {};
    return cfg.apiKey && !String(cfg.apiKey).includes('COLE_AQUI') && cfg.databaseURL;
  }

  function initFirebase(){
    try{
      if(!window.firebase || !hasFirebaseConfig()) return null;
      const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.FIREBASE_CONFIG);
      return firebase.database(app);
    }catch(e){
      console.warn('Firebase indisponível', e);
      return null;
    }
  }

  function saveEvent(name, extra={}){
    const db = initFirebase();
    if(!db) return;
    db.ref('events').push({name, extra, at:new Date().toISOString(), page:location.pathname}).catch(()=>{});
  }

  function bindArButtons(){
    const viewer = $('#viewer3d');
    const openAr = $('#openArBtn');
    if(openAr && viewer){
      openAr.addEventListener('click', async () => {
        saveEvent('open_ar_click');
        try{
          if(typeof viewer.activateAR === 'function') await viewer.activateAR();
        }catch(e){
          const slotBtn = viewer.querySelector('[slot="ar-button"]');
          if(slotBtn) slotBtn.click();
        }
      });
    }
    const view3d = $('#view3dBtn');
    if(view3d){
      view3d.addEventListener('click', () => {
        saveEvent('view_3d_click');
        document.getElementById('demo3d')?.scrollIntoView({behavior:'smooth', block:'start'});
      });
    }
  }

  function bindLeadForm(){
    const form = $('#leadForm');
    const status = $('#leadStatus');
    if(!form) return;
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      data.at = new Date().toISOString();
      const db = initFirebase();
      if(db){
        try{ await db.ref('leads').push(data); } catch(err){ console.warn(err); }
      }
      if(status) status.textContent = 'Solicitação registrada. Entraremos em contato.';
      form.reset();
    });
  }

  function bindShare(){
    const btn = $('#shareBtn');
    if(!btn) return;
    btn.addEventListener('click', async()=>{
      saveEvent('share_click');
      const payload = {title:document.title, text:'Demonstração AR técnica', url:location.href};
      if(navigator.share){
        await navigator.share(payload).catch(()=>{});
      }else{
        await navigator.clipboard.writeText(location.href).catch(()=>{});
        btn.textContent = 'Link copiado';
        setTimeout(()=>btn.textContent='Compartilhar demo',1600);
      }
    });
  }

  function bindVideos(){
    $$('.video-card').forEach(card=>{
      const video = $('video', card);
      if(!video) return;
      video.addEventListener('loadeddata',()=>card.classList.add('ready'));
      video.addEventListener('error',()=>card.classList.remove('ready'));
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    bindArButtons(); bindLeadForm(); bindShare(); bindVideos(); saveEvent('page_view');
  });
})();
