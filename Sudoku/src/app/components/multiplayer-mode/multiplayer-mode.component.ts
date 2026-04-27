import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SudokuStore } from "../../stores/sudoku.store";

@Component({
    selector: 'app-multiplayer',
    imports: [FormsModule],
    templateUrl: './multiplayer-mode.component.html',
    styleUrl: './multiplayer-mode.component.scss'
})

export class MultiPlayerComponent {
    protected readonly store = inject(SudokuStore);
}