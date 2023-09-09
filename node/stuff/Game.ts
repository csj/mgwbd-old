import {BaseGameSettings} from './BaseGameSettings'
import {SettingsConfig} from './SettingsConfig'
import {BaseGameState} from './BaseGameState'

export type UnknownGame = Game<BaseGameState, unknown, BaseGameSettings>

export abstract class Game<TGameState extends BaseGameState, TGameAction, TGameSettings extends BaseGameSettings> {
  gameState: TGameState
  gamePhase: number = 0
  gameSettings: TGameSettings

  constructor(
    gameState: TGameState | null = null,
    gameSettings: TGameSettings | null = null,
    gamePhase: number = 1  // PRE-GAME
  ) {

    if (gameState && gameSettings) {
      this.gameSettings = gameSettings
      this.gameState = gameState
      this.gamePhase = gamePhase
      return
    }

    const playerConfig = this.defaultPlayerConfig()
    const settings = this.buildDefaultSettings()
    settings.players = playerConfig

    this.gameState = this.initialGameState(settings)
    this.gameSettings = settings
    return
  }

  defaultPlayerConfig() {
    return [
      {'playerType': 'human', 'owner': null, 'name': 'Player 1', 'style': 'A'},
      {'playerType': 'human', 'owner': null, 'name': 'Player 2', 'style': 'B'},
    ]
  }

  buildDefaultSettings() {
    let settings: any = {}
    this.settingsConfig().forEach(setting => {
      settings[setting.canonicalName] = setting.defaultValue
    })
    return settings
  }

  abstract action(action: TGameAction): boolean
  abstract canonicalName: string

  checkGameEndCondition() {
    const gameEnd = this.gameEndCondition()
    if (!!gameEnd) {
      this.gamePhase = 3 // GAME-OVER
    }

    this.gameState.gameEnd = this.gameEndCondition()
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

  abstract gameEndCondition(): any;

  abstract settingsConfig(): SettingsConfig[]

  abstract initialGameState(settings: TGameSettings): TGameState
}
