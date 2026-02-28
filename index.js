let questions = [];

(async () => {
questions = await fetch('questions.json').then(r => r.json());
render();
})();

const userAnswers = Array(100).fill(null);
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

function render() {
const q = questions[current];
elCurrentNum.textContent = current + 1;
elQuestionTitle.textContent = `${current+1}. ${q.title}`;
elOptions.innerHTML = '';

q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'option ' + (userAnswers[current] === i ? 'selected' : '');
    div.textContent = `${String.fromCharCode(65+i)}. ${opt}`;
    div.onclick = () => {
    userAnswers[current] = i;
    render();
    updateDoneCount();
    };
    elOptions.appendChild(div);
});

elPrev.disabled = current === 0;
updateDoneCount();
}

function updateDoneCount() {
const c = userAnswers.filter(x => x !== null).length;
elDoneCount.textContent = c;
}

function calcScore() {
let system = 0, network = 0, code = 0, low = 0, front = 0;
questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) {
    switch(q.type) {
        case 'system': system++; break;
        case 'network': network++; break;
        case 'code': code++; break;
        case 'low': low++; break;
        case 'front': front++; break;
    }
    }
});
const total = system + network + code + low + front;

let level = '';
let levelClass = '';
if (total >= 90) {
    level = '人上人';
    levelClass = 'level-top';
} else if (total >= 80) {
    level = '顶尖';
    levelClass = 'level-ding';
} else if (total >= 60) {
    level = '夯';
    levelClass = 'level-hang';
} else if (total >= 40) {
    level = 'NPC';
    levelClass = 'level-npc';
} else {
    level = '拉';
    levelClass = 'level-rula';
}

document.getElementById('score-system').textContent = system;
document.getElementById('score-network').textContent = network;
document.getElementById('score-code').textContent = code;
document.getElementById('score-low').textContent = low;
document.getElementById('score-front').textContent = front;
document.getElementById('score-total').textContent = total;

elLevelText.className = 'level-text ' + levelClass;
elLevelText.textContent = '技术评级：' + level;
elScoreBox.style.display = 'block';
}

elPrev.onclick = () => { current--; render(); };
elNext.onclick = () => { current++; render(); };
elSubmitAll.onclick = calcScore;
elJumpBtn.onclick = () => {
const v = parseInt(elJumpInput.value);
if (v >=1 && v <=100) {
    current = v - 1;
    render();
}
};