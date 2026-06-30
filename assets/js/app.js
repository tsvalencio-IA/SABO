(function(){
  'use strict';
  const data = window.SITE_DATA || {};
  const produto = data.produto || {};
  const $ = (s, b=document) => b.querySelector(s);
  const $$ = (s, b=document) => Array.from(b.querySelectorAll(s));

  function setText(sel, value){ const el=$(sel); if(el) el.textContent = value || ''; }
  function setHTML(sel, value){ const el=$(sel); if(el) el.innerHTML = value || ''; }
  function setSrc(sel, value, alt){ const el=$(sel); if(el && value){ el.src=value; if(alt) el.alt=alt; } }
  function scrollToId(id){ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }

  function renderIntro(){
    setText('#codigoProduto', produto.codigo);
    setHTML('#tituloHero', `${produto.titulo || ''} <span>${produto.codigo || ''}</span>`);
    setText('#chamadaHero', produto.chamada);
    setSrc('#imagemHero', produto.destaque, produto.titulo);
    setText('#tituloViewer', `${produto.titulo || ''} • ${produto.codigo || ''}`);
    setText('#contadorAplicacoes', `${(produto.aplicacoes || []).length}+ aplicações`);
    setHTML('#pontosComerciais', (produto.pontos || []).map(p => `
      <article class="metric-card">
        <strong>${p.titulo}</strong>
        <span>${p.texto}</span>
      </article>
    `).join(''));
    setHTML('#listaSpecs', (produto.especificacoes || []).map(x => `<span>${x}</span>`).join(''));
    setHTML('#listaAplicacoes', (produto.aplicacoes || []).map(x => `<span>${x}</span>`).join(''));
  }

  function renderViewer(){
    const mount = $('#viewerMount');
    if(!mount) return;
    mount.innerHTML = `
      <model-viewer id="viewer3dModel"
        src="${produto.modelo}"
        poster="${produto.poster}"
        alt="${produto.titulo} ${produto.codigo}"
        ar
        ar-modes="scene-viewer webxr quick-look"
        ar-placement="floor"
        ar-scale="fixed"
        camera-controls
        auto-rotate
        auto-rotate-delay="900"
        rotation-per-second="22deg"
        camera-orbit="0deg 90deg 1.55m"
        field-of-view="32deg"
        min-field-of-view="18deg"
        max-field-of-view="55deg"
        shadow-intensity="1"
        exposure="1.05"
        reveal="auto"
        loading="eager"
        interaction-prompt="auto">
        <button slot="ar-button" class="ar-slot-button">Abrir em AR</button>
      </model-viewer>
    `;

    const viewer = $('#viewer3dModel');
    const status = $('#viewerStatus');
    if(viewer){
      viewer.addEventListener('load', () => { if(status) status.textContent = '3D carregado'; });
      viewer.addEventListener('error', () => { if(status) status.textContent = 'Não foi possível carregar a peça em 3D.'; });
    }
  }

  function openAR(){
    const viewer = $('#viewer3dModel');
    scrollToId('peca3d');
    setTimeout(() => {
      try{
        if(viewer && typeof viewer.activateAR === 'function') viewer.activateAR();
      }catch(e){ console.warn(e); }
    }, 450);
  }

  function renderTreinamento(){
    const cards = $('#cardsTreinamento');
    if(cards){
      cards.innerHTML = (data.treinamento || []).map((item, idx) => `
        <article class="training-card" data-slide="${idx}">
          <img src="${item.imagem}" alt="${item.titulo}">
          <div><small>${item.subtitulo}</small><strong>${item.titulo}</strong><p>${item.texto}</p></div>
        </article>
      `).join('');
    }

    const videos = $('#videosTreinamento');
    if(videos){
      videos.innerHTML = (data.videos || []).map(v => `
        <article class="video-card">
          <video controls playsinline preload="metadata">
            <source src="${v.arquivo}" type="video/mp4">
          </video>
          <strong>${v.titulo}</strong>
        </article>
      `).join('');
    }
  }

  function renderGaleria(){
    const principal = $('#imagemGaleriaPrincipal');
    const thumbs = $('#thumbsGaleria');
    const imagens = produto.galeria || [];
    if(principal && imagens[0]) principal.src = imagens[0];
    if(thumbs){
      thumbs.innerHTML = imagens.map((src, idx) => `
        <button class="thumb ${idx===0?'active':''}" data-src="${src}" type="button"><img src="${src}" alt="Imagem ${idx+1}"></button>
      `).join('');
      thumbs.addEventListener('click', (e) => {
        const btn = e.target.closest('.thumb');
        if(!btn || !principal) return;
        $$('.thumb', thumbs).forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        principal.src = btn.dataset.src;
      });
    }
  }

  function bindClicks(){
    $$('[data-go]').forEach(btn => btn.addEventListener('click', () => scrollToId(btn.dataset.go)));
    const arBtns = ['#btnArHero','#btnArViewer'];
    arBtns.forEach(sel => { const el=$(sel); if(el) el.addEventListener('click', openAR); });
    const treino = $('#btnTreinoHero');
    if(treino) treino.addEventListener('click', () => scrollToId('treinamento'));
    const treino2 = $('#btnTreinoViewer');
    if(treino2) treino2.addEventListener('click', () => scrollToId('treinamento'));
    const playFirst = $('#btnPlayTreino');
    if(playFirst) playFirst.addEventListener('click', () => {
      scrollToId('videos');
      const v = document.querySelector('#videos video');
      if(v) setTimeout(()=>v.play().catch(()=>{}), 500);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderIntro();
    renderViewer();
    renderTreinamento();
    renderGaleria();
    bindClicks();
  });
})();
