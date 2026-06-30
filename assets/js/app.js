(function(){
  const data = window.SITE_DATA;
  const $ = (sel,base=document)=>base.querySelector(sel);
  const $$ = (sel,base=document)=>Array.from(base.querySelectorAll(sel));

  function fillText(){
    $('#productCode').textContent = data.product.code;
    $('#heroTitle').innerHTML = `${data.product.title} <span class="highlight">${data.product.code}</span>`;
    $('#heroSubtitle').textContent = data.product.subtitle;
    $('#heroImage').src = data.product.heroImage;
    $('#viewerPosterImage').src = data.product.poster;
    $('#viewerPosterImage').alt = data.product.title;
    $('#mainGalleryImage').src = data.product.gallery[0];
    $('#mainGalleryImage').alt = data.product.title;
    $('#viewerSectionTitle').textContent = `${data.product.title} • ${data.product.code}`;
    $('#appsCount').textContent = `${data.product.applications.length}+ aplicações`;
    $('#specsWrap').innerHTML = data.product.specs.map(item => `<div class="spec-pill">${item}</div>`).join('');
    $('#appsWrap').innerHTML = data.product.applications.map(item => `<span class="app-chip">${item}</span>`).join('');
  }

  function buildGallery(){
    const thumbWrap = $('#thumbGrid');
    thumbWrap.innerHTML = data.product.gallery.map((src,idx)=>`
      <button type="button" class="thumb ${idx===0?'active':''}" data-src="${src}">
        <img src="${src}" alt="Imagem ${idx+1}">
      </button>
    `).join('');
    thumbWrap.addEventListener('click', (e)=>{
      const btn = e.target.closest('.thumb');
      if(!btn) return;
      $$('.thumb', thumbWrap).forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      $('#mainGalleryImage').src = btn.dataset.src;
    });
  }

  function buildViewer(){
    const shell = $('#viewerMount');
    shell.innerHTML = `
      <model-viewer id="productViewer"
        src="${data.product.modelGlb}"
        poster="${data.product.poster}"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        interaction-prompt="auto">
        <button slot="ar-button" class="btn btn-primary only-mobile">Abrir em AR</button>
      </model-viewer>
    `;
    const viewer = $('#productViewer');
    $('#btnOpenAr').addEventListener('click', ()=>{
      if(viewer && viewer.activateAR) viewer.activateAR();
    });
  }

  function buildSlides(){
    let current = 0;
    const modal = $('#trainingModal');
    const image = $('#slideImage');
    const badge = $('#slideBadge');
    const title = $('#slideTitle');
    const text = $('#slideText');
    const dots = $('#slideDots');
    const cardsWrap = $('#trainingCards');

    cardsWrap.innerHTML = data.trainingSlides.slice(0,3).map((slide,idx)=>`
      <article class="card step-card">
        <img src="${slide.image}" alt="${slide.title}">
        <span class="eyebrow">${slide.badge}</span>
        <h3>${slide.title}</h3>
        <p>${slide.text}</p>
      </article>
    `).join('');

    dots.innerHTML = data.trainingSlides.map((_,idx)=>`<span class="${idx===0?'active':''}"></span>`).join('');

    function renderSlide(){
      const slide = data.trainingSlides[current];
      image.src = slide.image;
      badge.textContent = slide.badge;
      title.textContent = slide.title;
      text.textContent = slide.text;
      $$('#slideDots span').forEach((dot,idx)=>dot.classList.toggle('active', idx===current));
    }
    renderSlide();

    $('#btnTraining').addEventListener('click', ()=>modal.classList.add('open'));
    $('#btnTraining2').addEventListener('click', ()=>modal.classList.add('open'));
    $('#closeTraining').addEventListener('click', ()=>modal.classList.remove('open'));
    modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('open'); });
    $('#prevSlide').addEventListener('click', ()=>{ current = (current - 1 + data.trainingSlides.length) % data.trainingSlides.length; renderSlide(); });
    $('#nextSlide').addEventListener('click', ()=>{ current = (current + 1) % data.trainingSlides.length; renderSlide(); });
  }

  function bindScrollButtons(){
    document.querySelectorAll('[data-scroll]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const target = document.getElementById(btn.dataset.scroll);
        if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    fillText();
    buildGallery();
    buildViewer();
    buildSlides();
    bindScrollButtons();
  });
})();
