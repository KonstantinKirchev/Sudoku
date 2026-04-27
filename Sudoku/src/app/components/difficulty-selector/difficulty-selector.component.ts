import { Component, inject, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Level } from "../../enums/difficulty-level.enum";
import { SudokuStore } from "../../stores/sudoku.store";

@Component({
  selector: 'app-difficulty-selector',
  imports: [FormsModule],
  templateUrl: './difficulty-selector.component.html',
  styleUrl: './difficulty-selector.component.scss'
})

export class DifficultySelectorComponent {
    public onChangeDifficulty = output<void>();
    protected readonly store = inject(SudokuStore);
    protected readonly Level = Level;
    
    onSubmit(): void {
        this.onChangeDifficulty.emit();
    }
}