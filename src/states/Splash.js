import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import atlasPng from 'assets/atlas.png'
import atlasJson from 'assets/atlas.json'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'loaderBg'
    )
    this.loaderBar = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'loaderBar'
    )
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)

    // load your assets
    this.load.bitmapFont(
      'carrierCommand',
      'assets/fonts/carrier_command.png',
      'assets/fonts/carrier_command.xml'
    )
    this.load.atlas('atlas', atlasPng, atlasJson)
  }

  create () {
    this.state.start('Game')
  }
}
