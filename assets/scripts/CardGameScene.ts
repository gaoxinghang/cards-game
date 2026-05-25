import { _decorator, Button, Color, Component, Graphics, Label, Node, UITransform, Vec3 } from 'cc';
import { GameController } from './controllers/GameController';
import { CardArea, CardData, Suit } from './models/CardTypes';
import { GameState } from './models/GameState';
import { CardView } from './views/CardView';

const { ccclass } = _decorator;

interface LevelCardConfig {
    id: string;
    rank: number;
    suit: Suit;
    area: CardArea;
    position: Vec3;
    stackId?: string;
    stackIndex?: number;
}

interface LevelConfig {
    title: string;
    topCard: LevelCardConfig;
    tableCards: LevelCardConfig[];
    stockCards: LevelCardConfig[];
}

@ccclass('CardGameScene')
export class CardGameScene extends Component {
    private readonly state = new GameState();
    private readonly cardViews = new Map<string, CardView>();
    private readonly levels: LevelConfig[] = [
        {
            title: '\u7b2c 1 \u5173',
            topCard: { id: 'level1-top-club-6', rank: 6, suit: Suit.Club, area: CardArea.Top, position: new Vec3(300, -720, 0) },
            tableCards: [
                { id: 'level1-left-3', rank: 3, suit: Suit.Club, area: CardArea.Table, position: new Vec3(-360, 610, 0), stackId: 'level1-left', stackIndex: 0 },
                { id: 'level1-left-4', rank: 4, suit: Suit.Club, area: CardArea.Table, position: new Vec3(-300, 500, 0), stackId: 'level1-left', stackIndex: 1 },
                { id: 'level1-left-5', rank: 5, suit: Suit.Heart, area: CardArea.Table, position: new Vec3(-250, 390, 0), stackId: 'level1-left', stackIndex: 2 },
                { id: 'level1-right-4', rank: 4, suit: Suit.Club, area: CardArea.Table, position: new Vec3(260, 610, 0), stackId: 'level1-right', stackIndex: 0 },
                { id: 'level1-right-3', rank: 3, suit: Suit.Spade, area: CardArea.Table, position: new Vec3(220, 500, 0), stackId: 'level1-right', stackIndex: 1 },
                { id: 'level1-right-2', rank: 2, suit: Suit.Club, area: CardArea.Table, position: new Vec3(160, 360, 0), stackId: 'level1-right', stackIndex: 2 },
            ],
            stockCards: [
                { id: 'level1-stock-4', rank: 4, suit: Suit.Club, area: CardArea.Stock, position: new Vec3(-175, -720, 0), stackId: 'level1-stock', stackIndex: 0 },
                { id: 'level1-stock-3', rank: 3, suit: Suit.Spade, area: CardArea.Stock, position: new Vec3(-305, -720, 0), stackId: 'level1-stock', stackIndex: 1 },
            ],
        },
        {
            title: '\u7b2c 2 \u5173',
            topCard: { id: 'level2-top-spade-8', rank: 8, suit: Suit.Spade, area: CardArea.Top, position: new Vec3(300, -720, 0) },
            tableCards: [
                { id: 'level2-left-4', rank: 4, suit: Suit.Club, area: CardArea.Table, position: new Vec3(-410, 670, 0), stackId: 'level2-left', stackIndex: 0 },
                { id: 'level2-left-5', rank: 5, suit: Suit.Diamond, area: CardArea.Table, position: new Vec3(-360, 560, 0), stackId: 'level2-left', stackIndex: 1 },
                { id: 'level2-left-7', rank: 7, suit: Suit.Heart, area: CardArea.Table, position: new Vec3(-310, 450, 0), stackId: 'level2-left', stackIndex: 2 },
                { id: 'level2-mid-12', rank: 12, suit: Suit.Heart, area: CardArea.Table, position: new Vec3(-50, 670, 0), stackId: 'level2-mid', stackIndex: 0 },
                { id: 'level2-mid-11', rank: 11, suit: Suit.Club, area: CardArea.Table, position: new Vec3(0, 560, 0), stackId: 'level2-mid', stackIndex: 1 },
                { id: 'level2-mid-10', rank: 10, suit: Suit.Spade, area: CardArea.Table, position: new Vec3(50, 450, 0), stackId: 'level2-mid', stackIndex: 2 },
                { id: 'level2-right-2', rank: 2, suit: Suit.Spade, area: CardArea.Table, position: new Vec3(330, 650, 0), stackId: 'level2-right', stackIndex: 0 },
                { id: 'level2-right-3', rank: 3, suit: Suit.Diamond, area: CardArea.Table, position: new Vec3(285, 540, 0), stackId: 'level2-right', stackIndex: 1 },
            ],
            stockCards: [
                { id: 'level2-stock-9', rank: 9, suit: Suit.Heart, area: CardArea.Stock, position: new Vec3(-280, -720, 0), stackId: 'level2-stock', stackIndex: 0 },
                { id: 'level2-stock-4', rank: 4, suit: Suit.Spade, area: CardArea.Stock, position: new Vec3(-410, -720, 0), stackId: 'level2-stock', stackIndex: 1 },
            ],
        },
        {
            title: '\u7b2c 3 \u5173',
            topCard: { id: 'level3-top-diamond-5', rank: 5, suit: Suit.Diamond, area: CardArea.Top, position: new Vec3(300, -720, 0) },
            tableCards: [
                { id: 'level3-a-9', rank: 9, suit: Suit.Diamond, area: CardArea.Table, position: new Vec3(-430, 710, 0), stackId: 'level3-a', stackIndex: 0 },
                { id: 'level3-a-8', rank: 8, suit: Suit.Spade, area: CardArea.Table, position: new Vec3(-385, 600, 0), stackId: 'level3-a', stackIndex: 1 },
                { id: 'level3-a-7', rank: 7, suit: Suit.Heart, area: CardArea.Table, position: new Vec3(-340, 490, 0), stackId: 'level3-a', stackIndex: 2 },
                { id: 'level3-a-6', rank: 6, suit: Suit.Club, area: CardArea.Table, position: new Vec3(-295, 380, 0), stackId: 'level3-a', stackIndex: 3 },
                { id: 'level3-b-13', rank: 13, suit: Suit.Diamond, area: CardArea.Table, position: new Vec3(-130, 710, 0), stackId: 'level3-b', stackIndex: 0 },
                { id: 'level3-b-12', rank: 12, suit: Suit.Club, area: CardArea.Table, position: new Vec3(-85, 600, 0), stackId: 'level3-b', stackIndex: 1 },
                { id: 'level3-b-11', rank: 11, suit: Suit.Heart, area: CardArea.Table, position: new Vec3(-40, 490, 0), stackId: 'level3-b', stackIndex: 2 },
                { id: 'level3-b-10', rank: 10, suit: Suit.Spade, area: CardArea.Table, position: new Vec3(5, 380, 0), stackId: 'level3-b', stackIndex: 3 },
                { id: 'level3-c-2', rank: 2, suit: Suit.Heart, area: CardArea.Table, position: new Vec3(170, 710, 0), stackId: 'level3-c', stackIndex: 0 },
                { id: 'level3-c-3', rank: 3, suit: Suit.Club, area: CardArea.Table, position: new Vec3(215, 600, 0), stackId: 'level3-c', stackIndex: 1 },
                { id: 'level3-c-4', rank: 4, suit: Suit.Spade, area: CardArea.Table, position: new Vec3(260, 490, 0), stackId: 'level3-c', stackIndex: 2 },
                { id: 'level3-c-5', rank: 5, suit: Suit.Diamond, area: CardArea.Table, position: new Vec3(305, 380, 0), stackId: 'level3-c', stackIndex: 3 },
                { id: 'level3-d-7', rank: 7, suit: Suit.Diamond, area: CardArea.Table, position: new Vec3(430, 680, 0), stackId: 'level3-d', stackIndex: 0 },
                { id: 'level3-d-8', rank: 8, suit: Suit.Club, area: CardArea.Table, position: new Vec3(430, 570, 0), stackId: 'level3-d', stackIndex: 1 },
            ],
            stockCards: [
                { id: 'level3-stock-4', rank: 4, suit: Suit.Club, area: CardArea.Stock, position: new Vec3(-305, -720, 0), stackId: 'level3-stock', stackIndex: 0 },
                { id: 'level3-stock-7', rank: 7, suit: Suit.Heart, area: CardArea.Stock, position: new Vec3(-435, -720, 0), stackId: 'level3-stock', stackIndex: 1 },
            ],
        },
    ];

    private controller: GameController | null = null;
    private undoButton: Button | null = null;
    private undoLabel: Label | null = null;
    private nextButton: Button | null = null;
    private nextLabel: Label | null = null;
    private statusLabel: Label | null = null;
    private winLabel: Label | null = null;
    private levelLabel: Label | null = null;
    private currentLevelIndex = 0;
    private topPileOrder: string[] = [];
    private readonly topPosition = new Vec3(300, -720, 0);

    protected onLoad(): void {
        this.setupCanvas();
        this.createBackground();
        this.createUndoButton();
        this.createNextButton();
        this.controller = new GameController(this.state, this.cardViews, this.topPosition, () => this.handleStateChanged());
        this.loadLevel(0);
    }

    private setupCanvas(): void {
        const transform = this.node.getComponent(UITransform) || this.node.addComponent(UITransform);
        transform.setContentSize(1080, 2080);
    }

    private createBackground(): void {
        this.createPanel('MainArea', new Vec3(0, 290, 0), 1080, 1500, new Color(176, 124, 65, 255));
        this.createPanel('DeckArea', new Vec3(0, -750, 0), 1080, 580, new Color(154, 26, 166, 255));
        this.levelLabel = this.createText('', new Vec3(-420, 940, 0), 38, new Color(255, 244, 210, 255));
        this.statusLabel = this.createText('', new Vec3(330, 940, 0), 30, new Color(255, 244, 210, 255));
        this.winLabel = this.createText('', new Vec3(0, 70, 0), 72, new Color(255, 232, 118, 255));
    }

    private createUndoButton(): void {
        const node = this.createPanel('UndoButton', new Vec3(460, -720, 0), 130, 76, new Color(154, 26, 166, 255));
        this.undoButton = node.addComponent(Button);
        this.undoButton.transition = Button.Transition.COLOR;
        this.undoButton.node.on(Button.EventType.CLICK, () => this.controller?.undo(), this);
        this.undoLabel = this.createText('\u56de\u9000', Vec3.ZERO, 30, new Color(255, 244, 255, 255), node);
    }

    private createNextButton(): void {
        const node = this.createPanel('NextButton', new Vec3(0, -170, 0), 240, 92, new Color(255, 232, 118, 255));
        this.nextButton = node.addComponent(Button);
        this.nextButton.transition = Button.Transition.COLOR;
        this.nextButton.node.on(Button.EventType.CLICK, () => this.goToNextLevel(), this);
        this.nextLabel = this.createText('\u4e0b\u4e00\u5173', Vec3.ZERO, 34, new Color(35, 34, 30, 255), node);
        node.active = false;
    }

    private loadLevel(levelIndex: number): void {
        this.clearCards();
        this.currentLevelIndex = levelIndex;
        const level = this.levels[this.currentLevelIndex];
        const cards = [level.topCard, ...level.tableCards, ...level.stockCards];

        cards.forEach((cardConfig) => {
            const card = this.makeCard(cardConfig);
            this.state.addCard(card);
            this.createCardView(card);
        });

        this.state.topCardId = level.topCard.id;
        this.topPileOrder = [level.topCard.id];
        this.handleStateChanged();
    }

    private clearCards(): void {
        this.cardViews.forEach((view) => view.node.destroy());
        this.cardViews.clear();
        this.state.cards.clear();
        this.state.history.splice(0);
        this.state.topCardId = '';
        this.state.inputLocked = false;
        this.topPileOrder = [];
    }

    private makeCard(config: LevelCardConfig): CardData {
        return {
            id: config.id,
            rank: config.rank,
            suit: config.suit,
            area: config.area,
            stackId: config.stackId,
            stackIndex: config.stackIndex,
            faceUp: config.area !== CardArea.Table || config.stackIndex === undefined,
            selectable: config.area === CardArea.Stock,
            position: config.position.clone(),
            originalPosition: config.position.clone(),
        };
    }

    private createCardView(card: CardData): void {
        const node = new Node(card.id);
        node.setParent(this.node);
        node.setPosition(card.position);

        const view = node.addComponent(CardView);
        view.initialize(card, (clickedCard) => this.controller?.handleCardClick(clickedCard));
        this.cardViews.set(card.id, view);

        if (card.area === CardArea.Top) {
            node.setSiblingIndex(998);
        } else if (card.area === CardArea.Stock && card.stackIndex !== undefined) {
            node.setSiblingIndex(700 + card.stackIndex);
        } else if (card.stackIndex !== undefined) {
            node.setSiblingIndex(100 + card.stackIndex);
        }
    }

    private goToNextLevel(): void {
        if (!this.isCurrentLevelWon() || this.currentLevelIndex >= this.levels.length - 1) {
            return;
        }

        this.loadLevel(this.currentLevelIndex + 1);
    }

    private handleStateChanged(): void {
        this.updateTableCoverage();
        this.layoutTopPile();
        this.refreshControls();
    }

    private updateTableCoverage(): void {
        const stacks = new Map<string, CardData[]>();
        const stockStacks = new Map<string, CardData[]>();

        this.state.cards.forEach((card) => {
            if (card.area === CardArea.Stock) {
                if (card.stackId && card.stackIndex !== undefined) {
                    const stack = stockStacks.get(card.stackId) || [];
                    stack.push(card);
                    stockStacks.set(card.stackId, stack);
                } else {
                    card.faceUp = true;
                    card.selectable = true;
                    this.refreshCardView(card);
                }
                return;
            }

            if (card.area !== CardArea.Table) {
                return;
            }

            if (!card.stackId || card.stackIndex === undefined) {
                card.faceUp = true;
                card.selectable = true;
                this.refreshCardView(card);
                return;
            }

            const stack = stacks.get(card.stackId) || [];
            stack.push(card);
            stacks.set(card.stackId, stack);
        });

        stacks.forEach((stack) => {
            const exposedIndex = Math.max(...stack.map((card) => card.stackIndex || 0));
            stack.forEach((card) => {
                const isExposed = card.stackIndex === exposedIndex;
                card.faceUp = isExposed;
                card.selectable = isExposed;
                this.refreshCardView(card);
            });
        });

        stockStacks.forEach((stack) => {
            const exposedIndex = Math.min(...stack.map((card) => card.stackIndex || 0));
            stack.forEach((card) => {
                const isExposed = card.stackIndex === exposedIndex;
                card.faceUp = isExposed;
                card.selectable = isExposed;
                this.refreshCardView(card);
            });
        });
    }

    private refreshCardView(card: CardData): void {
        const view = this.cardViews.get(card.id);
        if (!view) {
            return;
        }

        view.node.active = true;
        view.refresh();
    }

    private layoutTopPile(): void {
        this.topPileOrder = this.topPileOrder.filter((cardId) => this.state.getCard(cardId)?.area === CardArea.Top);
        if (this.state.topCardId && this.topPileOrder[this.topPileOrder.length - 1] !== this.state.topCardId) {
            this.topPileOrder = this.topPileOrder.filter((cardId) => cardId !== this.state.topCardId);
            this.topPileOrder.push(this.state.topCardId);
        }

        this.topPileOrder.forEach((cardId) => {
            const card = this.state.getCard(cardId);
            const view = this.cardViews.get(cardId);
            if (!card || !view) {
                return;
            }

            const isCurrentTop = card.id === this.state.topCardId;
            view.node.active = isCurrentTop;
            card.faceUp = isCurrentTop;
            card.selectable = false;
            if (isCurrentTop) {
                view.node.setSiblingIndex(998);
                view.moveTo(this.topPosition.clone(), 0.08, () => view.refresh());
            }
        });
    }

    private refreshControls(): void {
        const canUndo = this.state.canUndo();
        if (this.undoButton) {
            this.undoButton.interactable = canUndo;
        }
        if (this.undoLabel) {
            this.undoLabel.string = canUndo ? `\u56de\u9000 ${this.state.history.length}` : '\u56de\u9000';
            this.undoLabel.color = canUndo ? new Color(255, 244, 255, 255) : new Color(215, 160, 220, 255);
        }

        const won = this.isCurrentLevelWon();
        const isLastLevel = this.currentLevelIndex === this.levels.length - 1;
        const remainingTableCards = [...this.state.cards.values()].filter((card) => card.area === CardArea.Table).length;

        if (this.levelLabel) {
            this.levelLabel.string = this.levels[this.currentLevelIndex].title;
        }
        if (this.statusLabel) {
            this.statusLabel.string = `\u5269\u4f59\u4e3b\u724c\uff1a${remainingTableCards}`;
        }
        if (this.winLabel) {
            this.winLabel.string = won ? (isLastLevel ? '\u5168\u90e8\u901a\u5173' : '\u901a\u5173\u6210\u529f') : '';
        }
        if (this.nextButton) {
            this.nextButton.node.active = won && !isLastLevel;
        }
        if (this.nextLabel) {
            this.nextLabel.string = '\u4e0b\u4e00\u5173';
        }
    }

    private isCurrentLevelWon(): boolean {
        return this.state.cards.size > 0 && [...this.state.cards.values()].every((card) => card.area === CardArea.Top);
    }

    private createPanel(name: string, position: Vec3, width: number, height: number, color: Color): Node {
        const node = new Node(name);
        node.setParent(this.node);
        node.setPosition(position);
        const transform = node.addComponent(UITransform);
        transform.setContentSize(width, height);
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = color;
        graphics.fillRect(-width / 2, -height / 2, width, height);
        return node;
    }

    private createText(text: string, position: Vec3, fontSize: number, color: Color, parent: Node = this.node): Label {
        const node = new Node(text);
        node.setParent(parent);
        node.setPosition(position);
        const transform = node.addComponent(UITransform);
        transform.setContentSize(300, 80);
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 8;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        return label;
    }
}
