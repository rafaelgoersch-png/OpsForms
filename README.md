# OpsForms — Formulários Operacionais

Aplicação estática para gerar reportes operacionais padronizados para copiar/colar no WhatsApp ou Teams.

Não usa servidor, backend ou banco de dados. Roda como HTML/CSS/JS puro e pode ser publicado direto no GitHub Pages.

## Reportes disponíveis

Atualmente existem 4 reportes funcionais:

1. **SITOP - Fiscalização**
2. **SITOP - Supervisor**
3. **Caça-Desvio**
4. **Captura de Evento / Lições Aprendidas**

O rascunho dos formulários é salvo no navegador via `localStorage`.

---

## Estrutura modular atual

```text
OpsForms/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── config.js
    ├── storage.js
    ├── utils.js
    └── forms/
        ├── desvio.js
        ├── evento.js
        ├── sitop.js
        └── sitop-supervisor.js
```

---

## Responsabilidade dos arquivos

### `index.html`

Contém a estrutura visual da página:

- seletor do tipo de reporte;
- formulários;
- painel de prévia;
- botões de limpar/copiar/abrir WhatsApp;
- carregamento dos scripts JS.

A regra é manter aqui somente a estrutura HTML necessária. A lógica deve ficar nos arquivos JavaScript.

### `css/style.css`

Contém o visual da aplicação:

- temas visuais da aplicação;
- grid dos formulários;
- cards;
- inputs;
- botões;
- tabelas;
- checkboxes;
- responsividade para celular.

## Temas visuais

A aplicação possui três temas:

1. **Escuro** — tema padrão.
2. **Claro** — melhor para ambientes muito iluminados ou impressão visual.
3. **Pink anos 1980** — tema alternativo, visual retrô/neon.

O tema é escolhido no topo da aplicação e fica salvo no navegador via `localStorage`.

Para criar um novo tema, edite somente as variáveis CSS em `css/style.css`, seguindo o padrão:

```css
body[data-theme="novoTema"] {
  --bg: ...;
  --panel: ...;
  --text: ...;
  --accent: ...;
}
```

Depois, adicione a opção correspondente no seletor `themeSelect` do `index.html` e na lista permitida dentro de `js/app.js`.

### `js/config.js`

Centraliza listas e constantes globais usadas pelos formulários, por exemplo:

- sondas;
- fases;
- atividades;
- criticidades;
- opções reutilizáveis.

### `js/utils.js`

Funções auxiliares compartilhadas, como:

- leitura de campos;
- formatação de datas;
- montagem de listas;
- normalização de texto;
- leitura de checkboxes.

### `js/storage.js`

Controla persistência local:

- salvar rascunho;
- recuperar rascunho;
- limpar cabeçalho;
- limpar dados;
- limpar tudo;
- manter último poço/sonda quando aplicável.

### `js/app.js`

Controlador principal da aplicação:

- inicia o app;
- troca o formulário visível;
- chama o gerador de texto correto;
- atualiza a prévia;
- executa ações dos botões principais;
- integra os módulos dos relatórios.

### `js/forms/`

Cada arquivo dentro desta pasta concentra a lógica específica de um relatório.

| Arquivo | Relatório | Responsabilidade |
|---|---|---|
| `sitop.js` | SITOP - Fiscalização | Geração do texto do SITOP Fiscal e regras específicas do formulário |
| `sitop-supervisor.js` | SITOP - Supervisor | Geração do texto, turmas embarcadas, datas de teste e tabela PRONTOS |
| `desvio.js` | Caça-Desvio | Geração do texto do reporte de desvio |
| `evento.js` | Captura de Evento / Lições Aprendidas | Geração do texto de eventos, criticidade e campos condicionais |

---

## Regra de manutenção

A regra principal deste projeto é:

```text
Um relatório não deve quebrar outro relatório.
```

Ao alterar um relatório, mexa preferencialmente apenas no arquivo dele dentro de `js/forms/` e no bloco HTML correspondente em `index.html`.

Evite alterar `app.js`, `storage.js`, `utils.js` ou `config.js` sem necessidade real.

---

## Como criar um novo relatório

Exemplo: criar um novo relatório chamado **Checklist Diário**.

### 1. Criar o bloco visual no `index.html`

Adicione um novo bloco com classe `form-view hidden`:

```html
<section id="checklistDiarioForm" class="form-view hidden">
  <div class="form-card">
    <h2>Checklist Diário</h2>

    <div class="form-grid two-cols">
      <label>
        Sonda
        <input id="check_sonda" type="text" placeholder="Ex.: PR-14">
      </label>

      <label>
        Poço
        <input id="check_poco" type="text" placeholder="Ex.: MBW-56">
      </label>
    </div>

    <label>
      Observações
      <textarea id="check_observacoes" rows="4"></textarea>
    </label>
  </div>
</section>
```

Use IDs com prefixo próprio do relatório. Exemplo:

```text
check_sonda
check_poco
check_observacoes
```

Isso evita conflito com campos de outros relatórios.

---

### 2. Adicionar a opção no seletor de relatório

No seletor principal em `index.html`, adicione uma opção:

```html
<option value="checklistDiario">Checklist Diário</option>
```

O `value` será usado pelo JavaScript para identificar o relatório.

---

### 3. Criar o arquivo JS do novo relatório

Crie:

```text
js/forms/checklist-diario.js
```

Modelo básico:

```javascript
(function () {
  function buildChecklistDiarioOutput() {
    const sonda = getValue("check_sonda");
    const poco = getValue("check_poco");
    const observacoes = getValue("check_observacoes");

    return [
      "*Checklist Diário*",
      "",
      `*Sonda:* ${sonda || "-"}`,
      `*Poço:* ${poco || "-"}`,
      "",
      "*Observações:*",
      observacoes || "-"
    ].join("\n");
  }

  window.OpsForms = window.OpsForms || {};
  window.OpsForms.forms = window.OpsForms.forms || {};

  window.OpsForms.forms.checklistDiario = {
    buildOutput: buildChecklistDiarioOutput
  };
})();
```

Pontos importantes:

- o nome `checklistDiario` deve ser igual ao `value` usado no seletor;
- a função deve retornar o texto final pronto;
- use funções de `utils.js`, como `getValue()`, sempre que possível.

---

### 4. Registrar o novo script no `index.html`

No final do `index.html`, junto dos demais scripts de formulários, adicione:

```html
<script src="js/forms/checklist-diario.js"></script>
```

Coloque antes de:

```html
<script src="js/storage.js"></script>
<script src="js/app.js"></script>
```

Ordem recomendada:

```html
<script src="js/config.js"></script>
<script src="js/utils.js"></script>

<script src="js/forms/sitop.js"></script>
<script src="js/forms/sitop-supervisor.js"></script>
<script src="js/forms/desvio.js"></script>
<script src="js/forms/evento.js"></script>
<script src="js/forms/checklist-diario.js"></script>

<script src="js/storage.js"></script>
<script src="js/app.js"></script>
```

---

### 5. Integrar no `app.js`, se necessário

Se o `app.js` já busca o formulário pelo registro em `window.OpsForms.forms`, o novo relatório pode funcionar apenas com o registro acima.

Caso exista alguma lista manual de tipos dentro do `app.js`, adicione o novo tipo nela.

Procure por algo como:

```javascript
sitop
sitopSupervisor
desvio
evento
```

E adicione:

```javascript
checklistDiario
```

---

### 6. Adicionar persistência, se necessário

Se o relatório tiver campos comuns como sonda, poço e data, verifique se o `storage.js` já salva automaticamente os campos do formulário ativo.

Se algum campo for especial, adicione a regra no `storage.js` com cuidado.

---

### 7. Testar localmente

Na pasta do projeto:

```bash
python3 -m http.server 8000
```

Abra:

```text
http://localhost:8000
```

Teste obrigatoriamente:

- troca para o novo relatório;
- preenchimento dos campos;
- atualização da prévia;
- limpeza de cabeçalho;
- limpeza de dados;
- cópia do texto;
- abertura do WhatsApp;
- retorno aos outros relatórios já existentes.

---

## Checklist antes de fazer commit

Antes de subir qualquer alteração:

```bash
git status
```

Teste os 4 relatórios atuais:

- SITOP - Fiscalização;
- SITOP - Supervisor;
- Caça-Desvio;
- Captura de Evento / Lições Aprendidas.

Depois faça:

```bash
git add .
git commit -m "Descreve a alteracao feita"
git push
```

---

## Publicação no GitHub Pages

Este projeto pode ser publicado diretamente pelo GitHub Pages.

Arquivos necessários:

```text
index.html
README.md
css/
js/
```

Configuração recomendada:

1. GitHub > repositório do projeto;
2. Settings;
3. Pages;
4. Source: branch `main`;
5. Folder: `/root`;
6. Save.

---

## Histórico de alterações

### v6

- adiciona o formulário **SITOP - Supervisor**;
- inclui campo **Poço** no cabeçalho;
- padroniza **Turmas embarcadas** com checkboxes 1, 2, 3 e 4;
- inclui **Data do último teste de ESCP** como campo de data;
- mantém um campo único de **Pessoas / Comportamento** e inclui tabela dinâmica **PRONTOS**, exibida no texto somente quando preenchida.

### v7

- modulariza a aplicação sem mudar o comportamento esperado;
- move o CSS para `css/style.css`;
- divide o JavaScript em arquivos por responsabilidade;
- separa regras específicas por formulário dentro de `js/forms/`;
- mantém compatibilidade com uso estático e GitHub Pages.

### v8

- atualiza o README para documentar a estrutura modular;
- adiciona orientação para criação de novos relatórios;
- inclui checklist de manutenção e publicação.


### v9

- adiciona seletor de temas;
- mantém o tema escuro como padrão;
- inclui tema claro e tema pink anos 1980.

### v10

- adiciona o campo **Melhoria sugerida** no Caça-Desvio;
- inclui **Melhoria sugerida** no texto de saída para WhatsApp/Teams logo após **Ação imediata tomada**.


### v12

- simplifica a seção **ESCP** do **SITOP - Supervisor**;
- remove campos de simulado de controle de poço, simulado com UCI e data do próximo teste;
- mantém apenas pendências e data do último teste de ESCP.


### v19

- remove o campo **Estado dos equipamentos** da seção **ESCP** do **SITOP - Supervisor**;
- mantém **Pendências** e **Data do último teste de ESCP** como os únicos campos da seção.
