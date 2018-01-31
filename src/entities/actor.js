export default class Actor {
  constructor (game, sprite) {
    this.game = game
    this.sprite = sprite
    this.states = []
    this.weight = 1
    this.game.physics.arcade.enable(this.sprite)
  }

  _calculateStateTimes () {
    this.states.map(state => {
      if (state.time) {
        state.time--
      } else if (state.cooldown) {
        state.cooldown--
      }
    })
  }

  _face (xFactor) {
    this.sprite.scale.x = xFactor
    for (const h of this.hitboxes.children) {
      h.scale.x = xFactor
    }
  }

  faceLeft () {
    this._face(-1)
  }

  faceRight () {
    this._face(1)
  }

  setStates (value) {
    this.states = value
  }

  getState () {
    return this.states.find(state => state.time || state.timeless)
  }

  setState (newStateType) {
    const current = this.getState()
    if (!current || (current.timeless && current.type !== newStateType)) {
      if (current && current.timeless) {
        this.states.filter(state => state.timeless).map(state => state.stop())
      }
      this.states
        .filter(state => !state.time && state.type === newStateType)
        .map(state => state.start())
    }
  }

  playAnimation (animationName) {
    return this.sprite.animations.play(animationName)
  }

  setVelocity (x, y) {
    if (x != null) {
      this.sprite.body.velocity.x = x
    }
    if (y != null) {
      this.sprite.body.velocity.y = y
    }
  }

  update () {
    this._calculateStateTimes()
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
