const CONFIG = {

    xp: {
        light: 10,
        medium: 25,
        heavy: 50
    },

    difficulty: {
        light: 1,
        medium: 2,
        heavy: 3
    },

    effortName: {
        light: "LEVE",
        medium: "MÉDIA",
        heavy: "PESADA"
    },

    quickActionMultiplier: 2,

    storageKey: "mirror-system-v1"

};


/* 
   ESTADO
 */

let state = {

    tasks: [],

    selectedEffort: null,

    activeFilter: "all",

    xp: 0,

    level: 1,

    streak: 0,

    history: [],

    statistics: {

        quickActions: 0,

        goalsReached: 0,

        abandonedTasks: 0

    }

};


/* ELEMENTOS */

const taskInput =
    document.getElementById("taskInput");

const addTaskButton =
    document.getElementById("addTaskButton");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const effortButtons =
    document.querySelectorAll(".effort-button");

const selectedEffortLabel =
    document.getElementById("selectedEffortLabel");


/* 
   DATA
 */

function getToday() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getDateObject(dateString) {

    const [
        year,
        month,
        day
    ] = dateString.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day
    );
}


/* 
   STORAGE
 */

function saveState() {

    localStorage.setItem(
        CONFIG.storageKey,
        JSON.stringify(state)
    );

}


function loadState() {

    const saved =
        localStorage.getItem(CONFIG.storageKey);

    if (!saved) {
        return;
    }

    try {

        const parsed =
            JSON.parse(saved);

        state = {
            ...state,
            ...parsed,
            statistics: {
                ...state.statistics,
                ...(parsed.statistics || {})
            }
        };

    } catch (error) {

        console.error(
            "Erro ao carregar dados:",
            error
        );

    }

}


/* 
   UTILITÁRIOS
 */

function generateId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


function formatNumber(number) {

    return String(number)
        .padStart(2, "0");

}


function getTasksToday() {

    const today =
        getToday();

    return state.tasks.filter(
        task => task.date === today
    );

}


/* 
   SELEÇÃO DE ESFORÇO
 */

function selectEffort(effort) {

    state.selectedEffort =
        effort;

    effortButtons.forEach(button => {

        button.classList.toggle(
            "selected",
            button.dataset.effort === effort
        );

    });

    selectedEffortLabel.textContent =
        CONFIG.effortName[effort];

}


/* 
   ADICIONAR TAREFA
 */

function addTask() {

    const title =
        taskInput.value.trim();

    if (!title) {

        taskInput.focus();

        return;

    }

    if (!state.selectedEffort) {

        selectedEffortLabel.textContent =
            "SELECIONE A DIFICULDADE";

        selectedEffortLabel.classList.add(
            "text-red-400"
        );

        setTimeout(() => {

            selectedEffortLabel.classList.remove(
                "text-red-400"
            );

            selectedEffortLabel.textContent =
                "NÃO DEFINIDO";

        }, 1600);

        return;

    }


    const effort =
        state.selectedEffort;


    const task = {

        id: generateId(),

        title,

        effort,

        difficulty:
            CONFIG.difficulty[effort],

        xp:
            CONFIG.xp[effort],

        impact:
            CONFIG.xp[effort],

        date:
            getToday(),

        createdAt:
            Date.now(),

        completed:
            false,

        notDone:
            false,

        completedAt:
            null,

        quickAction:
            false

    };


    state.tasks.push(task);


    taskInput.value = "";

    state.selectedEffort = null;

    effortButtons.forEach(button => {

        button.classList.remove(
            "selected"
        );

    });

    selectedEffortLabel.textContent =
        "NÃO DEFINIDO";


    saveState();

    render();

    taskInput.focus();

}


/* 
   CONCLUIR TAREFA
 */

/* ============================================================
   CONCLUIR / DESMARCAR TAREFA (TOGGLE)
============================================================ */

function completeTask(taskId) {
    const task = state.tasks.find(item => item.id === taskId);

    if (!task) return;

    if (!task.completed) {
        // --- 1. CASO ESTEJA PENDENTE: MARCAR COMO CONCLUÍDA ---
        task.completed = true;
        task.notDone = false;
        task.completedAt = Date.now();

        // Checagem de Quick Action (dentro de 1 hora da criação)
        const elapsed = Date.now() - task.createdAt;
        const oneHour = 60 * 60 * 1000;

        if (elapsed <= oneHour) {
            task.quickAction = true;
            state.statistics.quickActions++;
        }

        const multiplier = task.quickAction ? CONFIG.quickActionMultiplier : 1;
        state.xp += task.xp * multiplier;

        updateLevel();

    } else {
        // --- 2. CASO JÁ ESTEJA CONCLUÍDA: DESMARCAR ---
        const multiplier = task.quickAction ? CONFIG.quickActionMultiplier : 1;
        const xpToRemove = task.xp * multiplier;

        // Subtrai o XP ganho (impedindo que fique negativo)
        state.xp = Math.max(0, state.xp - xpToRemove);

        // Se foi Quick Action, reverte a estatística
        if (task.quickAction) {
            task.quickAction = false;
            state.statistics.quickActions = Math.max(0, state.statistics.quickActions - 1);
        }

        task.completed = false;
        task.completedAt = null;
    }

    // Atualiza Streak e histórico diário
    updateStreak();

    // Persiste e atualiza a interface
    saveState();
    render();
}


/* 
   NÃO FIZ
 */

function markNotDone(taskId) {

    const task =
        state.tasks.find(
            item => item.id === taskId
        );

    if (!task) {
        return;
    }


    if (task.completed) {
        return;
    }


    task.notDone = true;


    saveState();

    render();

}


/* 
   EXCLUIR
 */

function deleteTask(taskId) {

    const task =
        state.tasks.find(
            item => item.id === taskId
        );

    if (!task) {
        return;
    }


    const confirmed =
        confirm(
            "Remover esta directiva?\n\nA remoção será registrada como abandono."
        );


    if (!confirmed) {
        return;
    }


    if (!task.completed) {

        state.statistics.abandonedTasks++;

    }


    state.tasks =
        state.tasks.filter(
            item => item.id !== taskId
        );


    saveState();

    render();

}


/* 
   NÍVEL / XP
 */

function getXpRequired(level) {

    return level * 150;

}


function updateLevel() {

    while (
        state.xp >= getXpRequired(state.level)
    ) {

        state.xp -=
            getXpRequired(state.level);

        state.level++;

    }

}


/* 
   MÉTRICAS DO DIA
 */

function getDailyMetrics() {

    const tasks =
        getTasksToday();


    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const totalDifficulty =
        tasks.reduce(
            (sum, task) =>
                sum + task.difficulty,
            0
        );


    const averageDifficulty =
        total > 0
            ? totalDifficulty / total
            : 0;


    const focus =
        total > 0
            ? (completed / total) * 100
            : 0;


    const resistance =
        total > 0
            ? 100 - focus
            : 100;


    const impact =
        tasks
            .filter(task => task.completed)
            .reduce(
                (sum, task) =>
                    sum + task.impact,
                0
            );


    return {

        total,

        completed,

        totalDifficulty,

        averageDifficulty,

        focus,

        resistance,

        impact

    };

}


/* 
   STATUS DO CICLO
 */

function getCycleStatus() {

    const metrics =
        getDailyMetrics();


    if (metrics.total === 0) {

        return {

            title: "AGUARDANDO",

            description:
                "Adicione uma directiva para iniciar o ciclo.",

            type: "idle"

        };

    }


    if (
        metrics.completed ===
        metrics.total
    ) {

        return {

            title: "CICLO CONCLUÍDO",

            description:
                "Todas as directivas foram executadas. O foco foi mantido.",

            type: "success"

        };

    }


    if (
        metrics.completed > 0
    ) {

        return {

            title: "EXECUÇÃO EM CURSO",

            description:
                `${metrics.completed} de ${metrics.total} directivas executadas.`,

            type: "active"

        };

    }


    return {

        title: "CICLO INICIADO",

        description:
            "As directivas estão aguardando execução.",

        type: "active"

    };

}


/* 
   STREAK
 */

function updateStreak() {

    const tasks =
        getTasksToday();


    if (tasks.length === 0) {
        return;
    }


    const allCompleted =
        tasks.every(
            task => task.completed
        );


    const today =
        getToday();


    const existing =
        state.history.find(
            item => item.date === today
        );


    if (existing) {

        existing.success =
            allCompleted;

    } else {


        if (allCompleted) {

            state.history.push({

                date: today,

                success: true

            });

        }

    }


    calculateStreak();

}


function calculateStreak() {

    const successfulDates =
        state.history
            .filter(item => item.success)
            .map(item => item.date)
            .sort()
            .reverse();


    if (
        successfulDates.length === 0
    ) {

        state.streak = 0;

        return;

    }


    let streak = 0;

    let referenceDate =
        new Date();


    for (
        const dateString of successfulDates
    ) {

        const date =
            getDateObject(dateString);


        const difference =
            Math.round(
                (
                    referenceDate - date
                ) /
                (1000 * 60 * 60 * 24)
            );


        if (
            difference === 0 ||
            difference === 1
        ) {

            streak++;

            referenceDate =
                date;

        } else {

            break;

        }

    }


    state.streak =
        streak;

}


/* 
   SEMANA
 */

function getLastSevenDays() {

    const result = [];

    const today =
        new Date();


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date(today);

        date.setDate(
            today.getDate() - i
        );


        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        const dateString =
            `${year}-${month}-${day}`;


        result.push(
            dateString
        );

    }


    return result;

}


/* 
   RENDER SEMANA
 */

function renderWeek() {

    const container =
        document.getElementById(
            "weekTracker"
        );


    container.innerHTML = "";


    const days =
        getLastSevenDays();


    let completedDays = 0;


    days.forEach(dateString => {

        const date =
            getDateObject(dateString);


        const history =
            state.history.find(
                item =>
                    item.date === dateString
            );


        const day =
            document.createElement(
                "div"
            );

        day.className =
            "week-day";


        if (
            dateString === getToday()
        ) {

            day.classList.add(
                "today"
            );

        }


        if (history?.success) {

            day.classList.add(
                "success"
            );

            completedDays++;

        }


        if (
            history &&
            !history.success
        ) {

            day.classList.add(
                "failed"
            );

        }


        const dayNames = [
            "D",
            "S",
            "T",
            "Q",
            "Q",
            "S",
            "S"
        ];


        day.innerHTML = `

            <span class="week-day-label">
                ${dayNames[date.getDay()]}
            </span>

            <div class="week-day-block"></div>

        `;


        container.appendChild(day);

    });


    document.getElementById(
        "weekCompleted"
    ).textContent =
        `${completedDays} / 7`;

}


/* 
   CONQUISTAS
 */

function getAchievements() {

    const totalCompleted =
        state.tasks.filter(
            task => task.completed
        ).length;


    return [

        {

            code: "01",

            name: "PRIMEIRO PASSO",

            unlocked:
                totalCompleted >= 1

        },

        {

            code: "02",

            name: "CONSISTÊNCIA",

            unlocked:
                state.streak >= 3

        },

        {

            code: "03",

            name: "FOCO",

            unlocked:
                totalCompleted >= 10

        },

        {

            code: "04",

            name: "EVOLUÇÃO",

            unlocked:
                state.level >= 5

        }

    ];

}


function renderAchievements() {

    const container =
        document.getElementById(
            "achievementList"
        );


    container.innerHTML = "";


    getAchievements().forEach(
        achievement => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "achievement";


            if (
                achievement.unlocked
            ) {

                element.classList.add(
                    "unlocked"
                );

            }


            element.innerHTML = `

                <div class="achievement-icon">
                    ${achievement.code}
                </div>

                <span class="achievement-name">
                    ${achievement.name}
                </span>

            `;


            container.appendChild(
                element
            );

        }
    );

}


/* 
   RENDER TASKS
 */

function renderTasks() {

    const todayTasks =
        getTasksToday();


    let filtered =
        [...todayTasks];


    if (
        state.activeFilter ===
        "pending"
    ) {

        filtered =
            filtered.filter(
                task =>
                    !task.completed
            );

    }


    if (
        state.activeFilter ===
        "completed"
    ) {

        filtered =
            filtered.filter(
                task =>
                    task.completed
            );

    }


    taskList.innerHTML = "";


    if (filtered.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

    } else {

        emptyState.classList.add(
            "hidden"
        );

    }


    filtered.forEach(task => {

        const item =
            document.createElement(
                "article"
            );


        item.className =
            "task-item";


        if (task.completed) {

            item.classList.add(
                "completed"
            );

        }


        const multiplier =
            task.quickAction
                ? 2
                : 1;


        const earnedXP =
            task.xp * multiplier;


        item.innerHTML = `

            <button
                type="button"
                class="task-checkbox ${task.completed ? "completed" : ""}"
                data-action="complete"
                data-id="${task.id}"
                aria-label="Concluir directiva"
            >
                ${
                    task.completed
                        ? `
                            <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                            >
                                <path d="m5 12 4 4L19 6"/>
                            </svg>
                        `
                        : ""
                }
            </button>


            <div class="min-w-0">

                <p class="task-title">
                    ${escapeHTML(task.title)}
                </p>


                <div class="task-meta">

                    <span class="task-effort ${task.effort}">
                        ${CONFIG.effortName[task.effort]}
                    </span>

                    <span class="separator">/</span>

                    <span>
                        ${task.impact} IMP
                    </span>

                    <span class="separator">/</span>

                    <span>
                        +${earnedXP} XP
                    </span>

                    ${
                        task.quickAction
                            ? `
                                <span class="separator">/</span>
                                <span class="text-[#00A3FF]">
                                    QUICK
                                </span>
                            `
                            : ""
                    }

                </div>

            </div>


            <button
                type="button"
                class="delete-task"
                data-action="delete"
                data-id="${task.id}"
                aria-label="Remover directiva"
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                >
                    <path d="M3 6h18"/>
                    <path d="M8 6V4h8v2"/>
                    <path d="m19 6-1 14H6L5 6"/>
                </svg>
            </button>

        `;


        taskList.appendChild(item);

    });

}


/* 
   ESCAPE HTML
 */

function escapeHTML(value) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* 
   RENDER PERFORMANCE
 */

function renderPerformance() {

    const metrics =
        getDailyMetrics();


    document.getElementById(
        "focusPercentage"
    ).textContent =
        Math.round(metrics.focus);


    document.getElementById(
        "resistancePercentage"
    ).textContent =
        Math.round(metrics.resistance);


    document.getElementById(
        "focusBar"
    ).style.width =
        `${metrics.focus}%`;


    document.getElementById(
        "totalTasks"
    ).textContent =
        formatNumber(metrics.total);


    document.getElementById(
        "completedTasks"
    ).textContent =
        formatNumber(metrics.completed);


    document.getElementById(
        "impactValue"
    ).textContent =
        String(metrics.impact)
            .padStart(3, "0");


    document.getElementById(
        "streakValue"
    ).textContent =
        `${state.streak}D`;


    const nextXP =
        getXpRequired(state.level);


    document.getElementById(
        "levelValue"
    ).textContent =
        formatNumber(state.level);


    document.getElementById(
        "xpCurrent"
    ).textContent =
        state.xp;


    document.getElementById(
        "xpNext"
    ).textContent =
        nextXP;


    document.getElementById(
        "xpBar"
    ).style.width =
        `${Math.min(
            (state.xp / nextXP) * 100,
            100
        )}%`;

}


/* 
   RENDER STATUS
 */

function renderStatus() {

    const status =
        getCycleStatus();


    const title =
        document.getElementById(
            "cycleStatus"
        );


    const description =
        document.getElementById(
            "cycleDescription"
        );


    const indicator =
        document.getElementById(
            "cycleIndicator"
        );


    title.textContent =
        status.title;


    description.textContent =
        status.description;


    indicator.className =
        "w-2 h-2";


    if (
        status.type ===
        "success"
    ) {

        indicator.classList.add(
            "bg-[#00A3FF]"
        );

    } else if (
        status.type ===
        "active"
    ) {

        indicator.classList.add(
            "bg-slate-400"
        );

    } else {

        indicator.classList.add(
            "bg-slate-700"
        );

    }


    const metrics =
        getDailyMetrics();


    const diagnostic =
        document.getElementById(
            "diagnosticText"
        );


    const diagnosticSub =
        document.getElementById(
            "diagnosticSubtext"
        );


    if (
        metrics.total === 0
    ) {

        diagnostic.textContent =
            "Aguardando primeira directiva.";

        diagnosticSub.textContent =
            "Defina uma tarefa para iniciar.";

    } else if (
        metrics.completed ===
        metrics.total
    ) {

        diagnostic.textContent =
            "Todas as directivas foram executadas.";

        diagnosticSub.textContent =
            "Ciclo concluído com foco integral.";

    } else {

        diagnostic.textContent =
            "Execução parcial detectada.";

        diagnosticSub.textContent =
            `${metrics.total - metrics.completed} directiva(s) aguardando ação.`;

    }

}


/* 
   ESTATÍSTICAS
 */

function renderStatistics() {

    document.getElementById(
        "quickActions"
    ).textContent =
        state.statistics.quickActions;


    document.getElementById(
        "goalsReached"
    ).textContent =
        state.statistics.goalsReached;


    document.getElementById(
        "abandonedTasks"
    ).textContent =
        state.statistics.abandonedTasks;

}


/* 
   CONTADORES
 */

function renderCounters() {

    const tasks =
        getTasksToday();


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        tasks.length - completed;


    document.getElementById(
        "activeCount"
    ).textContent =
        formatNumber(pending);


    document.getElementById(
        "allCount"
    ).textContent =
        tasks.length;


    document.getElementById(
        "pendingCount"
    ).textContent =
        pending;


    document.getElementById(
        "completedFilterCount"
    ).textContent =
        completed;

}


/* 
   RENDER GERAL
 */

function render() {

    updateStreak();

    renderPerformance();

    renderTasks();

    renderCounters();

    renderStatus();

    renderWeek();

    renderAchievements();

    renderStatistics();

    saveState();

}


/* 
   FILTROS
 */

function setupFilters() {

    document
        .querySelectorAll(".filter-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.activeFilter =
                        button.dataset.filter;


                    document
                        .querySelectorAll(
                            ".filter-button"
                        )
                        .forEach(item => {

                            item.classList.toggle(
                                "active",
                                item === button
                            );

                        });


                    renderTasks();

                }
            );

        });

}


/* 
   EVENTOS DE TASK
 */

taskList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        const id =
            button.dataset.id;


        if (
            action ===
            "complete"
        ) {

            completeTask(id);

        }


        if (
            action ===
            "delete"
        ) {

            deleteTask(id);

        }

    }
);


/* 
   EVENTOS DE DIFICULDADE
 */

effortButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            selectEffort(
                button.dataset.effort
            );

        }
    );

});


/* 
   EVENTOS DE INPUT
 */

addTaskButton.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            addTask();

        }

    }
);


loadState();

setupFilters();

render();

