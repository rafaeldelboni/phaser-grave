import Phaser from 'phaser'
import { State, types } from './'
import { Experience } from '../../../objects'
import { getRandomArbitraryInt } from '../../../utils'

export default class Die extends State {
  constructor (actor, die) {
    super(actor, types.die)
    this.die = die
    this.dying = false
    this.stage = actor.game.state.states.Game
  }

  _animation (name) {
    this.actor.playAnimation(name, this.die.archorX)
    this.actor.game.add
      .tween(this.actor.sprite)
      .to({ alpha: 0 }, 1250, Phaser.Easing.Quintic.None, true)
  }

  _particle (name) {
    this.actor.sprite.alpha = 0
    switch (name) {
      case 'bones':
        this.actor.bones.start()
        break
      case 'feathers':
        const normalParticle = getRandomArbitraryInt(0, 9)
        if (normalParticle) {
          this.actor.feathers.start()
        } else {
          this.actor.confetti.start()
        }
        break
    }
    this._destroy()
  }

  _spawExperience () {
    if (this.actor.name !== 'skeleton') {
      this.stage.experiences.addMultiple(
        Experience.factory(this.actor, this.striker, this.actor.experience)
      )
    }
  }

  _destroy () {
    this._spawExperience()
    this.actor.destroy()
  }

  start (striker) {
    this.time = this.die.duration
    this.dying = true
    this.striker = striker

    this.actor.setVelocity(0)

    if (this.die.type.animation) {
      this._animation(this.die.type.animation)
    } else {
      this._particle(this.die.type.particle)
    }

    striker.killCount++
  }

  stop () {
    this.time = 0
    this.dying = false
  }

  update () {
    if (this.dying && this.time === 1) {
      this._destroy()
    }
  }
}
