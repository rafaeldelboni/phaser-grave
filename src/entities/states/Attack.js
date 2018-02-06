import { State, types } from './'

export default class Attack extends State {
  constructor (actor, attacks) {
    super(actor, types.attack)
    this.restartable = true
    this.attacks = attacks
    this.current = {}
  }

  _getNext (attack) {
    return this.attacks.find(next => next.name === attack.next)
  }

  _isCombo () {
    return this.time > 0 && this.combo >= this.time
  }

  _get () {
    if (this._isCombo()) {
      return this._getNext(this.current)
    }
    return this.attacks[0]
  }

  start () {
    if (!this.cooldown || this._isCombo()) {
      const attack = this._get()
      this.current = attack
      this.time = attack.duration
      this.cooldown = attack.cooldown
      this.combo = attack.combo

      this.actor.setVelocity(0)
      this.actor.playAnimation(attack.name, attack.archorX)
    }
  }
}
