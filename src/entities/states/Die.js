import Phaser from 'phaser'
import { State, types } from './'

export default class Die extends State {
  constructor (actor, die) {
    super(actor, types.die)
    this.die = die
    this.dying = false
  }

  _animation (name) {
    this.actor.playAnimation('die', this.die.archorX)
    this.actor.game.add
      .tween(this.actor.sprite)
      .to({ alpha: 0 }, 1250, Phaser.Easing.Quintic.None, true)
  }

  _particle (name) {
    this.actor.sprite.alpha = 0
    // TODO: death particles feather
    switch (name) {
      case 'bones':
        this.actor.bones.start()
        break
    }
    this.actor.destroy()
  }

  start () {
    this.time = this.die.duration
    this.dying = true

    this.actor.setVelocity(0)

    if (this.die.type.animation) {
      this._animation(this.die.type.animation)
    } else {
      this._particle(this.die.type.particle)
    }
  }

  stop () {
    this.time = 0
    this.dying = false
  }

  update () {
    if (this.dying && this.time <= 1) {
      this.actor.destroy()
    }
  }
}
