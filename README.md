# Controle de Despesas (Expense Control)

Um aplicativo web simples e eficiente para controle de finanças pessoais (Receitas e Despesas), desenvolvido com HTML, CSS e JavaScript puro (Vanilla JS). O projeto também está configurado como um **PWA (Progressive Web App)**.

## 🚀 Funcionalidades

- **Adicionar Transações**: Insira o nome e o valor da transação. Valores positivos são considerados *Receitas* e valores negativos são *Despesas*.
- **Cálculo Automático**: O saldo atual, total de receitas e total de despesas são calculados e exibidos automaticamente na tela.
- **Persistência de Dados**: As transações são salvas localmente no seu navegador utilizando o `localStorage`, garantindo que os dados não sejam perdidos ao recarregar a página.
- **Remover Transações**: É possível excluir uma transação específica clicando no botão "x".
- **PWA (Progressive Web App)**: Possui arquivo de manifesto (`manifest.webmanifest`) e Service Worker (`sw.js`), permitindo que a aplicação seja instalada na tela inicial de dispositivos móveis e desktops.

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estruturação semântica.
- **CSS3**: Estilização e layout da interface de usuário.
- **JavaScript (Vanilla JS / ES6+)**: Lógica da aplicação, manipulação do DOM e `localStorage`.
- **Service Workers & Web Manifest**: Para recursos PWA e cache.

## 📁 Estrutura de Arquivos

- `index.html`: Ponto de entrada da aplicação contendo a marcação HTML.
- `style.css`: Estilos visuais da página.
- `script.js`: Toda a lógica principal, formatação monetária e controle de eventos.
- `index.js` e `sw.js`: Configurações de registro do Service Worker para o comportamento PWA e funcionamento offline.
- `manifest.webmanifest`: Arquivo de manifesto para instalação do aplicativo.

## ⚙️ Como Executar o Projeto

Por se tratar de um projeto de páginas estáticas e JavaScript puro, não é necessário rodar ferramentas de build ou instalação de pacotes (como npm).

1. **Clone ou faça o download** deste repositório:
   ```bash
   git clone <url-do-repositorio>
   cd expense-control
   ```

2. **Para rodar a aplicação localmente**, você tem duas opções:
   - Abrir o arquivo `index.html` diretamente com o seu navegador (com um duplo clique).
   - **(Recomendado)** Utilizar uma extensão como o *Live Server* do VSCode ou um servidor local estático simples (ex: `npx http-server` ou `python -m http.server`) para que os recursos do PWA (Service Workers) funcionem perfeitamente.

3. O sistema já estará pronto para uso. Adicione suas receitas, despesas e acompanhe o seu saldo!
