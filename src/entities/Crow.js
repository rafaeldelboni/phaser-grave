import Actor from './Actor'
import { Ai, Animations, Hitboxes } from './helpers'
import { Feathers } from '../particles'
import { getRandomArbitraryInt } from '../utils'

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
    run: {
      speed: getRandomArbitraryInt(50, 100),
      archorX: 0.45,
      animation: 'crow'
    },
    attacks: [
      {
        name: 'crow',
        damage: 5,
        duration: 2,
        hitFrame: 1,
        knockback: 1.5,
        shake: 1,
        audioHit: 'hitTwo',
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
    super(game, sprite, attributes)

    this.player = player

    this.anims = Animations.addMultiple(
      this.name,
      this.sprite.animations,
      attributes.animations
    )
    this._setupBody()

    this.initialDirection =
      this.sprite.x > this.player.sprite.x ? 'left' : 'right'

    this.feathers = new Feathers(this, 0, -5)
    this.controls = new Ai(this, player, attributes)

    this.playAnimation('crow', attributes.states.run.archorX)
  }

  _setupBody () {
    this.sprite.body.setSize(0)
    this.sprite.body.checkCollision.none = true
    this.hitboxes = Hitboxes.addMultiple(this.game, attributes.hitboxes)
    this.sprite.addChild(this.hitboxes)
  }

  update (targets) {
    super.update()
    this.targets = targets
  }

  render () {
    super.render()
  }
}
