import { _decorator, Color, Component, EventTouch, Graphics, Label, Node, tween, UITransform, Vec3 } from 'cc';
import { formatRank, Suit } from '../models/CardTypes';
import type { CardData } from '../models/CardTypes';

const { ccclass } = _decorator;

@ccclass('CardView')
export class CardView extends Component {
    private cardData: CardData | null = null;
    private clickHandler: ((card: CardData) => void) | null = null;
    private background: Graphics | null = null;
    private label: Label | null = null;

    public initialize(cardData: CardData, clickHandler: (card: CardData) => void): void {
        this.cardData = cardData;
        this.clickHandler = clickHandler;
        this.ensureView();
        this.refresh();
        this.node.setPosition(cardData.position);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public refresh(): void {
        if (!this.cardData || !this.background || !this.label) {
            return;
        }

        const isRed = this.cardData.suit === Suit.Heart || this.cardData.suit === Suit.Diamond;
        this.drawBackground(this.cardData.faceUp ? new Color(248, 248, 242, 255) : new Color(78, 95, 135, 255));
        this.label.color = isRed ? new Color(194, 45, 57, 255) : new Color(30, 36, 45, 255);
        this.label.string = this.cardData.faceUp ? `${this.cardData.suit}${formatRank(this.cardData.rank)}` : '';
    }

    public setInteractive(enabled: boolean): void {
        if (this.cardData) {
            this.cardData.selectable = enabled;
        }
    }

    public moveTo(position: Vec3, duration: number, onComplete?: () => void): void {
        tween(this.node)
            .stop()
            .to(duration, { position })
            .call(() => {
                if (this.cardData) {
                    this.cardData.position = position.clone();
                }
                onComplete?.();
            })
            .start();
    }

    private ensureView(): void {
        if (!this.node.getComponent(UITransform)) {
            const transform = this.node.addComponent(UITransform);
            transform.setContentSize(150, 210);
        }

        if (!this.background) {
            this.background = this.node.getComponent(Graphics) || this.node.addComponent(Graphics);
        }

        if (!this.label) {
            const labelNode = new Node('Label');
            labelNode.setParent(this.node);
            labelNode.setPosition(0, 0, 0);

            const transform = labelNode.addComponent(UITransform);
            transform.setContentSize(140, 80);

            this.label = labelNode.addComponent(Label);
            this.label.fontSize = 42;
            this.label.lineHeight = 48;
            this.label.horizontalAlign = Label.HorizontalAlign.CENTER;
            this.label.verticalAlign = Label.VerticalAlign.CENTER;
        }
    }

    private onTouchEnd(event: EventTouch): void {
        event.propagationStopped = true;

        if (!this.cardData || !this.cardData.selectable || !this.cardData.faceUp) {
            return;
        }

        this.clickHandler?.(this.cardData);
    }

    private drawBackground(color: Color): void {
        if (!this.background) {
            return;
        }

        this.background.clear();
        this.background.fillColor = color;
        this.background.fillRect(-75, -105, 150, 210);
        this.background.strokeColor = new Color(26, 31, 39, 255);
        this.background.lineWidth = 4;
        this.background.rect(-75, -105, 150, 210);
        this.background.stroke();
    }
}
