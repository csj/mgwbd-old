import {Body, Controller, Post, Route} from 'tsoa'
import {gameRegistry} from './stuff/GameRegistry'
import {UnknownGame} from './stuff/Game'

interface GameBlob {
  gameKey: string
  gameType: string
  gameSettingsConfig: any
  gameSettings: any
  gamePhase: number
  gameState: any
}

let currentGames: {[key: string]: UnknownGame} = {}
const _GAME_KEY_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const _GAME_KEY_LEN = 8

function generateGameKey(): string {
  return Array(_GAME_KEY_LEN)
    .fill(0)
    .map(() => _GAME_KEY_CHARS[Math.floor(Math.random() * _GAME_KEY_CHARS.length)])
    .join('')
}

function toBlob(game: UnknownGame): GameBlob {
  return {
    gameType: game.canonicalName,
    gameSettingsConfig: game.settingsConfig(),
    gameSettings: game.gameSettings,
    gamePhase: game.gamePhase,
    gameState: game.gameState,
    gameKey: ''
  }
}

@Route('gameplay')
export class GameController extends Controller {
  @Post('new')
  public async newGame(
    @Body() requestBody: { gameType: string, hostDomain: string }
  ): Promise<GameBlob> {
    const {gameType} = requestBody
    if (!gameRegistry[gameType]) {
      throw new Error(`Game type ${gameType} not found`)
    }

    // @ts-ignore: we are actually instantiating concrete classes
    const game = new gameRegistry[requestBody.gameType]()

    const gameKey = generateGameKey()
    currentGames[gameKey] = game

    return {
      ...toBlob(game),
      gameKey,
    }
  }

  private findGame(gameKey: string): UnknownGame {
    const currentGame = currentGames[gameKey]
    if (!currentGame) {
      throw new Error(`Game with key ${gameKey} not found`)
    }
    return currentGame
  }

  @Post('setsettings')
  public async setSettings(
    @Body() requestBody: { gameKey: string, gameSettings: any }
  ): Promise<void> {
    const currentGame = this.findGame(requestBody.gameKey)
    currentGame.gameSettings = requestBody.gameSettings
  }

  @Post('start')
  public async startGame(
    @Body() requestBody: { gameKey: string, gameSettings: any }
  ): Promise<GameBlob> {
    const {gameKey, gameSettings} = requestBody
    const game = this.findGame(gameKey)

    if (gameSettings) {
      game.gameSettings = requestBody.gameSettings
      game.gameState = game.initialGameState(requestBody.gameSettings)
    }
    game.start()

    return {
      ...toBlob(game),
      gameKey,
    }
  }

  @Post('action')
  public async action(
    @Body() requestBody: { gameKey: string, clientCode: string, action: any }
  ): Promise<GameBlob> {
    // TODO: Validate clientCode
    const game = this.findGame(requestBody.gameKey)
    game.action(requestBody.action)

    return {
      ...toBlob(game),
      gameKey: requestBody.gameKey,
    }
  }
}
