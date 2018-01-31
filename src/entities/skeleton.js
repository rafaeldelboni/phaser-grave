import Actor from './actor'
import Animations from './helpers/animations'
import Controls from './helpers/controls'

import { types as stateTypes, Idle, Attack } from './states'

const attributes = {
  name: 'skeleton',
  weight: 1,
  animations: [
    { name: 'idle', start: 0, stop: 2, speed: 5, loop: true },
    { name: 'run', start: 0, stop: 5, speed: 9, loop: true },
    { name: 'roll', start: 0, stop: 6, speed: 12, loop: false },
    { name: 'attack_one', start: 0, stop: 4, speed: 6, loop: false },
    { name: 'attack_two', start: 0, stop: 4, speed: 6, loop: false },
    { name: 'attack_three', start: 0, stop: 5, speed: 6, loop: false }
  ],
  speed: 100
}

const attacks = {
  one: {
    name: 'attack_one',
    combo: 30,
    duration: 35,
    coolDown: 15,
    cooldown: 15
  },
  two: {
    name: 'attack_two',
    combo: 35,
    duration: 45,
    coolDown: 5
  },
  three: {
    name: 'attack_three',
    duration: 40,
    coolDown: 5
  }
}

const State = {
  IDLE: { id: 1, time: 0 },
  RUN: { id: 2, time: 0 },
  ATTACK: {
    id: 3,
    time: 0,
    name: attacks.one.name,
    duration: attacks.one.duration,
    combo: attacks.one.combo,
    coolDown: attacks.one.coolDown
  },
  ROLL: { id: 4, time: 0, duration: 36 }
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

    this.controls = new Controls(this)

    this.sprite.anchor.setTo(0.5)
    this.setState(State.IDLE)

    super.setStates([new Idle(this), new Attack(this, [attacks.one])])
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
    if (this.controls.left && !this.controls.right) {
      this.setState(State.RUN)
      this.faceLeft()
      this.playAnimation('run')
      this.setVelocity(-attributes.speed)
    } else if (this.controls.right && !this.controls.left) {
      this.setState(State.RUN)
      this.faceRight()
      this.playAnimation('run')
      this.setVelocity(attributes.speed)
    } else {
      this.setState(State.IDLE)
      this.setVelocity(0)
      this.playAnimation('idle')
      super.setState(stateTypes.idle)
    }
  }

  setAttackState (current, next) {
    if (this.state !== State.ATTACK) {
      this.setState(State.ATTACK)
      this.state.name = current.name
      this.state.combo = current.combo
      this.state.duration = current.duration
      this.playAnimation(current.name)
    } else if (next && this.state.time >= this.state.combo) {
      this.state.time = 0
      this.state.name = next.name
      this.state.combo = next.combo
      this.state.duration = next.duration
      this.playAnimation(next.name)
    }
  }

  attack () {
    if (this.controls.attack) {
      super.setState(stateTypes.attack)
      this.setVelocity(0)
      switch (this.state.name) {
        default:
        case attacks.one.name:
          this.setAttackState(attacks.one, attacks.two)
          break
        case attacks.two.name:
          this.setAttackState(attacks.two, attacks.three)
          break
        case attacks.three.name:
          this.setAttackState(attacks.three)
          break
      }
    }
  }

  roll () {
    if (this.controls.roll) {
      this.sprite.anchor.setTo(0.25, 0.5)
      this.setState(State.ROLL)
      this.playAnimation('roll')
      this.setVelocity(180 * this.sprite.scale.x)
    }
  }

  setState (state) {
    if (this.state) {
      this.state.time = 0
    }
    this.state = state
  }

  handleStates () {
    this.state.time++
    if (this.state.duration <= this.state.time) {
      this.setState(State.IDLE)
    }

    switch (this.state) {
      default:
      case State.IDLE:
        this.run()
        this.attack()
        this.roll()
        break
      case State.RUN:
        this.run()
        this.attack()
        this.roll()
        break
      case State.ATTACK:
        this.attack()
        break
      case State.ROLL:
        break
    }
  }

  update () {
    super.update()
    console.log(super.getState())
    this.handleStates()
  }

  render () {
    super.render()
  }
}
