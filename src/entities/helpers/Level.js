const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

export default class Level {
  constructor (actor) {
    this.actor = actor
    this._level = 1
    this._factor = 0
  }

  get factor () {
    return precisionRound(1 + this._factor * this._level, 2)
  }

  get () {
    return this._level
  }

  change () {
    if (this.actor.experiencePoints > this.actor.experienceToNextLevel) {
      this._level++

      this.actor.experiencePoints =
        this.actor.experiencePoints - this.actor.experienceToNextLevel

      this.actor.experienceToNextLevel += this.actor.experienceToNextLevel
      this.actor.maxHealth += 5
      this.actor.heal(this.actor.maxHealth / 2)

      this._factor += 0.2
    }
  }
}
