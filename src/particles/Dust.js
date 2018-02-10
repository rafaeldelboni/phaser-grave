import Phaser from 'phaser'

export default class extends Phaser.Particles.Arcade.Emitter {
  constructor (actor, archorX, archorY, maxParticles) {
    super(actor.game, actor.sprite.x, actor.sprite.y, maxParticles)
    this.actor = actor
    this.archorX = archorX
    this.archorY = archorY
    this.makeParticles('atlas', 'smoke_puff')
    this.setXSpeed(0, 0)
    this.setYSpeed(0, 0)
    this.setRotation(0, 0)
    this.setAlpha(1, 0.1, 400)
    this.setScale(0.05, 0.1, 0.05, 0.1, 1000, Phaser.Easing.Quintic.Out)
    this.gravity = -80
    this.width = 16
    this.forEach(particle => {
      particle.tint = 0x202020
    })
  }

  update () {
    if (this.on) {
      super.update()
      this.emitX = this.actor.sprite.x + this.archorX
      this.emitY = this.actor.sprite.y + this.archorY
    }
  }

  start () {
    super.start(false, 300, 50)
  }

  stop () {
    this.on = false
  }
}
