import type { CardData } from './CardTypes';
import type { IUndoableAction } from '../actions/IUndoableAction';

export class GameState {
    public readonly cards = new Map<string, CardData>();
    public readonly history: IUndoableAction[] = [];
    public topCardId = '';
    public inputLocked = false;

    public addCard(card: CardData): void {
        this.cards.set(card.id, card);
    }

    public getCard(cardId: string): CardData | undefined {
        return this.cards.get(cardId);
    }

    public getTopCard(): CardData | undefined {
        return this.getCard(this.topCardId);
    }

    public pushHistory(action: IUndoableAction): void {
        this.history.push(action);
    }

    public popHistory(): IUndoableAction | undefined {
        return this.history.pop();
    }

    public canUndo(): boolean {
        return this.history.length > 0 && !this.inputLocked;
    }
}
