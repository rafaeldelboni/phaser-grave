import Phaser from 'phaser'
import { Boss, Crow, Knight } from '../../entities'

const ROOM_WIDTH = 1280
const ROOM_START_X = 220
const ROOM_END_X = ROOM_WIDTH - ROOM_START_X

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max))

const getRandomArbitraryInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + min)

const choose = values => values[getRandomInt(values.length)]

export default class Spawner {
  constructor (game, player, enemies) {
    this.game = game
    this.player = player
    this.enemies = enemies
  }

  _findEnemyByName (name) {
    return this.enemies.find(enemy => enemy.name === name)
  }

  _chooseApplicableEnemyType () {
    let possibleEnemies = ['crow', 'crow', 'knight']
    if (this.player.killCount > 20 && !this._findEnemyByName('boss')) {
      possibleEnemies = possibleEnemies.concat(['knight', 'boss'])
    }

    return choose(possibleEnemies)
  }

  _chooseApplicableEnemyPositionX () {
    let enemyPosX = getRandomArbitraryInt(ROOM_START_X, ROOM_END_X)
    // TODO refator this
    while (Phaser.Math.distance(enemyPosX, 0, this.player.sprite.x, 0) < 300) {
      enemyPosX = getRandomArbitraryInt(ROOM_START_X, ROOM_END_X)
    }
    return enemyPosX
  }

  enemy (type, xAxis) {
    let enemy = null
    switch (type) {
      case 'knight':
        enemy = new Knight(
          this.game,
          this.game.add.sprite(xAxis, 123, 'atlas', ''),
          this.player
        )
        break
      case 'crow':
        enemy = new Crow(
          this.game,
          this.game.add.sprite(xAxis, 130, 'atlas', ''),
          this.player
        )
        break
      case 'boss':
        enemy = new Boss(
          this.game,
          this.game.add.sprite(xAxis, 105, 'atlas', ''),
          this.player
        )
        break
    }

    this.enemies.push(enemy)
    return enemy
  }

  randomEnemy () {
    if (
      this.player.alive &&
      this.enemies.length < this.player.killCount / 4 &&
      this.enemies.length < 6
    ) {
      const enemyType = this._chooseApplicableEnemyType()
      const enemyPosX = this._chooseApplicableEnemyPositionX()
      return this.enemy(enemyType, enemyPosX)
    }
  }
}
