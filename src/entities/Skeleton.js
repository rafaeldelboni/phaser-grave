import Actor from './Actor'
import { Animations, Controls, Hitboxes, States } from './helpers'
import { types as stateTypes } from './states'
import { Dust, Bones } from '../particles'
import { HealthBar } from '../ui'

const attributes = {
  name: 'skeleton',
  health: 2,
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
  states: {
    idle: { archorX: 0.5 },
    run: { speed: 125, archorX: 0.5 },
    roll: { duration: 36, cooldown: 0, speed: 180, archorX: 0.25 },
    attacks: [
      {
        name: 'attack_one',
        duration: 35,
        hitFrame: 15,
        cooldown: 5,
        damage: 10,
        knockback: 1,
        shake: 1,
        combo: 15,
        next: 'attack_two'
      },
      {
        name: 'attack_two',
        duration: 35,
        hitFrame: 15,
        cooldown: 5,
        damage: 11,
        knockback: 1,
        shake: 1,
        combo: 10,
        next: 'attack_three'
      },
      {
        name: 'attack_three',
        duration: 65,
        hitFrame: 31,
        cooldown: 10,
        damage: 6,
        knockback: 15,
        shake: 1
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
    super(game, sprite)
    super.initializeStates(States.addMultiple(this, attributes))

    this.game = game
    this.name = attributes.name
    this.weight = attributes.weight
    this.setHealth(attributes.health)
    this.anims = Animations.addMultiple(
      this.name,
      this.sprite.animations,
      attributes.animations
    )
    this._setupBody()
    this._setupParticles()
    this.controls = new Controls(this)

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

  _setupParticles () {
    this.dust = new Dust(this, 0, 24, 10)
    this.bones = new Bones(this, 0, 10)
  }

  _handleStates () {
    switch (super.getState().type) {
      default:
      case stateTypes.idle:
        super.run(attributes.states.run.speed)
        super.attack()
        super.roll()
        break
      case stateTypes.run:
        super.run(attributes.states.run.speed)
        super.attack()
        super.roll()
        break
      case stateTypes.attack:
        super.attack()
        break
      case stateTypes.roll:
      case stateTypes.hit:
      case stateTypes.die:
        break
    }
  }

  update (targets) {
    super.update()
    this.game.physics.arcade.collide(this.bones)
    this.targets = targets
    this._handleStates()
  }

  render () {
    super.render()
  }
}
