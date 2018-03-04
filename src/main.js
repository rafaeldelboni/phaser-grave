import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import EndState from './states/End'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    super(config)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)
    this.state.add('End', EndState, false)

    this.state.start('Boot')
  }
}

window.game = new Game()
