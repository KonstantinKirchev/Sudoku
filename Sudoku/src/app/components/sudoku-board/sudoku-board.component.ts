import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuStore } from '../../stores/sudoku.store';
import { SudokuApiService } from '../../services/sudoku.service';
import { Subscription } from 'rxjs';
import { PlayerId } from '../../models/player-id.model';
import { GameStatus } from '../../enums/game-status.enum';
import { Router } from '@angular/router';

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
  private router: Router = inject(Router);

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
    this.store.updateGameStatus(GameStatus.LOADING);
    this.subscriptions.push(
      this.apiService.getBoard(this.store.difficulty()).subscribe({
        next: (res) => {
          this.store.setBoard(res.board, true);
          this.cellOwners = this.createEmptyOwnerGrid(res.board);
          this.resetTurnState();
          this.store.updateGameStatus(GameStatus.PLAYING);
          this.router.navigate(['/']);
        },
        error: () => this.store.updateGameStatus(GameStatus.BROKEN)
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
        this.store.switchActivePlayer();
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
        this.store.updateGameStatus(res.status);
        if (res.status === GameStatus.SOLVED) {
          this.router.navigate(['/winner']);
        } else {
          this.router.navigate(['/']);
        }
      })
    );
  }

  public solve(): void {
    this.subscriptions.push(
      this.apiService.solveBoard(this.store.board()).subscribe((res) => {
        this.store.updateGameStatus(res.status);
        if (res.status === GameStatus.SOLVED) {
          this.store.setBoard(res.solution);
          this.router.navigate(['/winner']);
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
    this.store.updateActivePlayer(1);
    this.store.resetMoveCounts();
  }

  private updateOwner(row: number, col: number, player: PlayerId): void {
    const previousOwner = this.cellOwners[row]?.[col] ?? 0;
    if (previousOwner === player) {
      return;
    }
    if (previousOwner === 1) {
      this.store.updateMoveCounts('player1', 'decrease');
    }
    if (previousOwner === 2) {
      this.store.updateMoveCounts('player2', 'decrease');
    }
    if (player === 1) {
      this.store.updateMoveCounts('player1', 'increase');
    }
    if (player === 2) {
      this.store.updateMoveCounts('player2', 'increase');
    }
    this.cellOwners[row][col] = player;
  }
}