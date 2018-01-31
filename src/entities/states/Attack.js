import { State, types } from './'

export default class Attack extends State {
  constructor (actor, attacks) {
    super(actor, types.attack)
    this.attacks = attacks
    this.current = null
    this.next = null
  }

  start () {
    if (!this.cooldown) {
      const attack = this.get()
      this.current = attack.id
      this.time = attack.duration
      this.cooldown = attack.cooldown

      // this.actor.setVelocity(0)
      // this.actor.playAnimation(this.current.name)
    }
  }

  get () {
    return this.attacks[0]
  }
}
