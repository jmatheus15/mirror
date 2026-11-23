# MIRROR — Roteiro de vídeo de apresentação

- **Duração alvo:** ~3 minutos
- **Formato:** narração em off + gravação de tela do app + trechos dos slides
- **Tom:** direto, confiante, um pouco "sistema/terminal" (combina com o visual do app)
- **Ritmo de fala:** ~140 palavras por minuto

---

## Antes de gravar

1. Abra o `index.html` no navegador, em tela cheia, largura de desktop (≥ 1024 px, para aparecerem as 3 colunas).
2. Comece com o painel **zerado**: no DevTools, `Application › Local Storage`, apague a chave `mirror-system-v1` e recarregue.
3. Deixe prontas 3 tarefas para digitar: *"Estudar JavaScript"* (Média), *"Responder e-mails"* (Leve), *"Finalizar relatório"* (Pesada).
4. Grave a tela em 1080p e a narração separada (fica mais fácil de editar).

> Para mostrar streak, semana e conquistas já preenchidos (cena 6), grave essa parte em outro perfil do navegador com alguns dias de uso, ou use os slides 5 e 6.

---

## Cena 1 — Abertura (0:00 – 0:15)

**TELA:** Fundo escuro. O ponto azul pulsando. Entra o título **MIRROR** (slide de capa) e a barra azul enchendo.

**LOCUÇÃO:**
> Você termina o dia e fica com a sensação de que não fez nada?
> Este é o MIRROR: um painel que transforma as suas tarefas do dia em XP, níveis e consistência.

---

## Cena 2 — O que é (0:15 – 0:35)

**TELA:** Corte para o app aberto, painel vazio. Movimento lento de câmera (zoom suave) passando pelas três colunas.

**LOCUÇÃO:**
> O MIRROR é um gerenciador de tarefas com mecânicas de jogo.
> Ele roda direto no navegador, sem login e sem servidor: tudo fica salvo na sua máquina.
> E o nome não é por acaso: ele funciona como um espelho do seu dia, mostrando em números quanto do que você planejou foi realmente feito.

---

## Cena 3 — Criando uma tarefa (0:35 – 1:05)

**TELA:** Zoom no **Terminal de Tarefas**.
1. Digita *"Estudar JavaScript"*.
2. Clica em **MÉDIA · 25 XP** (botão fica azul).
3. Aperta **Enter**. A tarefa aparece em "Tarefas ativas".
4. Repete rápido com *"Responder e-mails"* (Leve) e *"Finalizar relatório"* (Pesada).
5. Destaque (círculo ou zoom) nas etiquetas coloridas: verde, amarelo, rosa.

**LOCUÇÃO:**
> Tudo começa no terminal de tarefas. Você escreve o que vai fazer e escolhe a dificuldade: leve vale 10 XP, média 25 e pesada 50.
> Sem escolher a dificuldade, a tarefa não entra. A ideia é você pensar no esforço antes de começar.

**DICA DE EDIÇÃO:** Mostre rapidamente o aviso vermelho "SELECIONE A DIFICULDADE" tentando criar uma tarefa sem escolher o nível.

---

## Cena 4 — Concluindo e ganhando XP (1:05 – 1:35)

**TELA:**
1. Marca o checkbox de *"Estudar JavaScript"*. Aparece o selo **QUICK** e **+50 XP**.
2. Zoom na coluna esquerda: **Desempenho** sobe para 33%, **Procrastinação** cai para 67%, a barra azul anda.
3. Zoom no bloco **Progressão**: barra de XP enchendo (50 / 150).

**LOCUÇÃO:**
> Concluiu? Marca. E se você fizer isso em até uma hora depois de criar a tarefa, ganha o dobro de XP: é a ação rápida.
> Do lado esquerdo, o painel mostra em tempo real o seu desempenho contra a sua procrastinação.
> O XP vai acumulando e, a cada 150 XP vezes o seu nível, você sobe de nível.

---

## Cena 5 — Fechando o ciclo do dia (1:35 – 2:00)

**TELA:**
1. Marca as outras duas tarefas.
2. Zoom em **Status do Ciclo**: muda para **CICLO CONCLUÍDO** com o indicador azul.
3. Zoom em **Diagnóstico**: "Todas as directivas foram executadas."
4. Mostra o filtro **Pendentes / Concluídas** rapidamente.

**LOCUÇÃO:**
> Quando todas as tarefas do dia estão feitas, o ciclo fecha. O sistema lê o seu dia e te dá o diagnóstico na hora.
> Um dia cem por cento concluído conta como um dia de sucesso.

---

## Cena 6 — Consistência (2:00 – 2:25)

**TELA:** Coluna direita (ou slide 5 "A consistência ao longo dos dias"): **Ciclo Semanal** com os quadrados azuis, **Streak** na coluna esquerda e a lista de **conquistas** acendendo.

**LOCUÇÃO:**
> Dias de sucesso seguidos formam o seu streak, e o ciclo semanal mostra os últimos sete dias de uma vez.
> Ao longo do caminho você desbloqueia conquistas: Primeiro Passo, Consistência, Foco e Evolução.

---

## Cena 7 — Por dentro (2:25 – 2:45)

**TELA:** Slide 6 "Um estado único, uma renderização" (fluxo Evento → Ação → Estado → Persistência → Tela). Opcional: relance do código em `scripts.js` no editor.

**LOCUÇÃO:**
> Por dentro, o projeto é simples de propósito: HTML, Tailwind e JavaScript puro, sem nenhuma dependência instalada.
> Toda ação muda um único objeto de estado, que é salvo no navegador e redesenha o painel inteiro.

---

## Cena 8 — Encerramento (2:45 – 3:00)

**TELA:** Volta para o painel com o ciclo concluído. Fade para o slide final: **"MIRROR · o dia, refletido em números."**

**LOCUÇÃO:**
> Planeje, execute, evolua e mantenha.
> MIRROR: o seu dia, refletido em números.

---

## Resumo de tempos

| Cena | Tempo | Conteúdo | Fonte da imagem |
|---|---|---|---|
| 1 | 0:00–0:15 | Abertura | Slide 1 |
| 2 | 0:15–0:35 | O que é | App (painel vazio) |
| 3 | 0:35–1:05 | Criar tarefa | App (terminal) |
| 4 | 1:05–1:35 | Concluir, XP, desempenho | App |
| 5 | 1:35–2:00 | Ciclo concluído | App |
| 6 | 2:00–2:25 | Streak, semana, conquistas | App com histórico ou slide 5 |
| 7 | 2:25–2:45 | Arquitetura | Slide 6 / código |
| 8 | 2:45–3:00 | Encerramento | App + slide 10 |

## Sugestões de produção

- **Trilha:** eletrônica minimalista, baixa, sem vocal (combina com o visual "HUD").
- **Efeitos sonoros:** um "bip" curto ao marcar tarefa e ao fechar o ciclo.
- **Legendas:** em fonte mono (JetBrains Mono), brancas, para manter a identidade.
- **Zooms:** use zoom suave nos blocos em vez de cortes secos; o texto do app é pequeno em 1080p.
- **Versão curta (30 s, para redes):** use as cenas 1, 3, 4 e 8, cortando a locução para uma frase por cena.
