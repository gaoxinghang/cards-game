import { Vec3 } from 'cc';
import { CardArea } from '../models/CardTypes';
import { GameState } from '../models/GameState';
import type { CardView } from '../views/CardView';
import type { IUndoableAction } from './IUndoableAction';

export interface MoveCardActionOptions {
    cardId: string;
    fromArea: CardArea;
    toArea: CardArea;
    fromPosition: Vec3;
    toPosition: Vec3;
    previousTopCardId: string;
    nextTopCardId: string;
}

export class MoveCardAction implements IUndoableAction {
    public constructor(
        private readonly state: GameState,
        private readonly cardViews: Map<string, CardView>,
        private readonly options: MoveCardActionOptions,
        private readonly duration = 0.22,
    ) {}

    public execute(onComplete?: () => void): void {
        const card = this.state.getCard(this.options.cardId);
        const cardView = this.cardViews.get(this.options.cardId);
        const previousTopView = this.cardViews.get(this.options.previousTopCardId);

        if (!card || !cardView) {
            onComplete?.();
            return;
        }

        previousTopView?.node.setSiblingIndex(Math.max(0, previousTopView.node.getSiblingIndex()));
        cardView.node.setSiblingIndex(999);
        card.area = this.options.toArea;
        card.selectable = false;
        this.state.topCardId = this.options.nextTopCardId;

        cardView.moveTo(this.options.toPosition, this.duration, () => {
            cardView.refresh();
            onComplete?.();
        });
    }

    public undo(onComplete?: () => void): void {
        const card = this.state.getCard(this.options.cardId);
        const cardView = this.cardViews.get(this.options.cardId);

        if (!card || !cardView) {
            onComplete?.();
            return;
        }

        cardView.node.setSiblingIndex(999);
        card.area = this.options.fromArea;
        card.selectable = true;
        this.state.topCardId = this.options.previousTopCardId;

        cardView.moveTo(this.options.fromPosition, this.duration, () => {
            cardView.refresh();
            const topView = this.cardViews.get(this.options.previousTopCardId);
            topView?.node.setSiblingIndex(998);
            onComplete?.();
        });
    }
}
