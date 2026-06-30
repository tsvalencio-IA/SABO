# Sabó AR Técnico • VERSÃO 2 • GitHub Pages

Projeto de demonstração para manual técnico interativo com realidade aumentada aplicado ao retentor Sabó 05801.

## O que já vem pronto
- Página inicial
- Página do produto
- Página de realidade aumentada (pronta para receber GLB/USDZ)
- Página de assistente técnico simples
- Página com estratégia de vídeos em sequência para VEO3
- Cadastro público para teste com Firebase Realtime Database
- Regras abertas do RTDB
- Dados de exemplo do produto 05801
- Pastas prontas para imagens, 3D, vídeos e referências

## Estrutura
- `index.html` → entrada
- `produto.html` → página da peça
- `ar.html` → modo AR / 3D
- `assistente.html` → tira-dúvidas
- `cadastro.html` → cadastro aberto para teste
- `roteiros-veo3.html` → prompts e método de geração dos vídeos de 8 segundos
- `firebase-config.js` → você cola os dados do seu Firebase
- `database-rules.json` → regras abertas para teste
- `database-sample.json` → base pronta para importar se quiser

## Como usar
1. Extraia o ZIP.
2. Abra `firebase-config.js` e cole os dados do seu projeto Firebase.
3. No Realtime Database, aplique as regras do arquivo `database-rules.json`.
4. Se quiser importar a base pronta, importe `database-sample.json`.
5. Suba tudo para um repositório no GitHub.
6. Ative o GitHub Pages.
7. Abra `index.html` publicado.

## Importante sobre os arquivos de mídia
Neste MVP, os arquivos de imagem, 3D e vídeo devem ficar dentro do próprio repositório em `/assets/...`.
Use o Firebase RTDB somente para guardar os textos, URLs/caminhos, passos, FAQ e metadados.

## Como ativar o 3D/AR real
1. Gerar ou conseguir os arquivos:
   - `sabo-05801.glb`
   - `sabo-05801.usdz`
2. Colocar em `assets/modelos/`
3. Atualizar o cadastro do produto no Firebase ou em `assets/js/sample-data.js`
4. Abrir `ar.html?codigo=05801` no celular.

## Observação sobre vídeo longo no VEO3
Como o VEO3 costuma limitar o tempo, a solução foi preparar uma sequência em blocos de 8 segundos.
Os prompts estão na pasta `/prompts` e na página `roteiros-veo3.html`.

## Rodapé
Powered by thIAguinho Soluções Digitais


## Novidade da versão 2
- GLB otimizado já integrado em `assets/modelos/sabo-05801.glb`.
- Página extra de pitch comercial para apresentar à fábrica.
- Documentação de otimização do GLB em `docs/OTIMIZACAO-GLB.txt`.
