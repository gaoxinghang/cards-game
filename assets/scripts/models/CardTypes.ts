import { Vec3 } from 'cc';

export enum Suit {
    Spade = '♠',
    Heart = '♥',
    Club = '♣',
    Diamond = '♦',
}

export enum CardArea {
    Table = 'table',
    Stock = 'stock',
    Top = 'top',
}

export interface CardData {
    id: string;
    rank: number;
    suit: Suit;
    area: CardArea;
    faceUp: boolean;
    selectable: boolean;
    position: Vec3;
    originalPosition: Vec3;
}

export function formatRank(rank: number): string {
    if (rank === 1) {
        return 'A';
    }
    if (rank === 11) {
        return 'J';
    }
    if (rank === 12) {
        return 'Q';
    }
    if (rank === 13) {
        return 'K';
    }
    return String(rank);
}
