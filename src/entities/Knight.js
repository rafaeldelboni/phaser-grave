import Actor from './Actor'
import { Animations, Hitboxes } from './helpers'

import { types as stateTypes, Idle, Run, Attack, Hit, Die } from './states'
import { Dust, Spark } from '../particles'
import { HealthBar } from '../ui'

const attributes = {
  name: 'knight',
  experience: 4,
  health: 4,
  weight: 1,
  animations: [
    { name: 'idle', start: 0, stop: 2, speed: 5, loop: true },
    { name: 'run', start: 0, stop: 5, speed: 9, loop: true },
    { name: 'walk', start: 0, stop: 3, speed: 9, loop: true },
    { name: 'attack', start: 0, stop: 11, speed: 9, loop: false },
    { name: 'die', start: 0, stop: 5, speed: 7, loop: false },
    { name: 'block', start: 0, stop: 0, speed: 1, loop: true },
    { name: 'hitstun', start: 0, stop: 0, speed: 1, loop: true }
  ],
  idle: { archorX: 0.5 },
  run: { speed: 50, archorX: 0.45 },
  attacks: [
    {
      name: 'attack',
      duration: 75,
      hitFrame: 35,
      cooldown: 10,
      knockback: 1,
      shake: 3,
      archorX: 0.25
    }
  ],
  hit: { duration: 34 },
  die: { duration: 80, archorX: 0.25, type: { animation: 'die' } },
  ai: {
    attackRange: 160
  },
  healthBar: {
    width: 25,
    height: 2,
    y: 105
  },
  hitboxes: [
    {
      width: 35,
      height: 28,
      offsetX: 21,
      offsetY: 8,
      name: 'attack'
    },
    {
      width: 18,
      height: 25,
      offsetX: 15,
      offsetY: 8,
      name: 'torso'
    }
  ]
}

export default class Knight extends Actor {
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
    this._setupParticles()

    super.initializeStates([
      new Idle(this, attributes.idle),
      new Run(this, attributes.run),
      new Attack(this, attributes.attacks),
      new Hit(this, attributes.hit),
      new Die(this, attributes.die)
    ])

    this.healthBar = new HealthBar(this, attributes.healthBar)
    this.playAnimation('idle', attributes.idle.archorX)
    this.faceLeft()
  }

  _setupBody () {
    this.sprite.body.setSize(20, 8, 13, 40)
    this.sprite.body.collideWorldBounds = true

    this.hitboxes = Hitboxes.addMultiple(this.game, attributes.hitboxes)
    this.sprite.addChild(this.hitboxes)
  }

  _setupParticles () {
    this.dust = new Dust(this, 0, 24, 10)
    this.spark = new Spark(this, 0, 0, 15)
  }

  _ai () {
    this.controls = {}
    const player = this.player.sprite

    if (!player.alive) return

    const playerDistance =
      this.game.math.distanceSq(this.sprite.x, 0, player.x, 0) / 10
    const playerDirection = this.sprite.x > player.x ? 'left' : 'right'
    if (playerDistance > attributes.ai.attackRange) {
      this.controls[playerDirection] = true
    } else {
      if (this.direction.name !== playerDirection) {
        this.controls[playerDirection] = true
      } else {
        const attack = this.states.find(
          state => state.type === stateTypes.attack
        )

        if (!attack.cooldown) {
          this.controls.attack = true
        }
      }
    }
  }

  _handleStates () {
    switch (super.getState().type) {
      default:
      case stateTypes.idle:
        super.run(attributes.run.speed)
        super.attack()
        break
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
