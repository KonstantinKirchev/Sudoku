import { Injectable, signal, computed } from '@angular/core';
import { Board } from '../models/board.model';
import { Difficulty } from '../models/difficulty.model';
import { Status } from '../models/status.model';
import { Level } from '../enums/difficulty-level.enum';
import { GameStatus } from '../enums/game-status.enum';

@Injectable({ providedIn: 'root' })
export class SudokuStore {
  readonly board = signal<Board>([]);
  readonly initialBoard = signal<Board>([]);
  readonly status = signal<Status>(GameStatus.LOADING);
  readonly difficulty = signal<Difficulty>(Level.RANDOM);

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
}