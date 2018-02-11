import Actor from './Actor'
import Animations from './helpers/Animations'
import Controls from './helpers/Controls'

import { types as stateTypes, Idle, Run, Roll, Attack, Hit } from './states'
import { Dust } from '../particles'

const attributes = {
  name: 'skeleton',
  weight: 1,
  animations: [
    { name: 'idle', start: 0, stop: 2, speed: 5, loop: true },
    { name: 'run', start: 0, stop: 5, speed: 9, loop: true },
    { name: 'roll', start: 0, stop: 6, speed: 12, loop: false },
    { name: 'attack_one', start: 0, stop: 4, speed: 7, loop: false },
    { name: 'attack_two', start: 0, stop: 4, speed: 7, loop: false },
    { name: 'attack_three', start: 0, stop: 5, speed: 6, loop: false },
    { name: 'hitstun', start: 0, stop: 0, speed: 1, loop: true }
  ],
  idle: { archorX: 0.5 },
  run: { speed: 125, archorX: 0.5 },
  roll: { duration: 36, cooldown: 0, speed: 180, archorX: 0.25 },
  attacks: [
    {
      name: 'attack_one',
      duration: 35,
      cooldown: 5,
      damage: 10,
      knockback: 1,
      combo: 15,
      next: 'attack_two'
    },
    {
      name: 'attack_two',
      duration: 35,
      cooldown: 5,
      damage: 11,
      knockback: 1,
      combo: 10,
      next: 'attack_three'
    },
    {
      name: 'attack_three',
      duration: 65,
      cooldown: 10,
      damage: 6,
      knockback: 15
    }
  ],
  hit: { duration: 34 }
}

export default class Skeleton extends Actor {
  constructor (game, sprite) {
    super(game, sprite)
    this.game = game
    this.name = attributes.name
    this.weight = attributes.weight
    this.anims = Animations.addMultiple(
      this.name,
      this.sprite.animations,
      attributes.animations
    )
    this._setupBody()
    this._setupParticles()
    this.controls = new Controls(this)

    super.initializeStates([
      new Idle(this, attributes.idle),
      new Run(this, attributes.run),
      new Roll(this, attributes.roll),
      new Attack(this, attributes.attacks),
      new Hit(this, attributes.hit)
    ])

    this.playAnimation('idle', attributes.idle.archorX)
    this.faceRight()
  }

  _setupBody () {
    // walk body
    this.sprite.body.setSize(20, 8, 13, 40)
    this.sprite.body.collideWorldBounds = true

    const attackOne = this.hitboxes.create(0, 0, null)
    attackOne.anchor.set(0.5)
    attackOne.body.setSize(30, 18, 18, 15)
    attackOne.name = 'attack_one'

    const attackTwo = this.hitboxes.create(0, 0, null)
    attackTwo.anchor.set(0.5)
    attackTwo.body.setSize(20, 28, 25, 8)
    attackTwo.name = 'attack_two'

    const attackThree = this.hitboxes.create(0, 0, null)
    attackThree.anchor.set(0.5)
    attackThree.body.setSize(52, 8, 7, 22)
    attackThree.name = 'attack_three'

    const torso = this.hitboxes.create(0, 0, null)
    torso.anchor.set(0.5)
    torso.body.setSize(17, 22, 11, 10)
    torso.name = 'torso'

    this.hitboxes.children.map(hitbox => hitbox.reset(0, 0))

    this.sprite.addChild(this.hitboxes)
  }

  _setupParticles () {
    this.dust = new Dust(this, 0, 24, 10)
  }

  _handleStates () {
    switch (super.getState().type) {
      default:
      case stateTypes.idle:
        super.run(attributes.run.speed)
        super.attack()
        super.roll()
        break
      case stateTypes.run:
        super.run(attributes.run.speed)
        super.attack()
        super.roll()
        break
      case stateTypes.attack:
        super.attack()
        break
      case stateTypes.roll:
        break
    }
  }

  update (targets) {
    super.update()
    this.targets = targets
    this._handleStates()
  }

  render () {
    super.render()
  }
}
