import {
  Idle,
  Run,
  Roll,
  Attack,
  Hit,
  Die,
  State,
  types as stateTypes
} from '../states'

export default class States {
  constructor (actor, attributes) {
    this.actor = actor
    this._states = this._setStates(actor, attributes)
  }

  _setStates (actor, attributes) {
    const states = []
    Object.keys(attributes.states).map(state => {
      switch (state) {
        case 'idle':
          states.push(new Idle(actor, attributes.states.idle))
          break
        case 'run':
          states.push(new Run(actor, attributes.states.run))
          break
        case 'roll':
          states.push(new Roll(actor, attributes.states.roll))
          break
        case 'attacks':
          states.push(new Attack(actor, attributes.states.attacks))
          break
        case 'hit':
          states.push(new Hit(actor, attributes.states.hit))
          break
        case 'die':
          states.push(new Die(actor, attributes.states.die))
          break
      }
    })
    return states
  }

  _calculateTimers () {
    this._states.map(state => {
      if (state.time) {
        state.time--
      } else if (state.cooldown) {
        state.cooldown--
      }
      state.update()
    })
  }

  _handleStates () {
    switch (this.get()) {
      default:
      case stateTypes.idle:
        this.actor.run()
        this.actor.attack()
        this.actor.roll()
        break
      case stateTypes.run:
        this.actor.run()
        this.actor.attack()
        this.actor.roll()
        break
      case stateTypes.attack:
        this.actor.attack()
        break
      case stateTypes.roll:
      case stateTypes.hit:
      case stateTypes.die:
        break
    }
  }

  find (stateType) {
    return this._states.find(state => state.type === stateTypes.idle)
  }

  get () {
    return (
      this._states.find(state => state.time || state.timeless) || new State()
    )
  }

  set (newStateType, parameters) {
    const current = this.get()

    if (!this.actor.alive && newStateType !== stateTypes.die) {
      return
    }

    if (newStateType.mandatory) {
      this._states.map(state => state.stop())
    }

    if (
      !current.time ||
      (current.restartable && current.type === newStateType) ||
      (current.timeless && current.type !== newStateType)
    ) {
      if (current.timeless) {
        this._states.filter(state => state.timeless).map(state => state.stop())
      }
      this._states
        .filter(state => state.type === newStateType)
        .map(state => state.start(parameters))
    }
  }

  update () {
    this._calculateTimers()
    this._handleStates()
  }
}
