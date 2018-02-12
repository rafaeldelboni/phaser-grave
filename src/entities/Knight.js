import Actor from './Actor'
import Animations from './helpers/Animations'

import { types as stateTypes, Idle, Run, Attack, Hit, Die } from './states'
import { Dust, Spark } from '../particles'

const attributes = {
  name: 'knight',
  health: 5,
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
      cooldown: 10,
      knockback: 1,
      shake: 3,
      archorX: 0.25
    }
  ],
  hit: { duration: 34 },
  die: { duration: 80, archorX: 0.25, type: { animation: 'die' } },
  ai: {
    attackRange: 1600
  }
}

export default class Knight extends Actor {
  constructor (game, sprite, player) {
    super(game, sprite)
    this.game = game
    this.player = player
    this.name = attributes.name
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

    this.playAnimation('idle', attributes.idle.archorX)
    this.faceLeft()
  }

  _setupBody () {
    this.sprite.body.setSize(20, 8, 13, 40)
    this.sprite.body.collideWorldBounds = true

    const attack = this.hitboxes.create(0, 0, null)
    attack.anchor.set(0.5)
    attack.body.setSize(35, 28, 21, 8)
    attack.name = 'attack'

    const torso = this.hitboxes.create(0, 0, null)
    torso.anchor.set(0.5)
    torso.body.setSize(18, 25, 15, 8)
    torso.name = 'torso'

    this.hitboxes.children.map(hitbox => hitbox.reset(0, 0))
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

    const playerDistance = this.game.math.distanceSq(
      this.sprite.x,
      0,
      player.x,
      0
    )
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
