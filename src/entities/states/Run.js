import { State, types } from './'

export default class Run extends State {
  constructor (actor, run) {
    super(actor, types.run)
    this.run = run
    this.restartable = true
  }

  start (parameters = {}) {
    this.timeless = true
    let speedSide = 1
    if (parameters.side === 'right') {
      speedSide = this.actor.faceRight()
    } else {
      speedSide = this.actor.faceLeft()
    }

    this.actor.setVelocity(parameters.speed * speedSide)
    this.actor.playAnimation(this.run.animation || 'run', this.run.archorX)
  }

  stop () {
    this.timeless = false
  }
}
