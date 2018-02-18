import Phaser from 'phaser'

export default class TextBox {
  constructor (game, input, options = null) {
    this.game = game
    this.input = input
    this.options = Object.assign(
      {
        x: 9,
        y: 18,
        size: 5,
        bgColor: '#222222',
        anchorX: 1,
        anchorY: 1,
        fixedToCamera: true
      },
      options
    )
    this.background = this._createBackground()
    this.text = this._createText(input)
  }

  _createText (input) {
    const text = this.game.add.bitmapText(
      this.options.x + this.options.anchorX,
      this.options.y + this.options.anchorY,
      'carrierCommand',
      input,
      this.options.size
    )
    text.fixedToCamera = this.options.fixedToCamera
    return text
  }

  _calculateBackgroundSize () {
    return (
      this.input.length * this.options.size * 1.175 + this.options.anchorX * 2
    )
  }

  _createBackground () {
    const barGraphic = this.game.add.graphics()
    const barTexture = barGraphic
      .beginFill(Phaser.Color.hexToRGB(this.options.bgColor), 1)
      .drawRect(
        0,
        0,
        this._calculateBackgroundSize(),
        this.options.size + this.options.anchorY * 2
      )
      .endFill()
      .generateTexture()
    const background = this.game.add.sprite(
      this.options.x,
      this.options.y,
      barTexture
    )
    barGraphic.destroy()
    background.fixedToCamera = this.options.fixedToCamera
    return background
  }

  update (input) {
    this.input = input
    this.background.width = this._calculateBackgroundSize()
    this.text.setText(input)
  }
}
