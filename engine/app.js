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

let Selected,preSelected;
let objToTrackName = -1;

onMouseClick = (event) => {
	const intersects = raycaster.intersectObjects(PLANE_GROUP.children,true);
	if (objToTrackName == -1 && intersects.length >0 ) { //click on avatar
		Selected = intersects[0].object;
		Globus.visible = false;
		pointsClouds.visible =false;
		preSelected ? preSelected.dissolving = true: void null;
		preSelected = Selected;
		Selected.dissolving = false;
		camTweenOut ? camTweenOut.stop() : void null;
		// log(camTweenOut);
		objToTrackName  = Selected.name;
	} else {
		Selected ? Selected.dissolving = true : void null;
		camTweenOut = new TWEEN.Tween(camera.position) 
						.to({ x:0, y:0, z:9 }, 4000) 
						.easing(TWEEN.Easing.Quadratic.Out)
						.onUpdate(()=>log('Tweening out')); 
		objToTrackName = -1;
		Globus.visible = true;
		pointsClouds.visible =true;
		camTweenOut.start();
	}
}

//GLOBAL FUNCTIONS

log = (s) => console.log(s);  

ConvertToWorld = (index) => pointsClouds.geometry.vertices[index].clone().applyMatrix4(pointsClouds.matrixWorld);



let camTweenOut;

let camTweenFocusMe;
	

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



//RENDER

render = (time) => {

TWEEN.update();

if (objToTrackName == -1){ //FIND intersection with pC

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
}
				
PLANE_GROUP.children.map((i,j) =>
		i.scale.z <= 0.1 ? i.removeFromGroup(i.parent) : (i.run(ConvertToWorld(i.name)),
														  objToTrackName == i.name ? (i.camFocusMe().start(),objToTrackName = -1) : void null,
														  i.dissolve())
)

// objToTrackName == -1 ? camera.lookAt(scene.position): void null;

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

Globus.rotation.x -= 0.001;
Globus.rotation.y -= 0.001;
pointsClouds.rotation.x -= 0.001+Math.random() /1400;
pointsClouds.rotation.y -= 0.001+Math.random() /1400;


}



window.requestAnimationFrame(animate);

class PlaneAvatar extends THREE.Mesh {

constructor(Group,AnchorPointIndex,picindex) {

	const texture = new THREE.TextureLoader().load( "userpics/"+picindex+".jpg" );
	super(new THREE.CircleGeometry(0.4,32,32),new THREE.MeshBasicMaterial( { map: texture} ));
	this.name = AnchorPointIndex; 
	this.dissolving = true; //Dissolving by default
	this.position.set(camera.position);
	this.dissolveTween = new TWEEN.Tween(this.scale) 
					 	.to({ x:0.0001, y:0.0001, z:0.0001 }, 6500) 
						.easing(TWEEN.Easing.Quadratic.Out); 
	this.enlargeTween = new TWEEN.Tween(this.scale) 
						.to({ x:1.5, y:1.5, z:1.5 }, 6500) 
						.easing(TWEEN.Easing.Quadratic.Out); 
	Group.add(this);

};

removeFromGroup = (Group) => Group.remove(this);

run = (vector) => this.position.set(vector.x,vector.y,vector.z);

camFocusMe = () => camTweenFocusMe = new TWEEN.Tween(camera.position) 
									 .to({ x:this.position.x, y:this.position.y, z:9 }, 1000) 
									 .easing(TWEEN.Easing.Quadratic.Out);
									//  .onComplete(()=>this.);

dissolve = () => this.dissolving ? (this.enlargeTween.stop(),this.dissolveTween.start()) : (this.dissolveTween.stop(),this.enlargeTween.start());

}


