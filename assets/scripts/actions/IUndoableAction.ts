export interface IUndoableAction {
    execute(onComplete?: () => void): void;
    undo(onComplete?: () => void): void;
}
