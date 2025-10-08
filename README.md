# 植物大战僵尸 - 竖屏版

一款专为竖屏设备优化的网页版植物大战僵尸游戏，无需注册登录即可畅玩！

🎮 **在线体验：** [即将上线]

## ✨ 特色功能

- 🌻 **竖屏优化设计** - 完美适配手机竖屏操作
- 🎯 **简单易上手** - 简化的游戏机制，快速开始游戏
- 💾 **本地存储进度** - 使用localStorage保存游戏进度，数据安全
- 🆓 **完全免费** - 无广告、无内购，纯粹的游戏体验
- 📱 **跨平台支持** - 支持PC和移动设备访问

## 🎮 游戏玩法

### 游戏目标

- 种植各种植物来抵御僵尸入侵
- 阻止僵尸到达屏幕左侧
- 消灭所有僵尸波次获得胜利

### 基础操作

1. 点击植物卡片选择植物
2. 点击战场格子种植植物
3. 点击掉落的太阳收集阳光
4. 长按植物可移除（不返还阳光）

### 植物介绍

- **🌻 向日葵（50阳光）** - 定期生产阳光，是经济来源
- **🌱 豌豆射手（100阳光）** - 发射豌豆攻击僵尸，基础攻击单位
- **🥜 坚果墙（50阳光）** - 高血量防御植物，保护后方射手
- **❄️ 寒冰射手（175阳光）** - 发射冰豌豆，减缓僵尸速度
- **🍒 樱桃炸弹（150阳光）** - 一次性爆炸，消灭范围内僵尸

### 僵尸类型

- **🧟 普通僵尸** - 基础僵尸，血量低，速度慢
- **🧟‍♂️ 路障僵尸** - 戴着路障，血量中等
- **🧟‍♀️ 铁桶僵尸** - 戴着铁桶，血量高，速度快

### 关卡列表

1. **关卡1：阳光草地** - 熟悉游戏操作（简单）
2. **关卡2：僵尸来袭** - 僵尸数量增多（中等）
3. **关卡3：坚果防线** - 不让僵尸越过中线（中等偏难）
4. **关卡4：冰冻时刻** - 只能使用寒冰射手（困难）
5. **关卡5：终极对决** - 坚持10波攻击（极难）

## 🛠️ 技术栈

- **前端框架：** 原生HTML5 + CSS3 + JavaScript（ES6+）
- **UI组件：** Bootstrap 5.3（CDN）
- **数据存储：** localStorage
- **部署平台：** Netlify

## 📦 项目结构

```
plantvszombieastro/
├── index.html          # 主页面
├── style.css           # 样式文件
├── game.js             # 游戏核心逻辑
├── plants.js           # 植物系统
├── zombies.js          # 僵尸系统
├── levels.js           # 关卡配置
├── storage.js          # 数据存储
├── ui.js               # 界面控制
├── netlify.toml        # Netlify配置
├── .gitignore          # Git忽略文件
└── README.md           # 项目说明
```

## 🚀 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/plantvszombieastro.git
cd plantvszombieastro
```

### 2. 启动本地服务器

由于是纯静态网站，可以使用任何HTTP服务器：

**使用Python 3：**
```bash
python -m http.server 8000
```

**使用Node.js（http-server）：**
```bash
npx http-server -p 8000
```

**使用VSCode Live Server插件：**
- 安装Live Server插件
- 右键点击index.html -> Open with Live Server

### 3. 访问游戏

打开浏览器访问：`http://localhost:8000`

## 🌐 部署到Netlify

### 方法1：通过Git部署（推荐）

1. 将代码推送到GitHub仓库
2. 登录 [Netlify](https://www.netlify.com/)
3. 点击 "Add new site" -> "Import an existing project"
4. 选择GitHub并授权
5. 选择你的仓库
6. 构建设置保持默认即可
7. 点击 "Deploy site"

### 方法2：拖拽部署

1. 登录 [Netlify](https://www.netlify.com/)
2. 将项目文件夹拖拽到 Netlify 的部署区域
3. 等待部署完成

## 🎯 游戏技巧

- 前期优先种植向日葵积累阳光
- 每行至少放置一个攻击性植物
- 使用坚果墙延缓僵尸前进
- 合理使用樱桃炸弹应对大波僵尸
- 及时收集阳光，不要浪费

## 🔧 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ 移动端浏览器（iOS Safari, Chrome Mobile）

## 📝 开发计划

### 已完成
- [x] 基础游戏框架
- [x] 5种植物系统
- [x] 3种僵尸类型
- [x] 5个游戏关卡
- [x] 阳光系统
- [x] 碰撞检测
- [x] 进度保存
- [x] 响应式设计

### 未来计划
- [ ] 音效系统
- [ ] 更多植物类型
- [ ] 更多僵尸类型
- [ ] 无尽模式
- [ ] 成就系统
- [ ] 多语言支持

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- 灵感来源于经典游戏《植物大战僵尸》
- 使用Emoji图标快速开发
- 感谢Bootstrap提供的UI组件

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- GitHub Issues: [项目Issues页面]
- Email: your.email@example.com

---

**享受游戏！祝你好运！** 🌻🧟

