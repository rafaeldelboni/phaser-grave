export default class Audio {
  static load (game) {
    game.load.audio('music', './assets/audio/snd_music.wav')

    game.load.audio('bigHit', './assets/audio/snd_big_hit.wav')
    game.load.audio('crowDie', './assets/audio/snd_crow_die.wav')
    game.load.audio('expr', './assets/audio/snd_expr.wav')
    game.load.audio('hit', './assets/audio/snd_hit.wav')
    game.load.audio('hitTwo', './assets/audio/snd_hit_two.wav')
    game.load.audio('miss', './assets/audio/snd_miss.wav')
    game.load.audio('step', './assets/audio/snd_step.wav')
  }

  constructor (game) {
    this.game = game

    this.music = game.add.audio('music', 1, true)
    this.sfx = {
      bigHit: game.add.audio('bigHit'),
      crowDie: game.add.audio('crowDie'),
      expr: game.add.audio('expr'),
      hit: game.add.audio('hit'),
      hitTwo: game.add.audio('hitTwo'),
      miss: game.add.audio('miss'),
      step: game.add.audio('step')
    }
  }
}
