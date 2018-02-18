import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#c0c0c0'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    this.scaleGameCentralize()
    this.pixelCrispScaleRender()
    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
  }

  render () {
    this.state.start('Splash')
  }

  fontsLoaded () {
    this.fontsReady = true
  }

  scaleGameCentralize () {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.forceLandscape = true
    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.setMinMax(config.width, config.height, 960, 540)
    this.game.scale.setResizeCallback(() => {
      this.game.scale.setMinMax(config.width, config.height, 960, 540)
    })
  }

  pixelCrispScaleRender () {
    this.game.renderer.renderSession.roundPixels = true
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)
  }
}
