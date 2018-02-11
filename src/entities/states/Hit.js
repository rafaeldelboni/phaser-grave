import { State, types } from './'

export default class Hit extends State {
  constructor (actor, hit) {
    super(actor, types.hit)
    this.hit = hit
    this.attack = {}
  }

  _generateDust () {
    if (this.actor.dust && this.attack.knockback) {
      if (this.time && !this.actor.dust.on) {
        this.actor.dust.start()
      } else if (!this.time && this.actor.dust.on) {
        this.actor.dust.stop()
      }
    }
  }

  _startSpark () {
    if (this.actor.spark) {
      this.actor.spark.start()
    }
  }

  _stopSpark () {
    if (this.actor.spark) {
      if (this.time < 23 && this.actor.spark.on) {
        this.actor.spark.stop()
      }
    }
  }

  start ({ striker, attack }) {
    this.attack = attack
    this.time = this.hit.duration

    this.actor.setVelocity(0)
    this.actor.playAnimation('hitstun', this.hit.archorX)
    this.actor.knockback(striker.sprite.x, attack.knockback)
    this._startSpark()
  }

  stop () {
    this.time = 0
  }

  update () {
    this._generateDust()
    this._stopSpark()
  }
}
