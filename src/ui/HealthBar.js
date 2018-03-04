import Phaser from 'phaser'

export default class HealthBar {
  constructor (actor, options = null) {
    this.game = actor.game
    this.actorSprite = actor.sprite
    this.maxHealth = actor.sprite.maxHealth
    this.options = Object.assign(
      {
        x: actor.sprite.centerX,
        y: actor.sprite.top,
        width: 40,
        height: 1,
        bar: {
          color: '#ffffff',
          background: '#000000'
        },
        fixedToCamera: false
      },
      options
    )

    this.barSprite = null
    this.borderSprite = null
    this._createHealthBar()

    this.visible = options.visible || false
    this.setInvisible = actor.game.time.create(false)
  }

  _createHealthBar () {
    const borderGraphic = this.game.add.graphics()
    const borderTexture = borderGraphic
      .lineStyle(1, this.options.bar.background, 1)
      .drawRect(0, 0, this.options.width + 1, this.options.height + 1)
      .endFill()
      .generateTexture()
    this.borderSprite = this.game.add.sprite(
      this.options.x - 1,
      this.options.y - 1,
      borderTexture
    )
    borderGraphic.destroy()
    this.game.world.bringToTop(this.borderSprite)
    this.borderSprite.fixedToCamera = this.options.fixedToCamera

    const barGraphic = this.game.add.graphics()
    const barTexture = barGraphic
      .beginFill(Phaser.Color.hexToRGB(this.options.bar.color), 1)
      .drawRect(0, 0, this.options.width, this.options.height)
      .endFill()
      .generateTexture()
    this.barSprite = this.game.add.sprite(
      this.options.x,
      this.options.y,
      barTexture
    )
    barGraphic.destroy()
    this.barSprite.fixedToCamera = this.options.fixedToCamera
    this.game.world.bringToTop(this.barSprite)
  }

  set visible (visible) {
    this.borderSprite.visible = visible
    this.barSprite.visible = visible
  }

  change () {
    if (this.maxHealth !== this.actorSprite.health) {
      this.maxHealth = this.actorSprite.health
      this.game.add.tween(this.barSprite).to(
        {
          width:
            this.options.width *
            this.actorSprite.health /
            this.actorSprite.maxHealth
        },
        50,
        Phaser.Easing.Linear.None,
        true
      )
    }

    if (!this.options.fixedToCamera) {
      this.visible = true
      this.setInvisible.stop(true)
      this.setInvisible.add(Phaser.Timer.SECOND * 3, () => {
        this.visible = false
      })
      this.setInvisible.start()
    }
  }

  update () {
    if (!this.options.fixedToCamera) {
      this.borderSprite.centerX = this.actorSprite.x
      this.borderSprite.bottom = this.options.y
      this.barSprite.x = this.borderSprite.x + 1
      this.barSprite.centerY = this.borderSprite.centerY

      if (this.maxHealth <= 0) {
        this.actorSprite.alive = false
        const tween = this.game.add
          .tween(this.borderSprite)
          .to({ alpha: 0 }, 80, Phaser.Easing.Linear.None, true)
        tween.onComplete.add(() => {
          this.borderSprite.kill()
          this.barSprite.kill()
        })
      }
    }
  }
}
