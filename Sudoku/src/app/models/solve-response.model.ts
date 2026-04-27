import { Board } from "./board.model";
import { Difficulty } from "./difficulty.model";
import { Status } from "./status.model";

export type SolveResponse = {
    difficulty: Difficulty;
    solution: Board;
    status: Status;
};