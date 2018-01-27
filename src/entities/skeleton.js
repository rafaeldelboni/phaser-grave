import Actor from './actor'
import Animations from './helpers/animations'
import Controls from './helpers/controls'

const attributes = {
  name: 'skeleton',
  weight: 1,
  animations: [
    { name: 'idle', start: 0, stop: 2, speed: 5, loop: true },
    { name: 'run', start: 0, stop: 5, speed: 8, loop: true },
    { name: 'roll', start: 0, stop: 6, speed: 8, loop: true },
    { name: 'attack_one', start: 0, stop: 4, speed: 8, loop: false },
    { name: 'attack_two', start: 0, stop: 4, speed: 8, loop: false },
    { name: 'attack_three', start: 0, stop: 5, speed: 8, loop: false }
  ],
  speed: 100,
  attackOne: {
    coolDown: 500
  }
}

const state = {
  moving: false,
  attacking: false
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

    this.controls = new Controls(game)

    this.sprite.anchor.setTo(0.5)
    this.sprite.animations.play('run')
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

  update () {
    if (!state.attacking) {
      if (this.controls.attack) {
        state.attacking = true
        this.sprite.animations.play('attack_one')
        this.sprite.body.velocity.x = 0
        this.game.time.events.add(attributes.attackOne.coolDown, () => {
          state.attacking = false
        })
      }
    }
    if (!state.attacking) {
      if (this.controls.left && !this.controls.right) {
        state.moving = true
        super.faceLeft()
        this.sprite.animations.play('run')
        this.sprite.body.velocity.x = -attributes.speed
      } else if (this.controls.right && !this.controls.left) {
        state.moving = true
        super.faceRight()
        this.sprite.animations.play('run')
        this.sprite.body.velocity.x = attributes.speed
      } else {
        state.moving = false
        this.sprite.body.velocity.x = 0
        this.sprite.animations.play('idle')
      }
    }
  }

  render () {
    super.render()
  }
}
