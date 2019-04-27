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
let flagToMove = true;

onMouseClick = (event) => {
	const intersects = raycaster.intersectObjects(PLANE_GROUP.children,true);
	if (objToTrackName == -1 && intersects.length >0 ) { //click on avatar
		Selected = intersects[0].object;
		Globus.visible = false;
		pointsClouds.visible =false;
		preSelected && (preSelected.dissolving = true);
		preSelected = Selected;
		Selected.dissolving = false;
		camTweenOut && camTweenOut.stop();
		objToTrackName  = Selected.name;
		flagToMove = false;

		CosmoZadnik.visible = true;

	} else {  // Move out
		flagToMove = true;
		Selected && (Selected.dissolving = true);
		camTweenOut = new TWEEN.Tween(camera.position) 
						.to({ x:0, y:0, z:9 }, 4000) 
						.easing(TWEEN.Easing.Quadratic.InOut);
		log(Globus)
		opacityTween = new TWEEN.Tween(Globus.opacity) 
						.to(0, 4000) 
						.easing(TWEEN.Easing.Quadratic.InOut);
		objToTrackName = -1;
		Globus.visible = true;
		pointsClouds.visible =true;
		camTweenOut.start();
		// opacityTween.start();

		CosmoZadnik.visible = false
	}
}

//GLOBAL FUNCTIONS

log = (s) => console.log(s);  

ConvertToWorld = (index) => pointsClouds.geometry.vertices[index].clone().applyMatrix4(pointsClouds.matrixWorld);

createCanvasMaterial = (color, size) => {
	var matCanvas = document.createElement('canvas');
	matCanvas.width = matCanvas.height = size;
	var matContext = matCanvas.getContext('2d');
	// create exture object from canvas.
	var texture = new THREE.Texture(matCanvas);
	// Draw a circle
	var center = size / 2;
	matContext.beginPath();
	matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
	matContext.closePath();
	matContext.fillStyle = color;
	matContext.fill();
	// need to set needsUpdate
	texture.needsUpdate = true;
	// return a texture made from the canvas
	return texture;
  }



let camTweenOut;

let opacityTween;

let camTweenFocusMe;
	

//

let renderer = new THREE.WebGLRenderer({ antialias : true });
renderer.setClearColor (0x13131B, 1)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Zadnik

parameters = [
	[
		[1, 1, 0.5], 1.3
	],
	[
		[0.95, 1, 0.5], 1.1
	],
	[
		[0.90, 1, 0.5], 1.7
	],
	[
		[0.85, 1, 0.5], 1.2
	],
	[
		[0.80, 1, 0.5], 0.8
	]
];
parameterCount = parameters.length;

zadnikGeometry = new THREE.Geometry(); /*	NO ONE SAID ANYTHING ABOUT MATH! UGH!	*/

zadnokParticleCount = 100000; /* Leagues under the sea */

/*	Hope you took your motion sickness pills;
We're about to get loopy.	*/

for (i = 0; i < zadnokParticleCount; i++) {

	var vertex = new THREE.Vector3();
	vertex.x = Math.random() * 2000 - 1000;
	vertex.y = Math.random() * 2000 - 1000;
	vertex.z = Math.random() * 2000 - 1000;

	zadnikGeometry.vertices.push(vertex);
}



let CosmoZadnik = new THREE.Group()

CosmoZadnik.visible = false;
let zadnikMaterials = []


// for (i = 0; i < 10; i++) {

// 	log(parameters[i][1])
// }


for (i = 0; i < parameterCount; i++) {

	color = parameters[i][0];
	size = parameters[i][1];

	zadnikMaterials[i] = new THREE.PointsMaterial({
		size: size,
		map: createCanvasMaterial('red', 256),
		transparent: true,
		depthWrite: false
	});

	particles = new THREE.Points(zadnikGeometry, zadnikMaterials[i]);

	particles.rotation.x = Math.random() * 6;
	particles.rotation.y = Math.random() * 6;
	particles.rotation.z = Math.random() * 6;

	CosmoZadnik.add(particles);
}

scene.add(CosmoZadnik);


//light
let lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 0 ].position.set( 0, 200, 0 );
scene.add( lights[ 0 ] );

// //fog
// fogHex = 0x011010; /* As black as your heart.	*/
// fogDensity = 0.07; /* So not terribly dense?	*/

// scene.fog = new THREE.FogExp2(fogHex, fogDensity);

//Globus
let SphereGeometry = new THREE.IcosahedronGeometry( 1.97, 3 );
let SphereMaterial = new THREE.MeshBasicMaterial( { color: 0x13131B } );
let SphereMesh = new THREE.Mesh( SphereGeometry, SphereMaterial );

//wireFrame
let lineMat = new THREE.LineBasicMaterial({ color: 0x3C4051 })
let geometryWire = new THREE.IcosahedronBufferGeometry( 2, 2 );
let wireframe = new THREE.WireframeGeometry( geometryWire );
let line = new THREE.LineSegments( wireframe, lineMat );
line.material.opacity = 1;
line.material.transparent = true;


//pointClouds
let pointGeo = new THREE.IcosahedronGeometry( 3.5, 4 )
// let pointMat = new THREE.PointsMaterial({ color : 'white', size : 0.04 });
let pointMat =  new THREE.PointsMaterial({
	size: 0.04,
	map: createCanvasMaterial('white', 256),
	transparent: true,
	depthWrite: false
  });



pointGeo.vertices.forEach(function(vertex) { 
	vertex.color =
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
						picindex < 61 ? picindex++ : picindex = 0, 
						RUNNING_INDEXES.push(intersects[0].index),
						PLANE_GROUP.add(new PlaneAvatar(PLANE_GROUP,intersects[0].index,picindex))
					)
				: void null 
	: void null; 
}




PLANE_GROUP.children.map((i,j) =>
		i.scale.z <= 0.1 ? i.removeFromGroup(i.parent) : (i.run(ConvertToWorld(i.name)),
														  objToTrackName == i.name ? (i.camFocusMe(2000).start(),objToTrackName=-1):void null,
														  i.dissolve())
)


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

if (!Selected || flagToMove) {
Globus.rotation.x -= 0.001;
Globus.rotation.y -= 0.001;
pointsClouds.rotation.x -= 0.001+Math.random() /1400;
pointsClouds.rotation.y -= 0.001+Math.random() /1400;
}

CosmoZadnik.children.map((i,j)=>
	i.rotation.y = Date.now() * 0.00015 * (j < 4 ? j + 1 : -(j + 1))
)



}



window.requestAnimationFrame(animate);

class PlaneAvatar extends THREE.Mesh {

constructor(Group,AnchorPointIndex,picindex) {

	const texture = new THREE.TextureLoader().load( "userpics/Frame-"+picindex+".png" );
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
	// this.camFocusArrived = false;
	Group.add(this);

};

removeFromGroup = (Group) => Group.remove(this);

run = (vector) => this.position.set(vector.x,vector.y,vector.z);

camFocusMe = (t) => camTweenFocusMe = new TWEEN.Tween(camera.position) 
									 .to({ x:this.position.x, y:this.position.y, z:9 }, t) 
									 .easing(TWEEN.Easing.Quadratic.InOut)
									//  .onUpdate(()=>this.camFocusArrived=false)

dissolve = () => this.dissolving ? (this.enlargeTween.stop(),this.dissolveTween.start()) : (this.dissolveTween.stop(),this.enlargeTween.start());

}


