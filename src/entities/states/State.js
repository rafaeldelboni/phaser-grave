export default class State {
  constructor (actor, type) {
    this.actor = actor
    this.type = type
    this.timeless = false
    this.time = 0
    this._cooldown = 0
  }

  get cooldown () {
    return this._cooldown
  }

  set cooldown (value) {
    this._cooldown = value >= 0 ? value : 0
  }
}
