# Formulários Operacionais

Aplicação estática para GitHub Pages com quatro formulários:

- SITOP - Fiscalização
- SITOP - Supervisor
- Caça-Desvio
- Captura de Evento / Lições Aprendidas

Não precisa de servidor, backend ou banco de dados. O rascunho é salvo no navegador via `localStorage`.

## Estrutura atual

```text
OpsForms/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── config.js
│   ├── storage.js
│   ├── utils.js
│   └── forms/
│       ├── desvio.js
│       ├── evento.js
│       ├── sitop.js
│       └── sitop-supervisor.js
└── README.md
```

## Responsabilidade dos arquivos

- `index.html`: estrutura visual da página e dos formulários.
- `css/style.css`: tema visual, layout, cards, inputs, botões e responsividade.
- `js/config.js`: listas e constantes globais, como sondas, fases, atividades e criticidade.
- `js/utils.js`: funções comuns para leitura de campos, datas, listas e montagem de selects/checkboxes.
- `js/storage.js`: salvamento local, recuperação de estado e preferências de sonda/poço.
- `js/app.js`: inicialização, troca de formulário, prévia, limpeza e botão de WhatsApp.
- `js/forms/sitop.js`: regras, listas dinâmicas e texto final do SITOP Fiscalização.
- `js/forms/sitop-supervisor.js`: regras, PRONTOS, turmas embarcadas e texto final do SITOP Supervisor.
- `js/forms/desvio.js`: texto final e padrões do Caça-Desvio.
- `js/forms/evento.js`: texto final, criticidade, datas e campos condicionais de Evento.

## Como adicionar um novo relatório

1. Criar um novo bloco visual no `index.html` com `id="novoTipoForm"` e `class="form-view hidden"`.
2. Criar um arquivo em `js/forms/novo-tipo.js`.
3. Registrar o script no final do `index.html`, antes de `js/storage.js` e `js/app.js`.
4. Adicionar a opção no seletor de tipo de registro.
5. No `js/app.js`, incluir o novo módulo no `buildOutput()` e nos defaults, se necessário.
6. Testar localmente antes de publicar.

## Publicação no GitHub Pages

1. Envie `index.html`, a pasta `css/`, a pasta `js/` e o `README.md` para o repositório.
2. Ative GitHub Pages em Settings > Pages.
3. Use a branch principal e a pasta raiz.

## Alteração v6

- adiciona o formulário **SITOP - Supervisor**;
- inclui campo **Poço** no cabeçalho;
- padroniza **Turmas embarcadas** com checkboxes 1, 2, 3 e 4;
- separa **Data do último teste** e **Data do próximo teste** em campos de data;
- inclui tabela dinâmica **PRONTOS**, exibida no texto somente quando preenchida.

## Alteração v7

- modulariza a aplicação sem mudar o comportamento esperado;
- move o CSS para `css/style.css`;
- divide o JavaScript em arquivos por responsabilidade;
- separa regras específicas por formulário dentro de `js/forms/`;
- mantém compatibilidade com uso estático e GitHub Pages.
