/**
 * levels.js - 关卡配置数据
 * 定义所有关卡的僵尸配置、可用植物、难度等
 */

// 关卡配置数组
const LEVELS_CONFIG = [
    // 关卡1：阳光草地
    {
        id: 1,
        name: '阳光草地',
        description: '熟悉游戏操作，种植你的第一批植物',
        objective: '消灭15个僵尸',
        difficulty: '简单',
        initialSun: 150,
        availablePlants: ['sunflower', 'peashooter', 'wallnut'],
        waves: [
            {
                wave: 1,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 3, delay: 5000 }
                ]
            },
            {
                wave: 2,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 3000 },
                    { type: 'normal', row: 4, delay: 6000 }
                ]
            },
            {
                wave: 3,
                zombies: [
                    { type: 'normal', row: 2, delay: 0 },
                    { type: 'normal', row: 3, delay: 2000 },
                    { type: 'normal', row: 4, delay: 4000 },
                    { type: 'normal', row: 5, delay: 6000 }
                ]
            },
            {
                wave: 4,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 3, delay: 3000 },
                    { type: 'normal', row: 5, delay: 6000 },
                    { type: 'cone', row: 2, delay: 8000 }
                ]
            },
            {
                wave: 5,
                zombies: [
                    { type: 'normal', row: 2, delay: 0 },
                    { type: 'normal', row: 4, delay: 2000 },
                    { type: 'cone', row: 3, delay: 5000 }
                ]
            }
        ],
        waveInterval: 25000, // 25秒
        specialRules: {}
    },

    // 关卡2：僵尸来袭
    {
        id: 2,
        name: '僵尸来袭',
        description: '僵尸数量增多，使用寒冰射手减缓它们',
        objective: '消灭25个僵尸',
        difficulty: '中等',
        initialSun: 100,
        availablePlants: ['sunflower', 'peashooter', 'wallnut', 'snowpea'],
        waves: [
            {
                wave: 1,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 2000 },
                    { type: 'normal', row: 4, delay: 4000 },
                    { type: 'normal', row: 5, delay: 6000 }
                ]
            },
            {
                wave: 2,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 2000 },
                    { type: 'normal', row: 3, delay: 3000 },
                    { type: 'normal', row: 4, delay: 4000 },
                    { type: 'normal', row: 5, delay: 5000 },
                    { type: 'cone', row: 3, delay: 8000 }
                ]
            },
            {
                wave: 3,
                zombies: [
                    { type: 'normal', row: 2, delay: 0 },
                    { type: 'normal', row: 3, delay: 2000 },
                    { type: 'normal', row: 4, delay: 4000 },
                    { type: 'normal', row: 5, delay: 6000 },
                    { type: 'cone', row: 1, delay: 7000 },
                    { type: 'cone', row: 3, delay: 10000 }
                ]
            },
            {
                wave: 4,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 4, delay: 2000 },
                    { type: 'normal', row: 5, delay: 4000 },
                    { type: 'cone', row: 2, delay: 5000 },
                    { type: 'cone', row: 3, delay: 7000 },
                    { type: 'cone', row: 4, delay: 9000 }
                ]
            },
            {
                wave: 5,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 2000 },
                    { type: 'normal', row: 4, delay: 4000 },
                    { type: 'normal', row: 5, delay: 6000 },
                    { type: 'cone', row: 3, delay: 7000 },
                    { type: 'cone', row: 2, delay: 9000 },
                    { type: 'cone', row: 4, delay: 11000 },
                    { type: 'bucket', row: 3, delay: 13000 }
                ]
            }
        ],
        waveInterval: 20000, // 20秒
        specialRules: {}
    },

    // 关卡3：坚果防线
    {
        id: 3,
        name: '坚果防线',
        description: '不让僵尸越过中线，使用坚果墙构建防线',
        objective: '消灭30个僵尸，不让僵尸越过第2列',
        difficulty: '中等偏难',
        initialSun: 150,
        availablePlants: ['sunflower', 'peashooter', 'wallnut', 'snowpea', 'cherrybomb'],
        waves: [
            {
                wave: 1,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 1000 },
                    { type: 'normal', row: 3, delay: 2000 },
                    { type: 'normal', row: 4, delay: 3000 },
                    { type: 'normal', row: 5, delay: 4000 },
                    { type: 'normal', row: 2, delay: 5000 }
                ]
            },
            {
                wave: 2,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 3, delay: 2000 },
                    { type: 'normal', row: 5, delay: 4000 },
                    { type: 'normal', row: 2, delay: 6000 },
                    { type: 'normal', row: 4, delay: 8000 },
                    { type: 'cone', row: 3, delay: 9000 },
                    { type: 'cone', row: 1, delay: 11000 }
                ]
            },
            {
                wave: 3,
                zombies: [
                    { type: 'normal', row: 2, delay: 0 },
                    { type: 'normal', row: 3, delay: 1500 },
                    { type: 'normal', row: 4, delay: 3000 },
                    { type: 'normal', row: 5, delay: 4500 },
                    { type: 'cone', row: 1, delay: 6000 },
                    { type: 'cone', row: 3, delay: 8000 },
                    { type: 'cone', row: 5, delay: 10000 },
                    { type: 'bucket', row: 3, delay: 12000 }
                ]
            },
            {
                wave: 4,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 1000 },
                    { type: 'normal', row: 3, delay: 2000 },
                    { type: 'normal', row: 4, delay: 3000 },
                    { type: 'normal', row: 5, delay: 4000 },
                    { type: 'normal', row: 2, delay: 5000 },
                    { type: 'cone', row: 1, delay: 7000 },
                    { type: 'cone', row: 4, delay: 9000 },
                    { type: 'bucket', row: 3, delay: 11000 }
                ]
            },
            {
                wave: 5,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 1000 },
                    { type: 'normal', row: 3, delay: 2000 },
                    { type: 'normal', row: 4, delay: 3000 },
                    { type: 'normal', row: 5, delay: 4000 },
                    { type: 'cone', row: 2, delay: 6000 },
                    { type: 'cone', row: 3, delay: 7000 },
                    { type: 'cone', row: 4, delay: 8000 },
                    { type: 'bucket', row: 1, delay: 10000 },
                    { type: 'bucket', row: 5, delay: 12000 }
                ]
            }
        ],
        waveInterval: 15000, // 15秒
        specialRules: {
            wallnutCooldownMultiplier: 0.5, // 坚果墙冷却减半
            middleLineCheck: true // 检查僵尸是否越过中线
        }
    },

    // 关卡4：冰冻时刻
    {
        id: 4,
        name: '冰冻时刻',
        description: '只能使用寒冰射手，冻结所有僵尸',
        objective: '消灭35个僵尸',
        difficulty: '困难',
        initialSun: 125,
        availablePlants: ['sunflower', 'snowpea', 'wallnut', 'cherrybomb'],
        waves: [
            {
                wave: 1,
                zombies: [
                    { type: 'cone', row: 1, delay: 0 },
                    { type: 'cone', row: 2, delay: 2000 },
                    { type: 'cone', row: 3, delay: 4000 },
                    { type: 'cone', row: 4, delay: 6000 },
                    { type: 'cone', row: 5, delay: 8000 }
                ]
            },
            {
                wave: 2,
                zombies: [
                    { type: 'cone', row: 1, delay: 0 },
                    { type: 'cone', row: 2, delay: 1500 },
                    { type: 'cone', row: 3, delay: 3000 },
                    { type: 'cone', row: 4, delay: 4500 },
                    { type: 'cone', row: 5, delay: 6000 },
                    { type: 'cone', row: 3, delay: 8000 },
                    { type: 'bucket', row: 2, delay: 10000 }
                ]
            },
            {
                wave: 3,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 1000 },
                    { type: 'normal', row: 4, delay: 2000 },
                    { type: 'normal', row: 5, delay: 3000 },
                    { type: 'cone', row: 3, delay: 4000 },
                    { type: 'cone', row: 1, delay: 6000 },
                    { type: 'cone', row: 4, delay: 8000 },
                    { type: 'cone', row: 5, delay: 10000 },
                    { type: 'bucket', row: 3, delay: 12000 }
                ]
            },
            {
                wave: 4,
                zombies: [
                    { type: 'cone', row: 1, delay: 0 },
                    { type: 'cone', row: 2, delay: 1500 },
                    { type: 'cone', row: 3, delay: 3000 },
                    { type: 'cone', row: 4, delay: 4500 },
                    { type: 'cone', row: 5, delay: 6000 },
                    { type: 'bucket', row: 2, delay: 8000 },
                    { type: 'bucket', row: 4, delay: 10000 }
                ]
            },
            {
                wave: 5,
                zombies: [
                    { type: 'cone', row: 1, delay: 0 },
                    { type: 'cone', row: 2, delay: 1000 },
                    { type: 'cone', row: 3, delay: 2000 },
                    { type: 'cone', row: 4, delay: 3000 },
                    { type: 'cone', row: 5, delay: 4000 },
                    { type: 'cone', row: 1, delay: 6000 },
                    { type: 'bucket', row: 2, delay: 8000 },
                    { type: 'bucket', row: 3, delay: 10000 },
                    { type: 'bucket', row: 4, delay: 12000 }
                ]
            }
        ],
        waveInterval: 18000, // 18秒
        specialRules: {
            snowpeaCostReduction: 50, // 寒冰射手消耗降为125
            zombieHealthMultiplier: 1.2 // 僵尸血量提升20%
        }
    },

    // 关卡5：终极对决
    {
        id: 5,
        name: '终极对决',
        description: '最终挑战，坚持10波僵尸攻击',
        objective: '消灭50个僵尸，存活10波攻击',
        difficulty: '极难',
        initialSun: 200,
        availablePlants: ['sunflower', 'peashooter', 'wallnut', 'snowpea', 'cherrybomb'],
        waves: [
            // 第1-2波
            {
                wave: 1,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 1500 },
                    { type: 'normal', row: 3, delay: 3000 },
                    { type: 'normal', row: 4, delay: 4500 },
                    { type: 'normal', row: 5, delay: 6000 }
                ]
            },
            {
                wave: 2,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 1500 },
                    { type: 'normal', row: 3, delay: 3000 },
                    { type: 'normal', row: 4, delay: 4500 },
                    { type: 'normal', row: 5, delay: 6000 }
                ]
            },
            // 第3-4波
            {
                wave: 3,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 1000 },
                    { type: 'normal', row: 4, delay: 2000 },
                    { type: 'normal', row: 5, delay: 3000 },
                    { type: 'cone', row: 3, delay: 4000 },
                    { type: 'cone', row: 2, delay: 6000 }
                ]
            },
            {
                wave: 4,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 3, delay: 1000 },
                    { type: 'normal', row: 5, delay: 2000 },
                    { type: 'normal', row: 2, delay: 3000 },
                    { type: 'cone', row: 4, delay: 4000 },
                    { type: 'cone', row: 1, delay: 6000 }
                ]
            },
            // 第5-6波
            {
                wave: 5,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 1000 },
                    { type: 'normal', row: 5, delay: 2000 },
                    { type: 'cone', row: 3, delay: 3000 },
                    { type: 'cone', row: 4, delay: 4000 },
                    { type: 'cone', row: 2, delay: 5000 },
                    { type: 'bucket', row: 3, delay: 7000 }
                ]
            },
            {
                wave: 6,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 4, delay: 1000 },
                    { type: 'normal', row: 5, delay: 2000 },
                    { type: 'cone', row: 2, delay: 3000 },
                    { type: 'cone', row: 3, delay: 4000 },
                    { type: 'cone', row: 1, delay: 5000 },
                    { type: 'bucket', row: 4, delay: 7000 }
                ]
            },
            // 第7-8波
            {
                wave: 7,
                zombies: [
                    { type: 'cone', row: 1, delay: 0 },
                    { type: 'cone', row: 2, delay: 1500 },
                    { type: 'cone', row: 3, delay: 3000 },
                    { type: 'cone', row: 4, delay: 4500 },
                    { type: 'bucket', row: 5, delay: 6000 },
                    { type: 'bucket', row: 3, delay: 8000 }
                ]
            },
            {
                wave: 8,
                zombies: [
                    { type: 'cone', row: 1, delay: 0 },
                    { type: 'cone', row: 2, delay: 1500 },
                    { type: 'cone', row: 4, delay: 3000 },
                    { type: 'cone', row: 5, delay: 4500 },
                    { type: 'bucket', row: 3, delay: 6000 },
                    { type: 'bucket', row: 2, delay: 8000 }
                ]
            },
            // 第9波
            {
                wave: 9,
                zombies: [
                    { type: 'cone', row: 1, delay: 0 },
                    { type: 'cone', row: 2, delay: 1000 },
                    { type: 'cone', row: 3, delay: 2000 },
                    { type: 'cone', row: 4, delay: 3000 },
                    { type: 'cone', row: 5, delay: 4000 },
                    { type: 'cone', row: 2, delay: 5000 },
                    { type: 'bucket', row: 1, delay: 6000 },
                    { type: 'bucket', row: 3, delay: 7000 },
                    { type: 'bucket', row: 5, delay: 8000 }
                ]
            },
            // 第10波（最终波）
            {
                wave: 10,
                zombies: [
                    { type: 'normal', row: 1, delay: 0 },
                    { type: 'normal', row: 2, delay: 500 },
                    { type: 'normal', row: 3, delay: 1000 },
                    { type: 'normal', row: 4, delay: 1500 },
                    { type: 'normal', row: 5, delay: 2000 },
                    { type: 'normal', row: 1, delay: 2500 },
                    { type: 'normal', row: 3, delay: 3000 },
                    { type: 'normal', row: 5, delay: 3500 },
                    { type: 'cone', row: 2, delay: 4000 },
                    { type: 'cone', row: 3, delay: 4500 },
                    { type: 'cone', row: 4, delay: 5000 },
                    { type: 'cone', row: 1, delay: 5500 },
                    { type: 'cone', row: 5, delay: 6000 },
                    { type: 'bucket', row: 2, delay: 7000 },
                    { type: 'bucket', row: 3, delay: 7500 },
                    { type: 'bucket', row: 4, delay: 8000 }
                ]
            }
        ],
        waveInterval: 12000, // 12秒
        specialRules: {
            cooldownMultiplier: 0.7, // 所有植物冷却减少30%
            finalBoss: true // 标记为最终关卡
        }
    }
];

/**
 * 获取关卡配置
 * @param {number} levelId - 关卡ID（1-5）
 * @returns {Object} 关卡配置对象
 */
function getLevelConfig(levelId) {
    return LEVELS_CONFIG.find(level => level.id === levelId) || LEVELS_CONFIG[0];
}

/**
 * 获取所有关卡列表
 * @returns {Array} 关卡配置数组
 */
function getAllLevels() {
    return LEVELS_CONFIG;
}

/**
 * 计算关卡总僵尸数量
 * @param {number} levelId - 关卡ID
 * @returns {number} 僵尸总数
 */
function getTotalZombieCount(levelId) {
    const level = getLevelConfig(levelId);
    let count = 0;
    level.waves.forEach(wave => {
        count += wave.zombies.length;
    });
    return count;
}

