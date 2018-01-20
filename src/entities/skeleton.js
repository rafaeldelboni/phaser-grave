import Actor from './actor'
import addAnimations from '../helpers/animations'

export default class Skeleton extends Actor {
  constructor (game, sprite) {
    super(game, sprite)
    this.name = 'skeleton'
    this.anims = addAnimations(this.name, this.sprite.animations, [
      { name: 'idle', start: 0, stop: 2, speed: 5, loop: true },
      { name: 'run', start: 0, stop: 5, speed: 8, loop: true },
      { name: 'roll', start: 0, stop: 6, speed: 8, loop: true }
    ])
    this.sprite.animations.play('run')
  }
}
