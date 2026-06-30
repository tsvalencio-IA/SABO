(function () {
  function $(sel, base = document) { return base.querySelector(sel); }
  function $all(sel, base = document) { return Array.from(base.querySelectorAll(sel)); }
  function params() { return new URLSearchParams(location.search); }
  function getCodigo() { return params().get('codigo') || '05801'; }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  function safeUrl(url) {
    return String(url || '').trim();
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html || '';
  }

  function renderBadges(items) {
    return (items || []).map(item => `<span class="badge">${escapeHtml(item)}</span>`).join('');
  }

  function renderPassos(items) {
    return (items || []).map(item => `
      <article class="step-card">
        <h3>${escapeHtml(item.titulo)}</h3>
        <p>${escapeHtml(item.descricao)}</p>
      </article>
    `).join('');
  }

  function renderFaq(items) {
    return (items || []).map(item => `
      <details class="faq-item">
        <summary>${escapeHtml(item.pergunta)}</summary>
        <p>${escapeHtml(item.resposta)}</p>
      </details>
    `).join('');
  }

  function renderSpecs(obj) {
    return Object.entries(obj || {}).map(([key, value]) => `
      <div class="spec-row">
        <div class="spec-key">${escapeHtml(formatKey(key))}</div>
        <div class="spec-value">${escapeHtml(value)}</div>
      </div>
    `).join('');
  }

  function formatKey(key) {
    return key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, s => s.toUpperCase());
  }

  function fillGallery(images) {
    const hero = $('#galleryHero');
    const thumbs = $('#galleryThumbs');
    if (!hero || !thumbs || !images?.length) return;
    hero.src = images[0];
    hero.alt = 'Imagem do produto';
    thumbs.innerHTML = images.map((src, idx) => `
      <button class="thumb-btn ${idx === 0 ? 'active' : ''}" data-src="${escapeHtml(src)}" type="button">
        <img src="${escapeHtml(src)}" alt="Miniatura ${idx + 1}">
      </button>
    `).join('');
    thumbs.addEventListener('click', (e) => {
      const btn = e.target.closest('.thumb-btn');
      if (!btn) return;
      $all('.thumb-btn', thumbs).forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      hero.src = btn.dataset.src;
    });
  }

  function mountLinks(produto) {
    const codigo = encodeURIComponent(produto.codigo);
    document.querySelectorAll('[data-role="ar-link"]').forEach(el => el.href = `ar.html?codigo=${codigo}`);
    document.querySelectorAll('[data-role="assist-link"]').forEach(el => el.href = `assistente.html?codigo=${codigo}`);
    const quickAr = $('#quickArLink');
    const quickProd = $('#quickProdutoLink');
    if (quickAr) quickAr.href = `ar.html?codigo=${codigo}`;
    if (quickProd) quickProd.href = `produto.html?codigo=${codigo}`;
  }

  function renderProduto(produto) {
    setText('produtoNome', produto.nome);
    setText('produtoSubtitulo', produto.subtitulo || '');
    setText('produtoCodigo', `Código: ${produto.codigo}`);
    setText('produtoAlerta', produto.alerta || '');
    setText('descricaoCurta', produto.descricaoCurta || '');
    setText('descricaoLonga', produto.descricaoLonga || '');
    setText('aplicacoesDetalhadas', produto.aplicacoesDetalhadasTexto || '');

    setHtml('aplicacoesResumo', renderBadges(produto.aplicacoesResumo));
    setHtml('passosInstalacao', renderPassos(produto.passos));
    setHtml('errosComuns', (produto.errosComuns || []).map(x => `<li>${escapeHtml(x)}</li>`).join(''));
    setHtml('faqList', renderFaq(produto.faq));
    setHtml('specsList', renderSpecs(produto.tecnicas));

    fillGallery(produto.galeria || [produto.heroImage].filter(Boolean));
    mountLinks(produto);
  }

  function renderAr(produto) {
    setText('arTitulo', produto.nome);
    setText('arSubtitulo', produto.alerta || '');
    const shell = $('#arShell');
    const poster = safeUrl(produto.posterImage || produto.heroImage);
    const glb = safeUrl(produto.modelGlbUrl);
    const usdz = safeUrl(produto.modelUsdzUrl);

    if (!shell) return;

    if (glb) {
      shell.innerHTML = `
        <model-viewer
          src="${escapeHtml(glb)}"
          ios-src="${escapeHtml(usdz)}"
          poster="${escapeHtml(poster)}"
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          exposure="1"
          touch-action="pan-y"
          style="width:100%;height:560px;background:#fff;border-radius:24px;">
          <button slot="ar-button" class="primary-btn">Abrir em realidade aumentada</button>
        </model-viewer>
      `;
    } else {
      shell.innerHTML = `
        <div class="placeholder-3d">
          <img src="${escapeHtml(poster)}" alt="Poster do produto">
          <div>
            <h3>Modelo 3D placeholder</h3>
            <p>Substitua os campos <strong>modelGlbUrl</strong> e <strong>modelUsdzUrl</strong> no produto 05801 assim que você tiver os arquivos 3D finais.</p>
            <p>Arquivos esperados no projeto: <code>/assets/modelos/sabo-05801.glb</code> e <code>/assets/modelos/sabo-05801.usdz</code>.</p>
          </div>
        </div>
      `;
    }

    setHtml('arPassos', renderPassos(produto.passos));
  }

  function renderAssistente(produto) {
    setText('assistenteTitulo', produto.nome);
    setText('assistenteAlerta', produto.alerta || '');
    setHtml('assistenteFaq', renderFaq(produto.faq));

    const askForm = document.getElementById('askForm');
    const answerBox = document.getElementById('assistantAnswer');
    if (askForm && answerBox) {
      askForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = document.getElementById('userQuestion').value.trim().toLowerCase();
        let answer = 'Use o catálogo oficial e a lista de aplicação para confirmar a peça. Em caso de dúvida, mantenha a luva plástica até o final da instalação e revise o passo a passo desta página.';

        if (q.includes('luva')) answer = 'A luva plástica é guia de instalação. Não retire antes de montar.';
        else if (q.includes('sensor')) answer = 'Pelas informações enviadas, este retentor não inclui sensor e serve apenas para sensor quadrado com leitura da roda fônica dentada.';
        else if (q.includes('vazar') || q.includes('vazamento')) answer = 'Os erros mais comuns que causam vazamento são: tirar a luva antes da hora, montar torto ou ferir o lábio de PTFE durante a passagem no eixo.';
        else if (q.includes('ferramenta')) answer = 'Use ferramenta plana e adequada, aplicando força uniforme até o assentamento completo.';

        answerBox.textContent = answer;
      });
    }
  }

  async function bootstrap() {
    const data = await window.DB_API.loadAllData();
    const codigo = getCodigo();
    const produto = data?.produtos?.[codigo] || data?.produtos?.['05801'];

    const sourceBadge = document.getElementById('dataSourceBadge');
    if (sourceBadge) {
      sourceBadge.textContent = window.DB_API.state.source === 'firebase' ? 'Dados: Firebase RTDB' : 'Dados: modo local/sample';
    }

    if (!produto) return;
    document.body.dataset.produtoCodigo = produto.codigo;

    if (document.body.classList.contains('page-produto')) renderProduto(produto);
    if (document.body.classList.contains('page-ar')) renderAr(produto);
    if (document.body.classList.contains('page-assistente')) renderAssistente(produto);

    const codeEls = document.querySelectorAll('[data-prod-code]');
    codeEls.forEach(el => el.textContent = produto.codigo);
  }

  function bindHomeQuickLinks() {
    const form = document.getElementById('quickOpenForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const codigo = (document.getElementById('quickCodigo').value || '05801').trim();
      location.href = `produto.html?codigo=${encodeURIComponent(codigo)}`;
    });
  }

  function bindCadastro() {
    const form = document.getElementById('cadastroProdutoForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('cadastroStatus');
      const produto = {
        codigo: document.getElementById('codigo').value.trim(),
        marca: document.getElementById('marca').value.trim(),
        nome: document.getElementById('nome').value.trim(),
        subtitulo: document.getElementById('subtitulo').value.trim(),
        heroImage: document.getElementById('heroImage').value.trim(),
        galeria: (document.getElementById('galeria').value || '').split('\n').map(x => x.trim()).filter(Boolean),
        modelGlbUrl: document.getElementById('modelGlbUrl').value.trim(),
        modelUsdzUrl: document.getElementById('modelUsdzUrl').value.trim(),
        posterImage: document.getElementById('posterImage').value.trim(),
        videoUrl: document.getElementById('videoUrl').value.trim(),
        alerta: document.getElementById('alerta').value.trim(),
        descricaoCurta: document.getElementById('descricaoCurta').value.trim(),
        descricaoLonga: document.getElementById('descricaoLonga').value.trim(),
        tecnicas: {
          diametroEixo: document.getElementById('diametroEixo').value.trim(),
          incluiSensor: document.getElementById('incluiSensor').value.trim(),
          lado: document.getElementById('lado').value.trim(),
          material: document.getElementById('material').value.trim(),
          posicao: document.getElementById('posicao').value.trim(),
          sentidoRotacao: document.getElementById('sentidoRotacao').value.trim(),
          tipoRetentor: document.getElementById('tipoRetentor').value.trim(),
          tipoVeiculo: document.getElementById('tipoVeiculo').value.trim()
        },
        aplicacoesResumo: (document.getElementById('aplicacoesResumoInput').value || '').split('\n').map(x => x.trim()).filter(Boolean),
        aplicacoesDetalhadasTexto: document.getElementById('aplicacoesDetalhadasTexto').value.trim(),
        passos: (document.getElementById('passosJson').value || '[]').trim() ? JSON.parse(document.getElementById('passosJson').value) : [],
        errosComuns: (document.getElementById('errosComunsInput').value || '').split('\n').map(x => x.trim()).filter(Boolean),
        faq: (document.getElementById('faqJson').value || '[]').trim() ? JSON.parse(document.getElementById('faqJson').value) : []
      };
      try {
        await window.DB_API.saveProduto(produto);
        status.textContent = 'Produto salvo no Firebase com sucesso.';
      } catch (err) {
        console.error(err);
        status.textContent = 'Erro ao salvar: ' + err.message;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindHomeQuickLinks();
    bindCadastro();
    bootstrap();
  });
})();
