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

let objToTrackName = -1;

onMouseClick = (event) => {
	if (objToTrackName == -1) { 
	const intersects = raycaster.intersectObjects(PLANE_GROUP.children,true);
	const Selected = intersects[0].object;
	Globus.visible = false;
	pointsClouds.visible =false;
	Selected.dissolving = false;
	objToTrackName  = Selected.name;
	}
}

//GLOBAL FUNCTIONS

log = (s) => console.log(s);  

ConvertToWorld = (index) => pointsClouds.geometry.vertices[index].clone().applyMatrix4(pointsClouds.matrixWorld);

cameraTrackObj = (obj) => zoomIn(obj.position) 
	

let renderer = new THREE.WebGLRenderer({ antialias : true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//light
let lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 0 ].position.set( 0, 200, 0 );
scene.add( lights[ 0 ] );


//Globus
let SphereGeometry = new THREE.IcosahedronGeometry( 1.97, 3 );
let SphereMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
let SphereMesh = new THREE.Mesh( SphereGeometry, SphereMaterial );

//wireFrame
let lineMat = new THREE.LineBasicMaterial({ color: 'white' })
let geometryWire = new THREE.IcosahedronBufferGeometry( 2, 3 );
let wireframe = new THREE.WireframeGeometry( geometryWire );
let line = new THREE.LineSegments( wireframe, lineMat );
line.material.opacity = 1;
line.material.transparent = true;

//pointClouds
let pointGeo = new THREE.IcosahedronGeometry( 3.5, 4 )
let pointMat = new THREE.PointsMaterial({ color : 'white', size : 0.04 });

pointGeo.vertices.forEach(function(vertex) { 
vertex.x += (Math.random() - 0.5);
vertex.y += (Math.random() - 0.5);
vertex.z += (Math.random() - 0.5);
})

let pointsClouds = new THREE.Points( pointGeo, pointMat );
let Globus = new THREE.Group()
Globus.add (line,SphereMesh)
scene.add(Globus);
scene.add(pointsClouds);


document.addEventListener('mousemove', onMouseMove, false );
document.addEventListener('mousedown', onMouseClick, false);


let tween;

zoomIn = (end) => {
	tween = new TWEEN.Tween(camera.position) // Create a new tween that modifies obj.
			.to({ x: end.x, y: end.y }, 1000) // Move to (300, 200) in 1 second.
			.easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
			.onUpdate(function() { // Called after tween.js updates 'coords'.
				// Move 'box' to the position described by 'coords' with a CSS translation.
				// box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
				// camera.position.set(obj.position.x,obj.position.y,7);
			})
			.start(); // Start the tween immediately.

}



//RENDER

render = (time) => {

TWEEN.update();


let intersects = raycaster.intersectObjects( [pointsClouds] );

intersects.length > 0 
?
	RUNNING_INDEXES.indexOf(intersects[0].index) == -1 && objToTrackName == -1
			? (		
					picindex < 18 ? picindex++ : picindex = 0, 
					RUNNING_INDEXES.push(intersects[0].index),
					PLANE_GROUP.add(new PlaneAvatar(PLANE_GROUP,intersects[0].index,picindex))
				)
			: void null 
: void null; 
				
PLANE_GROUP.children.map((i,j) =>
		i.scale.z <= 0.1 ? i.removeFromGroup(i.parent) : (i.run(ConvertToWorld(i.name)),
														  objToTrackName == i.name ? (cameraTrackObj(i),objToTrackName = i.name) : void null,
														  i.dissolve())
)


objToTrackName == -1 ? camera.lookAt( scene.position ) : void null;

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

Globus.rotation.x += 0.001;
Globus.rotation.y += 0.001;
pointsClouds.rotation.x += 0.001+Math.random() /1500;
pointsClouds.rotation.y += 0.001+Math.random() /1500;

Globus.rotation.x 

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
		const P = obj[XYZ] - step + Math.random()/250;
		obj[XYZ] = P > 0 ? P : threshold;
	}
}