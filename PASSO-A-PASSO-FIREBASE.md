# PASSO A PASSO — Firebase Realtime Database

## 1. Criar o Realtime Database
1. Abra o Firebase Console.
2. Entre no seu projeto.
3. Vá em **Build > Realtime Database**.
4. Clique em **Criar banco de dados**.
5. Escolha uma região.
6. Pode começar em modo teste.

## 2. Colar as regras abertas para teste
No menu **Realtime Database > Regras**, apague tudo e cole:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Depois clique em **Publicar**.

## 3. Importar os dados iniciais
No Realtime Database, vá em **Dados** e use a opção de importar JSON.
Importe o arquivo:

`database-sample.json`

## 4. Configurar o site
Abra o arquivo:

`firebase-config.js`

Cole as informações do seu Firebase:

```js
window.FIREBASE_CONFIG = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

## 5. GLB
O GLB principal já está no caminho:

`assets/modelos/sabo-05801.glb`

O site já aponta para esse arquivo.

## 6. Publicar no GitHub Pages
1. Crie um repositório.
2. Envie todos os arquivos deste ZIP.
3. Vá em **Settings > Pages**.
4. Em **Branch**, escolha `main` e pasta `/root`.
5. Abra a URL publicada.

## Observação
Essas regras abertas são somente para teste.
Para apresentar publicamente para cliente/fábrica, use regras mais seguras.
Deixei também o arquivo:

`REGRAS-REALTIME-DATABASE-PRODUCAO-MAIS-SEGURA.json`
