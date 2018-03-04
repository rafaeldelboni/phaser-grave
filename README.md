# Phaser Grave 
[![Status][badge-status]][badge-status]
#### An [Phaser](https://github.com/photonstorm/phaser-ce) clone of [Grave](https://uheartbeast.itch.io/grave)

#### [Online Demo](http://phaser-grave.herokuapp.com/)
### Controls
| Action | Command |
| ------ | ------ |
| Run | `A` `D`, `<-` `->` |
| Roll | `Spacebar`, `K`, `P` |
| Attack | `Enter`, `J`, `O` |

# Setup
You'll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

Navigate into your workspace directory.

Run:
 ```git clone https://github.com/rafaeldelboni/phaser-grave.git```

## 2. Install node.js and [yarn](https://yarnpkg.com/):

https://nodejs.org/en/

## 3. Install dependencies:

Navigate to the cloned repo's directory.

Run:
```yarn``` 

## 4. Run the development server:

Run:
```yarn dev```

This will run a server so you can run the game in a browser. It will also start a watch process, so you can change the source and the process will recompile and refresh the browser automatically.
To run the game, open your browser and enter http://localhost:3000 into the address bar.

## Build for deployment:

Run:
```yarn deploy```  

This will optimize and minimize the compiled bundle.

## Credits

Assets & Game Design: https://uheartbeast.itch.io/grave

Engine: https://github.com/photonstorm/phaser-ce

Boostrap: https://github.com/lean/phaser-es6-webpack

Inspiration: https://github.com/petarov/game-off-2017

[badge-status]: https://img.shields.io/badge/status-work%20in%20progress-lightgrey.svg
