import { ActivePlayer } from "./active-player.model";
import { Board } from "./board.model";
import { Difficulty } from "./difficulty.model";
import { MoveCounts } from "./move-counts.model";
import { Status } from "./status.model";

export interface SudokuState {
    board: Board;
    initialBoard: Board;
    status: Status;
    difficulty: Difficulty;
    multiplayer: boolean;
    activePlayer: ActivePlayer;
    moveCounts: MoveCounts;
}