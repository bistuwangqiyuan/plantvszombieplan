/**
 * game.js - 游戏核心逻辑
 * 包含游戏主循环、碰撞检测、阳光系统、胜负判定等
 */

// 网格配置
const GRID = {
    rows: 5,
    cols: 3,
    cellWidth: 90,
    cellHeight: 100,
    offsetX: 0,
    offsetY: 0
};

// 游戏状态
let gameState = {
    state: 'menu', // menu, playing, paused, victory, defeat
    currentLevel: null,
    levelConfig: null,
    
    // 游戏对象
    plants: [],
    zombies: [],
    projectiles: [],
    suns: [],
    grid: Array(5).fill(null).map(() => Array(3).fill(null)),
    
    // 资源
    sunAmount: 150,
    
    // 植物选择
    selectedPlant: null,
    availablePlants: [],
    plantCooldowns: {},
    
    // 僵尸生成
    spawner: null,
    
    // 统计
    zombiesKilled: 0,
    plantsLost: 0,
    
    // 游戏结束
    gameOver: false,
    victory: false,
    
    // 阳光自动掉落
    lastSunDropTime: 0,
    sunDropInterval: 10000 // 10秒
};

// 游戏循环相关
let lastTime = 0;
let animationId = null;

// 将gameState暴露到全局，供其他模块访问
window.gameState = gameState;

/**
 * 坐标转换：屏幕坐标 -> 网格坐标
 */
function screenToGrid(x, y) {
    const gridContainer = document.getElementById('grid-container');
    if (!gridContainer) return { row: -1, col: -1 };
    
    const rect = gridContainer.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;
    
    const col = Math.floor(relX / (GRID.cellWidth + 5)); // +5 for gap
    const row = Math.floor(relY / (GRID.cellHeight + 5));
    
    if (row >= 0 && row < GRID.rows && col >= 0 && col < GRID.cols) {
        return { row, col };
    }
    return { row: -1, col: -1 };
}

/**
 * 坐标转换：网格坐标 -> 屏幕坐标（中心点）
 */
function gridToScreen(row, col) {
    const gridContainer = document.getElementById('grid-container');
    if (!gridContainer) return { x: 0, y: 0 };
    
    const rect = gridContainer.getBoundingClientRect();
    
    const x = rect.left + col * (GRID.cellWidth + 5) + GRID.cellWidth / 2;
    const y = rect.top + row * (GRID.cellHeight + 5) + GRID.cellHeight / 2;
    
    return { x, y };
}

// 暴露给全局
window.gridToScreen = gridToScreen;
window.screenToGrid = screenToGrid;

/**
 * 初始化游戏关卡
 */
function initGame(levelId) {
    console.log('初始化关卡:', levelId);
    
    // 重置游戏状态
    gameState.state = 'playing';
    gameState.currentLevel = levelId;
    gameState.levelConfig = getLevelConfig(levelId);
    
    gameState.plants = [];
    gameState.zombies = [];
    gameState.projectiles = [];
    gameState.suns = [];
    gameState.grid = Array(5).fill(null).map(() => Array(3).fill(null));
    
    gameState.sunAmount = gameState.levelConfig.initialSun;
    gameState.selectedPlant = null;
    gameState.availablePlants = gameState.levelConfig.availablePlants;
    gameState.plantCooldowns = {};
    
    gameState.zombiesKilled = 0;
    gameState.plantsLost = 0;
    gameState.gameOver = false;
    gameState.victory = false;
    
    gameState.lastSunDropTime = Date.now();
    
    // 应用关卡特殊规则
    applyLevelRules();
    
    // 初始化僵尸生成器
    gameState.spawner = new ZombieSpawner(gameState.levelConfig);
    
    // 清空游戏层
    document.getElementById('grid-container').innerHTML = '';
    document.getElementById('zombie-layer').innerHTML = '';
    document.getElementById('projectile-layer').innerHTML = '';
    document.getElementById('sun-layer').innerHTML = '';
    
    // 创建网格
    createGrid();
    
    // 初始化植物选择栏
    initPlantSelector();
    
    // 更新UI
    updateSunDisplay();
    updateWaveDisplay(`第1波 / 共${gameState.levelConfig.waves.length}波`);
    showHint('点击植物后点击格子种植', 'normal');
    
    // 启动游戏循环
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    lastTime = performance.now();
    gameLoop(lastTime);
}

/**
 * 应用关卡特殊规则
 */
function applyLevelRules() {
    const rules = gameState.levelConfig.specialRules;
    if (!rules) return;
    
    // 修改植物属性
    if (rules.wallnutCooldownMultiplier) {
        // 坚果墙冷却减半等
        const wallnut = PLANT_DATA['wallnut'];
        if (wallnut) {
            wallnut.cooldownModified = wallnut.cooldown * rules.wallnutCooldownMultiplier;
        }
    }
    
    if (rules.snowpeaCostReduction) {
        // 寒冰射手消耗降低
        const snowpea = PLANT_DATA['snowpea'];
        if (snowpea) {
            snowpea.costModified = snowpea.cost - rules.snowpeaCostReduction;
        }
    }
    
    if (rules.cooldownMultiplier) {
        // 所有植物冷却减少
        Object.values(PLANT_DATA).forEach(plant => {
            plant.cooldownModified = plant.cooldown * rules.cooldownMultiplier;
        });
    }
}

/**
 * 创建网格
 */
function createGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    
    for (let row = 0; row < GRID.rows; row++) {
        for (let col = 0; col < GRID.cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            
            gridContainer.appendChild(cell);
        }
    }
}

/**
 * 初始化植物选择栏
 */
function initPlantSelector() {
    const selector = document.getElementById('plant-selector');
    selector.innerHTML = '';
    
    gameState.availablePlants.forEach(plantId => {
        const plantData = getPlantData(plantId);
        if (!plantData) return;
        
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.dataset.plantId = plantId;
        
        const emoji = document.createElement('span');
        emoji.className = 'plant-card-emoji';
        emoji.textContent = plantData.emoji;
        
        // 应用关卡特殊规则的消耗
        let cost = plantData.cost;
        if (plantData.costModified !== undefined) {
            cost = plantData.costModified;
        }
        
        const costSpan = document.createElement('span');
        costSpan.className = 'plant-card-cost';
        costSpan.textContent = cost;
        
        card.appendChild(emoji);
        card.appendChild(costSpan);
        
        card.addEventListener('click', () => handlePlantSelect(plantId));
        
        selector.appendChild(card);
    });
}

/**
 * 处理植物选择
 */
function handlePlantSelect(plantId) {
    const plantData = getPlantData(plantId);
    if (!plantData) return;
    
    // 应用关卡特殊规则的消耗
    let cost = plantData.cost;
    if (plantData.costModified !== undefined) {
        cost = plantData.costModified;
    }
    
    // 检查阳光是否足够
    if (gameState.sunAmount < cost) {
        showHint('阳光不足！', 'warning');
        return;
    }
    
    // 检查冷却
    if (gameState.plantCooldowns[plantId]) {
        const now = Date.now();
        if (now < gameState.plantCooldowns[plantId]) {
            showHint('植物冷却中！', 'warning');
            return;
        }
    }
    
    // 选择植物
    gameState.selectedPlant = plantId;
    
    // 更新UI
    document.querySelectorAll('.plant-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.plantId === plantId) {
            card.classList.add('selected');
        }
    });
    
    // 显示预览
    showPlantPreview(true);
    showHint('选择一个格子种植植物', 'normal');
}

/**
 * 显示/隐藏植物预览
 */
function showPlantPreview(show) {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        if (show && !cell.classList.contains('occupied')) {
            cell.classList.add('preview');
        } else {
            cell.classList.remove('preview');
        }
    });
}

/**
 * 处理格子点击
 */
function handleCellClick(row, col) {
    if (!gameState.selectedPlant) return;
    
    // 检查格子是否被占用
    if (gameState.grid[row][col]) {
        showHint('该格子已有植物！', 'warning');
        return;
    }
    
    const plantData = getPlantData(gameState.selectedPlant);
    if (!plantData) return;
    
    // 应用关卡特殊规则的消耗
    let cost = plantData.cost;
    if (plantData.costModified !== undefined) {
        cost = plantData.costModified;
    }
    
    // 再次检查阳光
    if (gameState.sunAmount < cost) {
        showHint('阳光不足！', 'warning');
        return;
    }
    
    // 种植植物
    const plant = createPlant(gameState.selectedPlant, row, col);
    gameState.plants.push(plant);
    gameState.grid[row][col] = plant;
    
    // 扣除阳光
    gameState.sunAmount -= cost;
    updateSunDisplay();
    
    // 开始冷却
    let cooldown = plantData.cooldown;
    if (plantData.cooldownModified !== undefined) {
        cooldown = plantData.cooldownModified;
    }
    
    gameState.plantCooldowns[gameState.selectedPlant] = Date.now() + cooldown;
    
    // 标记格子为占用
    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        cell.classList.add('occupied');
    }
    
    // 取消选择
    gameState.selectedPlant = null;
    document.querySelectorAll('.plant-card').forEach(card => {
        card.classList.remove('selected');
    });
    showPlantPreview(false);
    showHint('植物种植成功！', 'normal');
}

/**
 * 游戏主循环
 */
function gameLoop(currentTime) {
    if (gameState.state !== 'playing') {
        animationId = requestAnimationFrame(gameLoop);
        return;
    }
    
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // 限制最大时间步长，避免卡顿时出现问题
    const safeDeltaTime = Math.min(deltaTime, 100);
    
    updateGame(currentTime, safeDeltaTime);
    updateCooldowns();
    
    // 继续循环
    animationId = requestAnimationFrame(gameLoop);
}

/**
 * 更新游戏状态
 */
function updateGame(currentTime, deltaTime) {
    // 生成僵尸
    if (gameState.spawner) {
        const newZombies = gameState.spawner.update(currentTime);
        gameState.zombies.push(...newZombies);
    }
    
    // 更新植物
    gameState.plants.forEach(plant => {
        if (plant.isAlive) {
            plant.update(currentTime);
        }
    });
    
    // 更新僵尸
    gameState.zombies.forEach(zombie => {
        if (zombie.isAlive) {
            zombie.update(currentTime, deltaTime);
        }
    });
    
    // 更新子弹
    gameState.projectiles.forEach(projectile => {
        if (projectile.isAlive) {
            projectile.update(deltaTime);
        }
    });
    
    // 碰撞检测
    checkCollisions();
    
    // 阳光自动掉落
    if (currentTime - gameState.lastSunDropTime >= gameState.sunDropInterval) {
        dropRandomSun();
        gameState.lastSunDropTime = currentTime;
    }
    
    // 更新太阳
    updateSuns(currentTime);
    
    // 清理死亡对象
    cleanupDeadObjects();
    
    // 检查游戏结束
    checkGameOver();
}

/**
 * 碰撞检测
 */
function checkCollisions() {
    // 子弹与僵尸碰撞
    gameState.projectiles.forEach(projectile => {
        if (!projectile.isAlive) return;
        
        // 只检测同行的僵尸
        const zombiesInRow = gameState.zombies.filter(z => 
            z.isAlive && z.row === projectile.row
        );
        
        zombiesInRow.forEach(zombie => {
            // 简单的矩形碰撞检测
            const distance = Math.abs(zombie.x - projectile.x);
            if (distance < 40) { // 碰撞阈值
                projectile.hit(zombie);
            }
        });
    });
}

/**
 * 清理死亡对象
 */
function cleanupDeadObjects() {
    gameState.plants = gameState.plants.filter(p => p.isAlive);
    gameState.zombies = gameState.zombies.filter(z => z.isAlive);
    gameState.projectiles = gameState.projectiles.filter(p => p.isAlive);
}

/**
 * 检查游戏结束
 */
function checkGameOver() {
    // 检查失败
    if (gameState.gameOver && !gameState.victory) {
        endGame(false);
        return;
    }
    
    // 检查胜利：所有波次完成且所有僵尸被消灭
    if (gameState.spawner && gameState.spawner.isComplete()) {
        const allZombiesDead = gameState.zombies.every(z => !z.isAlive);
        if (allZombiesDead) {
            endGame(true);
        }
    }
}

/**
 * 结束游戏
 */
function endGame(victory) {
    gameState.state = victory ? 'victory' : 'defeat';
    gameState.gameOver = true;
    gameState.victory = victory;
    
    // 停止游戏循环
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // 更新统计
    updateStats({
        zombiesKilled: gameState.zombiesKilled,
        gamesPlayed: 1
    });
    
    if (victory) {
        // 更新进度
        updateProgress(gameState.currentLevel);
        
        // 显示胜利界面
        showVictoryScreen();
    } else {
        // 显示失败界面
        showDefeatScreen();
    }
}

/**
 * 更新冷却状态
 */
function updateCooldowns() {
    const now = Date.now();
    
    gameState.availablePlants.forEach(plantId => {
        const card = document.querySelector(`.plant-card[data-plant-id="${plantId}"]`);
        if (!card) return;
        
        const plantData = getPlantData(plantId);
        if (!plantData) return;
        
        // 应用关卡特殊规则的消耗和冷却
        let cost = plantData.cost;
        if (plantData.costModified !== undefined) {
            cost = plantData.costModified;
        }
        
        // 检查阳光是否足够
        if (gameState.sunAmount < cost) {
            card.classList.add('disabled');
        } else {
            card.classList.remove('disabled');
        }
        
        // 检查冷却
        if (gameState.plantCooldowns[plantId] && now < gameState.plantCooldowns[plantId]) {
            card.classList.add('cooling');
            
            // 显示冷却倒计时
            const remaining = Math.ceil((gameState.plantCooldowns[plantId] - now) / 1000);
            let overlay = card.querySelector('.cooldown-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'cooldown-overlay';
                card.appendChild(overlay);
            }
            overlay.textContent = remaining;
        } else {
            card.classList.remove('cooling');
            const overlay = card.querySelector('.cooldown-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    });
}

/**
 * 创建太阳
 */
function createSun(x, y, amount = 25) {
    const sun = {
        x: x,
        y: y,
        amount: amount,
        createdTime: Date.now(),
        lifetime: 8000, // 8秒后消失
        isCollected: false,
        element: null
    };
    
    // 创建DOM元素
    sun.element = document.createElement('div');
    sun.element.className = 'sun-object';
    sun.element.style.left = x + 'px';
    sun.element.style.top = y + 'px';
    sun.element.textContent = '☀️';
    
    sun.element.addEventListener('click', () => collectSun(sun));
    
    document.getElementById('sun-layer').appendChild(sun.element);
    
    gameState.suns.push(sun);
}

/**
 * 掉落随机太阳
 */
function dropRandomSun() {
    const gridContainer = document.getElementById('grid-container');
    if (!gridContainer) return;
    
    const rect = gridContainer.getBoundingClientRect();
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    
    createSun(x, y, 25);
}

/**
 * 收集太阳
 */
function collectSun(sun) {
    if (sun.isCollected) return;
    
    sun.isCollected = true;
    
    // 动画：飞向阳光计数器
    if (sun.element) {
        const sunCounter = document.querySelector('.sun-counter');
        const counterRect = sunCounter.getBoundingClientRect();
        
        const deltaX = counterRect.left - sun.x;
        const deltaY = counterRect.top - sun.y;
        
        sun.element.style.setProperty('--target-x', deltaX + 'px');
        sun.element.style.setProperty('--target-y', deltaY + 'px');
        sun.element.classList.add('collecting');
        
        setTimeout(() => {
            gameState.sunAmount += sun.amount;
            updateSunDisplay();
            if (sun.element && sun.element.parentNode) {
                sun.element.remove();
            }
        }, 500);
    }
}

/**
 * 更新太阳状态
 */
function updateSuns(currentTime) {
    gameState.suns = gameState.suns.filter(sun => {
        if (sun.isCollected) return false;
        
        // 检查是否超时
        if (currentTime - sun.createdTime >= sun.lifetime) {
            if (sun.element && sun.element.parentNode) {
                sun.element.remove();
            }
            return false;
        }
        
        return true;
    });
}

/**
 * 更新阳光显示
 */
function updateSunDisplay() {
    const sunCount = document.getElementById('sun-count');
    if (sunCount) {
        sunCount.textContent = gameState.sunAmount;
    }
}

/**
 * 更新波次显示
 */
function updateWaveDisplay(text) {
    const waveText = document.getElementById('wave-text');
    if (waveText) {
        waveText.textContent = text;
    }
}

/**
 * 显示提示
 */
function showHint(text, type = 'normal') {
    const hintBar = document.getElementById('hint-bar');
    const hintText = document.getElementById('hint-text');
    
    if (hintBar && hintText) {
        hintText.textContent = text;
        
        if (type === 'warning') {
            hintBar.classList.add('warning');
        } else {
            hintBar.classList.remove('warning');
        }
        
        // 3秒后恢复默认提示
        setTimeout(() => {
            if (type !== 'normal') {
                hintText.textContent = '点击植物后点击格子种植';
                hintBar.classList.remove('warning');
            }
        }, 3000);
    }
}

/**
 * 暂停游戏
 */
function pauseGame() {
    if (gameState.state === 'playing') {
        gameState.state = 'paused';
        showModal('pause-modal');
    }
}

/**
 * 恢复游戏
 */
function resumeGame() {
    if (gameState.state === 'paused') {
        gameState.state = 'playing';
        hideModal('pause-modal');
        lastTime = performance.now();
    }
}

/**
 * 重新开始关卡
 */
function restartLevel() {
    hideModal('pause-modal');
    initGame(gameState.currentLevel);
}

