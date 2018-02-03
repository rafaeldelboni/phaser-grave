import Phaser from 'phaser'
import Skeleton from '../entities/Skeleton'

export default class extends Phaser.State {
  init () {}
  preload () {}

  setBackground () {
    this.background = this.game.add.group(this.world, 'background')

    const clouds = this.game.add.sprite(0, 0, 'atlas', 'bg_clouds')
    clouds.tint = Phaser.Color.hexToRGB('#d2d2d2')
    this.background.add(clouds)

    const firstLayerBg = this.game.add.sprite(0, 0, 'atlas', 'bg_graves')
    firstLayerBg.tint = Phaser.Color.hexToRGB('#8c8c8c')
    this.background.add(firstLayerBg)

    const secondLayerBg = this.game.add.sprite(0, 16, 'atlas', 'bg_graves')
    secondLayerBg.tint = Phaser.Color.hexToRGB('#787878')
    this.background.add(secondLayerBg)

    const thirdLayerBg = this.game.add.sprite(0, 38, 'atlas', 'bg_graves')
    thirdLayerBg.tint = Phaser.Color.hexToRGB('#646464')
    this.background.add(thirdLayerBg)

    for (let i = 0; i <= 320; i += 32) {
      this.background.create(i, 116, 'atlas', 'bg_grass')
      const wall = this.background.create(i, 148, 'atlas', 'wall_0')
      wall.fixedToCamera = true
    }

    this.background.sort('y', Phaser.Group.SORT_ASCENDING)
  }

  create () {
    this.game.world.setBounds(0, -360, 3000, 540)
    this.setBackground()

    this.skeleton = new Skeleton(
      this.game,
      this.game.add.sprite(100, 123, 'atlas', '')
    )

    this.game.camera.setBoundsToWorld()
    this.game.camera.follow(
      this.skeleton.sprite,
      Phaser.Camera.FOLLOW_LOCKON,
      0.2
    )
  }

  update () {
    this.skeleton.update()
  }

  render () {
    this.skeleton.render()
    if (this.game.config.isDevelopment) {
      this.game.debug.spriteInfo(this.skeleton.sprite, 32, 32)
    }
  }
}
