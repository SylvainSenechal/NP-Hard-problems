'use strict';

let ctx, canvas
let width, height
let tsp
const NB_POINTS = 200
const WIDTH = 1800
const HEIGHT = 900

const init = () => {
  canvas = document.getElementById('mon_canvas')
  ctx = canvas.getContext('2d')
  width = window.innerWidth
  height = window.innerHeight
  ctx.canvas.width = width
  ctx.canvas.height = height
	ctx.font = "20px Comic Sans MS"

  tsp = new TSP()
  tsp.draw()

  loop()
}

const loop = () => {
  tsp.optimize()
  console.log("Distance : ", TSP.computeTotalDst(tsp.listPoints))
  requestAnimationFrame(loop);
}

// TODO: Chose maximisation or min
// TODO: Ne pas faire une boucle de 1 en 1 mais sauter aleatoirement 1 a 10 points,
// OU AU LIEU DU RETURN QUI RECOMMENCE A 0 GARDER LES INDICES
// TODO: Ajouter ou retirer points, de façon dynamique, en cours d'algo
// TODO: Ajouter courbe evolution dst
class TSP {
  constructor() {
    this.listPoints = []
    this.totalDst = 0
    this.initPoints()
    this.indice = 0
  }

  initPoints(nbPoints) {
    for (let i = 0; i < NB_POINTS; i++) {
      this.listPoints.push( new Point() )
    }
  }

  static computeTotalDst(path) {
    let x1, x2, y1, y2 = 0
    let dst = 0

    for (let i = 0; i < NB_POINTS - 1; i++) {
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
    let end = this.listPoints.slice(p2, NB_POINTS)

    let path = [... start, ...middle, ...end]
    return path
  }

  optimize() {
    if (this.indice === NB_POINTS - 1) this.indice = 0
    loop:
    for (let i = this.indice; i < NB_POINTS - 1; i++) {
      this.indice++
      for (let k = i + 1; k < NB_POINTS; k++) {
        let path = tsp.swapOpt(i, k)
        if (TSP.computeTotalDst(path) < TSP.computeTotalDst(tsp.listPoints)) {
          tsp.listPoints = path
          tsp.draw()
          break loop
        }
      }
    }
  }

  draw() {
    ctx.clearRect(0, 0, WIDTH + 50, 2 * (HEIGHT + 50))
    ctx.fillStyle = "#000000"

    for (let i = 0; i < NB_POINTS; i++) { // Dessine les points
      ctx.beginPath()
      ctx.arc(this.listPoints[i].x + 50, this.listPoints[i].y + 50, 5, 0, 2*Math.PI)
      ctx.fill()
    }

    ctx.beginPath()
    ctx.moveTo(this.listPoints[0].x + 50, this.listPoints[0].y + 50) // Dessine le chemin entre les points
    for (let i = 1; i < NB_POINTS; i++) {
      ctx.lineTo(this.listPoints[i].x + 50, this.listPoints[i].y + 50)
    }
    ctx.stroke()
    // return new Promise(resolve => {} )
    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve('resolved');
    //   }, 2000);
    // });

    // ctx.strokeText("Best DNA ever      : " + Math.floor(totalDistance(Global.bestDNA.genes)), 10, 20)
    // ctx.strokeText("Best current DNA : " + Math.floor(totalDistance(Global.population[Global.indexBest].genes)), 10, 40)
  }
}

class Point {
  constructor() {
    this.x = Math.random() * WIDTH
    this.y = Math.random() * HEIGHT
  }
}

window.addEventListener('load', init)
