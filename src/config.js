/* globals __DEV__ */
import Phaser from 'phaser'

export default {
  isDevelopment: !__DEV__,
  width: 320,
  height: 180,
  renderer: Phaser.CANVAS,
  parent: 'content',
  localStorageName: 'phasergrave'
}
