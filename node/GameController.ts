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

let currentGame: UnknownGame | null = null

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

    currentGame = game
    const gameKey = 'ABDAD'

    return {
      gameKey,
      gameSettingsConfig: game.settingsConfig(),
      gameType: requestBody.gameType,
      gameSettings: game.settings,
      gamePhase: 1, // PRE-GAME
      gameState: game.gameState
    }
  }

  @Post('setsettings')
  public async setSettings(
    @Body() requestBody: { gameKey: string, gameSettings: any }
  ): Promise<any> {
    currentGame!.gameSettings = requestBody.gameSettings
  }

  @Post('start')
  public async startGame(
    @Body() requestBody: { gameKey: string, gameSettings: any }
  ): Promise<GameBlob> {
    const {gameKey, gameSettings} = requestBody
    if (gameSettings) {
      currentGame!.gameSettings = requestBody.gameSettings
      currentGame!.gameState = currentGame!.initialGameState(requestBody.gameSettings)
    }
    currentGame!.start()

    return {
      gameKey: gameKey,
      gameSettingsConfig: currentGame!.settingsConfig(),
      gameType: currentGame!.canonicalName,
      gameSettings: currentGame!.gameSettings,
      gamePhase: currentGame!.gamePhase,
      gameState: currentGame!.gameState
    }
  }

  @Post('action')
  public async action(
    @Body() requestBody: { gameKey: string, clientCode: string, action: any }
  ): Promise<GameBlob> {
    // TODO: Validate clientCode
    currentGame!.action(requestBody.action)

    return {
      gameKey: requestBody.gameKey,
      gameSettingsConfig: currentGame!.settingsConfig(),
      gameType: currentGame!.canonicalName,
      gameSettings: currentGame!.gameSettings,
      gamePhase: currentGame!.gamePhase,
      gameState: currentGame!.gameState
    }
  }
}
