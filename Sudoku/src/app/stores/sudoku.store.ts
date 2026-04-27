import { Injectable, signal, computed } from '@angular/core';
import { Board } from '../models/board.model';
import { Difficulty } from '../models/difficulty.model';
import { Status } from '../models/status.model';
import { MoveCounts } from '../models/move-counts.model';
import { ActivePlayer } from '../models/active-player.model';
import { Level } from '../enums/difficulty-level.enum';
import { GameStatus } from '../enums/game-status.enum';
import { WinningMessage } from '../enums/winning-message.enum';

@Injectable({ providedIn: 'root' })
export class SudokuStore {
  readonly board = signal<Board>([]);
  readonly initialBoard = signal<Board>([]);
  readonly status = signal<Status>(GameStatus.LOADING);
  readonly difficulty = signal<Difficulty>(Level.RANDOM);
  readonly multiplayer = signal<boolean>(false);
  readonly activePlayer = signal<ActivePlayer>(1);
  readonly moveCounts = signal<MoveCounts>({ player1: 0, player2: 0 });

  readonly isComplete = computed(() => 
    this.board().every(row => row.every(cell => cell !== 0))
  );

  public setBoard(newBoard: Board, isNewGame = false) {
    this.board.set(JSON.parse(JSON.stringify(newBoard)));
    if (isNewGame) {
      this.initialBoard.set(JSON.parse(JSON.stringify(newBoard)));
    }
  }

  public updateCell(row: number, col: number, value: number) {
    this.board.update(current => {
      const newBoard = [...current];
      newBoard[row][col] = value;
      return newBoard;
    });
  }

  public getWinnerText(): string {
    if (!this.multiplayer()) {
      return WinningMessage.SINGLE_PLAYER_WIN;
    }

    if (this.moveCounts().player1 > this.moveCounts().player2) {
      return WinningMessage.PLAYER_1_WIN;
    }

    if (this.moveCounts().player2 > this.moveCounts().player1) {
      return WinningMessage.PLAYER_2_WIN;
    }

    return WinningMessage.TIE;
  }
}