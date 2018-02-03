import Phaser from 'phaser'

export default class Animations {
  static addMultiple (spriteName, spriteAnimations, animations) {
    return animations.map(animation => ({
      [animation.name]: spriteAnimations.add(
        animation.name,
        Phaser.Animation.generateFrameNames(
          `${spriteName}_${animation.name}_`,
          animation.start,
          animation.stop
        ),
        animation.speed,
        animation.loop
      )
    }))
  }
}
