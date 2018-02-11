import { State, types } from './'

export default class Hit extends State {
  constructor (actor, hit) {
    super(actor, types.hit)
    this.hit = hit
    this.attack = {}
  }

  _stopDust () {
    if (!this.time && this.actor.dust.on) {
      this.actor.dust.stop()
    }
  }

  _stopSpark () {
    if (this.time < 23 && this.actor.spark.on) {
      this.actor.spark.stop()
    }
  }

  start ({ striker, attack }) {
    this.attack = attack
    this.time = this.hit.duration

    this.actor.setVelocity(0)
    this.actor.playAnimation('hitstun', this.hit.archorX)
    this.actor.knockback(striker.sprite.x, attack.knockback)

    this.actor.game.camera.shake(0.01 * attack.shake, 100 * attack.shake)
    this.actor.spark.start()
    this.actor.dust.start()
  }

  stop () {
    this.time = 0
  }

  update () {
    this._stopDust()
    this._stopSpark()
  }
}
