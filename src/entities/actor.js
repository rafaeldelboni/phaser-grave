export default class Actor {
  constructor (game, sprite) {
    this.game = game
    this.sprite = sprite
    this.weight = 1
  }

  get sprite () {
    return this.sprite
  }

  get maxHealth () {
    return this.sprite.maxHealth
  }

  get weight () {
    return this.weight
  }

  set weight (value) {
    this.weight = value
  }

  update () {
    if (this.game.config.isDevelopment) {
      this.game.debug.body(this.sprite)
      if (this.hitboxes) {
        for (const hitbox of this.hitboxes.children) {
          this.game.debug.body(hitbox)
        }
      }
    }
  }
}
