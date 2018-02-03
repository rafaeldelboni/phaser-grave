import Phaser from 'phaser'

export default class Controls {
  constructor (actor) {
    this.game = actor.game
    this.keys = {
      left: [
        this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
      ],
      right: [
        this.game.input.keyboard.addKey(Phaser.Keyboard.D),
        this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
      ],
      attack: [
        this.game.input.keyboard.addKey(Phaser.Keyboard.K),
        this.game.input.keyboard.addKey(Phaser.Keyboard.O),
        this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
      ],
      roll: [
        this.game.input.keyboard.addKey(Phaser.Keyboard.J),
        this.game.input.keyboard.addKey(Phaser.Keyboard.P),
        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
      ]
    }
  }

  isDown (keys) {
    return keys
      .map(key => key.isDown)
      .reduce((accumulator, current) => accumulator || current)
  }

  isDownTimeout (keys) {
    return keys
      .map(key => key.downDuration(1))
      .reduce((accumulator, current) => accumulator || current)
  }

  get left () {
    return this.isDown(this.keys.left)
  }

  get right () {
    return this.isDown(this.keys.right)
  }

  get attack () {
    return this.isDownTimeout(this.keys.attack)
  }

  get roll () {
    return this.isDownTimeout(this.keys.roll)
  }
}
