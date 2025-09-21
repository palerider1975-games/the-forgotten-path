import { shuffle, choice } from './game.js';
import { DUNGEON_MONSTERS } from './monsters.js';

export function generateDungeon(width, height, level) {
    let map = Array(height).fill(null).map(() => Array(width).fill('W'));
    let playerPos = { x: 0, y: 0 };
    let floorTiles = [];
    let monsters = {};

    function carve(x, y) {
        map[y][x] = 'F';
        floorTiles.push({x, y});
        const dirs = shuffle([{x:0,y:-2},{x:0,y:2},{x:-2,y:0},{x:2,y:0}]);
        for(const dir of dirs) {
            const nx = x + dir.x, ny = y + dir.y;
            if (nx > 0 && nx < width-1 && ny > 0 && ny < height-1 && map[ny][nx] === 'W') {
                map[y + dir.y/2][x + dir.x/2] = 'F';
                carve(nx, ny);
            }
        }
    }
    const startX = 1, startY = 1;
    carve(startX, startY);
    playerPos = {x: startX, y: startY};
    
    let placed = 0;
    const validTiles = shuffle(floorTiles.filter(t => t.x !== startX || t.y !== startY));
    
    for(const tile of validTiles) {
        if (placed >= 4 + level * 2) break;
        if (placed === 0) {
            map[tile.y][tile.x] = 'E'; // Exit
        } else if (placed % 2 === 1) { // Monster
            map[tile.y][tile.x] = 'M';
            monsters[`${tile.x},${tile.y}`] = choice(DUNGEON_MONSTERS);
        } else { // Treasure
            map[tile.y][tile.x] = 'T';
        }
        placed++;
    }
    return { map, playerPos, monsters };
}

