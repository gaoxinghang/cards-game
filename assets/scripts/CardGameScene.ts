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
            topCard: { id: 'level1-top-club-4', rank: 4, suit: Suit.Club, area: CardArea.Top, position: new Vec3(210, -690, 0) },
            tableCards: [
                { id: 'level1-table-diamond-3', rank: 3, suit: Suit.Diamond, area: CardArea.Table, position: new Vec3(-260, 390, 0) },
                { id: 'level1-table-spade-2', rank: 2, suit: Suit.Spade, area: CardArea.Table, position: new Vec3(0, 390, 0) },
                { id: 'level1-table-heart-8', rank: 8, suit: Suit.Heart, area: CardArea.Table, position: new Vec3(260, 390, 0) },
            ],
            stockCards: [{ id: 'level1-stock-heart-7', rank: 7, suit: Suit.Heart, area: CardArea.Stock, position: new Vec3(-230, -690, 0) }],
        },
        {
            title: '\u7b2c 2 \u5173',
            topCard: { id: 'level2-top-spade-6', rank: 6, suit: Suit.Spade, area: CardArea.Top, position: new Vec3(210, -690, 0) },
            tableCards: [
                { id: 'level2-table-heart-5', rank: 5, suit: Suit.Heart, area: CardArea.Table, position: new Vec3(-330, 520, 0) },
                { id: 'level2-table-club-4', rank: 4, suit: Suit.Club, area: CardArea.Table, position: new Vec3(-110, 520, 0) },
                { id: 'level2-table-diamond-9', rank: 9, suit: Suit.Diamond, area: CardArea.Table, position: new Vec3(110, 520, 0) },
                { id: 'level2-table-spade-10', rank: 10, suit: Suit.Spade, area: CardArea.Table, position: new Vec3(330, 520, 0) },
            ],
            stockCards: [{ id: 'level2-stock-heart-8', rank: 8, suit: Suit.Heart, area: CardArea.Stock, position: new Vec3(-230, -690, 0) }],
        },
        {
            title: '\u7b2c 3 \u5173',
            topCard: { id: 'level3-top-diamond-7', rank: 7, suit: Suit.Diamond, area: CardArea.Top, position: new Vec3(210, -690, 0) },
            tableCards: [
                { id: 'level3-table-spade-6', rank: 6, suit: Suit.Spade, area: CardArea.Table, position: new Vec3(-360, 600, 0) },
                { id: 'level3-table-heart-5', rank: 5, suit: Suit.Heart, area: CardArea.Table, position: new Vec3(-120, 600, 0) },
                { id: 'level3-table-club-4', rank: 4, suit: Suit.Club, area: CardArea.Table, position: new Vec3(120, 600, 0) },
                { id: 'level3-table-diamond-10', rank: 10, suit: Suit.Diamond, area: CardArea.Table, position: new Vec3(-240, 330, 0) },
                { id: 'level3-table-spade-11', rank: 11, suit: Suit.Spade, area: CardArea.Table, position: new Vec3(0, 330, 0) },
                { id: 'level3-table-heart-12', rank: 12, suit: Suit.Heart, area: CardArea.Table, position: new Vec3(240, 330, 0) },
            ],
            stockCards: [{ id: 'level3-stock-club-9', rank: 9, suit: Suit.Club, area: CardArea.Stock, position: new Vec3(-230, -690, 0) }],
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
    private readonly topPosition = new Vec3(210, -690, 0);

    protected onLoad(): void {
        this.setupCanvas();
        this.createBackground();
        this.createUndoButton();
        this.createNextButton();
        this.controller = new GameController(this.state, this.cardViews, this.topPosition, () => this.refreshControls());
        this.loadLevel(0);
    }

    private setupCanvas(): void {
        const transform = this.node.getComponent(UITransform) || this.node.addComponent(UITransform);
        transform.setContentSize(1080, 2080);
    }

    private createBackground(): void {
        this.createPanel('MainArea', new Vec3(0, 290, 0), 1080, 1500, new Color(36, 117, 86, 255));
        this.createPanel('DeckArea', new Vec3(0, -750, 0), 1080, 580, new Color(31, 44, 58, 255));
        this.createText('\u4e3b\u724c\u533a', new Vec3(-430, 940, 0), 44, new Color(235, 242, 235, 255));
        this.createText('\u624b\u724c / \u5907\u7528\u724c\u533a', new Vec3(-360, -510, 0), 38, new Color(235, 242, 235, 255));
        this.createText('\u5f53\u524d\u9876\u90e8\u724c', new Vec3(210, -500, 0), 34, new Color(235, 242, 235, 255));
        this.levelLabel = this.createText('', new Vec3(0, 940, 0), 44, new Color(255, 232, 118, 255));
        this.statusLabel = this.createText('', new Vec3(360, 940, 0), 34, new Color(235, 242, 235, 255));
        this.winLabel = this.createText('', new Vec3(0, 70, 0), 72, new Color(255, 232, 118, 255));
    }

    private createUndoButton(): void {
        const node = this.createPanel('UndoButton', new Vec3(430, -690, 0), 160, 86, new Color(238, 190, 82, 255));
        this.undoButton = node.addComponent(Button);
        this.undoButton.transition = Button.Transition.COLOR;
        this.undoButton.node.on(Button.EventType.CLICK, () => this.controller?.undo(), this);
        this.undoLabel = this.createText('\u64a4\u56de', Vec3.ZERO, 32, new Color(35, 34, 30, 255), node);
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
        this.refreshControls();
    }

    private clearCards(): void {
        this.cardViews.forEach((view) => view.node.destroy());
        this.cardViews.clear();
        this.state.cards.clear();
        this.state.history.splice(0);
        this.state.topCardId = '';
        this.state.inputLocked = false;
    }

    private makeCard(config: LevelCardConfig): CardData {
        return {
            id: config.id,
            rank: config.rank,
            suit: config.suit,
            area: config.area,
            faceUp: true,
            selectable: config.area !== CardArea.Top,
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
        }
    }

    private goToNextLevel(): void {
        if (!this.isCurrentLevelWon() || this.currentLevelIndex >= this.levels.length - 1) {
            return;
        }

        this.loadLevel(this.currentLevelIndex + 1);
    }

    private refreshControls(): void {
        const canUndo = this.state.canUndo();
        if (this.undoButton) {
            this.undoButton.interactable = canUndo;
        }
        if (this.undoLabel) {
            this.undoLabel.string = canUndo ? `\u64a4\u56de ${this.state.history.length}` : '\u64a4\u56de';
            this.undoLabel.color = canUndo ? new Color(35, 34, 30, 255) : new Color(115, 110, 98, 255);
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
        return this.state.cards.size > 0 && [...this.state.cards.values()].every((card) => card.area !== CardArea.Table);
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
