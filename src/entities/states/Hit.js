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

  update () {
    if (this.actor.dust && this.attack.knockback) {
      if (this.time && !this.actor.dust.on) {
        this.actor.dust.start()
      } else if (!this.time && this.actor.dust.on) {
        this.actor.dust.stop()
      }
    }
  }
}
