/**
 * zombies.js - 僵尸系统
 * 定义所有僵尸类和生成管理器
 */

// 僵尸属性配置
const ZOMBIE_DATA = {
    normal: {
        id: 'normal',
        name: '普通僵尸',
        emoji: '🧟',
        health: 200,
        speed: 30, // 像素/秒
        damage: 20,
        attackInterval: 1000 // 1秒攻击一次
    },
    cone: {
        id: 'cone',
        name: '路障僵尸',
        emoji: '🧟‍♂️',
        health: 500,
        speed: 30,
        damage: 20,
        attackInterval: 1000
    },
    bucket: {
        id: 'bucket',
        name: '铁桶僵尸',
        emoji: '🧟‍♀️',
        health: 1200,
        speed: 40,
        damage: 30,
        attackInterval: 800 // 0.8秒
    }
};

// 僵尸基类
class Zombie {
    constructor(type, row, healthMultiplier = 1) {
        const data = ZOMBIE_DATA[type];
        if (!data) {
            console.error('Invalid zombie type:', type);
            return;
        }

        this.type = type;
        this.name = data.name;
        this.emoji = data.emoji;
        this.row = row;
        this.health = data.health * healthMultiplier;
        this.maxHealth = data.health * healthMultiplier;
        this.speed = data.speed;
        this.damage = data.damage;
        this.attackInterval = data.attackInterval;
        
        // 位置（僵尸从右侧屏幕外生成）
        this.x = window.innerWidth + 50;
        const gridPos = gridToScreen(row, 2);
        this.y = gridPos.y;
        
        // 状态
        this.isAlive = true;
        this.isAttacking = false;
        this.target = null; // 当前攻击的植物
        this.lastAttackTime = 0;
        
        // 减速效果
        this.slowMultiplier = 1; // 速度倍数（1为正常，0.5为减速50%）
        this.slowEndTime = 0;
        
        this.element = null;
        this.createDOM();
    }

    /**
     * 创建僵尸的DOM元素
     */
    createDOM() {
        this.element = document.createElement('div');
        this.element.className = 'zombie-object';
        this.element.style.left = this.x + 'px';
        this.element.style.top = (this.y - 40) + 'px';
        this.element.style.width = '60px';
        this.element.style.height = '80px';
        
        const emoji = document.createElement('span');
        emoji.className = 'zombie-object-emoji';
        emoji.textContent = this.emoji;
        
        const healthBar = document.createElement('div');
        healthBar.className = 'health-bar';
        const healthBarFill = document.createElement('div');
        healthBarFill.className = 'health-bar-fill';
        healthBarFill.style.width = '100%';
        healthBar.appendChild(healthBarFill);
        
        this.element.appendChild(emoji);
        this.element.appendChild(healthBar);
        
        // 添加到战场
        document.getElementById('zombie-layer').appendChild(this.element);
    }

    /**
     * 更新僵尸状态
     * @param {number} currentTime - 当前时间戳
     * @param {number} deltaTime - 时间间隔（毫秒）
     */
    update(currentTime, deltaTime) {
        if (!this.isAlive) return;

        // 更新减速状态
        if (this.slowEndTime > 0 && currentTime >= this.slowEndTime) {
            this.slowMultiplier = 1;
            this.slowEndTime = 0;
            this.element.classList.remove('slowed');
        }

        // 检查是否有植物可以攻击
        this.checkForPlant();

        if (this.isAttacking && this.target && this.target.isAlive) {
            // 攻击植物
            if (currentTime - this.lastAttackTime >= this.attackInterval) {
                this.attack();
                this.lastAttackTime = currentTime;
            }
        } else {
            // 向左移动
            this.move(deltaTime);
        }

        // 更新DOM位置
        if (this.element) {
            this.element.style.left = this.x + 'px';
        }

        // 检查是否越界
        this.checkBoundary();
    }

    /**
     * 检查是否有植物在前方
     */
    checkForPlant() {
        const gridPos = screenToGrid(this.x, this.y);
        
        if (window.gameState && window.gameState.grid) {
            // 检查当前格子
            if (gridPos.col >= 0 && gridPos.col < 3) {
                const plant = window.gameState.grid[this.row][gridPos.col];
                
                if (plant && plant.isAlive) {
                    this.setTarget(plant);
                    return;
                }
            }
        }
        
        // 没有植物，清除目标
        this.clearTarget();
    }

    /**
     * 设置攻击目标
     * @param {Plant} plant - 目标植物
     */
    setTarget(plant) {
        if (this.target !== plant) {
            this.target = plant;
            this.isAttacking = true;
        }
    }

    /**
     * 清除攻击目标
     */
    clearTarget() {
        this.target = null;
        this.isAttacking = false;
    }

    /**
     * 移动
     * @param {number} deltaTime - 时间间隔（毫秒）
     */
    move(deltaTime) {
        const moveSpeed = this.speed * this.slowMultiplier;
        this.x -= (moveSpeed * deltaTime) / 1000;
    }

    /**
     * 攻击植物
     */
    attack() {
        if (!this.target || !this.target.isAlive) {
            this.clearTarget();
            return;
        }

        this.target.takeDamage(this.damage);
        
        // 攻击动画
        if (this.element) {
            this.element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (this.element) {
                    this.element.style.transform = 'scale(1)';
                }
            }, 100);
        }

        // 检查植物是否死亡
        if (!this.target.isAlive) {
            this.clearTarget();
        }
    }

    /**
     * 应用减速效果
     * @param {number} slowAmount - 减速比例（0.5表示减速50%）
     * @param {number} duration - 持续时间（毫秒）
     */
    applySlow(slowAmount, duration) {
        this.slowMultiplier = 1 - slowAmount;
        this.slowEndTime = Date.now() + duration;
        
        if (this.element) {
            this.element.classList.add('slowed');
        }
    }

    /**
     * 受到伤害
     * @param {number} damage - 伤害值
     */
    takeDamage(damage) {
        if (!this.isAlive) return;
        
        this.health -= damage;
        this.updateHealthBar();
        
        // 受伤闪烁效果
        if (this.element) {
            this.element.classList.add('flash');
            setTimeout(() => {
                if (this.element) {
                    this.element.classList.remove('flash');
                }
            }, 300);
        }
        
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }

    /**
     * 更新生命值条
     */
    updateHealthBar() {
        if (!this.element) return;
        
        const healthBarFill = this.element.querySelector('.health-bar-fill');
        if (healthBarFill) {
            const percentage = (this.health / this.maxHealth) * 100;
            healthBarFill.style.width = percentage + '%';
            
            if (percentage <= 30) {
                healthBarFill.classList.add('low');
            }
        }
    }

    /**
     * 检查边界（是否到达屏幕左侧）
     */
    checkBoundary() {
        // 到达屏幕左侧边界
        if (this.x < -50) {
            this.reachEnd();
        }
    }

    /**
     * 到达终点（游戏失败）
     */
    reachEnd() {
        if (!this.isAlive) return;
        
        console.log('僵尸到达终点！');
        this.destroy();
        
        // 触发游戏失败
        if (window.gameState) {
            window.gameState.gameOver = true;
            window.gameState.victory = false;
        }
    }

    /**
     * 僵尸死亡
     */
    die() {
        this.isAlive = false;
        
        // 死亡动画
        if (this.element) {
            this.element.style.opacity = '0';
            this.element.style.transform = 'scale(0.5) rotate(90deg)';
            setTimeout(() => this.destroy(), 300);
        } else {
            this.destroy();
        }
        
        // 统计
        if (window.gameState) {
            window.gameState.zombiesKilled++;
        }
    }

    /**
     * 销毁僵尸
     */
    destroy() {
        this.isAlive = false;
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }
}

// 僵尸生成管理器
class ZombieSpawner {
    constructor(levelConfig) {
        this.levelConfig = levelConfig;
        this.currentWave = 0;
        this.totalWaves = levelConfig.waves.length;
        this.zombiesToSpawn = [];
        this.waveStartTime = 0;
        this.isWaveActive = false;
        this.allWavesComplete = false;
        
        this.prepareNextWave();
    }

    /**
     * 准备下一波僵尸
     */
    prepareNextWave() {
        if (this.currentWave >= this.totalWaves) {
            this.allWavesComplete = true;
            return;
        }

        const waveConfig = this.levelConfig.waves[this.currentWave];
        this.zombiesToSpawn = waveConfig.zombies.map(z => ({
            type: z.type,
            row: z.row - 1, // 转换为0-based索引
            spawnTime: z.delay,
            spawned: false
        }));
        
        this.isWaveActive = true;
        this.waveStartTime = Date.now();
        
        console.log(`准备第${this.currentWave + 1}波僵尸，共${this.zombiesToSpawn.length}只`);
        
        // 显示波次提示
        const waveText = `第${this.currentWave + 1}波 / 共${this.totalWaves}波`;
        updateWaveDisplay(waveText);
        
        if (this.currentWave === this.totalWaves - 1) {
            showHint('一大波僵尸正在接近！这是最后一波！', 'warning');
        } else {
            showHint(`第${this.currentWave + 1}波僵尸来袭！`, 'normal');
        }
    }

    /**
     * 更新生成器状态
     * @param {number} currentTime - 当前时间戳
     * @returns {Array} 新生成的僵尸数组
     */
    update(currentTime) {
        const newZombies = [];

        if (!this.isWaveActive) {
            // 检查是否可以开始下一波
            if (this.currentWave < this.totalWaves) {
                // 检查所有僵尸是否已被消灭
                const allDead = window.gameState.zombies.every(z => !z.isAlive);
                
                if (allDead && currentTime - this.waveStartTime >= this.levelConfig.waveInterval) {
                    this.currentWave++;
                    this.prepareNextWave();
                }
            }
            return newZombies;
        }

        // 生成当前波次的僵尸
        const elapsedTime = currentTime - this.waveStartTime;
        
        this.zombiesToSpawn.forEach(zombieConfig => {
            if (!zombieConfig.spawned && elapsedTime >= zombieConfig.spawnTime) {
                // 应用关卡特殊规则（如血量倍数）
                let healthMultiplier = 1;
                if (this.levelConfig.specialRules && this.levelConfig.specialRules.zombieHealthMultiplier) {
                    healthMultiplier = this.levelConfig.specialRules.zombieHealthMultiplier;
                }
                
                const zombie = new Zombie(zombieConfig.type, zombieConfig.row, healthMultiplier);
                newZombies.push(zombie);
                zombieConfig.spawned = true;
            }
        });

        // 检查当前波次是否完成
        if (this.zombiesToSpawn.every(z => z.spawned)) {
            this.isWaveActive = false;
            console.log(`第${this.currentWave}波生成完成`);
        }

        return newZombies;
    }

    /**
     * 是否所有波次都已完成
     */
    isComplete() {
        return this.allWavesComplete && this.zombiesToSpawn.every(z => z.spawned);
    }

    /**
     * 获取当前波次
     */
    getCurrentWave() {
        return this.currentWave;
    }
}

/**
 * 创建僵尸实例
 * @param {string} type - 僵尸类型
 * @param {number} row - 行号（0-4）
 * @param {number} healthMultiplier - 血量倍数
 * @returns {Zombie} 僵尸实例
 */
function createZombie(type, row, healthMultiplier = 1) {
    return new Zombie(type, row, healthMultiplier);
}

/**
 * 获取僵尸数据
 * @param {string} type - 僵尸类型
 * @returns {Object} 僵尸数据
 */
function getZombieData(type) {
    return ZOMBIE_DATA[type];
}

