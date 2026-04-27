import { Component, inject } from "@angular/core";
import { SudokuStore } from "../../stores/sudoku.store";

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrl: './winner.component.scss'
})

export class WinnerComponent {
    protected readonly store = inject(SudokuStore);
}