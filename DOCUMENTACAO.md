# MIRROR — Documentação do Projeto

> Painel pessoal de produtividade com estética de "HUD" (interface de sistema), que transforma tarefas do dia em XP, níveis, sequências (streaks) e conquistas.

---

## 1. O que é

**MIRROR** é uma aplicação web de página única (*single page*) que funciona como um **gerenciador de tarefas diárias gamificado**. O nome sugere a ideia central: o sistema é um *espelho* do seu dia — ele reflete, em números, o quanto do que você se propôs a fazer foi realmente feito.

- **Tipo:** aplicação front-end estática (sem servidor, sem banco de dados, sem login).
- **Idioma da interface:** português.
- **Público:** uso pessoal, uma pessoa por navegador.
- **Visual:** tema escuro, tipografia monoespaçada, linguagem de "terminal/sistema" (`SYS.01`, `TELEMETRIA`, `CICLO`, `DIAGNÓSTICO`).

## 2. Para que serve

O objetivo é **combater a procrastinação** dando retorno imediato e visível a cada tarefa concluída:

1. Você define o que vai fazer hoje e o quanto isso custa (dificuldade).
2. Ao concluir, ganha XP — e ganha **o dobro** se agir rápido (em até 1 hora).
3. O painel mostra em tempo real seu **desempenho** (% concluído) contra a **procrastinação** (% pendente).
4. Fechar todas as tarefas do dia conta como um **dia de sucesso**, que alimenta o **streak** e o **ciclo semanal**.

Em resumo: transforma "intenção em execução" (frase do próprio terminal de tarefas) com mecânicas de jogo.

## 3. Tecnologias

| Camada | Tecnologia | Uso |
|---|---|---|
| Estrutura | HTML5 (`index.html`) | Layout do painel em 3 colunas |
| Estilo | Tailwind CSS (via CDN `cdn.tailwindcss.com`) + `style.css` | Utilitários de layout + componentes próprios (`.hud-card`, `.effort-button`, etc.) |
| Fontes | Google Fonts — **Inter** (texto) e **JetBrains Mono** (números/rótulos) | Identidade visual de "sistema" |
| Lógica | JavaScript puro (`scripts.js`) | Estado, regras de XP/nível/streak, renderização |
| Persistência | `localStorage` do navegador (chave `mirror-system-v1`) | Salva tudo localmente |

Não há dependências instaladas, build, nem `package.json`.

## 4. Estrutura de arquivos

```
mirror/
├── index.html      # Marcação do painel (header + 3 colunas)
├── style.css       # Tokens de cor e componentes visuais
├── scripts.js      # Toda a lógica da aplicação
└── DOCUMENTACAO.md # Este documento
```

## 5. Como executar

Basta abrir o `index.html` no navegador (duplo clique). É necessário estar online na primeira carga para baixar o Tailwind e as fontes pelos CDNs.

Opcionalmente, com um servidor local:

```powershell
npx serve .
```

## 6. Interface — o painel

O layout é uma grade de 12 colunas em telas grandes (`lg`), dividida em **3 – 6 – 3**. Em telas menores, os blocos empilham em uma coluna.

### Coluna esquerda — Estado

| Bloco | O que mostra |
|---|---|
| **01 · PERFORMANCE** | % de **Desempenho** (tarefas concluídas ÷ total do dia), % de **Procrastinação** (100 − desempenho), barra de progresso, e 4 métricas: Tarefas, Concluídas, Impacto, Streak. |
| **XP · PROGRESSÃO** | Nível atual, XP atual / XP para o próximo nível e barra de XP. |
| **DIAGNÓSTICO (AUTO)** | Duas linhas (`SYS.01`, `SYS.02`) com uma leitura textual automática do dia. |

### Coluna central — Ação

| Bloco | O que faz |
|---|---|
| **TERMINAL DE TAREFAS** | Campo de texto (máx. 120 caracteres), seleção de dificuldade (Leve / Média / Pesada) e botão **INICIAR TAREFA** (ou `Enter`). |
| **TAREFAS ATIVAS** | Lista das tarefas **de hoje**, com filtros **Todas / Pendentes / Concluídas** e contadores. Cada item tem checkbox (concluir/desmarcar), etiqueta de dificuldade, impacto, XP ganho, selo **QUICK** e botão de remover (lixeira, aparece ao passar o mouse). |

### Coluna direita — Histórico

| Bloco | O que mostra |
|---|---|
| **CICLO SEMANAL · 07D** | Os últimos 7 dias como quadrados: azul = dia de sucesso, cinza = dia com tarefas não fechadas, contorno = hoje. Contador "Dias concluídos X / 7". |
| **STATUS DO CICLO** | Estado do dia: `AGUARDANDO`, `CICLO INICIADO`, `EXECUÇÃO EM CURSO` ou `CICLO CONCLUÍDO`, com indicador colorido. |
| **REGISTRO · ACH** | 4 conquistas que acendem quando desbloqueadas. |
| **TELEMETRIA · LIVE** | Contadores acumulados: Ações rápidas, Metas alcançadas, Tarefas abandonadas. |

## 7. Regras do sistema

### 7.1 Dificuldade, XP e impacto

| Dificuldade | XP base | Peso (difficulty) | Impacto |
|---|---|---|---|
| LEVE | 10 | 1 | 10 |
| MÉDIA | 25 | 2 | 25 |
| PESADA | 50 | 3 | 50 |

- É **obrigatório** escolher a dificuldade; sem ela, o rótulo pisca em vermelho "SELECIONE A DIFICULDADE".
- **Impacto** do dia = soma do impacto das tarefas concluídas hoje.

### 7.2 Ação rápida (Quick Action)

Se a tarefa for concluída **em até 1 hora** após ser criada, ela recebe o selo **QUICK** e vale **2× XP** (`quickActionMultiplier: 2`). O contador "Ações rápidas" da telemetria aumenta.

### 7.3 Níveis

- XP necessário para passar do nível *N* = **N × 150** (nível 1 → 150, nível 2 → 300, nível 3 → 450…).
- Ao atingir o limite, o excedente passa para o próximo nível (pode subir vários níveis de uma vez).

### 7.4 Desmarcar uma tarefa

Clicar de novo no checkbox de uma tarefa concluída **reverte**: remove o XP que ela deu (incluindo o bônus QUICK) sem deixar o XP negativo, e desfaz a contagem de ação rápida.

### 7.5 Remover uma tarefa

Pede confirmação. Se a tarefa ainda **não** estava concluída, a remoção conta como **abandono** (telemetria "Tarefas abandonadas").

### 7.6 Dia de sucesso e streak

- Um dia é **sucesso** quando **todas** as tarefas daquele dia estão concluídas.
- O resultado fica em `history` (`{ date, success }`). Se depois você adicionar uma nova tarefa pendente, o dia volta a ser "não sucesso".
- **Streak** = quantidade de dias de sucesso consecutivos até hoje.

### 7.7 Conquistas

| Código | Nome | Condição |
|---|---|---|
| 01 | PRIMEIRO PASSO | 1 tarefa concluída |
| 02 | CONSISTÊNCIA | Streak ≥ 3 dias |
| 03 | FOCO | 10 tarefas concluídas (total) |
| 04 | EVOLUÇÃO | Nível ≥ 5 |

### 7.8 Ciclo diário

O painel trabalha sempre com o **dia atual** (`getToday()` no fuso local). À meia-noite, a lista "zera" visualmente: as tarefas antigas continuam salvas, mas só as de hoje aparecem e entram nas métricas.

## 8. Arquitetura do código (`scripts.js`)

### 8.1 Configuração

```js
const CONFIG = {
  xp:         { light: 10, medium: 25, heavy: 50 },
  difficulty: { light: 1,  medium: 2,  heavy: 3  },
  effortName: { light: "LEVE", medium: "MÉDIA", heavy: "PESADA" },
  quickActionMultiplier: 2,
  storageKey: "mirror-system-v1"
};
```

Para ajustar o "balanço" do jogo, basta mudar esses valores.

### 8.2 Estado

Um único objeto `state` guarda tudo e é salvo inteiro no `localStorage`:

```js
state = {
  tasks: [],            // todas as tarefas (de todos os dias)
  selectedEffort: null, // dificuldade escolhida no terminal
  activeFilter: "all",  // all | pending | completed
  xp: 0, level: 1, streak: 0,
  history: [],          // [{ date: "AAAA-MM-DD", success: bool }]
  statistics: { quickActions: 0, goalsReached: 0, abandonedTasks: 0 }
}
```

Formato de uma tarefa:

```js
{
  id, title, effort,          // "light" | "medium" | "heavy"
  difficulty, xp, impact,
  date: "AAAA-MM-DD",
  createdAt, completedAt,     // timestamps (ms)
  completed, notDone, quickAction
}
```

### 8.3 Fluxo de dados

```
Ação do usuário (clique / Enter)
        │
        ▼
addTask / completeTask / deleteTask / selectEffort
        │  altera `state`
        ▼
saveState()  ──►  localStorage
        │
        ▼
render()
  ├─ updateStreak()
  ├─ renderPerformance()   (desempenho, XP, nível)
  ├─ renderTasks()         (lista filtrada)
  ├─ renderCounters()
  ├─ renderStatus()        (status + diagnóstico)
  ├─ renderWeek()
  ├─ renderAchievements()
  └─ renderStatistics()
```

É um padrão simples de **estado único + re-renderização completa**: toda mudança redesenha o painel inteiro a partir do `state`.

### 8.4 Principais funções

| Grupo | Funções |
|---|---|
| Datas | `getToday`, `getDateObject`, `getLastSevenDays` |
| Persistência | `saveState`, `loadState` (com `try/catch` para dados corrompidos) |
| Tarefas | `addTask`, `completeTask` (toggle), `deleteTask`, `markNotDone` |
| Progressão | `getXpRequired`, `updateLevel`, `updateStreak`, `calculateStreak` |
| Métricas | `getDailyMetrics`, `getCycleStatus`, `getAchievements` |
| Renderização | `render` e os `render*` de cada bloco |
| Segurança | `escapeHTML` — impede injeção de HTML pelo título da tarefa |
| Eventos | Delegação de clique em `#taskList` (`data-action="complete" | "delete"`), botões de esforço, filtros, `Enter` no input |

## 9. Design visual (`style.css`)

- **Paleta:** fundo `#090A0F`, painéis translúcidos `rgba(15,17,24,.6)` com *blur*, linhas `#1E293B`, destaque azul **`#00A3FF`**, texto `#F8FAFC`.
- **Cores de dificuldade:** Leve = verde `#6EE7B7`, Média = amarelo `#FCD34D`, Pesada = rosa `#FB7185`.
- **Componentes:** `.hud-card` (cartão com vidro fosco), `.terminal-input`, `.effort-button`, `.system-button`, `.filter-button` (sublinhado azul quando ativo), `.task-item`, `.week-day`, `.achievement`.
- **Movimento:** ponto azul pulsante no header (`systemPulse`), transições curtas de 150–180 ms, barras com `transition-all duration-500`.
- **Responsivo:** abaixo de 640 px, a lixeira some e os metadados da tarefa quebram linha.

## 10. Limitações e pontos de atenção

Encontrados na leitura do código — úteis como lista de melhorias futuras:

| # | Ponto | Efeito |
|---|---|---|
| 1 | `index.html` carrega `scriptS.js` (S maiúsculo), mas o arquivo é `scripts.js`. | Funciona no Windows; **quebra** em servidores Linux (ex.: GitHub Pages), onde nomes diferenciam maiúsculas. |
| 2 | Dados só no `localStorage`. | Não sincroniza entre dispositivos; limpar o navegador apaga tudo. Sem exportar/importar. |
| 3 | `goalsReached` ("Metas alcançadas") nunca é incrementado. | Contador fica sempre em 0. |
| 4 | `markNotDone` existe, mas nenhum botão a chama. | Função sem uso. |
| 5 | Lixeira escondida em telas < 640 px e só visível no *hover*. | No celular não dá para remover tarefas; pelo teclado ela fica invisível. |
| 6 | `calculateStreak` mede a diferença a partir do horário atual. | Depois do meio-dia, se o dia de hoje ainda não estiver fechado, o streak de ontem pode aparecer como 0 até você concluir tudo. |
| 7 | Desmarcar uma tarefa após subir de nível não desce o nível. | O XP é retirado só do nível atual (mínimo 0). |
| 8 | Textos com pequenos erros/variações (ex.: "primeira tarefas", "Nenhuma tarefas registada", "actual", "directiva"). | Mistura de português do Brasil e de Portugal. |
| 9 | Cabeçalho do `style.css` ainda diz "DUELO DO TEMPO". | Resto de um nome anterior do projeto. |
| 10 | Tailwind via CDN. | Ótimo para protótipo; para produção, o recomendado é compilar o CSS. |

## 11. Possíveis evoluções

- Exportar/importar dados (JSON) ou sincronizar com uma conta.
- Histórico de dias anteriores (ver tarefas passadas).
- Mais conquistas e uso real de "Metas alcançadas".
- Botão "Não fiz" ligado a `markNotDone`.
- Ações de remover acessíveis no celular e pelo teclado.
- Revisão de textos para um único padrão de português.

---

*Documento gerado a partir da leitura do código-fonte (`index.html`, `style.css`, `scripts.js`).*
