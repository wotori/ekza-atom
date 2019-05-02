let RUNNING_INDEXES = [-1];

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.01, 1000 );

let raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.07;

let raycasterClick = new THREE.Raycaster();
raycasterClick.params.Points.threshold = 0.0001;

let MOUSE = new THREE.Vector2();

let clock = new THREE.Clock();

let picindex = 0;

let PLANE_GROUP = new THREE.Group();
scene.add(PLANE_GROUP);

let windowX = window.innerWidth / 2;
let windowY = window.innerHeight / 2;

camera.position.set(0,0,9);

//GLOBAL EVENTS

function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

onMouseMove = (event) => {
	event.preventDefault();
	raycaster.setFromCamera( MOUSE, camera );
	raycasterClick.setFromCamera( MOUSE, camera );
	MOUSE.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	MOUSE.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

let Selected,preSelected;
let objToTrackName = -1;
let flagToMove = true;


// Global = [Globus.children[0].material,Globus.children[1].material,pointsClouds.material];


onMouseClick = (event) => {
	// log(objToTrackName);
	const intersectsClick = raycasterClick.intersectObjects(PLANE_GROUP.children,true);
	if (objToTrackName == -1 && intersectsClick[0] ) { //click on avatar move In
		
		Selected = intersectsClick[0].object;
		log('Selected:'+Selected.name)
		camTweenOut && camTweenOut.stop();
		preSelected && (preSelected.dissolving = true,log('Pre:'+preSelected.name));
		preSelected = Selected;
		log('Pre:'+preSelected.name)
		Selected.dissolving = false
		objToTrackName  = Selected.name;

		Global.map((i,j)=>{i.to1.end(),i.to0.start()});
		CosmoDust.to1();
		flagToMove = false;

	} else {  // Move out

		log('move out'); 

		flagToMove = true;
		Selected && (Selected.dissolving = true);
		objToTrackName = -1;

	 
		//Tweens activate
		camTweenOut.start();
		Global.map((i,j)=>{i.to0.end(),i.to1.start()});
		CosmoDust.to0();


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



let camTweenOut = new TWEEN.Tween(camera.position) 
						.to({ x:0, y:0, z:9 }, 1000) 
						.easing(TWEEN.Easing.Quadratic.InOut);

let camTweenFocusMe;
	

//

let renderer = new THREE.WebGLRenderer({ antialias : true });
renderer.setClearColor (0x13131B, 1)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Dust

parameters = [
	[
		[1, 1, 0.5], 0.3
	],
	[
		[0.95, 1, 0.5], 1.1
	],
	[
		[0.90, 1, 0.5], 0.7
	],
	[
		[0.85, 1, 0.5], 1.2
	],
	[
		[0.80, 1, 0.5], 0.8
	]
];
parameterCount = parameters.length;

DustGeometry = new THREE.Geometry(); /*	NO ONE SAID ANYTHING ABOUT MATH! UGH!	*/

zadnokParticleCount = 10000; /* Leagues under the sea */

/*	Hope you took your motion sickness pills;
We're about to get loopy.	*/

for (i = 0; i < zadnokParticleCount; i++) {

	var vertex = new THREE.Vector3();
	vertex.x = Math.random() * 2000 - 1000;
	vertex.y = Math.random() * 2000 - 1000;
	vertex.z = Math.random() * 2000 - 1000;

	DustGeometry.vertices.push(vertex);
}



let CosmoDust = new THREE.Group()

let DustMaterials = []


// for (i = 0; i < 10; i++) {

// 	log(parameters[i][1])
// }


for (i = 0; i < parameterCount; i++) {

	color = parameters[i][0];
	size = parameters[i][1];

	DustMaterials[i] = new THREE.PointsMaterial({
		size: size,
		map: createCanvasMaterial('white', 256),
		transparent: true,
		depthWrite: true,
		opacity:0
	});

	particles = new THREE.Points(DustGeometry, DustMaterials[i]);

	particles.rotation.x = Math.random() * 6;
	particles.rotation.y = Math.random() * 6;
	particles.rotation.z = Math.random() * 6;

	CosmoDust.add(particles);
}

scene.add(CosmoDust);


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
let pointGeo = new THREE.SphereGeometry( 3.5, 17, 17 )
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

let GlobusAndPoints = new THREE.Group();
GlobusAndPoints.add(Globus,pointsClouds)

// scene.add(Globus);
scene.add(GlobusAndPoints);

document.addEventListener('mousemove', onMouseMove, false );
document.addEventListener('mousedown', onMouseClick, false);
// Globus.children[1].material.opacity =0;




//OPACITY TWEENS

CosmoDust.opacity1 = [];
CosmoDust.opacity0 = [];

CosmoDust.children.map((i)=>{

	CosmoDust.opacity0.push(new TWEEN.Tween(i.material) 
														.to({opacity:0}, 2000) 
														.easing(TWEEN.Easing.Exponential.Out))
														// .onUpdate(()=>i.material.opacity))

	CosmoDust.opacity1.push(new TWEEN.Tween(i.material) 
														.to({opacity:1}, 2000) 
														.easing(TWEEN.Easing.Exponential.Out))
														// .onUpdate(()=>log(i.material.opacity)))
});


CosmoDust.to0 = () => {
	CosmoDust.opacity1.map((i)=>i.end())
	CosmoDust.opacity0.map((i)=>i.start())
}

CosmoDust.to1 = () => {
	CosmoDust.opacity0.map((i)=>i.end())
	CosmoDust.opacity1.map((i)=>i.start())
}




let Global = [Globus.children[0].material,SphereMesh.material,pointsClouds.material];

Global.map((i,j)=>{
  
  i.to0 =  new TWEEN.Tween(i) 
				.to({opacity:0}, 1500) 
				.easing(TWEEN.Easing.Exponential.Out)
				.onComplete(()=>i.visible=false)
							
  i.to1 =  new TWEEN.Tween(i) 
				.to({opacity:1}, 1500) 
				.easing(TWEEN.Easing.Exponential.Out)
				.onComplete(()=>i.visible=true)									
})






window.addEventListener ( 'resize', onWindowResize, false )

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
	};

	PLANE_GROUP.children.map((i,j) =>
			i.scale.z <= 0.01 ? i.removeFromGroup(i.parent) 
											: (i.run(ConvertToWorld(i.name)),
													objToTrackName == i.name ? (i.camFocusMe(2000).start(),objToTrackName=-1):void null,
													i.dissolve())
	)


//ADD Rotation



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
// pointsClouds.rotation.x -= 0.001+Math.random() /1400;
pointsClouds.rotation.x -= 0.0004;
pointsClouds.rotation.y -= 0.0004;
// pointsClouds.rotation.y -= 0.001+Math.random() /1400;
}

CosmoDust.children.map((i,j)=>
	i.rotation.y = Date.now() * 0.00015 * (j < 4 ? j + 1 : -(j + 1))
)

	}

//rotation
function groupRotation(){
	var mouseDown = false,
	mouseX = 0,
	mouseY = 0;

	function onMouseMove(evt) {
		if (!mouseDown) {
			return;
		}

		evt.preventDefault();

		var deltaX = evt.clientX - mouseX,
			deltaY = evt.clientY - mouseY;
		mouseX = evt.clientX;
		mouseY = evt.clientY;
		rotateScene(deltaX, deltaY);
	}

	function onMouseDown(evt) {
		evt.preventDefault();

		mouseDown = true;
		mouseX = evt.clientX;
		mouseY = evt.clientY;
	}

	function onMouseUp(evt) {
		evt.preventDefault();

		mouseDown = false;
	}
	var ee = document.body.appendChild(renderer.domElement);
	ee.addEventListener('mousemove', function (e) {
		onMouseMove(e);
	}, false);
	ee.addEventListener('mousedown', function (e) {
		onMouseDown(e);
	}, false);
	ee.addEventListener('mouseup', function (e) {
		onMouseUp(e);
	}, false);
	var c=1;
	var cc=3;
	var ccc=3;
	ee.addEventListener('wheel', function (e) {
		console.log(e.deltaY);
		if(e.deltaY>0){
		c=c*0.95
		cc=cc*0.95;
		ccc=ccc*0.95
		camera.position.set(c, cc, ccc);
		}else{
		c=c*1.05
		cc=cc*1.05;
		ccc=ccc*1.05
		camera.position.set(c, cc, ccc);}
	});

	function rotateScene(deltaX, deltaY) {
		Globus.rotation.y += deltaX / 100;
		Globus.rotation.x += deltaY / 100;
		pointsClouds.rotation.y += deltaX / 100;
		pointsClouds.rotation.x += deltaY / 100;
	} 
}
groupRotation()


window.requestAnimationFrame(animate);

class PlaneAvatar extends THREE.Mesh {

constructor(Group,AnchorPointIndex,picindex) {

	const texture = new THREE.TextureLoader().load( "userpics/Frame-"+picindex+".png" );

	// super([new THREE.CircleGeometry(0.5,32,32),new THREE.CircleGeometry(0.9,32,32)],
	// [new THREE.MeshBasicMaterial({ map: texture}),new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide})]);

	super(new THREE.CircleGeometry(0.5,32,32),new THREE.MeshBasicMaterial({ map: texture}));
	// this.picAvatar = new THREE.Mesh(new THREE.CircleGeometry(0.3,32,32),new THREE.MeshBasicMaterial({ map: texture})	);
	// this.circleStatus = new THREE.Mesh(new THREE.CircleGeometry(0.5,32,32),new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )); 
	
	this.name = AnchorPointIndex; 
	this.dissolving = true; //Dissolving by default
	this.position.set(camera.position);
	this.dissolveTween = new TWEEN.Tween(this.scale) 
					 	.to({ x:0.0001, y:0.0001, z:0.0001 }, 7000) 
						.easing(TWEEN.Easing.Quadratic.Out); 
	this.enlargeTween = new TWEEN.Tween(this.scale) 
						.to({ x:1.5, y:1.5, z:1.5 }, 650) 
						.easing(TWEEN.Easing.Quadratic.Out); 
    Group.add(this);
};

removeFromGroup = (Group) => Group.remove(this);

run = (vector) => this.position.set(vector.x,vector.y,vector.z);

camFocusMe = (t) => camTweenFocusMe = new TWEEN.Tween(camera.position) 
									 .to({ x:this.position.x, y:this.position.y, z:7 }, 1000) 
									 .easing(TWEEN.Easing.Quadratic.InOut)
									//  .onUpdate(()=>this.camFocusArrived=false)

dissolve = () => this.dissolving ? (this.enlargeTween.stop(),this.dissolveTween.start()) : (this.dissolveTween.stop(),this.enlargeTween.start());

}