import Actor from './Actor'
import Controls from '../Controls'
import { Animations, Hitboxes } from './helpers'
import { Dust, Bones } from '../particles'
import { HealthBar } from '../ui'

const attributes = {
  name: 'skeleton',
  health: 25,
  weight: 1,
  experienceToNextLevel: 10,
  animations: [
    { name: 'idle', start: 0, stop: 2, speed: 5, loop: true },
    { name: 'run', start: 0, stop: 5, speed: 9, loop: true },
    { name: 'roll', start: 0, stop: 6, speed: 12, loop: false },
    { name: 'attack_one', start: 0, stop: 4, speed: 7, loop: false },
    { name: 'attack_two', start: 0, stop: 4, speed: 7, loop: false },
    { name: 'attack_three', start: 0, stop: 5, speed: 6, loop: false },
    { name: 'hitstun', start: 0, stop: 0, speed: 1, loop: true }
  ],
  states: {
    idle: { archorX: 0.5 },
    run: { speed: 125, archorX: 0.5, audio: 'step', stepTime: 17 },
    roll: { duration: 36, cooldown: 0, speed: 180, archorX: 0.25 },
    attacks: [
      {
        name: 'attack_one',
        damage: 5,
        duration: 35,
        hitFrame: 15,
        cooldown: 5,
        knockback: 1,
        shake: 1,
        combo: 15,
        audioHit: 'hit',
        audioMiss: 'miss',
        next: 'attack_two'
      },
      {
        name: 'attack_two',
        damage: 5,
        duration: 35,
        hitFrame: 15,
        cooldown: 5,
        knockback: 1,
        shake: 1,
        combo: 10,
        audioHit: 'hit',
        audioMiss: 'miss',
        next: 'attack_three'
      },
      {
        name: 'attack_three',
        damage: 8.5,
        duration: 65,
        hitFrame: 31,
        cooldown: 10,
        knockback: 15,
        shake: 1,
        audioHit: 'hit',
        audioMiss: 'miss'
      }
    ],
    hit: { duration: 30 },
    die: { duration: 40, type: { particle: 'bones' } }
  },
  healthBar: {
    x: 10,
    y: 10,
    width: 200,
    height: 6,
    fixedToCamera: true,
    visible: true
  },
  hitboxes: [
    {
      width: 30,
      height: 18,
      offsetX: 18,
      offsetY: 15,
      name: 'attack_one'
    },
    {
      width: 20,
      height: 28,
      offsetX: 25,
      offsetY: 8,
      name: 'attack_two'
    },
    {
      width: 52,
      height: 8,
      offsetX: 7,
      offsetY: 22,
      name: 'attack_three'
    },
    {
      width: 17,
      height: 22,
      offsetX: 11,
      offsetY: 10,
      name: 'torso'
    }
  ]
}

export default class Skeleton extends Actor {
  constructor (game, sprite) {
    super(game, sprite, attributes)

    this.anims = Animations.addMultiple(
      this.name,
      this.sprite.animations,
      attributes.animations
    )

    this._setupBody()

    this.dust = new Dust(this, 0, 24, 10)
    this.bones = new Bones(this, 0, 10)
    this.controls = new Controls(game)

    this.healthBar = new HealthBar(this, attributes.healthBar)

    this.playAnimation('idle', attributes.states.idle.archorX)
    this.faceRight()
  }

  _setupBody () {
    this.sprite.body.setSize(20, 8, 13, 40)
    this.sprite.body.collideWorldBounds = true
    this.hitboxes = Hitboxes.addMultiple(this.game, attributes.hitboxes)
    this.sprite.addChild(this.hitboxes)
  }

  update (targets) {
    super.update()
    this.game.physics.arcade.collide(this.bones)
    this.targets = targets
  }

  destroy () {
    this.game.time.events.add(1500, () =>
      this.game.state.start('End', true, false, this.killCount)
    )
    super.destroy()
  }

  render () {
    super.render()
  }
}
