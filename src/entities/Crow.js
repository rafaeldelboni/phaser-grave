import Actor from './Actor'
import { Animations, Hitboxes } from './helpers'

import { types as stateTypes, Hit, Run, Attack, Die } from './states'
import { Feathers } from '../particles'

const attributes = {
  name: 'crow',
  experience: 2,
  health: 1,
  weight: 1,
  animations: [
    {
      name: 'crow',
      spriteName: 'crow_',
      start: 0,
      stop: 4,
      speed: 10,
      loop: true
    }
  ],
  run: { speed: 100, archorX: 0.45, animation: 'crow' },
  attacks: [
    {
      name: 'crow',
      duration: 2,
      hitFrame: 1,
      knockback: 1.5,
      shake: 1,
      canMove: true
    }
  ],
  hit: { duration: 1, animation: 'crow' },
  die: { duration: 1, type: { particle: 'feathers' } },
  ai: {
    attackRange: 20
  },
  hitboxes: [
    {
      width: 5,
      height: 25,
      offsetX: 25,
      offsetY: 0,
      name: 'crow'
    },
    {
      width: 30,
      height: 25,
      offsetX: 5,
      offsetY: 0,
      name: 'torso'
    }
  ]
}

export default class Crow extends Actor {
  constructor (game, sprite, player) {
    super(game, sprite)
    this.game = game
    this.player = player
    this.name = attributes.name
    this.experience = attributes.experience
    this.weight = attributes.weight
    this.setHealth(attributes.health)
    this.anims = Animations.addMultiple(
      this.name,
      this.sprite.animations,
      attributes.animations
    )
    this._setupBody()
    this.feathers = new Feathers(this, 0, -5)

    super.initializeStates([
      new Run(this, attributes.run),
      new Attack(this, attributes.attacks),
      new Hit(this, attributes.hit),
      new Die(this, attributes.die)
    ])

    this.playAnimation('crow', attributes.run.archorX)
    this.initialDirection =
      this.sprite.x > this.player.sprite.x ? 'left' : 'right'
  }

  _setupBody () {
    this.sprite.body.setSize(0)
    this.sprite.body.checkCollision.none = true

    this.hitboxes = Hitboxes.addMultiple(this.game, attributes.hitboxes)
    this.sprite.addChild(this.hitboxes)
  }

  _ai () {
    this.controls = {}

    this.controls[this.initialDirection] = true
    if (this.lastTargetHit) {
      this.controls.up = true
      return
    }

    const playerDistance =
      this.game.math.distanceSq(this.sprite.x, 0, this.player.sprite.x, 0) / 10
    if (playerDistance <= attributes.ai.attackRange) {
      this.controls.attack = true
    }

    if (this.alive && this.sprite.body.checkWorldBounds()) {
      this.destroy()
    }
  }

  _handleStates () {
    switch (super.getState().type) {
      default:
      case stateTypes.run:
        super.run(attributes.run.speed)
        super.attack()
        break
      case stateTypes.attack:
        super.attack()
        break
      case stateTypes.hit:
      case stateTypes.die:
        break
    }
  }

  update (targets) {
    super.update()
    this.targets = targets
    this._handleStates()
    this._ai()
  }

  render () {
    super.render()
  }
}
