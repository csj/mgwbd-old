import {Game} from '../stuff/Game'
import {SettingsConfig} from '../stuff/SettingsConfig'

enum Dir {
  N, NE, E, SE, S, SW, W, NW
}


/*
Example Square:
{
  playerIndex: 0, // or 1, 2, 3
  value: 1, // 2, 3, 4, ...
  from: 'SW', // N, NE, E, SE, S, SW, W, NW, None
}
 */


interface SequenciumSquare {
  playerIndex: number
  value: number
  from: Dir | null
}

/*
  Example game state:
  {
    grid: [
      [Square, None, None, None, None, None],
      [None, Square, None, None, None, None],
      [None, None, Square, None, None, None],
      [None, None, None, Square, None, None],
      [None, None, None, None, Square, None],
      [None, None, None, None, None, Square],
    ],
    turnSequence: [],  # keeps track of playerIndex for each turn
    lastMove: {
      row: rowId,
      col: colId,
    },
    gameEnd: None,  # {win: 1}, {win: 2}, {draw: True}
  }
*/

interface SequenciumGameState {
  grid: (SequenciumSquare | null)[][]
  turnSequence: number[]
  lastMove: { row: number, col: number } | null
  gameEnd: { win: number } | { draw: true } | null
  activePlayerIndex: number | null
}

/*
Example action:
{
  playerIndex: 0,
  rowFrom: 1,
  colFrom: 1,
  rowTo: 2,
  colTo: 2,
 */

interface SequenciumAction {
  playerIndex: number
  rowFrom: number
  colFrom: number
  rowTo: number
  colTo: number
}

interface SequenciumSettings {
  gridSize: number
  doubleMoves: boolean
  "players:playerCount": number
  players: any[]
}

export class Sequencium extends Game<SequenciumGameState, SequenciumAction, SequenciumSettings> {
  canonicalName = "sequencium"

  // Ooh, look at us. We get to index arrays using negative numbers. We're so cool.
  directionHelper = [
    [Dir.NW, Dir.N, Dir.NE],
    [Dir.W, null, Dir.E],
    [Dir.SW, Dir.S, Dir.SE],
  ]

  private getDirection(rowFrom: number, colFrom: number, rowTo: number, colTo: number): Dir | null {
    return this.directionHelper[rowFrom - rowTo + 1][colFrom - colTo + 1]
  }

  action(action: SequenciumAction): boolean {
    const {playerIndex, rowFrom, colFrom, rowTo, colTo} = action
    const grid = this.gameState.grid
    if (this.gameState.activePlayerIndex === null ||
      playerIndex !== this.gameState.activePlayerIndex ||
      rowFrom - rowTo < -1 || rowFrom - rowTo > 1 ||
      colFrom - colTo < -1 || colFrom - colTo > 1 ||
      grid[rowFrom][colFrom] === null ||
      grid[rowFrom][colFrom]!.playerIndex !== playerIndex ||
      grid[rowTo][colTo] !== null) {
      return false
    }
    const direction = this.getDirection(rowFrom, colFrom, rowTo, colTo)
    const value = grid[rowFrom][colFrom]!.value + 1
    const newGameState = JSON.parse(JSON.stringify(this.gameState))
    newGameState.grid[rowTo][colTo] = {playerIndex, value, from: direction}
    newGameState.lastMove = {row: rowTo, col: colTo}
    newGameState.turnSequence.push(playerIndex)
    this.gameState = newGameState
    this.checkGameEndCondition()
    this.nextPlayerTurn()
    return true
  }

  override nextPlayerTurn(): void {
    const playerIndex = this.gameState.activePlayerIndex
    const numPlayers = this.gameSettings.players.length
    const grid = this.gameState.grid
    const turnSequence = this.gameState.turnSequence

    if (playerIndex === null) {
      super.nextPlayerTurn()
      return
    }
    if (turnSequence.length <= 1) {
      super.nextPlayerTurn()
      return
    }

    let isGridFull = true
    for (let row of grid) {
      for (let cell of row) {
        if (!cell) {
          isGridFull = false
        }
      }
    }
    if (isGridFull) return

    if (!(this.gameSettings.doubleMoves && new Set(turnSequence.slice(-2)).size > 1)) {
      super.nextPlayerTurn()
    }

    while (!this.playerHasAvailableMove()) {
      super.nextPlayerTurn()
    }
  }

  gameEndCondition(): any {
    const grid = this.gameState.grid
    const scores = this.gameSettings.players.map(() => 0)
    for (let row of grid) {
      for (let cell of row) {
        if (!cell) {
          return null
        }
        scores[cell.playerIndex] = Math.max(scores[cell.playerIndex], cell.value)
      }
    }
    const result: any = {scores}
    const winners = scores
      .map((score, i) => [i, score])
      .filter(([i, score]) => score === Math.max(...scores))

    if (winners.length > 1)
      result.draw = true
    else
      result.win = winners[0][0]

    return result
  }

  private playerHasAvailableMove(): boolean {
    const playerIndex = this.gameState.activePlayerIndex
    const grid = this.gameState.grid
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c]) continue
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (r + dr < 0 || r + dr >= grid.length || c + dc < 0 || c + dc >= grid[0].length) continue
            if (grid[r + dr][c + dc]?.playerIndex === playerIndex) return true
          }
        }
      }
    }
    return false
  }

  initialGameState(settings: SequenciumSettings): SequenciumGameState {
    return {
      grid: this.makeGrid(settings.gridSize, settings.players.length),
      turnSequence: [],
      lastMove: {row: -1, col: -1},
      gameEnd: null,
      activePlayerIndex: null,
    }
  }

  private makeGrid(gridSize: number, playerCount: number): (SequenciumSquare | null)[][] {
    let grid: (SequenciumSquare | null)[][] = []
    for (let i = 0; i < gridSize; i++) {
      grid.push([])
      for (let j = 0; j < gridSize; j++) {
        grid[i].push(null)
      }
    }
    let playerCorners: Dir[] = []
    if (playerCount === 2) {
      playerCorners = [Dir.NW, Dir.SE]
    } else if (playerCount === 4) {
      playerCorners = [Dir.NW, Dir.NE, Dir.SE, Dir.SW]
    }
    for (let i = 0; i < playerCorners.length; i++) {
      let row = playerCorners[i] === Dir.NW || playerCorners[i] === Dir.NE ? 0 : gridSize - 1
      let col = playerCorners[i] === Dir.NW || playerCorners[i] === Dir.SW ? 0 : gridSize - 1
      for (let val = 1; val <= Math.floor(gridSize / 2); val++) {
        grid[row][col] = this.sq(i, val, val > 1 ? playerCorners[i] : null)
        row += playerCorners[i] === Dir.NW || playerCorners[i] === Dir.NE ? 1 : -1
        col += playerCorners[i] === Dir.NW || playerCorners[i] === Dir.SW ? 1 : -1
      }
    }
    return grid
  }

  private sq(playerIndex: number, value: number, direction: Dir | null): SequenciumSquare {
    return {playerIndex, value, from: direction}
  }

  override settingsConfig(): SettingsConfig[] {
    return [
      {
        'canonicalName': 'doubleMoves',
        'displayName': 'Players move twice',
        'description': 'Starting with the second player’s first turn, each player moves twice per turn.',
        'values': [true, false],
        'defaultValue': false,
      },
      {
        'canonicalName': 'gridSize',
        'displayName': 'Grid size',
        'values': [6, 8, 10],
        'defaultValue': 6,
      },
      {
        'canonicalName': 'players:playerCount',
        'displayName': 'Player count',
        'values': [2, 4],
        'defaultValue': 2,
      }
    ]
  }
}

