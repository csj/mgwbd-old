export interface PropheciesSettings {
    numRows: number
    numCols: number
    xProphecies: boolean
    "players:playerCount": number
    players: any[]
}

export class Game {
    gameState: any = null
    gamePhase: number = 0
    gameSettings: any = null

    defaultPlayerConfig() {
        return [
            {'playerType': 'human', 'owner': null, 'name': 'Player 1', 'style': 'A'},
            {'playerType': 'human', 'owner': null, 'name': 'Player 2', 'style': 'B'},
        ]
    }

    action(action: any) { }

    checkGameEndCondition() {
        this.gameState.gameEnd = this.gameEndCondition()
        if (!!this.gameState.gameEnd) {
            this.gamePhase = 3 // GAME-OVER
        }
    }

    gameEndCondition(): any {
        return null
    }
}

interface PropheciesCell {
    owner: number | null
    value: number
}

export class Prophecies extends Game {
    getSettingsConfig() {
        return [
            {
                'canonicalName': 'numRows',
                'displayName': 'Number of rows',
                'description': '',
                'values': [3, 4, 5, 6],
                'defaultValue': 4,
            },
            {
                'canonicalName': 'numCols',
                'displayName': 'Number of columns',
                'description': '',
                'values': [3, 4, 5, 6],
                'defaultValue': 5,
            },
            {
                'canonicalName': 'xProphecies',
                'displayName': 'X-Prophecies',
                'description': 'Treat each number as a prediction of the number of Xs, rather than the number of numbers.',
                'values': [true, false],
                'defaultValue': false,
            },
            {
                'canonicalName': 'players:playerCount',
                'displayName': 'Player count',
                'values': [2, 3, 4],
                'defaultValue': 2,
            },
        ]
    }

    initialGameState(settings: PropheciesSettings) {
        const numRows = settings.numRows
        const numCols = settings.numCols
        const grid = Array(numRows).fill(null).map(() => Array(numCols).fill(null))
        return {
            grid,
            activePlayerIndex: null,
        }
    }

    start() {
        this.gamePhase = 2 // IN-PROGRESS
        this.nextPlayerTurn()
    }

    nextPlayerTurn() {
        // By default, assumes two players alternating
        if (this.gameState.gameEnd) {
            this.gameState.activePlayerIndex = null
        } else if (this.gameState.activePlayerIndex === null) {
            this.gameState.activePlayerIndex = 0
        } else {
            const numPlayers = this.gameSettings.players.length
            this.gameState.activePlayerIndex = (this.gameState.activePlayerIndex + 1) % numPlayers
        }
    }

    override action(action: any) {
        const grid = this.gameState.grid
        const playerIndex = action.owner
        const row = action.row as number
        const col = action.col as number
        const value = action.value

        console.log('Playing action: ', action)
        console.log('Current game state: ', this.gameState)

        if (this.gameState.activePlayerIndex === null) return false
        console.log(2)
        if (playerIndex !== this.gameState.activePlayerIndex) return false
        console.log(3)
        if (grid[row][col] !== null) return false
        console.log(4)
        if (!this.isValidValue(grid, row, col, value)) return false
        console.log(5)

        const newGameState = JSON.parse(JSON.stringify(this.gameState))
        newGameState.grid[row][col] = { owner: playerIndex, value }
        const autoXs = this.fillAutoXs(newGameState.grid)
        newGameState.lastMove = [{ row, col }, ...autoXs]
        this.gameState = newGameState
        console.log(this.gameState)
        this.checkGameEndCondition()
        this.nextPlayerTurn()
        return true
    }

    private fillAutoXs(grid: (PropheciesCell | null)[][]) {
        let maxValue = Math.max(grid.length, grid[0].length)
        if (this.gameSettings.xProphecies) maxValue -= 1

        const autoXs = []
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
                if (grid[row][col] !== null) continue
                let validMove = false
                for (let value = 1; value <= maxValue; value++) {
                    if (this.isValidValue(grid, row, col, value)) {
                        validMove = true
                    }
                }
                if (!validMove) {
                    grid[row][col] = { owner: null, value: 0 }
                    autoXs.push({ row, col })
                }
            }
        }
        return autoXs
    }

    private isValidValue(grid: (PropheciesCell | null)[][], row: number, col: number, value: number) {
        if (value === 0) return true
        if (value > grid.length && value > grid[0].length) return false
        if (this.gameSettings.xProphecies && value >= grid.length && value >= grid[0].length) return false
        for (let i = 0; i < grid.length; i++) {
            if (grid[i][col] !== null && grid[i][col]?.value === value) return false
        }
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[row][j] !== null && grid[row][j]?.value === value) return false
        }
        return true
    }

    calculateScores(grid: (PropheciesCell | null)[][], matchCondition: (v: number) => boolean = (v) => v > 0) {
        const rowWinners = Array(grid.length).fill(0)
        const colWinners = Array(grid[0].length).fill(0)
        const playerScores = Array(this.gameSettings.players.length).fill(0)
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                const square = grid[i][j]
                if (!square) continue
                if (!matchCondition(square.value)) continue
                rowWinners[i] += 1
                colWinners[j] += 1
            }
        }
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                const square = grid[i][j]
                if (!square) continue
                const value = square.value
                if (value === 0) continue

                if (rowWinners[i] === value) {
                    playerScores[square.owner!] += value
                }
                if (colWinners[j] === value) {
                    playerScores[square.owner!] += value
                }
            }
        }
        return playerScores
    }

    calculateWinner(scores: number[]) {
        const winners = []
        let maxScore = 0
        for (let i = 0; i < scores.length; i++) {
            const score = scores[i]
            if (score > maxScore) {
                maxScore = score
                winners.length = 0
            }
            if (score === maxScore) {
                winners.push(i)
            }
        }
        if (winners.length === 1) {
            return { win: winners[0], scores }
        } else {
            return { draw: true, scores }
        }
    }

    /*
  def gameEndCondition(self):
    grid = self.gameState['grid']
    for row in range(len(grid)):
      for col in range(len(grid[0])):
        if not grid[row][col]:
          return None
    if self.gameSettings and self.gameSettings['xProphecies']:
      scores = self.calculateScores(grid, matchCondition=(lambda v: not v))
    else:
      scores = self.calculateScores(grid)
    return self.calculateWinner(scores)
     */
    override gameEndCondition() {
        const grid = this.gameState.grid
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
                if (!grid[row][col]) {
                    return null
                }
            }
        }
        const scores = this.calculateScores(grid)
        return this.calculateWinner(scores)
    }
}


