import Phaser from 'phaser'

export default class extends Phaser.Particles.Arcade.Emitter {
  constructor (actor, archorX, archorY) {
    super(actor.game, actor.sprite.x, actor.sprite.y, 10)
    this.actor = actor
    this.archorX = archorX
    this.archorY = archorY
    this.makeParticles(
      'atlas',
      [
        'skeleton_bones_0',
        'skeleton_bones_1',
        'skeleton_bones_2',
        'skeleton_bones_3',
        'skeleton_bones_4',
        'skeleton_bones_5',
        'skeleton_bones_6',
        'skeleton_bones_7',
        'skeleton_bones_8',
        'skeleton_bones_9'
      ],
      10,
      true,
      true
    )
    this.forEach(particle => {
      particle.body.setSize(16, 16)
    })
    this.gravity = 380
    this.minParticleSpeed.setTo(-150, -150)
    this.maxParticleSpeed.setTo(150, -150)
    this.angulaDrag = 30
    this.setRotation(50, 0)
    this.angularDrag = 30
    this.particleDrag.setTo(30)
    this.bounce.setTo(0.5, 0.5)
  }

  start () {
    this.emitX = this.actor.sprite.x + this.archorX
    this.emitY = this.actor.sprite.y + this.archorY
    super.start(true, 0, null, 8)
  }

  stop () {
    this.on = false
  }
}
