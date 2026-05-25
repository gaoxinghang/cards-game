import { _decorator, Color, Component, EventTouch, Graphics, Label, Node, resources, Sprite, SpriteFrame, tween, UITransform, Vec3 } from 'cc';
import { formatRank, Suit } from '../models/CardTypes';
import type { CardData } from '../models/CardTypes';

const { ccclass } = _decorator;
const CARD_WIDTH = 150;
const CARD_HEIGHT = 210;
const ASSET_ROOT = 'cards';

const spriteCache = new Map<string, SpriteFrame>();

@ccclass('CardView')
export class CardView extends Component {
    private cardData: CardData | null = null;
    private clickHandler: ((card: CardData) => void) | null = null;
    private background: Graphics | null = null;
    private label: Label | null = null;
    private cardSprite: Sprite | null = null;
    private smallRankSprite: Sprite | null = null;
    private bigRankSprite: Sprite | null = null;
    private smallSuitSprite: Sprite | null = null;
    private bigSuitSprite: Sprite | null = null;

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

        if (this.cardData.faceUp) {
            this.setCardArtVisible(true);
            this.setRankArtVisible(true);
            this.drawBackground(new Color(0, 0, 0, 0), false);
            this.label.string = '';
            this.applyCardSprites();
            return;
        }

        this.setCardArtVisible(true);
        this.setRankArtVisible(false);
        this.drawBackground(new Color(0, 0, 0, 0), false);
        this.label.string = '';
        this.applyBackSprites();
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
            transform.setContentSize(CARD_WIDTH, CARD_HEIGHT);
        }

        if (!this.background) {
            this.background = this.node.getComponent(Graphics) || this.node.addComponent(Graphics);
        }

        if (!this.cardSprite) {
            this.cardSprite = this.createSpriteNode('CardFace', Vec3.ZERO, CARD_WIDTH, CARD_HEIGHT, this.node);
            this.smallRankSprite = this.createSpriteNode('SmallRank', new Vec3(-49, 72, 0), 28, 24, this.node);
            this.smallSuitSprite = this.createSpriteNode('SmallSuit', new Vec3(-49, 48, 0), 24, 24, this.node);
            this.bigRankSprite = this.createSpriteNode('BigRank', new Vec3(0, 28, 0), 58, 50, this.node);
            this.bigSuitSprite = this.createSpriteNode('BigSuit', new Vec3(0, -34, 0), 56, 56, this.node);
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

    private applyCardSprites(): void {
        if (!this.cardData) {
            return;
        }

        const rank = formatRank(this.cardData.rank);
        const color = this.isRedSuit(this.cardData.suit) ? 'red' : 'black';
        const suit = this.getSuitAssetName(this.cardData.suit);

        this.setSpriteFrame(this.cardSprite, `${ASSET_ROOT}/card_general/spriteFrame`);
        this.setSpriteFrame(this.smallRankSprite, `${ASSET_ROOT}/number/small_${color}_${rank}/spriteFrame`);
        this.setSpriteFrame(this.bigRankSprite, `${ASSET_ROOT}/number/big_${color}_${rank}/spriteFrame`);
        this.setSpriteFrame(this.smallSuitSprite, `${ASSET_ROOT}/suits/${suit}/spriteFrame`);
        this.setSpriteFrame(this.bigSuitSprite, `${ASSET_ROOT}/suits/${suit}/spriteFrame`);
    }

    private applyBackSprites(): void {
        this.setSpriteFrame(this.cardSprite, `${ASSET_ROOT}/card_general/spriteFrame`);
    }

    private createSpriteNode(name: string, position: Vec3, width: number, height: number, parent: Node): Sprite {
        const node = new Node(name);
        node.setParent(parent);
        node.setPosition(position);

        const transform = node.addComponent(UITransform);
        transform.setContentSize(width, height);

        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        return sprite;
    }

    private setCardArtVisible(visible: boolean): void {
        if (this.cardSprite) {
            this.cardSprite.node.active = visible;
        }
        if (this.bigSuitSprite) {
            this.bigSuitSprite.node.active = visible && this.cardData?.faceUp === true;
        }
    }

    private setRankArtVisible(visible: boolean): void {
        if (this.smallRankSprite) {
            this.smallRankSprite.node.active = visible;
        }
        if (this.smallSuitSprite) {
            this.smallSuitSprite.node.active = visible;
        }
        if (this.bigRankSprite) {
            this.bigRankSprite.node.active = visible;
        }
    }

    private setSpriteFrame(sprite: Sprite | null, path: string): void {
        if (!sprite) {
            return;
        }

        const cachedSpriteFrame = spriteCache.get(path);
        if (cachedSpriteFrame) {
            sprite.spriteFrame = cachedSpriteFrame;
            return;
        }

        resources.load(path, SpriteFrame, (error, spriteFrame) => {
            if (error || !spriteFrame) {
                return;
            }

            spriteCache.set(path, spriteFrame);
            sprite.spriteFrame = spriteFrame;
        });
    }

    private isRedSuit(suit: Suit): boolean {
        return suit === Suit.Heart || suit === Suit.Diamond;
    }

    private getSuitAssetName(suit: Suit): string {
        switch (suit) {
            case Suit.Heart:
                return 'heart';
            case Suit.Diamond:
                return 'diamond';
            case Suit.Club:
                return 'club';
            case Suit.Spade:
            default:
                return 'spade';
        }
    }

    private onTouchEnd(event: EventTouch): void {
        event.propagationStopped = true;

        if (!this.cardData || !this.cardData.selectable || !this.cardData.faceUp) {
            return;
        }

        this.clickHandler?.(this.cardData);
    }

    private drawBackground(color: Color, drawBorder: boolean): void {
        if (!this.background) {
            return;
        }

        this.background.clear();
        this.background.fillColor = color;
        this.background.fillRect(-CARD_WIDTH / 2, -CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT);
        if (!drawBorder) {
            return;
        }

        this.background.strokeColor = new Color(26, 31, 39, 255);
        this.background.lineWidth = 4;
        this.background.rect(-CARD_WIDTH / 2, -CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT);
        this.background.stroke();
    }
}
