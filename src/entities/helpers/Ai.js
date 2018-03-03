import { types as stateTypes } from '../states'

export default class Ai {
  constructor (actor, player, attributes) {
    this.actor = actor
    this.player = player
    this.game = player.game
    this.attributes = attributes
    this._left = false
    this._right = false
    this._up = false
    this._attack = false

    switch (this.attributes.type) {
      default:
      case 'humanoid':
        this._type = this.humanoid
        break
      case 'bird':
        this._type = this.bird
        break
    }
  }

  humanoid () {
    const controls = {}
    const actorSprite = this.actor.sprite
    const playerSprite = this.player.sprite

    if (!playerSprite.alive) return controls

    const playerDistance =
      this.game.math.distanceSq(actorSprite.x, 0, playerSprite.x, 0) / 10

    const playerDirection = actorSprite.x > playerSprite.x ? 'left' : 'right'

    if (playerDistance > this.attributes.ai.attackRange) {
      controls[playerDirection] = true
    } else {
      if (this.actor.direction.name !== playerDirection) {
        controls[playerDirection] = true
      } else {
        const attack = this.actor.states.find(
          state => state.type === stateTypes.attack
        )

        if (!attack.cooldown) {
          controls.attack = true
        }
      }
    }

    return controls
  }

  bird () {
    const controls = {}
    const actorSprite = this.actor.sprite
    const playerSprite = this.player.sprite

    controls[this.actor.initialDirection] = true

    if (this.actor.lastTargetHit) {
      controls.up = true
      return controls
    }

    const playerDistance =
      this.game.math.distanceSq(actorSprite.x, 0, playerSprite.x, 0) / 10

    if (playerDistance <= this.attributes.ai.attackRange) {
      controls.attack = true
    }

    if (this.alive && actorSprite.body.checkWorldBounds()) {
      this.actor.destroy()
    }

    return controls
  }

  get left () {
    return this._left
  }

  get right () {
    return this._right
  }

  get up () {
    return this._up
  }

  get attack () {
    return this._attack
  }

  update () {
    let controls = this._type()

    this._left = controls.left
    this._right = controls.right
    this._up = controls.up
    this._attack = controls.attack
  }
}
