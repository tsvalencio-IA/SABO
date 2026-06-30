(function () {
  const state = {
    app: null,
    db: null,
    loaded: false,
    source: 'sample'
  };

  function hasFirebaseConfig() {
    const cfg = window.FIREBASE_CONFIG || {};
    return !!(cfg.apiKey && !String(cfg.apiKey).includes('COLE_AQUI') && cfg.databaseURL);
  }

  function initFirebase() {
    if (!window.firebase || !hasFirebaseConfig()) return null;
    if (!state.app) {
      state.app = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.FIREBASE_CONFIG);
      state.db = firebase.database();
    }
    return state.db;
  }

  async function loadAllData() {
    const db = initFirebase();
    if (!db) {
      state.loaded = true;
      state.source = 'sample';
      return window.SAMPLE_DATA;
    }

    try {
      const snap = await db.ref('/').once('value');
      const data = snap.val();
      if (data && data.produtos) {
        state.loaded = true;
        state.source = 'firebase';
        return data;
      }
      state.loaded = true;
      state.source = 'sample';
      return window.SAMPLE_DATA;
    } catch (err) {
      console.error('Erro ao carregar Firebase:', err);
      state.loaded = true;
      state.source = 'sample';
      return window.SAMPLE_DATA;
    }
  }

  async function saveProduto(produto) {
    const db = initFirebase();
    if (!db) throw new Error('Firebase não configurado. Preencha o arquivo firebase-config.js primeiro.');
    if (!produto || !produto.codigo) throw new Error('Produto inválido');
    await db.ref('/produtos/' + produto.codigo).set(produto);
    return true;
  }

  async function saveConfig(config) {
    const db = initFirebase();
    if (!db) throw new Error('Firebase não configurado. Preencha o arquivo firebase-config.js primeiro.');
    await db.ref('/config').set(config);
    return true;
  }

  window.DB_API = {
    state,
    hasFirebaseConfig,
    loadAllData,
    saveProduto,
    saveConfig
  };
})();
