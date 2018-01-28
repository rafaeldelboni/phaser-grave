import Actor from './actor'
import Animations from './helpers/animations'
import Controls from './helpers/controls'

const attributes = {
  name: 'skeleton',
  weight: 1,
  animations: [
    { name: 'idle', start: 0, stop: 2, speed: 5, loop: true },
    { name: 'run', start: 0, stop: 5, speed: 9, loop: true },
    { name: 'roll', start: 0, stop: 6, speed: 12, loop: false },
    { name: 'attack_one', start: 0, stop: 4, speed: 8, loop: false },
    { name: 'attack_two', start: 0, stop: 4, speed: 8, loop: false },
    { name: 'attack_three', start: 0, stop: 5, speed: 8, loop: false }
  ],
  speed: 100,
  attackOne: {
    coolDown: 500
  },
  roll: {
    coolDown: 600
  }
}

const State = {
  IDLE: 1,
  RUN: 2,
  ATTACK: 3,
  ROLL: 4
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
    this.sprite.animations.play('idle')
    this.state = State.IDLE
    super.faceRight()
  }

  setupBody () {
    // walk body
    this.game.physics.arcade.enable(this.sprite)
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
      this.state = State.RUN
      super.faceLeft()
      this.sprite.animations.play('run')
      this.sprite.body.velocity.x = -attributes.speed
    } else if (this.controls.right && !this.controls.left) {
      this.state = State.RUN
      super.faceRight()
      this.sprite.animations.play('run')
      this.sprite.body.velocity.x = attributes.speed
    } else {
      this.state = State.IDLE
      this.sprite.body.velocity.x = 0
      this.sprite.animations.play('idle')
    }
  }

  attack () {
    if (this.controls.attack) {
      this.state = State.ATTACK
      this.sprite.animations.play('attack_one')
      this.sprite.body.velocity.x = 0
      this.game.time.events.add(attributes.attackOne.coolDown, () => {
        this.state = State.IDLE
      })
    }
  }

  roll () {
    if (this.controls.roll) {
      this.sprite.anchor.setTo(0.25, 0.5)
      this.state = State.ROLL
      this.sprite.animations.play('roll')
      this.sprite.body.velocity.x = 180 * this.sprite.scale.x
      this.game.time.events.add(attributes.roll.coolDown, () => {
        this.sprite.anchor.setTo(0.5)
        this.state = State.IDLE
      })
    }
  }

  handleStates () {
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
    this.handleStates()
  }

  render () {
    super.render()
  }
}
