import { State, types as stateTypes } from './states'

export default class Actor {
  constructor (game, sprite) {
    this.game = game
    this.sprite = sprite
    this.states = []
    this.weight = 1
    this.direction = {}
    this.targets = []
    this.controls = {}
    this.killCount = 0
    this.experiencePoints = 0
    this.dust = { start: () => {}, stop: () => {} }
    this.spark = { start: () => {}, stop: () => {} }

    this.healthBar = { change: () => {}, update: () => {} }

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
    const hitbox =
      this.hitboxes.children.find(hitbox => hitbox.name === name) || {}
    hitbox.actor = this
    return hitbox
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

    if (!this.alive && newStateType !== stateTypes.die) {
      return
    }

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
      110
    )
  }

  get alive () {
    return this.sprite.alive
  }

  get health () {
    return this.sprite.health
  }

  heal (amount) {
    this.sprite.heal(amount)
    this.healthBar.change()
  }

  setHealth (amount) {
    this.sprite.maxHealth = amount
    this.sprite.setHealth(amount)
    this.healthBar.change()
  }

  damage (amount, striker) {
    if (this.sprite.health - amount <= 0) {
      this.sprite.health = 0
      this.die(striker)
    } else {
      this.sprite.damage(amount)
    }
    this.healthBar.change()
  }

  destroy () {
    this.sprite.kill()
    return this.sprite.destroy()
  }

  hit (damage) {
    if (
      this !== damage.striker &&
      this.getState().type !== stateTypes.roll &&
      this.health > 0
    ) {
      this.setState(stateTypes.hit, damage)
    }
  }

  die (striker) {
    this.setState(stateTypes.die, striker)
  }

  run (speed) {
    if (this.controls.left && !this.controls.right) {
      this.setState(stateTypes.run, {
        side: 'left',
        speed: speed
      })
    } else if (this.controls.right && !this.controls.left) {
      this.setState(stateTypes.run, {
        side: 'right',
        speed: speed
      })
    } else {
      this.setState(stateTypes.idle)
    }
  }

  attack () {
    if (this.controls.attack) {
      this.setState(stateTypes.attack)
    }
  }

  roll () {
    if (this.controls.roll) {
      this.setState(stateTypes.roll)
    }
  }

  update () {
    this.healthBar.update()
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
