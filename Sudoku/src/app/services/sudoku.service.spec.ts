import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { HttpTestingController } from '@angular/common/http/testing';
import { SudokuApiService } from './sudoku.service';
import { Board } from '../models/board.model';
import { BoardResponse } from '../models/board-response.model';
import { ValidateResponse } from '../models/validate-response.model';
import { SolveResponse } from '../models/solve-response.model';
import { GameStatus } from '../enums/game-status.enum';
import { Level } from '../enums/difficulty-level.enum';

describe('SudokuApiService', () => {
  let service: SudokuApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SudokuApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SudokuApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request a board by difficulty', () => {
    const difficulty = 'easy';
    const response: BoardResponse = { board: [[0, 1, 2], [3, 4, 5], [6, 7, 8]] };

    service.getBoard(difficulty).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`https://sugoku.onrender.com/board?difficulty=${difficulty}`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('should validate a board using form-encoded data', () => {
    const board: Board = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    const response: ValidateResponse = { status: GameStatus.SOLVED };
    const expectedBody = new URLSearchParams({ board: JSON.stringify(board) }).toString();

    service.validateBoard(board).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne('https://sugoku.onrender.com/validate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(expectedBody);
    expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
    req.flush(response);
  });

  it('should solve a board using form-encoded data', () => {
    const board: Board = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    const response: SolveResponse = {
      difficulty: Level.EASY,
      solution: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      status: GameStatus.SOLVED
    };
    const expectedBody = new URLSearchParams({ board: JSON.stringify(board) }).toString();

    service.solveBoard(board).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne('https://sugoku.onrender.com/solve');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(expectedBody);
    expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
    req.flush(response);
  });
});
