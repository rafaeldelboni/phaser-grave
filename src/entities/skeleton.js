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
    { name: 'attack_one', start: 0, stop: 4, speed: 6, loop: false },
    { name: 'attack_two', start: 0, stop: 4, speed: 6, loop: false },
    { name: 'attack_three', start: 0, stop: 5, speed: 6, loop: false }
  ],
  speed: 100,
  attack: {
    one: {
      name: 'attack_one',
      comboTime: 450,
      duration: 500
    },
    two: {
      name: 'attack_two',
      comboTime: 600,
      duration: 750
    },
    three: {
      name: 'attack_three',
      duration: 600
    }
  },
  roll: {
    duration: 600
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
    this.comboAttack = {
      current: null,
      next: attributes.attack.one
    }

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

  // TODO very buggy, need to trigger one time only not on each update loop
  setAttack (current, next) {
    if (this.comboAttack.next === current) {
      this.comboAttack.current = current
      console.log('current', this.comboAttack.current.name)
      this.sprite.animations.play(current.name)

      if (next) {
        this.game.time.events.add(this.comboAttack.current.comboTime, () => {
          this.comboAttack.next = next
          console.log('next', this.comboAttack.next.name)
        })
      }

      this.game.time.events.add(this.comboAttack.current.duration, () => {
        if (this.comboAttack.current === current) {
          this.comboAttack.next = attributes.attack.one
          this.comboAttack.current = null
          this.state = State.IDLE
          console.log('reset', this.comboAttack.next.name)
        }
      })
    }
  }

  attack () {
    if (this.controls.attack) {
      this.state = State.ATTACK
      this.sprite.body.velocity.x = 0
      switch (this.comboAttack.next) {
        default:
        case attributes.attack.one:
          this.setAttack(attributes.attack.one, attributes.attack.two)
          break
        case attributes.attack.two:
          this.setAttack(attributes.attack.two, attributes.attack.three)
          break
        case attributes.attack.three:
          this.setAttack(attributes.attack.three)
          break
      }
    }
  }

  roll () {
    if (this.controls.roll) {
      this.sprite.anchor.setTo(0.25, 0.5)
      this.state = State.ROLL
      this.sprite.animations.play('roll')
      this.sprite.body.velocity.x = 180 * this.sprite.scale.x
      this.game.time.events.add(attributes.roll.duration, () => {
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
