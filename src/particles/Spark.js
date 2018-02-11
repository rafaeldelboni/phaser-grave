import Phaser from 'phaser'

export default class extends Phaser.Particles.Arcade.Emitter {
  constructor (actor, archorX, archorY, maxParticles) {
    super(actor.game, actor.sprite.x, actor.sprite.y, maxParticles)
    this.actor = actor
    this.makeParticles('atlas', 'skeleton_attack_three_damage_0')
    this.archorX = archorX
    this.archorY = archorY
    this.particleBringToTop = true
    this.gravity = 0
    this.setRotation(0)
    this.minParticleSpeed.setTo(-500, -500)
    this.maxParticleSpeed.setTo(500, 500)
    this.setAlpha(0.35, 1, 150, Phaser.Easing.Quintic.OutIn, true)
    this.setScale(0.15, 0.3, 0.05, 0.5, 1500, Phaser.Easing.Quintic.Out)
  }

  update () {
    if (this.on) {
      super.update()
      this.emitX = this.actor.sprite.x + this.archorX
      this.emitY = this.actor.sprite.y + this.archorY
      this.forEach(particle => {
        particle.tint = 0xffffff
        particle.rotation = this.actor.game.physics.arcade.angleBetween(
          this.actor.sprite,
          particle
        )
      })
    }
  }

  start () {
    this.actor.game.camera.flash(0xffffff, 75)
    super.start(false, 200, 10)
  }

  stop () {
    this.on = false
  }
}
