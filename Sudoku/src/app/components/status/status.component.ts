import { Component, inject } from "@angular/core";
import { SudokuStore } from "../../stores/sudoku.store";
import { CommonModule } from "@angular/common";
import { GameStatus } from "../../enums/game-status.enum";

@Component({
  selector: 'app-status',
  imports: [CommonModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})

export class StatusComponent {
    protected readonly store = inject(SudokuStore);
    protected readonly GameStatus = GameStatus;
}