import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BoardResponse } from '../models/board-response.model';
import { SolveResponse } from '../models/solve-response.model';
import { ValidateResponse } from '../models/validate-response.model';
import { Board } from '../models/board.model';

@Injectable({ providedIn: 'root' })
export class SudokuApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://sugoku.onrender.com';

  public getBoard(difficulty: string) {
    return this.http.get<BoardResponse>(`${this.API_URL}/board?difficulty=${difficulty}`);
  }

  public validateBoard(board: Board) {
    const data = new URLSearchParams({ board: JSON.stringify(board) });
    return this.http.post<ValidateResponse>(`${this.API_URL}/validate`, data.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  public solveBoard(board: Board) {
    const data = new URLSearchParams({ board: JSON.stringify(board) });
    return this.http.post<SolveResponse>(`${this.API_URL}/solve`, data.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }
}