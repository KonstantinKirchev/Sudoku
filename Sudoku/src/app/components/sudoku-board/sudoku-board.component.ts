import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuStore } from '../../stores/sudoku.store';
import { SudokuApiService } from '../../services/sudoku.service';
import { Subscription } from 'rxjs';
import { PlayerId } from '../../models/player-id.model';
import { GameStatus } from '../../enums/game-status.enum';

@Component({
  selector: 'app-sudoku-board',
  imports: [CommonModule],
  templateUrl: './sudoku-board.component.html',
  styleUrl: './sudoku-board.component.scss'
})
export class SudokuBoardComponent implements OnInit, OnDestroy {
  protected readonly GameStatus = GameStatus;
  protected readonly store = inject(SudokuStore);
  private readonly apiService = inject(SudokuApiService);
  public cellOwners: PlayerId[][] = [];
  private subscriptions: Subscription[] = [];
  private previousMultiplayerState?: boolean;

  constructor() {
    effect(() => {
      const nextState = this.store.multiplayer();
      if (this.previousMultiplayerState === undefined) {
        this.previousMultiplayerState = nextState;
        return;
      }

      if (nextState !== this.previousMultiplayerState) {
        this.previousMultiplayerState = nextState;
        this.loadNewGame();
      }
    });
  }

  public ngOnInit(): void {
    this.loadNewGame();
  }

  async loadNewGame(): Promise<void> {
    this.store.status.set(GameStatus.LOADING);
    this.subscriptions.push(
      this.apiService.getBoard(this.store.difficulty()).subscribe({
        next: (res) => {
          this.store.setBoard(res.board, true);
          this.cellOwners = this.createEmptyOwnerGrid(res.board);
          this.resetTurnState();
          this.store.status.set(GameStatus.PLAYING);
        },
        error: () => this.store.status.set(GameStatus.BROKEN)
      })
    );
  }

  public onInputChange(row: number, col: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    if (value >= 1 && value <= 9) {
      this.store.updateCell(row, col, value);
      this.updateOwner(row, col, this.store.multiplayer() ? this.store.activePlayer() : 0);
      if (this.store.multiplayer()) {
        this.store.activePlayer.set(this.store.activePlayer() === 1 ? 2 : 1);
      }
    } else {
      input.value = '';
      this.store.updateCell(row, col, 0);
      this.updateOwner(row, col, 0);
    }
  }

  public validate(): void {
    this.subscriptions.push(
      this.apiService.validateBoard(this.store.board()).subscribe((res) => {
        this.store.status.set(res.status);
      })
    );
  }

  public solve(): void {
    this.subscriptions.push(
      this.apiService.solveBoard(this.store.board()).subscribe((res) => {
        this.store.status.set(res.status);
        if (res.status === GameStatus.SOLVED) {
          this.store.setBoard(res.solution);
          this.store.status.set(res.status);
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private createEmptyOwnerGrid(board: number[][]): PlayerId[][] {
    return board.map(row => row.map(() => 0));
  }

  private resetTurnState(): void {
    this.store.activePlayer.set(1);
    this.store.moveCounts.set({ player1: 0, player2: 0 });
  }

  private updateOwner(row: number, col: number, player: PlayerId): void {
    const previousOwner = this.cellOwners[row]?.[col] ?? 0;
    if (previousOwner === player) {
      return;
    }

    if (previousOwner === 1) {
      this.store.moveCounts.update(counts => ({ ...counts, player1: counts.player1 - 1 }));
    }
    if (previousOwner === 2) {
      this.store.moveCounts.update(counts => ({ ...counts, player2: counts.player2 - 1 }));
    }

    if (player === 1) {
      this.store.moveCounts.update(counts => ({ ...counts, player1: counts.player1 + 1 }));
    }
    if (player === 2) {
      this.store.moveCounts.update(counts => ({ ...counts, player2: counts.player2 + 1 }));
    }

    this.cellOwners[row][col] = player;
  }
}