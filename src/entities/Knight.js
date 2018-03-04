import Actor from './Actor'
import { Ai, Animations, Hitboxes } from './helpers'
import { types as stateTypes } from './states'
import { Dust, Spark } from '../particles'
import { HealthBar } from '../ui'

const attributes = {
  name: 'knight',
  type: 'humanoid',
  experience: 4,
  health: 4,
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
  states: {
    idle: { archorX: 0.5 },
    run: { speed: 50, archorX: 0.45 },
    attacks: [
      {
        name: 'attack',
        damage: 1,
        duration: 75,
        hitFrame: 35,
        cooldown: 10,
        knockback: 1,
        shake: 3,
        audioHit: 'hitTwo',
        audioMiss: 'miss',
        archorX: 0.25
      }
    ],
    hit: { duration: 34 },
    die: { duration: 80, archorX: 0.25, type: { animation: 'die' } }
  },
  ai: {
    attackRange: 160
  },
  healthBar: {
    width: 25,
    height: 2,
    y: 105
  },
  hitboxes: [
    {
      width: 35,
      height: 28,
      offsetX: 21,
      offsetY: 8,
      name: 'attack'
    },
    {
      width: 18,
      height: 25,
      offsetX: 15,
      offsetY: 8,
      name: 'torso'
    }
  ]
}

export default class Knight extends Actor {
  constructor (game, sprite, player) {
    super(game, sprite, attributes)

    this.player = player

    this.anims = Animations.addMultiple(
      this.name,
      this.sprite.animations,
      attributes.animations
    )

    this._setupBody()

    this.dust = new Dust(this, 0, 24, 10)
    this.spark = new Spark(this, 0, 0, 15)
    this.controls = new Ai(this, player, attributes)

    this.healthBar = new HealthBar(this, attributes.healthBar)

    this.playAnimation('idle', attributes.states.idle.archorX)
    this.faceLeft()
  }

  _setupBody () {
    this.sprite.body.setSize(20, 8, 13, 40)
    this.sprite.body.collideWorldBounds = true
    this.hitboxes = Hitboxes.addMultiple(this.game, attributes.hitboxes)
    this.sprite.addChild(this.hitboxes)
  }

  _handleStates () {
    switch (super.getState().type) {
      default:
      case stateTypes.idle:
        super.run(attributes.states.run.speed)
        super.attack()
        break
      case stateTypes.run:
        super.run(attributes.states.run.speed)
        super.attack()
        break
      case stateTypes.attack:
        super.attack()
        break
      case stateTypes.hit:
      case stateTypes.die:
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
