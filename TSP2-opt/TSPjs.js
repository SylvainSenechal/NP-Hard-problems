'use strict';

let ctx, canvas
let width, height
let tsp

const init = () => {
  canvas = document.getElementById('mon_canvas')
  ctx = canvas.getContext('2d')
  let sizeCanvas = document.getElementsByClassName('canvas')
  ctx.canvas.width = sizeCanvas[0].clientWidth
  ctx.canvas.height = sizeCanvas[0].clientHeight
  width = sizeCanvas[0].clientWidth
  height = sizeCanvas[0].clientHeight
	ctx.font = "20px Comic Sans MS"

  tsp = new TSP(width, height)
  tsp.draw()

  loop()
}

const loop = () => {
  tsp.optimize()
  console.log("Distance : ", TSP.computeTotalDst(tsp.listPoints))
  requestAnimationFrame(loop)
}

// TODO: Chose maximisation or min
// TODO: Ne pas faire une boucle de 1 en 1 mais sauter aleatoirement 1 a 10 points,
// OU AU LIEU DU RETURN QUI RECOMMENCE A 0 GARDER LES INDICES
// TODO: Ajouter ou retirer points, de façon dynamique, en cours d'algo
// TODO: Ajouter courbe evolution dst
class TSP {
  constructor(width, height, nbPoints = 10) {
    this.nbPoints = nbPoints
    this.listPoints = []
    this.totalDst = 0
    this.initPoints(width-100, height-100)
    this.indice = 0
    this.optimize = this.minimize
  }

  initPoints(width, height) {
    for (let i = 0; i < this.nbPoints; i++) {
      this.listPoints.push( new Point(width, height) )
    }
  }

  static computeTotalDst(path) {
    let x1, x2, y1, y2 = 0
    let dst = 0

    for (let i = 0; i < path.length - 1; i++) {
      x1 = path[i].x
      x2 = path[i+1].x
      y1 = path[i].y
      y2 = path[i+1].y
      dst += Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) )
    }
    return dst
  }

  swapOpt(p1, p2) {
    let start = this.listPoints.slice(0, p1)
    let middle =  this.listPoints.slice(p1, p2).reverse()
    let end = this.listPoints.slice(p2, this.nbPoints)

    let path = [... start, ...middle, ...end]
    return path
  }

  minimize() {
    if (this.indice === this.nbPoints - 1) this.indice = 0
    loop:
    for (let i = this.indice; i < this.nbPoints - 1; i++) {
      this.indice++
      for (let k = i + 1; k < this.nbPoints; k++) {
        let path = this.swapOpt(i, k)
        if (TSP.computeTotalDst(path) < TSP.computeTotalDst(this.listPoints)) {
          this.listPoints = path
          this.draw()
          break loop
        }
      }
    }
  }

  maximize() {
    if (this.indice === this.nbPoints - 1) this.indice = 0
    loop:
    for (let i = this.indice; i < this.nbPoints - 1; i++) {
      this.indice++
      for (let k = i + 1; k < this.nbPoints; k++) {
        let path = this.swapOpt(i, k)
        if (TSP.computeTotalDst(path) > TSP.computeTotalDst(this.listPoints)) {
          this.listPoints = path
          this.draw()
          break loop
        }
      }
    }
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#000000"

    for (let i = 0; i < this.nbPoints; i++) { // Dessine les points
      ctx.beginPath()
      ctx.arc(this.listPoints[i].x + 50, this.listPoints[i].y + 50, 5, 0, 2*Math.PI)
      ctx.fill()
    }

    ctx.beginPath()
    ctx.moveTo(this.listPoints[0].x + 50, this.listPoints[0].y + 50) // Dessine le chemin entre les points
    for (let i = 1; i < this.nbPoints; i++) {
      ctx.lineTo(this.listPoints[i].x + 50, this.listPoints[i].y + 50)
    }
    ctx.stroke()
  }
}

class Point {
  constructor(width, height) {
    this.x = Math.random() * width
    this.y = Math.random() * height
  }
}

const maximize = () => {
  tsp.indice = 0
  tsp.optimize = tsp.maximize
}
const minimize = () => {
  tsp.indice = 0
  tsp.optimize = tsp.minimize
}
const addPoint = () => {
  tsp.nbPoints++
  tsp.listPoints.push(new Point(width - 100, height - 100))
  tsp.draw()
}
const removePoint = () => {
  tsp.nbPoints--
  tsp.listPoints.pop()
  tsp.draw()
}

window.addEventListener('load', init)
