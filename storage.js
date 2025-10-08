/**
 * storage.js - 游戏数据存储管理
 * 使用localStorage保存游戏进度
 */

const STORAGE_KEY = 'pvz_game_data';
const STORAGE_VERSION = '1.0';

// 默认游戏数据
const DEFAULT_GAME_DATA = {
    version: STORAGE_VERSION,
    lastUpdate: Date.now(),
    progress: {
        currentLevel: 1,
        completedLevels: [],
        unlockedPlants: ['sunflower', 'peashooter', 'wallnut']
    },
    settings: {
        soundEnabled: true,
        musicEnabled: true
    },
    stats: {
        totalGames: 0,
        totalWins: 0,
        totalZombiesKilled: 0
    }
};

/**
 * 检查localStorage是否可用
 */
function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.warn('localStorage不可用，游戏进度将不会被保存');
        return false;
    }
}

/**
 * 加载游戏数据
 * @returns {Object} 游戏数据对象，如果不存在则返回默认数据
 */
function loadGameData() {
    if (!isStorageAvailable()) {
        return JSON.parse(JSON.stringify(DEFAULT_GAME_DATA));
    }

    try {
        const dataString = localStorage.getItem(STORAGE_KEY);
        if (!dataString) {
            return JSON.parse(JSON.stringify(DEFAULT_GAME_DATA));
        }

        const data = JSON.parse(dataString);
        
        // 验证数据完整性
        if (!data.version || !data.progress) {
            console.warn('游戏数据损坏，使用默认数据');
            return JSON.parse(JSON.stringify(DEFAULT_GAME_DATA));
        }

        // 版本兼容性检查（未来可能需要）
        if (data.version !== STORAGE_VERSION) {
            console.log('数据版本不同，可能需要迁移');
            // 这里可以添加数据迁移逻辑
        }

        return data;
    } catch (error) {
        console.error('加载游戏数据失败:', error);
        return JSON.parse(JSON.stringify(DEFAULT_GAME_DATA));
    }
}

/**
 * 保存游戏数据
 * @param {Object} data - 要保存的游戏数据
 * @returns {boolean} 是否保存成功
 */
function saveGameData(data) {
    if (!isStorageAvailable()) {
        return false;
    }

    try {
        data.lastUpdate = Date.now();
        const dataString = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, dataString);
        return true;
    } catch (error) {
        console.error('保存游戏数据失败:', error);
        return false;
    }
}

/**
 * 重置游戏数据
 * @returns {boolean} 是否重置成功
 */
function resetGameData() {
    if (!isStorageAvailable()) {
        return false;
    }

    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('游戏进度已重置');
        return true;
    } catch (error) {
        console.error('重置游戏数据失败:', error);
        return false;
    }
}

/**
 * 更新关卡进度
 * @param {number} level - 完成的关卡编号（1-5）
 * @returns {Object} 更新后的游戏数据
 */
function updateProgress(level) {
    const data = loadGameData();
    
    // 添加到已完成关卡
    if (!data.progress.completedLevels.includes(level)) {
        data.progress.completedLevels.push(level);
        data.stats.totalWins++;
    }
    
    // 更新当前可玩关卡
    if (level < 5) {
        data.progress.currentLevel = Math.max(data.progress.currentLevel, level + 1);
    }
    
    // 解锁对应植物
    const plantUnlocks = {
        1: 'snowpea',      // 完成关卡1解锁寒冰射手
        2: 'cherrybomb'    // 完成关卡2解锁樱桃炸弹
    };
    
    if (plantUnlocks[level] && !data.progress.unlockedPlants.includes(plantUnlocks[level])) {
        data.progress.unlockedPlants.push(plantUnlocks[level]);
    }
    
    saveGameData(data);
    return data;
}

/**
 * 解锁植物
 * @param {string} plantId - 植物ID
 * @returns {Object} 更新后的游戏数据
 */
function unlockPlant(plantId) {
    const data = loadGameData();
    
    if (!data.progress.unlockedPlants.includes(plantId)) {
        data.progress.unlockedPlants.push(plantId);
        saveGameData(data);
    }
    
    return data;
}

/**
 * 更新统计数据
 * @param {Object} stats - 统计数据 { zombiesKilled, gamesPlayed }
 * @returns {Object} 更新后的游戏数据
 */
function updateStats(stats) {
    const data = loadGameData();
    
    if (stats.zombiesKilled) {
        data.stats.totalZombiesKilled += stats.zombiesKilled;
    }
    
    if (stats.gamesPlayed) {
        data.stats.totalGames += stats.gamesPlayed;
    }
    
    saveGameData(data);
    return data;
}

/**
 * 获取关卡是否已解锁
 * @param {number} level - 关卡编号（1-5）
 * @returns {boolean} 是否已解锁
 */
function isLevelUnlocked(level) {
    const data = loadGameData();
    
    // 第一关始终解锁
    if (level === 1) {
        return true;
    }
    
    // 检查前一关是否完成
    return data.progress.completedLevels.includes(level - 1);
}

/**
 * 获取关卡是否已完成
 * @param {number} level - 关卡编号（1-5）
 * @returns {boolean} 是否已完成
 */
function isLevelCompleted(level) {
    const data = loadGameData();
    return data.progress.completedLevels.includes(level);
}

/**
 * 获取已解锁的植物列表
 * @returns {Array} 植物ID数组
 */
function getUnlockedPlants() {
    const data = loadGameData();
    return data.progress.unlockedPlants;
}

/**
 * 获取当前可玩的最新关卡
 * @returns {number} 关卡编号（1-5）
 */
function getCurrentLevel() {
    const data = loadGameData();
    return data.progress.currentLevel;
}

