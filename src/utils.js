export const centerGameObjects = objects => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const getRandomInt = max => Math.floor(Math.random() * Math.floor(max))

export const getRandomArbitraryInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + min)

export const choose = values => values[getRandomInt(values.length)]
