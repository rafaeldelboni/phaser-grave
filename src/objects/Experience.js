import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (actor, x, y) {
    super(
      actor.game,
      x * Math.random() * 0.2,
      y * Math.random() * 0.2,
      'atlas',
      'expr_0'
    )
    this.actor = actor
    this.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this)
    this.body.setSize(4, 4)
    this.body.collideWorldBounds = false
    this.game.add.existing(this)

    this.options = {
      speed: 185
    }

    this.body.maxVelocity.set(120)
    this.body.drag.set(100)
  }

  update () {
    let rotation = this.game.physics.arcade.angleBetween(
      this,
      this.actor.sprite
    )

    this.game.physics.arcade.accelerationFromRotation(
      rotation,
      this.options.speed,
      this.body.acceleration
    )
  }

  render () {
    if (this.game.config.isDevelopment) {
      this.game.debug.body(this)
    }
  }
}
