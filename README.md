# Formulários Operacionais

Aplicação estática para GitHub Pages com três formulários:

- SITOP
- Caça-Desvio
- Captura de Evento / Lições Aprendidas

## Publicação no GitHub Pages

1. Envie `index.html`, `style.css` e `script.js` para o repositório.
2. Ative GitHub Pages em Settings > Pages.
3. Use a branch principal e a pasta raiz.

Não precisa de servidor, backend ou banco de dados. O rascunho é salvo no navegador via `localStorage`.


## Alteração v3

- adiciona botão **Abrir WhatsApp**;
- o botão copia o texto e abre o WhatsApp/WhatsApp Web com a mensagem preenchida;
- não envia automaticamente;
- usuário escolhe o grupo/conversa e envia manualmente;
- memoriza a última **Sonda** e o último **Poço** preenchidos;
- reaplica Sonda/Poço em campos vazios ao reabrir a página;
- padroniza **Sonda** como picklist nos três formulários;
- adiciona campo **Poço** no Caça-Desvio;
- mantém **Ação tomada:** em negrito no output.


## Alteração v4

- remove o botão separado **Abrir WhatsApp**;
- o botão principal agora é **Copiar texto e abrir WhatsApp**;
- ao clicar, o texto é copiado e o WhatsApp/WhatsApp Web é aberto com a mensagem preenchida;
- o envio continua manual e controlado pelo usuário.


## Alteração v5

- no desktop, o slider de criticidade continua vertical;
- no celular, o slider de criticidade passa a ser horizontal;
- no celular, a legenda fica em ordem intuitiva da esquerda para a direita: Baixa, Média, Alta, Crítica.
