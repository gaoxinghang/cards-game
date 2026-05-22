import { _decorator, Button, Color, Component, Graphics, Label, Node, UITransform, Vec3 } from 'cc';
import { GameController } from './controllers/GameController';
import { CardArea, CardData, Suit } from './models/CardTypes';
import { GameState } from './models/GameState';
import { CardView } from './views/CardView';

const { ccclass } = _decorator;

@ccclass('CardGameScene')
export class CardGameScene extends Component {
    private readonly state = new GameState();
    private readonly cardViews = new Map<string, CardView>();
    private controller: GameController | null = null;
    private undoButton: Button | null = null;
    private undoLabel: Label | null = null;
    private readonly topPosition = new Vec3(210, -690, 0);

    protected onLoad(): void {
        this.setupCanvas();
        this.createBackground();
        this.createInitialCards();
        this.createUndoButton();
        this.controller = new GameController(this.state, this.cardViews, this.topPosition, () => this.refreshControls());
        this.refreshControls();
    }

    private setupCanvas(): void {
        const transform = this.node.getComponent(UITransform) || this.node.addComponent(UITransform);
        transform.setContentSize(1080, 2080);
    }

    private createBackground(): void {
        this.createPanel('MainArea', new Vec3(0, 290, 0), 1080, 1500, new Color(36, 117, 86, 255));
        this.createPanel('DeckArea', new Vec3(0, -750, 0), 1080, 580, new Color(31, 44, 58, 255));
        this.createText('主牌区', new Vec3(-430, 940, 0), 44, new Color(235, 242, 235, 255));
        this.createText('手牌 / 备用牌区', new Vec3(-360, -510, 0), 38, new Color(235, 242, 235, 255));
        this.createText('当前顶部牌', new Vec3(210, -500, 0), 34, new Color(235, 242, 235, 255));
    }

    private createInitialCards(): void {
        const cards: CardData[] = [
            this.makeCard('top-club-4', 4, Suit.Club, CardArea.Top, this.topPosition, false),
            this.makeCard('table-diamond-3', 3, Suit.Diamond, CardArea.Table, new Vec3(-260, 390, 0), true),
            this.makeCard('table-spade-2', 2, Suit.Spade, CardArea.Table, new Vec3(0, 390, 0), true),
            this.makeCard('table-heart-8', 8, Suit.Heart, CardArea.Table, new Vec3(260, 390, 0), true),
            this.makeCard('stock-heart-a', 1, Suit.Heart, CardArea.Stock, new Vec3(-230, -690, 0), true),
        ];

        cards.forEach((card) => {
            this.state.addCard(card);
            this.createCardView(card);
        });

        this.state.topCardId = 'top-club-4';
    }

    private makeCard(id: string, rank: number, suit: Suit, area: CardArea, position: Vec3, selectable: boolean): CardData {
        return {
            id,
            rank,
            suit,
            area,
            faceUp: true,
            selectable,
            position: position.clone(),
            originalPosition: position.clone(),
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

    private createUndoButton(): void {
        const node = this.createPanel('UndoButton', new Vec3(430, -690, 0), 160, 86, new Color(238, 190, 82, 255));
        this.undoButton = node.addComponent(Button);
        this.undoButton.transition = Button.Transition.COLOR;
        this.undoButton.node.on(Button.EventType.CLICK, () => this.controller?.undo(), this);
        this.undoLabel = this.createText('回退', Vec3.ZERO, 32, new Color(35, 34, 30, 255), node);
    }

    private refreshControls(): void {
        const canUndo = this.state.canUndo();
        if (this.undoButton) {
            this.undoButton.interactable = canUndo;
        }
        if (this.undoLabel) {
            this.undoLabel.string = canUndo ? `回退 ${this.state.history.length}` : '回退';
            this.undoLabel.color = canUndo ? new Color(35, 34, 30, 255) : new Color(115, 110, 98, 255);
        }
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
