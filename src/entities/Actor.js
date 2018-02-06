import { State } from './states'

export default class Actor {
  constructor (game, sprite) {
    this.game = game
    this.sprite = sprite
    this.states = []
    this.weight = 1
    this.direction = {}
    this.targets = []

    this.game.physics.arcade.enable(this.sprite)
    this.hitboxes = this.game.add.group()
    this.hitboxes.enableBody = true
    this.game.physics.arcade.enable(this.hitboxes)
  }

  _calculateStateTimes () {
    this.states.map(state => {
      if (state.time) {
        state.time--
      } else if (state.cooldown) {
        state.cooldown--
      }
      state.update()
    })
  }

  _face (xFactor) {
    this.sprite.scale.x = xFactor
    for (const h of this.hitboxes.children) {
      h.scale.x = xFactor
    }
    return xFactor
  }

  face (direction) {
    this.direction = { name: direction, factor: direction === 'right' ? 1 : -1 }
    return this._face(this.direction.factor)
  }

  faceLeft () {
    this.direction = { name: 'left', factor: -1 }
    return this._face(this.direction.factor)
  }

  faceRight () {
    this.direction = { name: 'right', factor: 1 }
    return this._face(this.direction.factor)
  }

  getHitbox (name) {
    return this.hitboxes.children.find(hitbox => hitbox.name === name)
  }

  initializeStates (states) {
    this.states = states
  }

  getState () {
    return (
      this.states.find(state => state.time || state.timeless) || new State()
    )
  }

  setState (newStateType, parameters) {
    const current = this.getState()

    if (newStateType.mandatory) {
      this.states.map(state => state.stop())
    }

    if (
      !current.time ||
      (current.restartable && current.type === newStateType) ||
      (current.timeless && current.type !== newStateType)
    ) {
      if (current.timeless) {
        this.states.filter(state => state.timeless).map(state => state.stop())
      }
      this.states
        .filter(state => state.type === newStateType)
        .map(state => state.start(parameters))
    }
  }

  playAnimation (animationName, archorX = 0.5, archorY = 0.5) {
    this.sprite.anchor.set(archorX, archorY)
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

  knockback (strikerPositionX, distance) {
    let knockToX = this.sprite.x
    if (strikerPositionX < this.sprite.x) {
      knockToX += distance / this.weight
    } else {
      knockToX -= distance / this.weight
    }

    this.game.physics.arcade.moveToXY(
      this.sprite,
      knockToX,
      this.sprite.y,
      110,
      100
    )
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
