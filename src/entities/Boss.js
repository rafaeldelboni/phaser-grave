import Actor from './Actor'
import { Ai, Animations, Hitboxes } from './helpers'
import { types as stateTypes } from './states'
import { Dust, Spark } from '../particles'
import { HealthBar } from '../ui'

const attributes = {
  name: 'boss',
  type: 'humanoid',
  experience: 4,
  health: 10,
  weight: 1,
  unstoppable: true,
  animations: [
    { name: 'idle', start: 0, stop: 0, speed: 1, loop: true },
    { name: 'walk', start: 0, stop: 5, speed: 5, loop: true },
    { name: 'attack', start: 0, stop: 14, speed: 5, loop: false }
  ],
  states: {
    idle: { archorX: 0.5 },
    run: { speed: 35, archorX: 0.5, animation: 'walk' },
    attacks: [
      {
        name: 'attack',
        damage: 2,
        duration: 150,
        hitFrame: 60,
        cooldown: 15,
        knockback: 10,
        shake: 10,
        audioHit: 'bigHit',
        audioMiss: 'bigHit',
        archorX: 0.355,
        archorY: 0.737
      }
    ],
    die: { duration: 40, archorX: 0.5, type: { animation: 'idle' } }
  },
  ai: {
    attackRange: 1350,
    attackMinimumDistance: 500
  },
  healthBar: {
    width: 25,
    height: 2,
    y: 105
  },
  hitboxes: [
    {
      width: 90,
      height: 20,
      offsetX: 80,
      offsetY: 40,
      name: 'attack'
    },
    {
      width: 42,
      height: 84,
      offsetX: 0,
      offsetY: -25,
      name: 'torso'
    }
  ]
}

export default class Boss extends Actor {
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
    this.sprite.body.setSize(80, 8, 13, 82)
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
        super.attack()
        break
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
