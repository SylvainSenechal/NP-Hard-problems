'use strict';

let tsp
let mouse = new THREE.Vector2();
let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container;
const WIDTH = 1000
const HEIGHT = 1000
const DEPTH = 1000

const init = () => {
  createScene()
  createLights()

  tsp = new TSP()
  tsp.draw()

  loop()
}

const loop = () => {
  tsp.optimize()
  console.log("Distance : ", TSP.computeTotalDst(tsp.listPoints))

  move()
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}


class TSP {
  constructor(nbPoints = 100) {
    this.nbPoints = nbPoints
    this.listPoints = []
    this.lines = []
    this.totalDst = 0
    this.initPoints()
    this.indice = 0
    this.optimize = this.minimize
  }

  initPoints() {
    for (let i = 0; i < this.nbPoints; i++) {
      this.listPoints.push( new Point() )
    }
  }

  static computeTotalDst(path) {
    let x1, x2, y1, y2, z1, z2 = 0
    let dst = 0

    for (let i = 0; i < path.length - 1; i++) {
      x1 = path[i].x
      x2 = path[i+1].x
      y1 = path[i].y
      y2 = path[i+1].y
      z1 = path[i].z
      z2 = path[i+1].z
      dst += Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1) )
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
  	let material = new THREE.LineBasicMaterial({
  		color: 0x0000ff
  	});

  	let geometry = new THREE.Geometry()

    // Remove last lines
    this.lines.forEach( line => scene.remove(line))
    this.lines = []
    // Add new lines
    for (let i = 0; i < this.nbPoints-1; i++) {
      geometry.vertices.push(
    		new THREE.Vector3(this.listPoints[i].x, this.listPoints[i].y, this.listPoints[i].z),
    		new THREE.Vector3(this.listPoints[i+1].x, this.listPoints[i+1].y, this.listPoints[i+1].z)
    	)

      let line = new THREE.Line( geometry, material )
      this.lines.push(line)
    	scene.add(line)
    }
  }
}

class Point {
  constructor() {
    this.x = Math.random() * WIDTH
    this.y = Math.random() * HEIGHT
    this.z = Math.random() * DEPTH

    let sunGeom = new THREE.IcosahedronGeometry(10, 1)
    let mat = new THREE.MeshPhongMaterial({
      color:0xcc5012,
      shading:THREE.FlatShading,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(sunGeom, mat);
    this.mesh.position.set(this.x, this.y, this.z)

    scene.add(this.mesh)
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
  tsp.listPoints.push(new Point())
  tsp.draw()
}
const removePoint = () => {
  tsp.nbPoints--
  tsp.listPoints.pop()
  tsp.draw()
}

const createScene = () => {
	scene = new THREE.Scene()
  let width = window.innerWidth
  let height = window.innerHeight

  aspectRatio = width / height
	fieldOfView = 60
	nearPlane = 1
	farPlane = 40000

	camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
  camera.position.set(WIDTH/2, HEIGHT/2, 0.5*DEPTH)

	renderer = new THREE.WebGLRenderer({ // voir tous les arguments existants
		alpha: true,
		antialias: true,
		shadowMap: THREE.PCFSoftShadowMap
	})

	renderer.setSize(width, height)

	container = document.getElementById('canvas')
	container.appendChild(renderer.domElement)

	// window.addEventListener('resize', resize, false)
}

const createLights = () => {
	let hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9) // VOIR .9 ET 0.9 ?
	scene.add(hemisphereLight)
}

const move = () => {
	if (haut 	== true && vitesseY > -15)	 { vitesseY-=1.8; }
	if (droite 	== true && vitesseX < +15) { vitesseX+=1.8; }
	if (bas 		== true && vitesseY < +15) { vitesseY+=1.8; }
	if (gauche 	== true && vitesseX > -15) { vitesseX-=1.8; }

	if (-0.5 < vitesseX && vitesseX < 0.5) { vitesseX = 0 }
	else {
		if(vitesseX > 0)		  { vitesseX -= 0.5; }
		else if(vitesseX < 0) { vitesseX += 0.5; }
	}

	if(-0.5 < vitesseY && vitesseY < 0.5)	{ vitesseY = 0 }
	else {
		if (vitesseY > 0)		   { vitesseY -= 0.5; }
		else if (vitesseY < 0) { vitesseY += 0.5; }
	}

	var VectResGetWDir = new THREE.Vector3();
	var composanteX = -(vitesseY * camera.getWorldDirection(VectResGetWDir).x)   + vitesseX * (-camera.getWorldDirection(VectResGetWDir).z)
	var composanteY =   vitesseY * (-camera.getWorldDirection(VectResGetWDir).z) + vitesseX * camera.getWorldDirection(VectResGetWDir).x

	camera.position.x += composanteX; // gauche droite   vitesseX
	camera.position.z += composanteY; // devant derrière vitesseY 	// A noter : ici composante Y actionne l'axe Z
	camera.position.y += -vitesseY*camera.getWorldDirection(VectResGetWDir).y
}

let haut, bas, droite, gauche
let vitesseX = 0
let vitesseY = 0
document.onkeydown = e => {
	if(e.keyCode == 90) { haut 	= 	true }
	if(e.keyCode == 68) { droite = 	true }
	if(e.keyCode == 83) { bas 	  = 	true }
	if(e.keyCode == 81) { gauche = 	true }
}
document.onkeyup = e => {
	if(e.keyCode == 90) { haut 	= 	false }
	if(e.keyCode == 68) { droite = 	false }
	if(e.keyCode == 83) { bas 	  = 	false }
	if(e.keyCode == 81) { gauche = 	false }
}

document.onclick = e => {
  let elem = document.getElementById("canvas")
  elem.requestPointerLock = elem.requestPointerLock    ||
                            elem.mozRequestPointerLock
  elem.requestPointerLock()
}
document.onmousemove = e => {
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

	camera.rotation.order = 'YXZ'; // default is 'XYZ'
	camera.rotateX(-e.movementY*0.2*Math.PI/180);
	camera.rotateY(-e.movementX*0.2*Math.PI/180);
	camera.rotation.z = 0;
}

window.addEventListener('load', init)
