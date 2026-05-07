import { Component, inject, OnInit, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Level } from "../../enums/difficulty-level.enum";
import { SudokuStore } from "../../stores/sudoku.store";

@Component({
  selector: 'app-difficulty-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './difficulty-selector.component.html',
  styleUrl: './difficulty-selector.component.scss'
})

export class DifficultySelectorComponent implements OnInit {
    public onChangeDifficulty = output<void>();
    protected readonly store = inject(SudokuStore);
    protected readonly Level = Level;
    public form!: FormGroup;
    
    ngOnInit(): void {
        this.form = new FormGroup({
            difficulty: new FormControl(this.store.difficulty())
        });
    }

    onSubmit(): void {
        this.store.updateDifficulty(this.form.value.difficulty);
        this.onChangeDifficulty.emit();
    }
}