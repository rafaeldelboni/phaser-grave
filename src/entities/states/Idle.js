import { State, types } from './'

export default class Attack extends State {
  constructor (actor) {
    super(actor, types.idle)
  }

  start () {
    this.timeless = true

    // this.actor.setVelocity(0)
    // this.actor.playAnimation(this.current.name)
  }

  stop () {
    this.timeless = false
  }
}
