import Actor from './actor'
import addAnimations from '../helpers/animations'

const skeletonAttributes = {
  name: 'skeleton',
  weight: 1,
  animations: [
    { name: 'idle', start: 0, stop: 2, speed: 5, loop: true },
    { name: 'run', start: 0, stop: 5, speed: 8, loop: true },
    { name: 'roll', start: 0, stop: 6, speed: 8, loop: true },
    { name: 'attack_one', start: 0, stop: 4, speed: 8, loop: true },
    { name: 'attack_two', start: 0, stop: 4, speed: 8, loop: true },
    { name: 'attack_three', start: 0, stop: 5, speed: 8, loop: true }
  ]
}

export default class Skeleton extends Actor {
  constructor (game, sprite) {
    super(game, sprite)
    this.name = skeletonAttributes.name
    this.weight = skeletonAttributes.weight
    this.anims = addAnimations(
      this.name,
      this.sprite.animations,
      skeletonAttributes.animations
    )

    this.setupBody()

    this.sprite.anchor.setTo(0.5)
    this.sprite.animations.play('run')
    this.faceRight()
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
    attackThree.name = 'attackThree'

    const torso = hitboxes.create(0, 0, null)
    torso.anchor.set(0.5)
    torso.body.setSize(17, 22, 11, 10)
    torso.name = 'torso'

    for (const h of hitboxes.children) {
      h.reset(0, 0)
    }

    this.sprite.addChild(hitboxes)
    this.hitboxes = hitboxes
  }

  render () {
    super.render()
  }
}
