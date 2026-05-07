import { Injectable, signal, computed } from '@angular/core';
import { Board } from '../models/board.model';
import { ActivePlayer } from '../models/active-player.model';
import { Level } from '../enums/difficulty-level.enum';
import { GameStatus } from '../enums/game-status.enum';
import { WinningMessage } from '../enums/winning-message.enum';
import { SudokuState } from '../models/sudoku-state.model';

@Injectable({ providedIn: 'root' })
export class SudokuStore {
  private state = signal<SudokuState>({
    board: [],
    initialBoard: [],
    status: GameStatus.LOADING,
    difficulty: Level.RANDOM,
    multiplayer: false,
    activePlayer: 1,
    moveCounts: { player1: 0, player2: 0 }
  });

  readonly board = computed(() => this.state().board);
  readonly initialBoard = computed(() => this.state().initialBoard);
  readonly status = computed(() => this.state().status);
  readonly difficulty = computed(() => this.state().difficulty);
  readonly multiplayer = computed(() => this.state().multiplayer);
  readonly activePlayer = computed(() => this.state().activePlayer);
  readonly moveCounts = computed(() => this.state().moveCounts);

  readonly isComplete = computed(() => 
    this.board().every(row => row.every(cell => cell !== 0))
  );

  public setBoard(newBoard: Board, isNewGame = false) {
    this.state.update(state => ({ ...state, board: JSON.parse(JSON.stringify(newBoard)) }));
    if (isNewGame) {
      this.state.update(state => ({ ...state, initialBoard: JSON.parse(JSON.stringify(newBoard)) }));
    }
  }

  public updateCell(row: number, col: number, value: number) {
    this.state.update(state => {
      const newBoard = [...state.board];
      newBoard[row][col] = value;
      return { ...state, board: newBoard };
    });
  }

  public updateMultiplayer(isMultiplayer: boolean) {
    this.state.update(state => ({ ...state, multiplayer: isMultiplayer }));
  }

  public updateDifficulty(difficulty: Level) {
    this.state.update(state => ({ ...state, difficulty: difficulty }));
  }

  public updateGameStatus(gameStatus: GameStatus) {
    this.state.update(state => ({ ...state, status: gameStatus }));
  }

  public switchActivePlayer() {
    this.state.update(state => ({ ...state, activePlayer: state.activePlayer === 1 ? 2 : 1 }));
  }

  public updateActivePlayer(player: ActivePlayer) {
    this.state.update(state => ({ ...state, activePlayer: player }));
  }

  public resetMoveCounts() {
    this.state.update(state => ({ ...state, moveCounts: { player1: 0, player2: 0 } }));
  }

  public updateMoveCounts(player: 'player1' | 'player2', action: 'increase' | 'decrease') {
    this.state.update(state => {
      const newMoveCounts = { ...state.moveCounts };
      if (action === 'increase') {
        newMoveCounts[player] += 1;
      } else {
        newMoveCounts[player] -= 1;
      }
      return { ...state, moveCounts: newMoveCounts };
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