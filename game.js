import { WEAPONS, GEAR_POOL } from './items.js';
import { EVENTS, OUTCOME_TEXTS } from './events.js';
import { REGION_NAMES_BY_LEVEL } from './regions.js';
import { generateDungeon } from './dungeon.js';
import * as UI from './ui.js';

// --- Game State ---
let state = { regionLevel:1, playerLevel: 1, playerXp: 0, cleared:0, gold:0, gear:[], regions:[], activeDungeon: null, currentRegionId: null, hp: 10, maxHp: 10, hintedRegions: [] };

// ---------- Helpers ----------
function rand(n){ return Math.floor(Math.random()*n); }
function choice(a){ return a[rand(a.length)]; }
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function save(){ localStorage.setItem("regions_blobs_tiered_v30_final", JSON.stringify(state)); }
function load(){
    const s = localStorage.getItem("regions_blobs_tiered_v30_final");
    if(s){
        const v=JSON.parse(s);
        state.regionLevel=v.regionLevel||1;
        state.playerLevel = v.playerLevel || 1;
        state.playerXp = v.playerXp || 0;
        state.cleared=v.cleared||0;
        state.gold=v.gold||0;
        state.hp = v.hp !== undefined ? v.hp : 10;
        state.maxHp = v.maxHp !== undefined ? v.maxHp : 10;
        state.gear=Array.isArray(v.gear)?v.gear:[];
        state.regions=Array.isArray(v.regions)?v.regions:[];
        state.activeDungeon = v.activeDungeon || null;
        state.hintedRegions = v.hintedRegions || [];
    }
}

function hasItem(name){ return state.gear.includes(name); }
function hasWeapon(){ return state.gear.some(g => WEAPONS.includes(g)); }

function reqFor(label){
    const L = label.toLowerCase();
    if(L === 'fight') return { weapon:true };
    if(L.includes('rope')) return { item:'Rope' };
    if(L.includes('torch')) return { item:'Torch' };
    if(L === 'offer 10 gold') return { gold: 10 };
    if(L === 'pay' || L.startsWith('pay ') || L.includes('(15 or)') || L === 'trade (20 gold)') return { gold: 20 };
    return {};
}

function takeDamage(amount) {
    state.hp = Math.max(0, state.hp - amount);
    UI.updateStats(state);
    return state.hp <= 0; // Return true if dead
}

function heal(amount) {
    state.hp = Math.min(state.maxHp, state.hp + amount);
    UI.updateStats(state);
}

function generateRequirementsHtml(items) {
    if (!items || items.length === 0) return '';
    const listItems = items.map(item => {
        const has = hasItem(item);
        const icon = has ? `<span style="color:var(--ok);">✔</span>` : `<span style="color:var(--bad);">❌</span>`;
        return `<li style="list-style:none; margin-bottom:4px; font-weight: 500;">${icon} ${item}</li>`;
    }).join('');
    return `<ul style="padding:0; margin:0;">${listItems}</ul>`;
}

function checkPlayerLevelUp() {
    if (state.playerXp >= 10) {
        state.playerLevel++;
        state.playerXp -= 10;
        const hpGain = 10;
        state.maxHp += hpGain;
        heal(hpGain);
        UI.addLog(`<h2>🌟 LEVEL UP! You are now Player Level ${state.playerLevel}!</h2>`);
        const results = [
            { text: `Max HP increased to ${state.maxHp}!`, type: 'good' },
            { text: `All dice rolls gain a permanent +1 bonus!`, type: 'good' }
        ];
        const onContinue = () => {
            UI.updateStats(state);
            save();
        };
        UI.showResultModal(`Level Up! You reached Level ${state.playerLevel}!`, `You feel more experienced and powerful.`, results, onContinue);
        return true;
    }
    return false;
}

function gameOver(){
    UI.renderClasses(state.regions);
    UI.addLog(`<h2>GAME OVER</h2>`);
    UI.showConfirm(choice(OUTCOME_TEXTS.DEATH) + " Restart this Region Level?",
        () => startRegionLevel(state.regionLevel),
        () => newGame()
    );
}

function checkLevelCompletion() {
    const clearedCount = state.regions.filter(r => r.cleared || r.dead).length;
    state.cleared = clearedCount;
    UI.updateStats(state);

    if (clearedCount >= 8) {
        UI.elements.btnNextLevel.disabled = false;
        UI.addLog('✨ Vous avez exploré suffisamment de régions ! Passez au niveau suivant.');
    } else {
        UI.elements.btnNextLevel.disabled = true;
    }
}

function startRegionLevel(levelNum){
    state.regionLevel = levelNum;
    state.cleared = 0;
    state.hintedRegions = [];
    state.maxHp = 10 + (state.playerLevel - 1) * 10;
    state.hp = state.maxHp;
    
    const allEventsForLevel = EVENTS.filter(e => e.level === levelNum);
    const dungeonEvents = allEventsForLevel.filter(e => e.type === 'dungeon');
    const regularEvents = allEventsForLevel.filter(e => e.type !== 'dungeon');
    
    let eventPool = [];

    // Add one dungeon if available for the level
    if (dungeonEvents.length > 0) {
        eventPool.push(choice(dungeonEvents));
    }
    
    shuffle(regularEvents);
    while(eventPool.length < 10 && regularEvents.length > 0) {
        eventPool.push(regularEvents.pop());
    }
    
    if(eventPool.length < 10) {
        const lowerLevelRegulars = EVENTS.filter(e => e.level < levelNum && e.type !== 'dungeon');
        shuffle(lowerLevelRegulars);
        while(eventPool.length < 10 && lowerLevelRegulars.length > 0) {
            eventPool.push(lowerLevelRegulars.pop());
        }
    }

    shuffle(eventPool);
    const finalEvents = eventPool.slice(0, 10);

    state.regions = Array(10).fill(0).map((_, i) => ({
        cleared:false, 
        dead:false,
        event: finalEvents[i] || choice(EVENTS.filter(e => e.type !== 'dungeon')) 
    }));
    
    UI.genMap(state.regions, state.regionLevel, REGION_NAMES_BY_LEVEL);
    UI.renderClasses(state.regions);
    UI.updateStats(state);
    UI.updateSideInventory(state.gear);
    checkLevelCompletion();
    save();
}

function newGame(){
    state = { regionLevel:1, playerLevel: 1, playerXp: 0, cleared:0, gold:0, gear:[], regions:[], activeDungeon: null, currentRegionId: null, hp: 10, maxHp: 10, hintedRegions: [] };
    UI.log.innerHTML = '';
    UI.addLog("🌟 New adventure begins!");
    startRegionLevel(1);
}

// --- Init ---
load(); 
if (state.regions.length === 0 || !state.regions.find(r => r.event)) {
    startRegionLevel(state.regionLevel);
} else {
    UI.genMap(state.regions, state.regionLevel, REGION_NAMES_BY_LEVEL);
    UI.renderClasses(state.regions);
}
UI.updateStats(state);
UI.updateSideInventory(state.gear);
checkLevelCompletion();
UI.addLog("Welcome back, adventurer!");

UI.elements.btnNew.addEventListener('click', () => UI.showConfirm('Start a new run? All progress will be lost.', newGame));
UI.elements.btnReset.addEventListener('click', () => UI.showConfirm('Delete all saves and restart from scratch?', () => { localStorage.removeItem(SAVE_KEY); newGame(); }));
UI.elements.btnNextLevel.addEventListener('click', () => {
    if (UI.elements.btnNextLevel.disabled) return;
    UI.addLog(`<h2>🗺️ En route pour le niveau de région ${state.regionLevel + 1} !</h2>`);
    startRegionLevel(state.regionLevel + 1);
});
UI.elements.map.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) {
        openEvent(parseInt(card.dataset.id, 10));
    }
});
