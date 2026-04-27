import { GameStatus } from "../enums/game-status.enum";

export type Status = GameStatus.LOADING | 
                    GameStatus.PLAYING | 
                    GameStatus.SOLVED | 
                    GameStatus.BROKEN | 
                    GameStatus.UNSOLVED | 
                    GameStatus.UNSOLVABLE;