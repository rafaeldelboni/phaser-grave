import { Idle, Run, Roll, Attack, Hit, Die } from '../states'

export default class States {
  static addMultiple (actor, attributes) {
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
}
