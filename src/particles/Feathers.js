import Phaser from 'phaser'

export default class extends Phaser.Particles.Arcade.Emitter {
  constructor (actor, archorX, archorY) {
    super(actor.game, actor.sprite.x, actor.sprite.y, 8)
    this.actor = actor
    this.archorX = archorX
    this.archorY = archorY
    this.makeParticles('atlas', 'feather_0')
    this.gravity = 380
    this.particleDrag.setTo(30)
  }

  start () {
    this.emitX = this.actor.sprite.x + this.archorX
    this.emitY = this.actor.sprite.y + this.archorY
    super.start(true, 750, null, 8)
  }

  stop () {
    this.on = false
  }
}
