import { State, types } from './'

export default class Hit extends State {
  constructor (actor, hit) {
    super(actor, types.hit)
    this.hit = hit
  }

  start ({ striker, attack }) {
    this.time = this.hit.duration

    this.actor.setVelocity(0)
    this.actor.playAnimation('hitstun', this.hit.archorX)
    this.actor.knockback(striker.sprite.x, attack.knockback)
  }

  stop () {
    this.time = 0
  }
}
