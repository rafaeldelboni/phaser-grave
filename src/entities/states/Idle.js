import { State, types } from './'

export default class Idle extends State {
  constructor (actor, idle) {
    super(actor, types.idle)
    this.idle = idle
  }

  start () {
    this.timeless = true

    if (this.idle.archorX) {
      this.actor.sprite.anchor.x = this.idle.archorX
    }
    this.actor.setVelocity(0)
    this.actor.playAnimation('idle')
  }

  stop () {
    this.timeless = false
  }
}
