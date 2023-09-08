import {Body, Controller, Post, Route} from "tsoa";
import {Prophecies, PropheciesSettings} from "./Prophecies";

interface GameBlob {
    gameKey: string
    gameType: string
    gameSettingsConfig: any
    gameSettings: any
    gamePhase: number
    gameState: any
}

let currentGame: Prophecies | null = null

@Route("gameplay")
export class GameController extends Controller {


    @Post("new")
    public async newGame(
        @Body() requestBody: { gameType: string, hostDomain: string }
    ): Promise<GameBlob> {
        console.log("new game: " + requestBody.gameType)

        const game = new Prophecies()  // TODO: lookup from gameType

        const settingsConfig = game.getSettingsConfig()
        const playerConfig = game.defaultPlayerConfig()

        let settings:any = {}
        settingsConfig.forEach(setting => {
            settings[setting.canonicalName] = setting.defaultValue
        })
        settings['players'] = playerConfig

        const gameKey = "ABDAD"
        game.gameState = game.initialGameState(settings)
        game.gameSettings = settings
        currentGame = game

        return {
            gameKey,
            gameSettingsConfig: settingsConfig,
            gameType: requestBody.gameType,
            gameSettings: settings,
            gamePhase: 1, // PRE-GAME
            gameState: game.gameState
        }
    }

    @Post("setsettings")
    public async setSettings(
        @Body() requestBody: { gameKey: string, gameSettings: PropheciesSettings }
    ): Promise<any> {
        currentGame!.gameSettings = requestBody.gameSettings
    }

    @Post("start")
    public async startGame(
        @Body() requestBody: { gameKey: string, gameSettings: PropheciesSettings }
    ): Promise<GameBlob> {
        currentGame!.gameSettings = requestBody.gameSettings
        currentGame!.gameState = currentGame!.initialGameState(requestBody.gameSettings)
        currentGame!.start()

        return {
            gameKey: requestBody.gameKey,
            gameSettingsConfig: currentGame!.getSettingsConfig(),
            gameType: "prophecies",
            gameSettings: requestBody.gameSettings,
            gamePhase: currentGame!.gamePhase,
            gameState: currentGame!.gameState
        }
    }

    @Post("action")
    public async action(
        @Body() requestBody: { gameKey: string, clientCode: string, action: any }
    ): Promise<GameBlob> {
        // TODO: Validate clientCode
        currentGame!.action(requestBody.action)

        return {
            gameKey: requestBody.gameKey,
            gameSettingsConfig: currentGame!.getSettingsConfig(),
            gameType: "prophecies",
            gameSettings: currentGame!.gameSettings,
            gamePhase: currentGame!.gamePhase,
            gameState: currentGame!.gameState
        }
    }
}