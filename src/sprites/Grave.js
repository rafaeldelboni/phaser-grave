import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y, type = 0) {
    super(game, x, y, 'atlas', `grave_${type}`)
    this.anchor.setTo(0.5)
    game.add.existing(this)
  }
  static factory (game, x, y, type) {
    return new this(game, x, y, type)
  }
}
