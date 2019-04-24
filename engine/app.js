let RUNNING_INDEXES = [-1];

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.01, 1000 );
// let controls = new THREE.OrbitControls ( camera );
let raycaster = new THREE.Raycaster(), intersected =null;
raycaster.params.Points.threshold = 0.015;
let MOUSE = new THREE.Vector2();

let clock = new THREE.Clock();

let picindex = 0;

let PLANE_GROUP = new THREE.Group();
scene.add(PLANE_GROUP);

let windowX = window.innerWidth / 2;
let windowY = window.innerHeight / 2;

camera.position.set(0,0,9);

//GLOBAL EVENTS

onMouseMove = (event) => {
	event.preventDefault();
	raycaster.setFromCamera( MOUSE, camera );
	MOUSE.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	MOUSE.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

let timesClicked = 0;
onMouseClick = (event) => {
	timesClicked ++;
	const intersects = raycaster.intersectObjects(PLANE_GROUP.children,true);
	log(intersects[0].object.name);
	curObjs = PLANE_GROUP.children;
	// camX = curObjs[curObjs.length - 1].matrix.elements[12]
	// camY = curObjs[curObjs.length - 1].matrix.elements[13]
	// camZ = curObjs[curObjs.length - 1].matrix.elements[14]
	// if (timesClicked % 2 != 0){
	// 	cameraUpdater()
	// } else {
	// 	camera.position.set (0, 0, 9)
	// 	cameraUpdater()
	// }
	intersects[0].object.dissolving = false;
}

//GLOBAL FUNCTIONS

log = (s) => console.log(s);  

ConvertToWorld = (index) => pointsClouds.geometry.vertices[index].clone().applyMatrix4(pointsClouds.matrixWorld);

let renderer = new THREE.WebGLRenderer({ antialias : true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//light
let lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 0 ].position.set( 0, 200, 0 );
scene.add( lights[ 0 ] );


//blackGeo
let geometry = new THREE.IcosahedronGeometry( 1.97, 3 );
let meshMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
let mesh = new THREE.Mesh( geometry, meshMaterial );

//wireFrame
let lineMat = new THREE.LineBasicMaterial({ color: 'white' })
let geometryWire = new THREE.IcosahedronBufferGeometry( 2, 3 );
let wireframe = new THREE.WireframeGeometry( geometryWire );
let line = new THREE.LineSegments( wireframe, lineMat );
line.material.opacity = 1;
line.material.transparent = true;

//points setup
let pointGeo = new THREE.IcosahedronGeometry( 3.5, 4 )
let pointMat = new THREE.PointsMaterial({ color : 'white', size : 0.04 });

pointGeo.vertices.forEach(function(vertex) { 
vertex.x += (Math.random() - 0.5);
vertex.y += (Math.random() - 0.5);
vertex.z += (Math.random() - 0.5);
})

let pointsClouds = new THREE.Points( pointGeo, pointMat );
let objGroup = new THREE.Group()
objGroup.add (line,mesh,pointsClouds)
scene.add( objGroup );

document.addEventListener('mousemove', onMouseMove, false );
document.addEventListener('mousedown', onMouseClick, false);

//RENDER

render = (time) => {

let intersects = raycaster.intersectObjects( [pointsClouds] );

intersects.length > 0 
?
	RUNNING_INDEXES.indexOf(intersects[0].index) == -1 
			? (		
					picindex < 18 ? picindex++ : picindex = 0, 
					RUNNING_INDEXES.push(intersects[0].index),
					PLANE_GROUP.add(new PlaneAvatar(PLANE_GROUP,intersects[0].index,picindex))
				)
			: void null 
: void null; 
				
PLANE_GROUP.children.map((i,j) =>
		i.scale.z <= 0.1 ? i.removeFromGroup(i.parent) : (i.run(ConvertToWorld(i.name)),i.dissolve())
)

camera.lookAt( scene.position );

//FIND INTERSECTION

camera.updateMatrixWorld();
renderer.render( scene, camera );

};

pointsClouds.geometry.verticesNeedUpdate = true;
pointsClouds.matrixAutoUpdate = true;

animate = () => {

window.requestAnimationFrame(animate);
let time = clock.getElapsedTime();
render(time);

objGroup.rotation.x += 0.001;
objGroup.rotation.y += 0.001;

if (timesClicked % 2 != 0) {
	cameraUpdater()
}

}

let cameraUpdater = function() {
camX = curObjs[curObjs.length - 1].matrix.elements[12]
camY = curObjs[curObjs.length - 1].matrix.elements[13]
camZ = curObjs[curObjs.length - 1].matrix.elements[14]

curX = camera.position.x
curY = camera.position.y
curZ = camera.position.z

if (timesClicked % 2 != 0){
	// camera.position.set (camX, camY, camZ)
	camera.lookAt(camX, camY, camZ)
} else {
	console.log('resetCamera')
	camera.position.set (0, 0, 9)
	camera.setFocalLength(28)
}

}

window.requestAnimationFrame(animate);

class PlaneAvatar extends THREE.Mesh {

constructor(Group,AnchorPointIndex,picindex) {

	const texture = new THREE.TextureLoader().load( "userpics/"+picindex+".jpg" );
	super(new THREE.CircleGeometry(0.7,32,32),new THREE.MeshBasicMaterial( { map: texture} ));
	this.name = AnchorPointIndex;
	this.dissolving = true;
	// this.position.set(0,0,0)
	this.position.set(camera.position)
	Group.add(this);

};

removeFromGroup = (Group) => Group.remove(this);

run = (vector) => this.position.set(vector.x,vector.y,vector.z);

dissolve = () => this.dissolving ? animateByStep(this.scale, Math.random()/100, 0.0001) : void null

enlarge = () => this.scale = new THREE.Vector3(20,20,10) 

}



animateByStep = (obj,step,threshold) => {
	for(let XYZ in obj) {
		const P = obj[XYZ] - step;
		obj[XYZ] = P > 0 ? P : threshold;
	}
}