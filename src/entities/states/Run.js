import { State, types } from './'

const pythInverse = 1 / Math.SQRT2

export default class Run extends State {
  constructor (actor, run) {
    super(actor, types.run)
    this.run = run
    this.restartable = true
    this.step = run.stepTime || 10
  }

  start (parameters = {}) {
    this.timeless = true
    this.actor.face(parameters.direction.x)

    const targetSpeed =
      parameters.direction.x !== 0 && parameters.direction.y !== 0
        ? this.run.speed * pythInverse
        : this.run.speed

    this.actor.setVelocity(
      targetSpeed * parameters.direction.x,
      targetSpeed * parameters.direction.y
    )
    this.actor.playAnimation(this.run.animation || 'run', this.run.archorX)
  }

  stop () {
    this.timeless = false
  }

  update () {
    if (this.run.audio && this.timeless) {
      if (this.step === 0) {
        this.actor.game.audio.sfx[this.run.audio].play()
        this.step = 18
      } else {
        this.step--
      }
    }
  }
}
