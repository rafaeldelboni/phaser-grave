import Phaser from 'phaser'

const veryRandom = multiplier =>
  Math.random() * multiplier * (Math.random() < 0.5 ? -1 : 1)

export default class extends Phaser.Sprite {
  constructor (actor, x, y) {
    super(actor.game, x + veryRandom(15), y + veryRandom(15), 'atlas', 'expr_0')
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
    this.body.velocity.setTo(25, -85)
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

  static factory (actorOrigin, actorDestiny, quantity = 1) {
    const experiences = []
    for (let i = 0; i < quantity; i++) {
      experiences.push(
        new this(actorDestiny, actorOrigin.sprite.x, actorOrigin.sprite.y)
      )
    }
    return experiences
  }

  static collide (playerTorso, experience) {
    playerTorso.actor.experiencePoints++
    experience.destroy()
    this.game.audio.sfx.expr.play()
    return false
  }
}
