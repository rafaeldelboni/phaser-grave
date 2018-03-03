import Actor from './Actor'
import { Ai, Animations, Hitboxes, States } from './helpers'
import { types as stateTypes } from './states'
import { Feathers } from '../particles'

const attributes = {
  name: 'crow',
  type: 'bird',
  experience: 2,
  health: 1,
  weight: 1,
  animations: [
    {
      name: 'crow',
      spriteName: 'crow_',
      start: 0,
      stop: 4,
      speed: 10,
      loop: true
    }
  ],
  states: {
    run: { speed: 100, archorX: 0.45, animation: 'crow' },
    attacks: [
      {
        name: 'crow',
        duration: 2,
        hitFrame: 1,
        knockback: 1.5,
        shake: 1,
        canMove: true
      }
    ],
    hit: { duration: 1, animation: 'crow' },
    die: { duration: 1, type: { particle: 'feathers' } }
  },
  ai: {
    attackRange: 20
  },
  hitboxes: [
    {
      width: 5,
      height: 25,
      offsetX: 25,
      offsetY: 0,
      name: 'crow'
    },
    {
      width: 30,
      height: 25,
      offsetX: 5,
      offsetY: 0,
      name: 'torso'
    }
  ]
}

export default class Crow extends Actor {
  constructor (game, sprite, player) {
    super(game, sprite)
    super.initializeStates(States.addMultiple(this, attributes))

    this.player = player
    this.experience = attributes.experience

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
    this.feathers = new Feathers(this, 0, -5)
    this.controls = new Ai(this, player, attributes)

    this.playAnimation('crow', attributes.states.run.archorX)
    this.initialDirection =
      this.sprite.x > this.player.sprite.x ? 'left' : 'right'
  }

  _setupBody () {
    this.sprite.body.setSize(0)
    this.sprite.body.checkCollision.none = true

    this.hitboxes = Hitboxes.addMultiple(this.game, attributes.hitboxes)
    this.sprite.addChild(this.hitboxes)
  }

  _handleStates () {
    switch (super.getState().type) {
      default:
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
