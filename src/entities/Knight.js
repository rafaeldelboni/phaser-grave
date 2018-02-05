import Actor from './Actor'
import Animations from './helpers/Animations'

import { types as stateTypes, Idle, Run, Attack } from './states'

const attributes = {
  name: 'knight',
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
      archorX: 0.25
    }
  ],
  ai: {
    attackRange: 2000
  }
}

export default class Knight extends Actor {
  constructor (game, sprite, player) {
    super(game, sprite)
    this.game = game
    this.player = player
    this.name = attributes.name
    this.weight = attributes.weight
    this.anims = Animations.addMultiple(
      this.name,
      this.sprite.animations,
      attributes.animations
    )
    this.setupBody()
    this.controls = {}

    super.setStates([
      new Idle(this, attributes.idle),
      new Run(this, attributes.run),
      new Attack(this, attributes.attacks)
    ])

    this.sprite.anchor.setTo(attributes.idle.archorX)
    this.playAnimation('idle')
    this.faceLeft()
  }

  setupBody () {
    this.sprite.body.setSize(20, 8, 13, 40)
    this.sprite.body.collideWorldBounds = true

    const hitboxes = this.game.add.group()
    hitboxes.enableBody = true
    this.game.physics.arcade.enable(hitboxes)

    const attack = hitboxes.create(0, 0, null)
    attack.anchor.set(0.5)
    attack.body.setSize(30, 18, 18, 15)
    attack.name = 'attack'

    const torso = hitboxes.create(0, 0, null)
    torso.anchor.set(0.5)
    torso.body.setSize(17, 22, 11, 10)
    torso.name = 'torso'

    hitboxes.children.map(hitbox => hitbox.reset(0, 0))

    this.sprite.addChild(hitboxes)
    this.hitboxes = hitboxes
  }

  ai () {
    this.controls = {}
    const player = this.player.sprite
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

  run () {
    if (this.controls.left && !this.controls.right) {
      super.setState(stateTypes.run, {
        side: 'left',
        speed: attributes.run.speed
      })
    } else if (this.controls.right && !this.controls.left) {
      super.setState(stateTypes.run, {
        side: 'right',
        speed: attributes.run.speed
      })
    } else {
      super.setState(stateTypes.idle)
    }
  }

  attack () {
    if (this.controls.attack) {
      super.setState(stateTypes.attack)
    }
  }

  handleStates () {
    switch (super.getState().type) {
      default:
      case stateTypes.idle:
        this.run()
        this.attack()
        break
      case stateTypes.run:
        this.run()
        this.attack()
        break
      case stateTypes.attack:
        this.attack()
        break
    }
  }

  update () {
    super.update()
    this.handleStates()
    this.ai()
  }

  render () {
    super.render()
  }
}
