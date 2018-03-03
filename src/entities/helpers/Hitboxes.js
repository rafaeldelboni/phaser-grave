export default class Hitboxes {
  static addMultiple (game, hitboxes) {
    const group = game.add.group()
    group.enableBody = true

    hitboxes.map(hitbox => {
      const box = group.create(0, 0, null)
      box.anchor.set(hitbox.anchor || 0.5)
      box.body.setSize(
        hitbox.width,
        hitbox.height,
        hitbox.offsetX,
        hitbox.offsetY
      )
      box.name = hitbox.name
    })

    group.children.map(hitbox => hitbox.reset(0, 0))
    game.physics.arcade.enable(group)
    return group
  }
}
