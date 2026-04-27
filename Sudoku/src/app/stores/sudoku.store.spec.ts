import { TestBed } from '@angular/core/testing';
import { SudokuStore } from './sudoku.store';
import { Board } from '../models/board.model';
import { WinningMessage } from '../enums/winning-message.enum';

describe('SudokuStore', () => {
  let store: SudokuStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SudokuStore],
    });

    store = TestBed.inject(SudokuStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should set the board and initial board when starting a new game', () => {
    const board: Board = [
      [1, 0, 0],
      [0, 2, 0],
      [0, 0, 3],
    ];

    store.setBoard(board, true);

    expect(store.board()).toEqual(board);
    expect(store.initialBoard()).toEqual(board);
    expect(store.board()).not.toBe(board);
    expect(store.initialBoard()).not.toBe(board);
  });

  it('should set the board without changing initialBoard when not a new game', () => {
    const board: Board = [
      [1, 0, 0],
      [0, 2, 0],
      [0, 0, 3],
    ];

    store.setBoard(board, false);

    expect(store.board()).toEqual(board);
    expect(store.initialBoard()).toEqual([]);
  });

  it('should update a specific cell', () => {
    const board: Board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    store.setBoard(board, true);
    store.updateCell(1, 1, 5);

    expect(store.board()[1][1]).toBe(5);
    expect(store.board()).toEqual([
      [0, 0, 0],
      [0, 5, 0],
      [0, 0, 0],
    ]);
  });

  it('should compute completion status correctly', () => {
    const incompleteBoard: Board = [
      [1, 2, 3],
      [4, 0, 6],
      [7, 8, 9],
    ];
    const completeBoard: Board = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    store.setBoard(incompleteBoard, true);
    expect(store.isComplete()).toBeFalsy();

    store.setBoard(completeBoard, true);
    expect(store.isComplete()).toBeTruthy();
  });

  it('should return single player win text when multiplayer is false', () => {
    store.multiplayer.set(false);
    expect(store.getWinnerText()).toBe(WinningMessage.SINGLE_PLAYER_WIN);
  });

  it('should return player 1 win text when player1 has more moves', () => {
    store.multiplayer.set(true);
    store.moveCounts.set({ player1: 3, player2: 1 });

    expect(store.getWinnerText()).toBe(WinningMessage.PLAYER_1_WIN);
  });

  it('should return player 2 win text when player2 has more moves', () => {
    store.multiplayer.set(true);
    store.moveCounts.set({ player1: 1, player2: 4 });

    expect(store.getWinnerText()).toBe(WinningMessage.PLAYER_2_WIN);
  });

  it('should return tie text when move counts are equal', () => {
    store.multiplayer.set(true);
    store.moveCounts.set({ player1: 2, player2: 2 });

    expect(store.getWinnerText()).toBe(WinningMessage.TIE);
  });
});
