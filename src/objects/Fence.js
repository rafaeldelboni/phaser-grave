import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'atlas', 'fence_0')
    this.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this)
    this.body.setSize(16, 40)
    this.body.collideWorldBounds = true
    this.body.immovable = true
    game.add.existing(this)
  }

  render () {
    if (this.game.config.isDevelopment) {
      this.game.debug.body(this)
    }
  }
}
