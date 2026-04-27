import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuStore } from '../../stores/sudoku.store';
import { SudokuApiService } from '../../services/sudoku.service';
import { Subscription } from 'rxjs';
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
  private subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.loadNewGame();
  }

  async loadNewGame(): Promise<void> {
    this.store.status.set(GameStatus.LOADING);
    this.subscriptions.push(
      this.apiService.getBoard(this.store.difficulty()).subscribe({
        next: (res) => {
          this.store.setBoard(res.board, true);
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
    } else {
      input.value = '';
      this.store.updateCell(row, col, 0);
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
}