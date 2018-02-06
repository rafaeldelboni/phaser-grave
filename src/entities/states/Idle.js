import { State, types } from './'

export default class Idle extends State {
  constructor (actor, idle) {
    super(actor, types.idle)
    this.idle = idle
  }

  start () {
    this.timeless = true

    this.actor.setVelocity(0)
    this.actor.playAnimation('idle', this.idle.archorX)
  }

  stop () {
    this.timeless = false
  }
}
