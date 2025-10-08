/**
 * ui.js - UI界面控制和切换
 * 处理页面导航、按钮事件、数据渲染等
 */

// 初始化UI
document.addEventListener('DOMContentLoaded', () => {
    console.log('游戏界面初始化');
    initializeUI();
    loadMainMenu();
});

/**
 * 初始化所有UI事件监听器
 */
function initializeUI() {
    // 主菜单按钮
    document.getElementById('btn-start-game')?.addEventListener('click', () => {
        const data = loadGameData();
        const level = data.progress.currentLevel;
        showLevelPrepare(level);
    });
    
    document.getElementById('btn-select-level')?.addEventListener('click', () => {
        showLevelSelect();
    });
    
    document.getElementById('btn-game-help')?.addEventListener('click', () => {
        showScreen('game-help');
    });
    
    document.getElementById('btn-reset-progress')?.addEventListener('click', () => {
        showConfirm(
            '重置进度',
            '确定要重置游戏进度吗？所有关卡进度和解锁将被清空！',
            () => {
                resetGameData();
                alert('游戏进度已重置');
                location.reload();
            }
        );
    });
    
    // 关卡选择界面
    document.getElementById('btn-back-to-menu')?.addEventListener('click', () => {
        showScreen('main-menu');
    });
    
    // 关卡准备界面
    document.getElementById('btn-back-to-levels')?.addEventListener('click', () => {
        showLevelSelect();
    });
    
    document.getElementById('btn-start-battle')?.addEventListener('click', () => {
        const levelId = parseInt(document.getElementById('prepare-level-name')?.dataset.levelId);
        if (levelId) {
            startBattle(levelId);
        }
    });
    
    // 游戏战斗界面
    document.getElementById('btn-pause')?.addEventListener('click', () => {
        pauseGame();
    });
    
    // 暂停菜单
    document.getElementById('btn-resume')?.addEventListener('click', () => {
        resumeGame();
    });
    
    document.getElementById('btn-restart')?.addEventListener('click', () => {
        restartLevel();
    });
    
    document.getElementById('btn-pause-menu')?.addEventListener('click', () => {
        hideModal('pause-modal');
        showScreen('main-menu');
    });
    
    // 胜利界面
    document.getElementById('btn-next-level')?.addEventListener('click', () => {
        const nextLevel = gameState.currentLevel + 1;
        if (nextLevel <= 5) {
            showLevelPrepare(nextLevel);
        } else {
            showScreen('main-menu');
        }
    });
    
    document.getElementById('btn-replay-level')?.addEventListener('click', () => {
        startBattle(gameState.currentLevel);
    });
    
    document.getElementById('btn-victory-menu')?.addEventListener('click', () => {
        showScreen('main-menu');
    });
    
    // 失败界面
    document.getElementById('btn-retry-level')?.addEventListener('click', () => {
        startBattle(gameState.currentLevel);
    });
    
    document.getElementById('btn-defeat-menu')?.addEventListener('click', () => {
        showScreen('main-menu');
    });
    
    // 游戏说明界面
    document.getElementById('btn-close-help')?.addEventListener('click', () => {
        showScreen('main-menu');
    });
    
    // 确认对话框
    document.getElementById('btn-confirm-yes')?.addEventListener('click', () => {
        if (window.confirmCallback) {
            window.confirmCallback();
            window.confirmCallback = null;
        }
        hideModal('confirm-modal');
    });
    
    document.getElementById('btn-confirm-no')?.addEventListener('click', () => {
        window.confirmCallback = null;
        hideModal('confirm-modal');
    });
}

/**
 * 显示指定屏幕
 */
function showScreen(screenId) {
    // 隐藏所有屏幕
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // 显示目标屏幕
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

/**
 * 显示模态框
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * 隐藏模态框
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * 显示确认对话框
 */
function showConfirm(title, message, callback) {
    const confirmTitle = document.getElementById('confirm-title');
    const confirmMessage = document.getElementById('confirm-message');
    
    if (confirmTitle) confirmTitle.textContent = title;
    if (confirmMessage) confirmMessage.textContent = message;
    
    window.confirmCallback = callback;
    showModal('confirm-modal');
}

// 暴露到全局
window.showConfirm = showConfirm;

/**
 * 加载主菜单
 */
function loadMainMenu() {
    showScreen('main-menu');
}

/**
 * 显示关卡选择界面
 */
function showLevelSelect() {
    showScreen('level-select');
    renderLevelList();
}

/**
 * 渲染关卡列表
 */
function renderLevelList() {
    const levelList = document.getElementById('level-list');
    if (!levelList) return;
    
    levelList.innerHTML = '';
    
    const levels = getAllLevels();
    const gameData = loadGameData();
    
    levels.forEach(level => {
        const isUnlocked = isLevelUnlocked(level.id);
        const isCompleted = isLevelCompleted(level.id);
        
        const card = document.createElement('div');
        card.className = 'level-card';
        
        if (isUnlocked) {
            card.classList.add('unlocked');
        } else {
            card.classList.add('locked');
        }
        
        if (isCompleted) {
            card.classList.add('completed');
        }
        
        const header = document.createElement('div');
        header.className = 'level-header';
        
        const title = document.createElement('div');
        title.className = 'level-title';
        title.textContent = `关卡${level.id}：${level.name}`;
        
        const status = document.createElement('div');
        status.className = 'level-status';
        if (isCompleted) {
            status.textContent = '⭐';
        } else if (isUnlocked) {
            status.textContent = '🔓';
        } else {
            status.textContent = '🔒';
        }
        
        header.appendChild(title);
        header.appendChild(status);
        
        const description = document.createElement('div');
        description.className = 'level-description';
        description.textContent = level.description;
        
        card.appendChild(header);
        card.appendChild(description);
        
        // 点击事件
        if (isUnlocked) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                showLevelPrepare(level.id);
            });
        } else {
            card.addEventListener('click', () => {
                alert('请先完成前面的关卡！');
            });
        }
        
        levelList.appendChild(card);
    });
}

/**
 * 显示关卡准备界面
 */
function showLevelPrepare(levelId) {
    showScreen('level-prepare');
    
    const levelConfig = getLevelConfig(levelId);
    if (!levelConfig) return;
    
    // 设置关卡名称
    const levelName = document.getElementById('prepare-level-name');
    if (levelName) {
        levelName.textContent = `关卡${levelId}：${levelConfig.name}`;
        levelName.dataset.levelId = levelId;
    }
    
    // 设置关卡目标
    const objective = document.getElementById('prepare-objective');
    if (objective) {
        objective.innerHTML = `
            <h4>关卡目标</h4>
            <p>${levelConfig.objective}</p>
            <p><strong>难度：</strong>${levelConfig.difficulty}</p>
            <p><strong>初始阳光：</strong>${levelConfig.initialSun}</p>
        `;
    }
    
    // 显示可用植物
    renderAvailablePlants(levelConfig);
}

/**
 * 渲染可用植物列表
 */
function renderAvailablePlants(levelConfig) {
    const plantCards = document.getElementById('prepare-plant-cards');
    if (!plantCards) return;
    
    plantCards.innerHTML = '';
    
    levelConfig.availablePlants.forEach(plantId => {
        const plantData = getPlantData(plantId);
        if (!plantData) return;
        
        const card = document.createElement('div');
        card.className = 'prepare-plant-card';
        
        const emoji = document.createElement('div');
        emoji.className = 'plant-emoji';
        emoji.textContent = plantData.emoji;
        
        const info = document.createElement('div');
        info.className = 'plant-info';
        
        const name = document.createElement('div');
        name.className = 'plant-name';
        name.textContent = plantData.name;
        
        // 应用关卡特殊规则的消耗
        let cost = plantData.cost;
        if (levelConfig.specialRules?.snowpeaCostReduction && plantId === 'snowpea') {
            cost = plantData.cost - levelConfig.specialRules.snowpeaCostReduction;
        }
        
        const costDiv = document.createElement('div');
        costDiv.className = 'plant-cost';
        costDiv.textContent = `消耗：${cost}阳光`;
        
        let cooldown = plantData.cooldown / 1000;
        if (levelConfig.specialRules?.wallnutCooldownMultiplier && plantId === 'wallnut') {
            cooldown = (plantData.cooldown * levelConfig.specialRules.wallnutCooldownMultiplier) / 1000;
        }
        if (levelConfig.specialRules?.cooldownMultiplier) {
            cooldown = (plantData.cooldown * levelConfig.specialRules.cooldownMultiplier) / 1000;
        }
        
        costDiv.textContent += ` | 冷却：${cooldown}秒`;
        
        const desc = document.createElement('div');
        desc.className = 'plant-description';
        desc.textContent = plantData.description;
        
        info.appendChild(name);
        info.appendChild(costDiv);
        info.appendChild(desc);
        
        card.appendChild(emoji);
        card.appendChild(info);
        
        plantCards.appendChild(card);
    });
}

/**
 * 开始战斗
 */
function startBattle(levelId) {
    showScreen('game-battle');
    initGame(levelId);
}

/**
 * 显示胜利界面
 */
function showVictoryScreen() {
    showScreen('game-victory');
    
    // 更新统计数据
    document.getElementById('victory-zombies').textContent = gameState.zombiesKilled;
    document.getElementById('victory-plants').textContent = gameState.plantsLost;
    document.getElementById('victory-sun').textContent = gameState.sunAmount;
    
    // 显示解锁信息
    const unlockMessage = document.getElementById('unlock-message');
    if (gameState.currentLevel < 5) {
        unlockMessage.textContent = `🎉 解锁关卡${gameState.currentLevel + 1}！`;
        unlockMessage.style.display = 'block';
        
        // 根据关卡显示解锁植物
        if (gameState.currentLevel === 1) {
            unlockMessage.textContent += ' 解锁寒冰射手！';
        } else if (gameState.currentLevel === 2) {
            unlockMessage.textContent += ' 解锁樱桃炸弹！';
        }
    } else {
        unlockMessage.textContent = '🎊 恭喜通关全部关卡！';
        unlockMessage.style.display = 'block';
    }
    
    // 隐藏"下一关"按钮如果已通关所有关卡
    const nextButton = document.getElementById('btn-next-level');
    if (gameState.currentLevel >= 5) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'block';
    }
}

/**
 * 显示失败界面
 */
function showDefeatScreen() {
    showScreen('game-defeat');
}

/**
 * 防止双击缩放
 */
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

/**
 * 防止触摸移动时页面滚动（仅在游戏界面）
 */
document.addEventListener('touchmove', (e) => {
    if (gameState.state === 'playing') {
        // 允许特定元素滚动
        let target = e.target;
        while (target) {
            if (target.classList && (
                target.classList.contains('plant-selector') ||
                target.classList.contains('battlefield')
            )) {
                return;
            }
            target = target.parentElement;
        }
        e.preventDefault();
    }
}, { passive: false });

