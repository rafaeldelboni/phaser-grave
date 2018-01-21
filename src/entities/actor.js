export default class Actor {
  constructor (game, sprite) {
    this.game = game
    this.sprite = sprite
    this.weight = 1
  }

  get maxHealth () {
    return this.sprite.maxHealth
  }

  faceLeft () {
    this.face(-1)
  }

  faceRight () {
    this.face(1)
  }

  face (xFactor) {
    this.sprite.scale.x = xFactor
    for (const h of this.hitboxes.children) {
      h.scale.x = xFactor
    }
  }

  render () {
    if (this.game.config.isDevelopment) {
      this.game.debug.body(this.sprite)
      if (this.hitboxes) {
        for (const hitbox of this.hitboxes.children) {
          this.game.debug.body(hitbox, 'rgba(255, 0, 0, 0.3)')
        }
      }
    }
  }
}
