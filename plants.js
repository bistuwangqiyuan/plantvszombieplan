/**
 * plants.js - 植物系统
 * 定义所有植物类、子弹类和相关逻辑
 */

// 植物属性配置
const PLANT_DATA = {
    sunflower: {
        id: 'sunflower',
        name: '向日葵',
        emoji: '🌻',
        cost: 50,
        cooldown: 5000, // 5秒
        health: 100,
        damage: 0,
        attackInterval: 0,
        special: 'produce_sun',
        sunProduceInterval: 15000, // 15秒生产一次
        sunAmount: 50,
        description: '定期生产阳光'
    },
    peashooter: {
        id: 'peashooter',
        name: '豌豆射手',
        emoji: '🌱',
        cost: 100,
        cooldown: 5000,
        health: 150,
        damage: 20,
        attackInterval: 2000, // 2秒攻击一次
        special: 'shoot',
        projectileType: 'normal',
        description: '发射豌豆攻击僵尸'
    },
    wallnut: {
        id: 'wallnut',
        name: '坚果墙',
        emoji: '🥜',
        cost: 50,
        cooldown: 20000, // 20秒
        health: 600,
        damage: 0,
        attackInterval: 0,
        special: 'defense',
        description: '高血量防御植物'
    },
    snowpea: {
        id: 'snowpea',
        name: '寒冰射手',
        emoji: '❄️',
        cost: 175,
        cooldown: 7000, // 7秒
        health: 150,
        damage: 20,
        attackInterval: 2500, // 2.5秒攻击一次
        special: 'shoot_ice',
        projectileType: 'ice',
        slowEffect: 0.5, // 减速50%
        description: '发射冰豌豆，减速僵尸'
    },
    cherrybomb: {
        id: 'cherrybomb',
        name: '樱桃炸弹',
        emoji: '🍒',
        cost: 150,
        cooldown: 30000, // 30秒
        health: 50,
        damage: 1800,
        attackInterval: 3000, // 3秒后爆炸
        special: 'explode',
        explodeRange: 1, // 3×3范围（周围1格）
        description: '一次性爆炸攻击'
    }
};

// 植物基类
class Plant {
    constructor(id, row, col) {
        const data = PLANT_DATA[id];
        if (!data) {
            console.error('Invalid plant ID:', id);
            return;
        }

        this.id = id;
        this.name = data.name;
        this.emoji = data.emoji;
        this.row = row;
        this.col = col;
        this.health = data.health;
        this.maxHealth = data.health;
        this.damage = data.damage;
        this.attackInterval = data.attackInterval;
        this.special = data.special;
        
        // 时间相关
        this.lastAttackTime = 0;
        this.createdTime = Date.now();
        this.lastSunProduceTime = Date.now();
        
        // 状态
        this.isAlive = true;
        this.element = null;
        
        // 特殊属性
        this.projectileType = data.projectileType;
        this.slowEffect = data.slowEffect;
        this.explodeRange = data.explodeRange;
        this.sunProduceInterval = data.sunProduceInterval;
        this.sunAmount = data.sunAmount;
        
        this.createDOM();
    }

    /**
     * 创建植物的DOM元素
     */
    createDOM() {
        const pos = gridToScreen(this.row, this.col);
        
        this.element = document.createElement('div');
        this.element.className = 'plant-object';
        this.element.style.left = (pos.x - 30) + 'px';
        this.element.style.top = (pos.y - 40) + 'px';
        this.element.style.width = '60px';
        this.element.style.height = '80px';
        
        const emoji = document.createElement('span');
        emoji.className = 'plant-object-emoji';
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
        document.getElementById('grid-container').appendChild(this.element);
        
        // 添加长按移除功能
        this.addRemoveHandler();
    }

    /**
     * 添加长按移除处理
     */
    addRemoveHandler() {
        let pressTimer;
        
        const startPress = () => {
            pressTimer = setTimeout(() => {
                if (this.isAlive) {
                    showConfirm('移除植物', '确定要移除这株植物吗？（不返还阳光）', () => {
                        this.destroy();
                    });
                }
            }, 1000);
        };
        
        const cancelPress = () => {
            clearTimeout(pressTimer);
        };
        
        this.element.addEventListener('mousedown', startPress);
        this.element.addEventListener('mouseup', cancelPress);
        this.element.addEventListener('mouseleave', cancelPress);
        this.element.addEventListener('touchstart', startPress);
        this.element.addEventListener('touchend', cancelPress);
    }

    /**
     * 更新植物状态
     * @param {number} currentTime - 当前时间戳
     */
    update(currentTime) {
        if (!this.isAlive) return;

        // 向日葵生产阳光
        if (this.special === 'produce_sun') {
            if (currentTime - this.lastSunProduceTime >= this.sunProduceInterval) {
                this.produceSun();
                this.lastSunProduceTime = currentTime;
            }
        }

        // 射击类植物攻击
        if (this.special === 'shoot' || this.special === 'shoot_ice') {
            if (currentTime - this.lastAttackTime >= this.attackInterval) {
                if (this.canAttack()) {
                    this.shoot();
                    this.lastAttackTime = currentTime;
                }
            }
        }

        // 樱桃炸弹爆炸
        if (this.special === 'explode') {
            if (currentTime - this.createdTime >= this.attackInterval) {
                this.explode();
            }
        }
    }

    /**
     * 检查是否可以攻击（同行是否有僵尸）
     */
    canAttack() {
        if (!window.gameState || !window.gameState.zombies) return false;
        return window.gameState.zombies.some(zombie => zombie.row === this.row && zombie.isAlive);
    }

    /**
     * 发射子弹
     */
    shoot() {
        const pos = gridToScreen(this.row, this.col);
        const projectile = new Projectile(
            this.projectileType || 'normal',
            this.row,
            pos.x + 30,
            pos.y,
            this.damage,
            this.slowEffect
        );
        
        if (window.gameState && window.gameState.projectiles) {
            window.gameState.projectiles.push(projectile);
        }
    }

    /**
     * 生产阳光
     */
    produceSun() {
        const pos = gridToScreen(this.row, this.col);
        createSun(pos.x, pos.y, this.sunAmount);
    }

    /**
     * 樱桃炸弹爆炸
     */
    explode() {
        if (!this.isAlive) return;
        
        // 创建爆炸动画
        const explosion = document.createElement('div');
        explosion.textContent = '💥';
        explosion.style.position = 'absolute';
        explosion.style.fontSize = '5rem';
        explosion.style.left = this.element.style.left;
        explosion.style.top = this.element.style.top;
        explosion.style.animation = 'explode 0.5s ease-out forwards';
        explosion.style.pointerEvents = 'none';
        explosion.style.zIndex = '1000';
        document.getElementById('grid-container').appendChild(explosion);
        
        setTimeout(() => explosion.remove(), 500);
        
        // 对范围内的僵尸造成伤害
        if (window.gameState && window.gameState.zombies) {
            window.gameState.zombies.forEach(zombie => {
                if (!zombie.isAlive) return;
                
                // 计算距离
                const rowDiff = Math.abs(zombie.row - this.row);
                const zombieGridPos = screenToGrid(zombie.x, zombie.y);
                const colDiff = Math.abs(zombieGridPos.col - this.col);
                
                if (rowDiff <= this.explodeRange && colDiff <= this.explodeRange) {
                    zombie.takeDamage(this.damage);
                }
            });
        }
        
        this.destroy();
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
        this.element.classList.add('flash');
        setTimeout(() => {
            if (this.element) {
                this.element.classList.remove('flash');
            }
        }, 300);
        
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
     * 植物死亡
     */
    die() {
        this.isAlive = false;
        this.destroy();
        
        // 更新网格占用状态
        if (window.gameState && window.gameState.grid) {
            window.gameState.grid[this.row][this.col] = null;
        }
        
        // 统计
        if (window.gameState) {
            window.gameState.plantsLost++;
        }
    }

    /**
     * 销毁植物
     */
    destroy() {
        this.isAlive = false;
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
        
        // 更新网格占用状态
        if (window.gameState && window.gameState.grid) {
            window.gameState.grid[this.row][this.col] = null;
        }
    }
}

// 子弹类
class Projectile {
    constructor(type, row, x, y, damage, slowEffect = 0) {
        this.type = type; // 'normal' 或 'ice'
        this.row = row;
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.slowEffect = slowEffect;
        this.speed = 200; // 像素/秒
        this.isAlive = true;
        this.element = null;
        
        this.createDOM();
    }

    /**
     * 创建子弹的DOM元素
     */
    createDOM() {
        this.element = document.createElement('div');
        this.element.className = 'projectile-object projectile-' + this.type;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        document.getElementById('projectile-layer').appendChild(this.element);
    }

    /**
     * 更新子弹位置
     * @param {number} deltaTime - 时间间隔（毫秒）
     */
    update(deltaTime) {
        if (!this.isAlive) return;

        // 向右移动
        this.x += (this.speed * deltaTime) / 1000;
        
        if (this.element) {
            this.element.style.left = this.x + 'px';
        }

        // 超出屏幕则销毁
        if (this.x > window.innerWidth + 50) {
            this.destroy();
        }
    }

    /**
     * 击中目标
     * @param {Zombie} zombie - 被击中的僵尸
     */
    hit(zombie) {
        zombie.takeDamage(this.damage);
        
        if (this.type === 'ice' && this.slowEffect > 0) {
            zombie.applySlow(this.slowEffect, 3000); // 减速3秒
        }
        
        this.destroy();
    }

    /**
     * 销毁子弹
     */
    destroy() {
        this.isAlive = false;
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }
}

/**
 * 获取植物数据
 * @param {string} plantId - 植物ID
 * @returns {Object} 植物数据
 */
function getPlantData(plantId) {
    return PLANT_DATA[plantId];
}

/**
 * 获取所有植物数据
 * @returns {Object} 所有植物数据
 */
function getAllPlantData() {
    return PLANT_DATA;
}

/**
 * 创建植物实例
 * @param {string} plantId - 植物ID
 * @param {number} row - 行号（0-4）
 * @param {number} col - 列号（0-2）
 * @returns {Plant} 植物实例
 */
function createPlant(plantId, row, col) {
    return new Plant(plantId, row, col);
}

