import Phaser from 'phaser'
import Skeleton from '../entities/Skeleton'

export default class extends Phaser.State {
  init () {}
  preload () {}

  _createBackgroundLayer (positionY, sizeX, scaleX, scaleY, name, file, color) {
    const layer = this.game.add.group(this.world, name)
    for (let i = 0; i <= 1920; i += sizeX) {
      const sprite = this.game.add.sprite(i, positionY, 'atlas', file)
      sprite.scale.setTo(scaleX, scaleY)
      sprite.tint = color ? Phaser.Color.hexToRGB(color) : 0xffffff
      layer.add(sprite)
    }
    return layer
  }

  _setBackground () {
    this.cloudsBg = this._createBackgroundLayer(
      0,
      640,
      1,
      1,
      'clouds',
      'bg_clouds',
      '#d2d2d2'
    )

    this.firstLayerBg = this._createBackgroundLayer(
      40,
      416,
      0.65,
      0.65,
      'first',
      'bg_graves',
      '#8c8c8c'
    )

    this.secondLayerBg = this._createBackgroundLayer(
      45,
      480,
      -0.75,
      0.75,
      'second',
      'bg_graves',
      '#787878'
    )

    this.thirdLayerBg = this._createBackgroundLayer(
      38,
      640,
      1,
      1,
      'third',
      'bg_graves',
      '#646464'
    )

    this.floorLayerBg = this._createBackgroundLayer(
      116,
      32,
      1,
      1,
      'floor',
      'bg_grass'
    )

    for (let i = 0; i <= 320; i += 32) {
      const wall = this.floorLayerBg.create(i, 148, 'atlas', 'wall_0')
      wall.fixedToCamera = true
    }
  }

  create () {
    this.game.world.setBounds(0, -360, 1920, 540)
    this.game.stage.smoothing = false
    this._setBackground()

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
    this.firstLayerBg.x = this.game.camera.x * 0.05
    this.secondLayerBg.x = this.game.camera.x * 0.1
    this.thirdLayerBg.x = this.game.camera.x * 0.15
    this.skeleton.update()
  }

  render () {
    this.skeleton.render()
    if (this.game.config.isDevelopment) {
      this.game.debug.spriteInfo(this.skeleton.sprite, 32, 32)
    }
  }
}
