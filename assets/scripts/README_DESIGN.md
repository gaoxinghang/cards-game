# 纸牌 Demo 程序设计

## 架构

工程按数据、规则、控制器、视图、可回退动作分层：

- `models/CardTypes.ts`：定义卡牌点数、花色、区域和坐标等数据。
- `models/GameState.ts`：维护当前顶部牌、全部卡牌和回退历史栈。
- `rules/CardRule.ts`：封装“点数差 1 即可匹配”的规则。
- `controllers/GameController.ts`：处理点击、匹配、移动和回退入口。
- `actions/IUndoableAction.ts` 与 `actions/MoveCardAction.ts`：统一动作执行和撤销。
- `views/CardView.ts`：负责卡牌显示、点击和 `MoveTo` 动画。
- `CardGameScene.ts`：运行时生成主牌区、手牌区、卡牌和回退按钮。

## 当前玩法

工程当前没有预置场景文件。打开 Cocos Creator 3.8.8 后，新建一个空场景，创建 `Canvas` 节点并挂载 `CardGameScene` 组件即可运行。脚本会在运行时生成全部测试卡牌、区域背景和回退按钮。

初始顶部牌为 `♣4`，桌面牌包含 `♦3`、`♠2`、`♥8`，备用/手牌区包含 `♥A`。

- 点击 `♦3` 时，因为它与 `♣4` 点数差 1，会移动到顶部牌位置并成为新顶部牌。
- 点击 `♥A` 时，作为备用/手牌区卡牌，可直接移动到顶部牌位置并成为新顶部牌。
- 点击 `♠2` 时，若当前顶部牌是 `♥A` 或 `♦3`，点数差 1，允许匹配。
- 点击 `♥8` 时，若与当前顶部牌点数不相邻，不会移动，也不会产生回退记录。
- 点击回退按钮时，从历史栈中取出最近动作，反向移动回原坐标并恢复旧顶部牌。

## 扩展方式

新增卡牌时，在 `CardGameScene.createInitialCards()` 中追加 `CardData` 配置即可。配置包括 id、点数、花色、区域、初始坐标和是否可点，视图会自动根据数据生成。

新增回退类型时，实现 `IUndoableAction` 的 `execute()` 和 `undo()`，在对应业务逻辑中执行后压入 `GameState.history`。例如翻牌、发牌、洗牌、多牌连消都可以复用同一个历史栈。

## 注意事项

动画期间 `GameState.inputLocked` 会锁住输入，避免重复点击导致状态错乱。花色只用于显示，不参与匹配判断。
