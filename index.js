let questions = [];
let userAnswers = [];
let current = 0;

const elCurrentNum = document.getElementById('current-num');
const elDoneCount = document.getElementById('done-count');
const elQuestionTitle = document.getElementById('question-title');
const elOptions = document.getElementById('options');
const elPrev = document.getElementById('prev');
const elNext = document.getElementById('next');
const elSubmitAll = document.getElementById('submit-all');
const elJumpInput = document.getElementById('jump-input');
const elJumpBtn = document.getElementById('jump-btn');
const elScoreBox = document.getElementById('score-box');
const elLevelText = document.getElementById('level-text');

(async () => {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        userAnswers = Array(questions.length).fill(null);
        render();
    } catch (error) {
        console.error("题库加载失败:", error);
        elQuestionTitle.textContent = "题库加载失败，请检查 questions.json 文件。";
    }
})();


function render() {
    if (questions.length === 0) return;

    const q = questions[current];

    elCurrentNum.textContent = current + 1;
    elQuestionTitle.textContent = `${current + 1}. ${q.title}`;

    elOptions.innerHTML = '';
    q.options.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = 'option ' + (userAnswers[current] === i ? 'selected' : '');
        div.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
        
        div.onclick = () => {
            userAnswers[current] = i;
            render();
            updateDoneCount();
        };
        elOptions.appendChild(div);
    });

    elPrev.disabled = current === 0;
    elNext.disabled = current === questions.length - 1;
    updateDoneCount();
}

function updateDoneCount() {
    const count = userAnswers.filter(x => x !== null).length;
    elDoneCount.textContent = count;
}

function calcScore() {
    const categoryScores = {
        basic: 0, hardware: 0, os: 0, tools: 0, network: 0,
        ops: 0, frontend: 0, backend: 0, media: 0, solve: 0
    };

    questions.forEach((q, i) => {
        if (userAnswers[i] === q.answer) {
            if (categoryScores.hasOwnProperty(q.type)) {
                categoryScores[q.type]++;
            }
        }
    });

    const total = Object.values(categoryScores).reduce((a, b) => a + b, 0);

    for (const [category, score] of Object.entries(categoryScores)) {
        const span = document.getElementById(`score-${category}`);
        if (span) span.textContent = score;
    }

    document.getElementById('score-total').textContent = total;

    let level = '';
    let levelClass = '';
    if (total >= 90) {
        level = '夯';
        levelClass = 'level-top';
    } else if (total >= 80) {
        level = '顶尖';
        levelClass = 'level-ding';
    } else if (total >= 60) {
        level = '人上人';
        levelClass = 'level-hang';
    } else if (total >= 40) {
        level = 'NPC';
        levelClass = 'level-npc';
    } else {
        level = '拉';
        levelClass = 'level-rula';
    }

    elLevelText.className = 'level-text ' + levelClass;
    elLevelText.textContent = '技术评级：' + level;
    
    elScoreBox.style.display = 'block';
    elScoreBox.scrollIntoView({ behavior: 'smooth' });
}

elPrev.onclick = () => {
    if (current > 0) {
        current--;
        render();
    }
};

elNext.onclick = () => {
    if (current < questions.length - 1) {
        current++;
        render();
    }
};

elSubmitAll.onclick = () => {
    const remaining = questions.length - userAnswers.filter(x => x !== null).length;
    if (remaining > 0) {
        if (confirm(`还有 ${remaining} 道题未完成，确定要交卷吗？`)) {
            calcScore();
        }
    } else {
        calcScore();
    }
};

elJumpBtn.onclick = () => {
    const val = parseInt(elJumpInput.value);
    if (val >= 1 && val <= questions.length) {
        current = val - 1;
        render();
    } else {
        alert(`请输入 1 到 ${questions.length} 之间的题号`);
    }
};
