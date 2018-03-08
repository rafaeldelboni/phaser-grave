import Phaser from 'phaser'

export default class extends Phaser.Particles.Arcade.Emitter {
  constructor (actor, archorX, archorY) {
    super(actor.game, actor.sprite.x, actor.sprite.y, 9)
    this.actor = actor
    this.archorX = archorX
    this.archorY = archorY
    this.makeParticles(
      'atlas',
      [
        'confetti_0',
        'confetti_1',
        'confetti_2',
        'confetti_3',
        'confetti_4',
        'confetti_5',
        'confetti_6',
        'confetti_7',
        'confetti_8'
      ],
      9
    )
    this.gravity = 100
    this.particleDrag.setTo(30)
  }

  start () {
    this.emitX = this.actor.sprite.x + this.archorX
    this.emitY = this.actor.sprite.y + this.archorY
    this.actor.game.audio.sfx.crowDie.play()
    super.start(true, 750, null, 9)
  }

  stop () {
    this.on = false
  }
}
