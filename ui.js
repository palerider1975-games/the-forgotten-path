import { REGION_NAMES_BY_LEVEL } from './regions.js';
import { ITEM_IMAGES } from './items.js';

const $ = s => document.querySelector(s);

// --- DOM Elements ---
const map = $('#map'), log = $('#log');
const overlay = $('#overlay'), titleEl = $('#dlgTitle'), textEl = $('#dlgText'), msgEl = $('#dlgMsg'), choicesEl = $('#dlgChoices');
const invList = $('#invList');
const overlayConfirm = $('#overlayConfirm'), confirmTextEl = $('#confirmText'), btnConfirmYes = $('#btnConfirmYes'), btnConfirmNo = $('#btnConfirmNo');
const overlayResult = $('#overlayResult'), resultTitleEl = $('#resultTitle'), resultTextEl = $('#resultText'), resultListEl = $('#resultList'), btnResultContinue = $('#btnResultContinue');
const overlayDungeon = $('#overlayDungeon'), dungeonTitleEl = $('#dungeonTitle'), dungeonGridEl = $('#dungeonGrid'), dungeonStatusEl = $('#dungeonStatus');
const overlayCombat = $('#overlayCombat'), combatTitleEl = $('#combatTitle'), combatTextEl = $('#combatText'), combatRollsEl = $('#combatRolls'), btnCombatAction = $('#btnCombatAction');
const hpEl = $('#hp'), clearedCountEl = $('#clearedCount'), goldEl = $('#gold'), regionLevelEl = $('#regionLevel'), playerLevelEl = $('#playerLevel'), playerXpEl = $('#playerXp'), gearCountEl = $('#gearCount');
const btnNextLevel = $('#btnNextLevel');
const btnCloseDungeon = $('#btnCloseDungeon');

export const elements = {
    map, log, overlay, titleEl, textEl, msgEl, choicesEl, invList,
    overlayConfirm, confirmTextEl, btnConfirmYes, btnConfirmNo,
    overlayResult, resultTitleEl, resultTextEl, resultListEl, btnResultContinue,
    overlayDungeon, dungeonTitleEl, dungeonGridEl, dungeonStatusEl, btnCloseDungeon,
    overlayCombat, combatTitleEl, combatTextEl, combatRollsEl, btnCombatAction,
    hpEl, clearedCountEl, goldEl, regionLevelEl, playerLevelEl, playerXpEl, gearCountEl, btnNextLevel
};

export function updateStats(state) {
    hpEl.textContent = `${state.hp}/${state.maxHp}`;
    hpEl.parentElement.style.color = state.hp <= state.maxHp / 4 ? 'var(--bad)' : 'var(--ink)';
    clearedCountEl.textContent = `${state.cleared}/10`;
    goldEl.textContent = state.gold;
    gearCountEl.textContent = state.gear.length;
    regionLevelEl.textContent = state.regionLevel;
    playerLevelEl.textContent = state.playerLevel;
    playerXpEl.textContent = `${state.playerXp}/10`;
}

export function updateSideInventory(gear) {
    let html = gear.length
        ? `<div class="inv-grid">${gear.map(g => `<div class="inv-item" title="${g}"><img src="${ITEM_IMAGES[g] || ''}" alt="${g}"><span class="inv-item-name">${g}</span></div>`).join('')}</div>`
        : '<p style="font-size: 0.85rem; opacity: 0.7;">Vide</p>';
    invList.innerHTML = html;
}

export function genMap(regions, regionLevel) {
    map.innerHTML = '';
    for (let id = 0; id < 10; id++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = id;

        const regionData = regions[id];
        if (regionData && regionData.event && regionData.event.type === 'dungeon') {
            card.classList.add('is-dungeon');
        }

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        const currentRegionNames = REGION_NAMES_BY_LEVEL[regionLevel] || REGION_NAMES_BY_LEVEL[1];
        cardFront.className = 'card-front';
        cardFront.textContent = currentRegionNames[id % currentRegionNames.length];

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span style="font-size: 0.8rem; margin-top: 4px;">Complété</span>
        `;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        map.appendChild(card);
    }
}

export function renderClasses(regions) {
    const cards = document.querySelectorAll('#map .card');
    cards.forEach((cardNode, i) => {
        const region = regions[i];
        if (!region) return;
        cardNode.classList.toggle('is-flipped', !!region.cleared);
        cardNode.classList.toggle('is-dead', !!region.dead);

        if (region.cleared || region.dead) {
            cardNode.style.pointerEvents = 'none';
        } else {
            cardNode.style.pointerEvents = 'auto';
        }
    });
}

export function addLog(t) {
    const e = document.createElement('div');
    e.className = 'entry';
    e.innerHTML = t;
    log.prepend(e);
}

export function showReq(msg) {
    msgEl.textContent = msg;
    msgEl.style.display = 'block';
    setTimeout(() => msgEl.style.display = 'none', 1500);
}

// --- Modals ---
export function openModal(title, text, choices, onChoice, options = {}) {
    titleEl.textContent = title;
    textEl.innerHTML = text;
    msgEl.style.display = 'none';
    choicesEl.innerHTML = '';
    choices.forEach(choice => {
        const b = document.createElement('button');
        const label = typeof choice === 'string' ? choice : choice.label;
        b.textContent = label;
        b.className = 'ghost';

        const choiceObject = choices.find(c => (typeof c === 'string' ? c : c.label) === label);
        if (options.isHinted && choiceObject && typeof choiceObject === 'object' && choiceObject.best) {
            b.classList.add('is-hinted-good');
        }

        if (typeof choice === 'object' && choice.disabled) {
            b.disabled = true;
            b.title = "Vous n'avez pas tous les objets requis.";
        }

        b.onclick = () => onChoice(label);
        choicesEl.appendChild(b);
    });
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
}

export function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
}

export function showConfirm(text, onYes, onNo) {
    confirmTextEl.textContent = text;
    overlayConfirm.classList.add('open');
    btnConfirmYes.onclick = () => {
        overlayConfirm.classList.remove('open');
        if (onYes) onYes();
    };
    btnConfirmNo.onclick = () => {
        overlayConfirm.classList.remove('open');
        if (onNo) onNo();
    };
    overlayConfirm.addEventListener('click', (e) => { if (e.target === overlayConfirm) overlayConfirm.classList.remove('open'); });
}

export function showResultModal(title, text, results, onContinueCallback) {
    closeModal();
    resultTitleEl.textContent = title;
    resultTextEl.innerHTML = text;
    resultListEl.innerHTML = '';
    if (results) {
        results.forEach(res => {
            const li = document.createElement('li');
            li.innerHTML = res.text;
            if (res.type === 'bad') li.className = 'bad';
            resultListEl.appendChild(li);
        });
    }
    overlayResult.classList.add('open');
    btnResultContinue.onclick = () => {
        overlayResult.classList.remove('open');
        if (onContinueCallback) {
            onContinueCallback();
        }
    };
}

export function renderDungeon(dungeon) {
    if (!dungeon) return;
    const { map, playerPos } = dungeon;
    dungeonGridEl.innerHTML = '';
    dungeonGridEl.style.gridTemplateColumns = `repeat(${map[0].length}, 1fr)`;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            let type = map[y][x];

            switch(type) {
                case 'F': tile.classList.add('tile-floor'); break;
                case 'E': tile.classList.add('tile-exit'); tile.textContent = '🚪'; break;
                case 'M': tile.classList.add('tile-monster'); tile.textContent = dungeon.monsters[`${x},${y}`]?.emoji || '💀'; break;
                case 'T': tile.classList.add('tile-treasure'); tile.textContent = '💰'; break;
            }

            if (x === playerPos.x && y === playerPos.y) {
                tile.classList.add('tile-player');
                tile.textContent = '🙂';
            }
             tile.dataset.x = x;
             tile.dataset.y = y;
            
            dungeonGridEl.appendChild(tile);
        }
    }
}

