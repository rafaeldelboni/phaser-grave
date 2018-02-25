import Actor from './Actor'
import Animations from './helpers/Animations'

import { types as stateTypes, Hit, Run, Attack, Die } from './states'
import { Bones } from '../particles'

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
      speed: 15,
      loop: true
    }
  ],
  run: { speed: 125, archorX: 0.45, animation: 'crow' },
  attacks: [
    {
      name: 'crow',
      duration: 10,
      hitFrame: 5,
      cooldown: 0,
      knockback: 1,
      shake: 1,
      canMove: true
    }
  ],
  hit: { duration: 1, animation: 'crow' },
  die: { duration: 1, type: { particle: 'feathers' } },
  ai: {
    attackRange: 1600
  }
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
    this.feathers = new Bones(this, 0, 10)

    super.initializeStates([
      new Run(this, attributes.run),
      new Attack(this, attributes.attacks),
      new Hit(this, attributes.hit),
      new Die(this, attributes.die)
    ])

    this.playAnimation('crow', attributes.run.archorX)
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

  _ai () {
    // TODO: crow moving attack and flee
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
