# 快速开始指南

## 🚀 5分钟上手

### 步骤1：检查文件

确保项目包含以下文件：

```
✓ index.html
✓ style.css
✓ game.js
✓ plants.js
✓ zombies.js
✓ levels.js
✓ storage.js
✓ ui.js
✓ netlify.toml
✓ README.md
```

### 步骤2：启动本地服务器

**Windows用户（使用Python）：**
```powershell
python -m http.server 8000
```

**Mac/Linux用户：**
```bash
python3 -m http.server 8000
```

**使用Node.js：**
```bash
npx http-server -p 8000
```

### 步骤3：打开浏览器

访问：`http://localhost:8000`

## 🎮 游戏操作

### 基础操作
1. **选择植物** - 点击顶部植物卡片
2. **种植** - 点击战场上的空格子
3. **收集阳光** - 点击掉落的太阳☀️
4. **暂停游戏** - 点击右上角暂停按钮⏸

### 游戏策略
- 🌻 前期多种向日葵（50阳光）积累经济
- 🌱 每行至少放一个豌豆射手（100阳光）
- 🥜 使用坚果墙（50阳光）保护射手
- ❄️ 寒冰射手（175阳光）可以减缓僵尸
- 🍒 樱桃炸弹（150阳光）应对大波僵尸

## 📱 移动端测试

### 使用手机访问

1. 确保手机和电脑在同一WiFi网络
2. 找到电脑的IP地址：
   - Windows: `ipconfig`（查找IPv4地址）
   - Mac/Linux: `ifconfig`或`ip addr`
3. 在手机浏览器访问：`http://你的IP:8000`
   例如：`http://192.168.1.100:8000`

### 测试要点
- ✅ 竖屏显示正常
- ✅ 触摸操作流畅
- ✅ 植物和僵尸显示清晰
- ✅ 无双击缩放干扰

## 🐛 常见问题

### Q1: 页面显示空白？
**解决方案：**
- 检查浏览器控制台（F12）是否有错误
- 确认所有JS文件都已加载
- 清除浏览器缓存后刷新

### Q2: 植物无法种植？
**解决方案：**
- 检查阳光是否充足
- 确认植物未在冷却中
- 确认点击的是空格子

### Q3: 游戏卡顿？
**解决方案：**
- 关闭其他浏览器标签页
- 使用Chrome浏览器获得最佳性能
- 检查电脑资源使用情况

### Q4: 进度丢失？
**解决方案：**
- 检查浏览器是否禁用了localStorage
- 不要使用无痕模式
- 检查浏览器开发者工具 -> Application -> Local Storage

### Q5: 移动端显示异常？
**解决方案：**
- 确保使用竖屏模式
- 刷新页面
- 尝试其他浏览器（Chrome/Safari）

## 🎯 快速通关技巧

### 关卡1：阳光草地（简单）
**策略：**
- 前30秒种植2个向日葵
- 第1列种2个豌豆射手
- 收集所有阳光

**推荐布局：**
```
🌻 🌱 ⬜
⬜ 🌱 ⬜
🌻 🌱 ⬜
⬜ ⬜ ⬜
⬜ ⬜ ⬜
```

### 关卡2：僵尸来袭（中等）
**策略：**
- 种植3个向日葵
- 每行放1个豌豆射手
- 使用寒冰射手减速

### 关卡3：坚果防线（中等偏难）
**策略：**
- 第2列全部种坚果墙
- 第1列种植射手
- 准备樱桃炸弹应急

### 关卡4：冰冻时刻（困难）
**策略：**
- 只能用寒冰射手（125阳光）
- 多种向日葵快速积累阳光
- 坚果墙延缓僵尸

### 关卡5：终极对决（极难）
**策略：**
- 前期快速铺向日葵
- 混合使用豌豆和寒冰射手
- 保留樱桃炸弹对付第10波

## 📊 性能优化建议

### 浏览器设置
- 使用Chrome或Edge浏览器
- 启用硬件加速
- 关闭不必要的扩展

### 游戏设置
- 避免同时运行多个浏览器标签
- 定期清理浏览器缓存
- 确保最新浏览器版本

## 🔧 开发者模式

### 查看游戏数据
打开浏览器控制台（F12），输入：
```javascript
// 查看当前游戏状态
console.log(gameState);

// 查看存储数据
console.log(loadGameData());

// 添加阳光（作弊码）
gameState.sunAmount += 1000;
updateSunDisplay();
```

### 跳关（测试用）
```javascript
// 解锁所有关卡
const data = loadGameData();
data.progress.completedLevels = [1, 2, 3, 4];
data.progress.currentLevel = 5;
data.progress.unlockedPlants = ['sunflower', 'peashooter', 'wallnut', 'snowpea', 'cherrybomb'];
saveGameData(data);
location.reload();
```

### 调整游戏速度（测试用）
```javascript
// 加快游戏速度
gameState.levelConfig.waveInterval = 5000; // 5秒波次间隔
gameState.sunDropInterval = 3000; // 3秒掉落阳光
```

## 📦 部署到Netlify

### 方法1：拖拽部署
1. 访问 [Netlify](https://www.netlify.com/)
2. 注册/登录账号
3. 将整个项目文件夹拖到部署区域
4. 等待部署完成
5. 获得访问链接

### 方法2：Git部署
1. 将代码推送到GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

2. 在Netlify选择"Import from Git"
3. 授权并选择仓库
4. 点击Deploy

### 自定义域名（可选）
1. 在Netlify项目设置中选择"Domain settings"
2. 添加自定义域名
3. 更新DNS记录
4. 等待SSL证书生成

## ✅ 部署前检查清单

- [ ] 所有文件已提交到仓库
- [ ] 本地测试通过
- [ ] 移动端测试通过
- [ ] 进度保存功能正常
- [ ] 所有5个关卡可玩
- [ ] 无控制台错误
- [ ] README.md 已更新

## 🎉 祝你游戏愉快！

如有问题，请查看 `TESTING.md` 获取详细测试步骤。

