import type { CardData } from '../models/CardTypes';

export class CardRule {
    public static canMatch(card: CardData, topCard: CardData | undefined): boolean {
        if (!topCard || !card.faceUp || !card.selectable) {
            return false;
        }

        return Math.abs(card.rank - topCard.rank) === 1;
    }
}
