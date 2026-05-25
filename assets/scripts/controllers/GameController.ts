import { Vec3 } from 'cc';
import { MoveCardAction } from '../actions/MoveCardAction';
import { CardArea } from '../models/CardTypes';
import type { CardData } from '../models/CardTypes';
import { GameState } from '../models/GameState';
import { CardRule } from '../rules/CardRule';
import type { CardView } from '../views/CardView';

export class GameController {
    public constructor(
        private readonly state: GameState,
        private readonly cardViews: Map<string, CardView>,
        private readonly topPosition: Vec3,
        private readonly onStateChanged: () => void,
    ) {}

    public handleCardClick(card: CardData): void {
        if (this.state.inputLocked || card.area === CardArea.Top) {
            return;
        }

        if (card.area === CardArea.Table && !CardRule.canMatch(card, this.state.getTopCard())) {
            return;
        }

        this.moveCardToTop(card);
    }

    public undo(): void {
        if (!this.state.canUndo()) {
            return;
        }

        const action = this.state.popHistory();
        if (!action) {
            return;
        }

        this.state.inputLocked = true;
        action.undo(() => {
            this.state.inputLocked = false;
            this.onStateChanged();
        });
    }

    private moveCardToTop(card: CardData): void {
        const previousTopCardId = this.state.topCardId;
        const action = new MoveCardAction(this.state, this.cardViews, {
            cardId: card.id,
            fromArea: card.area,
            toArea: CardArea.Top,
            fromPosition: card.position.clone(),
            toPosition: this.topPosition.clone(),
            previousTopCardId,
            nextTopCardId: card.id,
        });

        this.state.inputLocked = true;
        action.execute(() => {
            this.state.pushHistory(action);
            this.state.inputLocked = false;
            this.onStateChanged();
        });
    }
}
