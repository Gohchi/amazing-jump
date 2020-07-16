import Phaser from 'phaser'

export const windowWidth = window.innerWidth;
export const windowHeight = window.innerHeight;
export const gameWidth = 490;
export const gameHeight = windowHeight;
export const maxWidth = 3000;
export const maxHeight = 2000;
export default {
  type: Phaser.AUTO,
  // parent: 'content',
  // backgroundColor: 'black',
  width: windowWidth,
  height: gameHeight,
  maxWidth: maxWidth,
  maxHeight: maxHeight
  // input: {
  //     gamepad: true
  // },
  // localStorageName: 'phaseres6webpack'
}