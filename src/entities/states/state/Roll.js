import { State, types } from './'

export default class Roll extends State {
  constructor (actor, roll) {
    super(actor, types.roll)
    this.roll = roll
  }

  start () {
    if (!this.cooldown) {
      this.time = this.roll.duration
      this.cooldown = this.roll.cooldown

      this.actor.setVelocity(this.roll.speed * this.actor.sprite.scale.x)
      this.actor.playAnimation('roll', this.roll.archorX)
    }
  }

  stop () {
    this.time = 0
    this.cooldown = 0
  }
}
