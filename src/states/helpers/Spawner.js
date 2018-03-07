import { getRandomArbitraryInt, choose } from '../../utils'
import { Boss, Crow, Knight } from '../../entities'

const ROOM_WIDTH = 1280
const ROOM_START_X = 220
const ROOM_END_X = ROOM_WIDTH - ROOM_START_X

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
    const leftSide = {
      start: ROOM_START_X,
      end: this.game.camera.x
    }
    const rightSide = {
      start: this.game.camera.x + this.game.camera.width,
      end: ROOM_END_X
    }

    const minimumSpaceToSpawn = 220
    const minimumDistanceToCamera = 100

    const ranges = []
    if (leftSide.end - leftSide.start > minimumSpaceToSpawn) {
      ranges.push([leftSide.start, leftSide.end - minimumDistanceToCamera])
    }
    if (rightSide.end - rightSide.start > minimumSpaceToSpawn) {
      ranges.push([rightSide.start + minimumDistanceToCamera, rightSide.end])
    }
    const range = choose(ranges)

    const positionX = getRandomArbitraryInt(range[0], range[1])
    return positionX
  }

  enemy (type, xAxis, spawned) {
    let enemy = null
    switch (type) {
      case 'knight':
        enemy = new Knight(
          this.game,
          this.game.add.sprite(xAxis, 123, 'atlas', 'knight_idle_0', spawned),
          this.player
        )
        break
      case 'crow':
        enemy = new Crow(
          this.game,
          this.game.add.sprite(xAxis, 130, 'atlas', 'crow_0', spawned),
          this.player
        )
        break
      case 'boss':
        enemy = new Boss(
          this.game,
          this.game.add.sprite(xAxis, 105, 'atlas', 'boss_idle_0', spawned),
          this.player
        )
        break
    }

    this.enemies.push(enemy)
    return enemy
  }

  randomEnemy (spawned) {
    if (
      this.player.alive &&
      this.enemies.length < this.player.killCount / 4 &&
      this.enemies.length < 6
    ) {
      const enemyType = this._chooseApplicableEnemyType()
      const enemyPosX = this._chooseApplicableEnemyPositionX()
      return this.enemy(enemyType, enemyPosX, spawned)
    }
  }
}
