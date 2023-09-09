import {Prophecies} from '../games/Prophecies'
import {BaseGameState} from './BaseGameState'
import {Game} from './Game'
import {BaseGameSettings} from './BaseGameSettings'

export const gameRegistry: {[key: string]: typeof Game<BaseGameState, unknown, BaseGameSettings>} = {
    "prophecies": Prophecies
}

