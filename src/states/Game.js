import Phaser from 'phaser'
import { Fence, Grave } from '../objects'
import { Knight, Skeleton } from '../entities'

export default class extends Phaser.State {
  init () {}
  preload () {}

  _createBackgroundLayer (positionY, sizeX, name, file, color, body) {
    const layer = this.game.add.group(this.world, name)
    for (let i = 0; i <= 1280; i += sizeX) {
      const sprite = this.game.add.sprite(i, positionY, 'atlas', file)
      sprite.tint = color ? Phaser.Color.hexToRGB(color) : 0xffffff
      if (body) {
        this.game.physics.arcade.enable(sprite)
      }
      layer.add(sprite)
    }
    return layer
  }

  _setBackground () {
    this.cloudsBg = this._createBackgroundLayer(
      0,
      640,
      'clouds',
      'bg_clouds',
      '#d2d2d2'
    )
    this.firstLayerBg = this._createBackgroundLayer(
      40,
      416,
      'first',
      'bg_graves_one',
      '#8c8c8c'
    )
    this.secondLayerBg = this._createBackgroundLayer(
      45,
      480,
      'second',
      'bg_graves_two',
      '#787878'
    )
    this.thirdLayerBg = this._createBackgroundLayer(
      38,
      640,
      'third',
      'bg_graves_three',
      '#646464'
    )

    Grave.factory(this.game, 25, 127, 2)
    Grave.factory(this.game, 75, 127, 0)
    Grave.factory(this.game, 92, 127, 2)
    Grave.factory(this.game, 125, 127, 1)
    Grave.factory(this.game, 160, 127, 1)
    Grave.factory(this.game, 1100, 127, 2)
    Grave.factory(this.game, 1115, 127, 2)
    Grave.factory(this.game, 1170, 127, 0)
    Grave.factory(this.game, 1235, 127, 1)

    this.fences = this.game.add.group(this.world, 'fences')
    this.fences.add(new Fence(this.game, 200, 127))
    this.fences.add(new Fence(this.game, 1050, 127))
  }

  _setFloor () {
    this.floorLayerBg = this._createBackgroundLayer(
      116,
      32,
      'floor',
      'bg_grass'
    )

    this.underFloorwallBg = this._createBackgroundLayer(
      148,
      32,
      'under_floor',
      'wall_0',
      null,
      true
    )
    this.underFloorwallBg.setAll('scale.y', 2)
    this.underFloorwallBg.setAll('body.collideWorldBounds', true)
    this.underFloorwallBg.setAll('body.immovable', true)
    this.underFloorwallBg.callAll('body.setSize', 'body', 32, 1)
  }

  _cleanKilledEnemies () {
    this.enemies = this.enemies.reduce((accumulator, current) => {
      if (current.alive) {
        accumulator.push(current)
      }
      return accumulator
    }, [])
  }

  create () {
    this.game.world.setBounds(0, -360, 1280, 540)
    this.game.stage.smoothing = false
    this._setBackground()

    this.skeleton = new Skeleton(
      this.game,
      this.game.add.sprite(300, 123, 'atlas', '')
    )

    this.enemies = []

    this.knight = new Knight(
      this.game,
      this.game.add.sprite(350, 123, 'atlas', ''),
      this.skeleton
    )
    this.enemies.push(this.knight)

    this._setFloor()

    this.game.camera.setBoundsToWorld()
    this.game.camera.follow(
      this.skeleton.sprite,
      Phaser.Camera.FOLLOW_LOCKON,
      0.1,
      0.1
    )
  }

  update () {
    this.skeleton.update(this.enemies)
    this.knight.update(this.enemies.concat([this.skeleton]))

    this.game.physics.arcade.collide(this.skeleton.sprite, this.fences)
    this.game.physics.arcade.collide(
      this.enemies.map(enemie => enemie.sprite),
      this.fences
    )
    this.game.physics.arcade.collide(this.skeleton.bones, this.underFloorwallBg)

    this.cloudsBg.x = this.game.camera.x * 0.95
    this.firstLayerBg.x = this.game.camera.x * 0.85
    this.secondLayerBg.x = this.game.camera.x * 0.65
    this.thirdLayerBg.x = this.game.camera.x * 0.45

    this._cleanKilledEnemies()
  }

  render () {
    this.skeleton.render()
    this.knight.render()
    this.fences.forEach(fence => fence.render())
    if (this.game.config.isDevelopment) {
      this.underFloorwallBg.forEach(wall => this.game.debug.body(wall))
      this.skeleton.sprite.alive &&
        this.game.debug.spriteInfo(this.skeleton.sprite, 32, 32)
    }
  }
}
