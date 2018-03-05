import { Hit, types as stateTypes, States } from './states'

export default class Actor {
  constructor (game, sprite, attributes = {}) {
    this.game = game
    this.sprite = sprite

    this.direction = {}
    this.targets = []
    this.controls = {}
    this.states = []
    this.killCount = 0
    this.lastTargetHit = null
    this.dust = { start: () => {}, stop: () => {} }
    this.spark = { start: () => {}, stop: () => {} }
    this.healthBar = { change: () => {}, update: () => {} }

    this.game.physics.arcade.enable(this.sprite)
    this.hitboxes = this.game.add.group()

    this.name = attributes.name || ''
    this.weight = attributes.weight || 1
    this.experience = attributes.experience || 0
    this.experiencePoints = attributes.experiencePoints || 0
    this.experienceToNextLevel = attributes.experienceToNextLevel || 10
    this.unstoppable = attributes.unstoppable || false
    this.sprite.maxHealth = attributes.health
    this.sprite.setHealth(attributes.health)

    this.states = new States(this, attributes)
  }

  face (xFactor) {
    this.direction = {
      name: xFactor === 1 ? 'right' : 'left',
      factor: xFactor
    }
    this.sprite.scale.x = xFactor
    for (const h of this.hitboxes.children) {
      h.scale.x = xFactor
    }
    return xFactor
  }

  faceLeft () {
    return this.face(-1)
  }

  faceRight () {
    return this.face(1)
  }

  getHitbox (name) {
    const hitbox =
      this.hitboxes.children.find(hitbox => hitbox.name === name) || {}
    hitbox.actor = this
    return hitbox
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

  hit (hit) {
    if (
      this !== hit.striker &&
      this.states.get().type !== stateTypes.roll &&
      this.health > 0
    ) {
      if (!this.unstoppable) {
        this.states.set(stateTypes.hit, hit)
      } else {
        Hit.unstoppableDamage(this, hit.attack, hit.striker)
      }
    }
  }

  die (striker) {
    this.states.set(stateTypes.die, striker)
  }

  run () {
    let direction = { x: 0, y: 0 }

    if (this.controls.left) {
      direction.x = -1
    } else if (this.controls.right) {
      direction.x = 1
    }

    if (this.controls.up) {
      direction.y = -1
    } else if (this.controls.down) {
      direction.y = 1
    }

    if (direction.x !== 0 || direction.y !== 0) {
      this.states.set(stateTypes.run, {
        direction
      })
    } else {
      if (this.states.find(stateTypes.idle)) {
        this.states.set(stateTypes.idle)
      }
    }
  }

  attack () {
    if (this.controls.attack) {
      this.states.set(stateTypes.attack)
    }
  }

  roll () {
    if (this.controls.roll) {
      this.states.set(stateTypes.roll)
    }
  }

  update () {
    this.controls.update()
    this.healthBar.update()
    this.states.update()
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
