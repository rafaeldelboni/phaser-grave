import Actor from './Actor'
import Animations from './helpers/Animations'
import Controls from './helpers/Controls'

import { types as stateTypes, Idle, Run, Roll, Attack } from './states'

const attributes = {
  name: 'skeleton',
  weight: 1,
  animations: [
    { name: 'idle', start: 0, stop: 2, speed: 5, loop: true },
    { name: 'run', start: 0, stop: 5, speed: 9, loop: true },
    { name: 'roll', start: 0, stop: 6, speed: 12, loop: false },
    { name: 'attack_one', start: 0, stop: 4, speed: 7, loop: false },
    { name: 'attack_two', start: 0, stop: 4, speed: 7, loop: false },
    { name: 'attack_three', start: 0, stop: 5, speed: 6, loop: false }
  ],
  speed: 125,
  roll: { duration: 36, cooldown: 0, speed: 180 },
  attacks: [
    {
      name: 'attack_one',
      duration: 35,
      cooldown: 5,
      combo: 15,
      next: 'attack_two'
    },
    {
      name: 'attack_two',
      duration: 35,
      cooldown: 5,
      combo: 10,
      next: 'attack_three'
    },
    {
      name: 'attack_three',
      duration: 65,
      cooldown: 15
    }
  ]
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
    this.setupBody()
    this.sprite.anchor.setTo(0.5)
    this.controls = new Controls(this)

    super.setStates([
      new Idle(this),
      new Run(this),
      new Roll(this, attributes.roll),
      new Attack(this, attributes.attacks)
    ])
    this.playAnimation('idle')
    this.faceRight()
  }

  setupBody () {
    // walk body
    this.sprite.body.setSize(20, 8, 13, 40)
    this.sprite.body.collideWorldBounds = true

    const hitboxes = this.game.add.group()
    hitboxes.enableBody = true
    this.game.physics.arcade.enable(hitboxes)

    const attackOne = hitboxes.create(0, 0, null)
    attackOne.anchor.set(0.5)
    attackOne.body.setSize(30, 18, 18, 15)
    attackOne.name = 'attack_one'

    const attackTwo = hitboxes.create(0, 0, null)
    attackTwo.anchor.set(0.5)
    attackTwo.body.setSize(20, 28, 25, 8)
    attackTwo.name = 'attack_two'

    const attackThree = hitboxes.create(0, 0, null)
    attackThree.anchor.set(0.5)
    attackThree.body.setSize(52, 8, 7, 22)
    attackThree.name = 'attack_three'

    const torso = hitboxes.create(0, 0, null)
    torso.anchor.set(0.5)
    torso.body.setSize(17, 22, 11, 10)
    torso.name = 'torso'

    hitboxes.children.map(hitbox => hitbox.reset(0, 0))

    this.sprite.addChild(hitboxes)
    this.hitboxes = hitboxes
  }

  run () {
    this.sprite.anchor.setTo(0.5)
    if (this.controls.left && !this.controls.right) {
      super.setState(stateTypes.run, { side: 'left', speed: attributes.speed })
    } else if (this.controls.right && !this.controls.left) {
      super.setState(stateTypes.run, { side: 'right', speed: attributes.speed })
    } else {
      super.setState(stateTypes.idle)
    }
  }

  attack () {
    if (this.controls.attack) {
      super.setState(stateTypes.attack)
    }
  }

  roll () {
    if (this.controls.roll) {
      this.sprite.anchor.setTo(0.25, 0.5)
      super.setState(stateTypes.roll)
    }
  }

  handleStates () {
    switch (super.getState().type) {
      default:
      case stateTypes.idle:
        this.run()
        this.attack()
        this.roll()
        break
      case stateTypes.run:
        this.run()
        this.attack()
        this.roll()
        break
      case stateTypes.attack:
        this.attack()
        break
      case stateTypes.roll:
        break
    }
  }

  update () {
    super.update()
    this.handleStates()
  }

  render () {
    super.render()
  }
}
