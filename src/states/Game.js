import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Skeleton from '../entities/skeleton'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(
      this.world.centerX,
      this.game.height - 80,
      bannerText,
      {
        font: '40px Bangers',
        fill: '#77BFA3',
        smoothed: false
      }
    )

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom'
    })
    this.game.add.existing(this.mushroom)

    this.skeleton = new Skeleton(
      this.game,
      this.game.add.sprite(
        this.world.centerX + 16,
        this.world.centerY + 16,
        'atlas',
        ''
      )
    )
  }

  render () {
    this.skeleton.render()
    if (this.game.config.isDevelopment) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
