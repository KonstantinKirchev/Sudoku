import { Component, signal, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SudokuBoardComponent } from "./components/sudoku-board/sudoku-board.component";
import { DifficultySelectorComponent } from "./components/difficulty-selector/difficulty-selector.component";
import { StatusComponent } from "./components/status/status.component";
import { SudokuStore } from './stores/sudoku.store';
import { GameStatus } from './enums/game-status.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SudokuBoardComponent, DifficultySelectorComponent, StatusComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Sudoku');
  protected readonly store = inject(SudokuStore);
  protected readonly GameStatus = GameStatus;
  protected readonly sudokuBoard = viewChild.required(SudokuBoardComponent);
}
