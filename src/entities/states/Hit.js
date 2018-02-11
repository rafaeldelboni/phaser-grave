import { State, types } from './'

export default class Hit extends State {
  constructor (actor, hit) {
    super(actor, types.hit)
    this.hit = hit
    this.attack = {}
  }

  start ({ striker, attack }) {
    this.attack = attack
    this.time = this.hit.duration

    this.actor.setVelocity(0)
    this.actor.playAnimation('hitstun', this.hit.archorX)
    this.actor.knockback(striker.sprite.x, attack.knockback)
  }

  stop () {
    this.time = 0
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

  _generateSpark () {
    if (this.actor.spark) {
      if (this.time && !this.actor.spark.on) {
        this.actor.spark.start()
      }
      if (this.time < 20 && this.actor.spark.on) {
        console.log('stop', this.time)
        this.actor.spark.stop()
      }
    }
  }

  update () {
    this._generateDust()
    this._generateSpark()
  }
}
