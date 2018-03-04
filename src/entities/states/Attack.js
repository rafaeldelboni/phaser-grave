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

  _damage () {
    const hitbox = this.actor.getHitbox(this.current.name)
    for (const target of this.actor.targets) {
      this.actor.game.physics.arcade.collide(
        hitbox,
        target.getHitbox('torso'),
        () => target.hit({ striker: this.actor, attack: this.current })
      )
    }
  }

  start () {
    if (!this.cooldown || this._isCombo()) {
      const attack = this._get()
      this.current = attack
      this.time = attack.duration
      this.cooldown = attack.cooldown
      this.combo = attack.combo

      if (!attack.canMove) {
        this.actor.setVelocity(0)
      }
      this.actor.playAnimation(attack.name, attack.archorX, attack.archorY)
    }
  }

  stop () {
    this.time = 0
    this.cooldown = 0
  }

  update () {
    if (this.time === this.current.hitFrame) {
      this._damage()
    }
  }
}
