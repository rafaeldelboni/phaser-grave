import { State, types } from './'

export default class Idle extends State {
  constructor (actor) {
    super(actor, types.idle)
  }

  start () {
    this.timeless = true

    this.actor.setVelocity(0)
    this.actor.playAnimation('idle')
  }

  stop () {
    this.timeless = false
  }
}
