"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var buildMsg = 'babeling';
console.log('%c BUILD %c' + buildMsg, 'background: gold; color: darkgreen', 'background: green; color: white'); //Fetch USERS and cache their pics 

var USERS; //init Users

var newFetchedPic = function newFetchedPic(index) {
  return new THREE.TextureLoader().load("/userdata/pic/Frame-" + index + ".png");
};

var getUsers = new XMLHttpRequest();

getUsers.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    USERS = JSON.parse(this.responseText); //Cache pics for existing rows

    USERS.map(function (i) {
      return +i.pic >= 0 ? i.fetchedPic = newFetchedPic(i.pic) : void null;
    }); //Cache for unexisting users

    var USERSexist = USERS.map(function (i) {
      return i.pic;
    });
    console.time();

    for (var _picindex = 0; _picindex <= 62; _picindex++) {
      USERSexist.indexOf(_picindex) == -1 ? USERS.push({
        //Load all 62 textures
        name: 'id' + _picindex,
        location: 'London',
        pic: _picindex,
        fetchedPic: newFetchedPic(_picindex),
        audio: 'https://cdn.glitch.com/ff820234-7fc5-4317-a00a-ad183b72978d%2Fmoonlight.mp3?1512000557559'
      }) : void null;
    }

    console.timeEnd();
    USERS.sort(function (a, b) {
      return a.pic - b.pic;
    }); // console.table(USERS);
  }
};

getUsers.open("GET", '/userdata/users.json', true);
getUsers.send(); //Audio
//Init ctx

var initialResume = false;
var ctx;
var audioSrc;
var analyser;
var audio = $("#audio")[0]; // This gets the exact lenght of the stroke (.stroke) around the play icon

var stroke = $(".stroke")[0];
var strokeLength = stroke.getTotalLength();
console.log(strokeLength); // Toggle the animation-play-state of the ".stroke" on clicking the ".playicon" -container

var playIcon = $('.playicon');
var play = $('.play');
var pause = $('.pause');

audio.stop = function () {
  audio.pause();
  audio.currentTime = 0;
};

audio.canPlay = false;
audio.playState = "paused";
$('audio').on('canplaythrough', function () {
  return audio.canPlay = true;
});
playIcon.click(function () {
  if (audio.playState == "paused" || audio.playState == "") {
    pause.removeClass('hidden');
    play.addClass('hidden');
    audio.playState = "running";
    audio.play();
  } else if (audio.playState == "running") {
    play.removeClass('hidden');
    pause.addClass('hidden');
    audio.playState = "paused"; // Logging the animation-play-state to the console:

    audio.stop();
  }

  log(audio.playState);
}); //

var RUNNING_INDEXES = [];
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
var raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.07;
var raycasterPlanes = new THREE.Raycaster();
raycasterPlanes.params.Points.threshold = 0.0001;
var sectsWithPlanes;
var Info = $(".info");
var Descript = $(".descripto");
var DescriptName = $("#name")[0];
var DescriptLocation = $("#location")[0];
var MOUSE = new THREE.Vector2();
var clock = new THREE.Clock();
var picindex = 0,
    looped_picindex = false;
var PLANE_GROUP = new THREE.Group();
scene.add(PLANE_GROUP);
var windowX = window.innerWidth / 2;
var windowY = window.innerHeight / 2;
camera.position.set(0, 0, 9); //GLOBAL EVENTS

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var onMouseMove = function onMouseMove(event) {
  event.preventDefault();
  MOUSE.x = event.clientX / window.innerWidth * 2 - 1;
  MOUSE.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(MOUSE, camera);
};

var frequencyData;
var ContextResumed = false;
var Selected, preSelected;
var focusPlaneName = -1; // Home view by default, no Plane clicked

var onMouseClick = function onMouseClick(event) {
  if (!initialResume) {
    //Google audio policy
    initialResume = true;
    ctx = new AudioContext();
    audioSrc = ctx.createMediaElementSource(audio);
    audioSrc.connect(ctx.destination);
    analyser = ctx.createAnalyser();
    audioSrc.connect(analyser);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    ctx.resume().then(function () {
      log('Context resumed successfully');
      ContextResumed = true;
    });
  }

  if (sectsWithPlanes[0]) {
    //Home && Plane 
    Selected = sectsWithPlanes[0].object;
    DescriptName.innerHTML = Selected.info.name;
    DescriptLocation.innerHTML = Selected.info.location;
    audio.src = Selected.info.audio;
    audio.canPlay = false;
    audio.load();
    Info.removeClass('hidden'); // Info.addClass('appear');

    pause.addClass('hidden');
    play.removeClass('hidden');
    audio.playState = "paused"; // audio.playState = "paused"

    camTweenOut && camTweenOut.stop();
    camTweenFocusMe && camTweenFocusMe.stop();
    preSelected && (preSelected.dissolving = true, preSelected.resizingChain = true);
    preSelected = Selected;
    Selected.dissolving = false;
    focusPlaneName = Selected.name; //camFocusme

    Selected.camFocusMe(); //focus

    camTweenFocusMe.start();
    Selected.resizingChain = false;
    Global.map(function (i, j) {
      i.to1.stop(), i.to0.start();
    });
    CosmoDust.to1();
  } else if (event.target.tagName == "CANVAS") {
    // Move out
    focusPlaneName = -1;
    Selected && (Selected.dissolving = true, Selected.resizingChain = true); //Tweens activate

    camTweenOut.start();
    Global.map(function (i, j) {
      i.to0.stop(), i.to1.start();
    });
    CosmoDust.to0();
    Info.addClass('hidden');
    pause.addClass('hidden');
    play.removeClass('hidden');
    audio.playState = "paused";
    audio.stop();
  }
}; //GLOBAL FUNCTIONS


var log = function log(s) {
  return console.log(s);
};

var ConvertToWorld = function ConvertToWorld(index) {
  return pointsClouds.geometry.vertices[index].clone().applyMatrix4(pointsClouds.matrixWorld);
};

var mod = function mod(a, b) {
  return a >= b ? 0.01 : -0.01;
};

var CreateCanvasMaterial = function CreateCanvasMaterial(color, size) {
  var matCanvas = document.createElement('canvas');
  matCanvas.width = matCanvas.height = size;
  var matContext = matCanvas.getContext('2d'); // create exture object from canvas.

  var texture = new THREE.Texture(matCanvas); // Draw a circle

  var center = size / 2;
  matContext.beginPath();
  matContext.arc(center, center, size / 2, 0, 2 * Math.PI, false);
  matContext.closePath();
  matContext.fillStyle = color;
  matContext.fill(); // need to set needsUpdate

  texture.needsUpdate = true; // return a texture made from the canvas

  return texture;
};

var camTweenOut = new TWEEN.Tween(camera.position).to({
  x: 0,
  y: 0,
  z: 9
}, 1600).easing(TWEEN.Easing.Quadratic.InOut);
var camTweenFocusMe;
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setClearColor(0x13131B, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); //Dust

var parameters = [[[1, 1, 1], 0.9], [[0.95, 1, 0.5], 1], [[0.90, 1, 0.5], 1.4], [[0.85, 1, 0.5], 1.1], [[1, 1, 1], 0.8]];
var parameterCount = parameters.length;
var DustGeometry = new THREE.Geometry();
/*	NO ONE SAID ANYTHING ABOUT MATH! UGH!	*/

var bg_particles_count = 1000;
/* Leagues under the sea */
//Particles

for (var i = 0; i < bg_particles_count; i++) {
  var vertex = new THREE.Vector3();
  vertex.x = Math.random() * 2000 - 1000;
  vertex.y = Math.random() * 2000 - 1000;
  vertex.z = Math.random() * 2000 - 1000;
  DustGeometry.vertices.push(vertex);
}

var CosmoDust = new THREE.Group();
var DustMaterials = [];

for (var i = 0; i < parameterCount; i++) {
  var color = parameters[i][0];
  var size = parameters[i][1];
  DustMaterials[i] = new THREE.PointsMaterial({
    size: size,
    map: CreateCanvasMaterial('white', 256),
    transparent: true,
    depthWrite: true,
    opacity: 0
  });
  var particles = new THREE.Points(DustGeometry, DustMaterials[i]);
  particles.rotation.x = Math.random() * 6;
  particles.rotation.y = Math.random() * 6;
  particles.rotation.z = Math.random() * 6;
  CosmoDust.add(particles);
}

scene.add(CosmoDust); //globus

var SphereGeometry = new THREE.IcosahedronGeometry(1.97, 3);
var SphereMaterial = new THREE.MeshNormalMaterial({
  color: 0x13131B,
  transparent: true
});
var SphereMesh = new THREE.Mesh(SphereGeometry, SphereMaterial); // console.warn('mesh')
// console.log(SphereMesh)
//wireFrame

var lineMat = new THREE.LineBasicMaterial({
  color: 0x3C4051
});
var geometryWire = new THREE.IcosahedronBufferGeometry(2, 2);
var wireframe = new THREE.WireframeGeometry(geometryWire);
var line = new THREE.LineSegments(wireframe, lineMat);
line.material.opacity = 1;
line.material.transparent = true; //pointClouds

var pointGeo = new THREE.SphereGeometry(3.5, 17, 17);
var pointMat = new THREE.PointsMaterial({
  size: 0.04,
  map: CreateCanvasMaterial('white', 256),
  transparent: true,
  depthWrite: false
});
pointGeo.vertices.forEach(function (vertex) {
  vertex.color = vertex.x += Math.random() - 0.5;
  vertex.y += Math.random() - 0.5;
  vertex.z += Math.random() - 0.5;
});
var pointsClouds = new THREE.Points(pointGeo, pointMat);
var Globus = new THREE.Group(); // Globus.add (line,SphereMesh);

Globus.add(SphereMesh);
var GlobusAndPoints = new THREE.Group();
GlobusAndPoints.add(Globus, pointsClouds); // scene.add(Globus);

scene.add(GlobusAndPoints);
document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mouseup', onMouseClick, false); //OPACITY TWEENS

CosmoDust.opacity1 = [];
CosmoDust.opacity0 = [];
CosmoDust.children.map(function (i) {
  CosmoDust.opacity0.push(new TWEEN.Tween(i.material).to({
    opacity: 0
  }, 2000).easing(TWEEN.Easing.Exponential.Out));
  CosmoDust.opacity1.push(new TWEEN.Tween(i.material).to({
    opacity: 1
  }, 2000).easing(TWEEN.Easing.Exponential.Out));
});

CosmoDust.to0 = function () {
  CosmoDust.opacity1.map(function (i) {
    return i.end();
  });
  CosmoDust.opacity0.map(function (i) {
    return i.start();
  });
};

CosmoDust.to1 = function () {
  CosmoDust.opacity0.map(function (i) {
    return i.end();
  });
  CosmoDust.opacity1.map(function (i) {
    return i.start();
  });
};

var Global = [Globus.children[0], pointsClouds]; // let Global = [Globus.children[0],Globus.children[1],pointsClouds];

Global.map(function (i, j) {
  i.to0 = new TWEEN.Tween(i.material).to({
    opacity: 0
  }, 1500).easing(TWEEN.Easing.Exponential.Out).onComplete(function () {
    return i.visible = false;
  });
  i.to1 = new TWEEN.Tween(i.material).to({
    opacity: 1
  }, 2000).easing(TWEEN.Easing.Quadratic.InOut).onStart(function () {
    return i.visible = true;
  });
});
window.addEventListener('resize', onWindowResize, false);

function getColoredBufferLine(steps, phase, geometry) {
  var vertices = geometry.vertices;
  var segments = geometry.vertices.length; // geometry

  var geometry = new THREE.BufferGeometry(); // material

  var lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors
  }); // attributes

  var positions = new Float32Array(segments * 3); // 3 vertices per point

  var colors = new Float32Array(segments * 3);
  var frequency = 1 / (steps * segments);
  var color = new THREE.Color();
  var x, y, z;

  for (var i = 0, l = segments; i < l; i++) {
    x = vertices[i].x;
    y = vertices[i].y;
    z = vertices[i].z;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    color.set(makeColorGradient(i, frequency, phase));
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3)); // line

  var line = new THREE.Line(geometry, lineMaterial);
  return line;
} // threejs color gradient line helper


function makeColorGradient(i, frequency, phase) {
  var center = 128;
  var width = 127;
  var redFrequency, grnFrequency, bluFrequency;
  grnFrequency = bluFrequency = redFrequency = frequency;
  var phase2 = phase + 2;
  var phase3 = phase + 4;
  var red = Math.sin(redFrequency * i + phase) * width + center;
  var green = Math.sin(grnFrequency * i + phase2) * width + center;
  var blue = Math.sin(bluFrequency * i + phase3) * width + center;
  return parseInt('0x' + _byte2Hex(red) + _byte2Hex(green) + _byte2Hex(blue));
}

function _byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr(n >> 4 & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
} // create geometry and add to scene


var geo = function geo(arr) {
  var geometry = new THREE.Geometry();

  for (var i = 0; i < arr.length; i++) {
    var r = arr[i] + 10;
    var theta = 2 * Math.PI / 1024 * i * 11;
    geometry.vertices.push(new THREE.Vector3(r * Math.cos(theta), r * Math.sin(theta), 4));
  } // parameters for gradient


  var steps = 0.09;
  var phase = 1.7;
  var coloredLine = getColoredBufferLine(steps, phase, geometry);
  coloredLine.position.set(0, -20, 0);
  scene.add(coloredLine);
}; //RENDER


var render = function render(time) {
  TWEEN.update();

  if (ContextResumed) {// analyser.getByteFrequencyData(frequencyData);
    // geo(frequencyData);
  }

  if (!audio.canPlay) {// stroke.style.animation = "dash 1.8s linear infinite paused";
    // log('loading')
  } else {// stroke.style.animation = "";
    }

  raycasterPlanes.setFromCamera(MOUSE, camera);
  sectsWithPlanes = raycasterPlanes.intersectObjects(PLANE_GROUP.children, true);
  sectsWithPlanes[0] ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";

  if (focusPlaneName == -1) {
    //Home view
    var sectsWithPoints = raycaster.intersectObjects([pointsClouds]);

    if (sectsWithPoints[0]) {
      //cursor on a point
      if (RUNNING_INDEXES.indexOf(sectsWithPoints[0].index) == -1) {
        //Check point for existence
        picindex < 61 ? picindex++ : (picindex = 0, looped_picindex = true); // log(RUNNING_INDEXES);

        RUNNING_INDEXES.push(sectsWithPoints[0].index);
        var newPlane = new PlaneAvatar(PLANE_GROUP, sectsWithPoints[0].index, !looped_picindex ? USERS[picindex] : Object.assign(USERS[picindex], {
          name: 'id' + sectsWithPoints[0].index,
          location: 'London',
          audio: 'https://cdn.glitch.com/ff820234-7fc5-4317-a00a-ad183b72978d%2Fmoonlight.mp3?1512000557559'
        }));
        newPlane.scale.set(0.001, 0.001, 0.001);
        newPlane.enlargeTween.start();
        PLANE_GROUP.add(newPlane);
      } else {
        var planeToEnlarge = PLANE_GROUP.children.find(function (e) {
          return e.name == sectsWithPoints[0].index;
        });
        planeToEnlarge != undefined ? planeToEnlarge.dissolving = false : void null;
      }
    }

    ;

    if (sectsWithPlanes[0]) {
      //Enlarge existing one not dissolved Plane
      var _planeToEnlarge = sectsWithPlanes[0].object;
      _planeToEnlarge.dissolving = false; //flag to enlarge
    }

    ;
  }

  ;
  PLANE_GROUP.children.map(function (i, j) {
    i.run(ConvertToWorld(i.name)); //change Plane position

    i.updateSize(); //every Plane size update
  }); //FIND INTERSECTION

  camera.updateMatrixWorld();
  renderer.render(scene, camera);
};

pointsClouds.geometry.verticesNeedUpdate = true;
pointsClouds.matrixAutoUpdate = true;

var PlaneAvatar =
/*#__PURE__*/
function (_THREE$Mesh) {
  _inherits(PlaneAvatar, _THREE$Mesh);

  function PlaneAvatar(_Group, AnchorPointIndex, oINFO) {
    var _this;

    _classCallCheck(this, PlaneAvatar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PlaneAvatar).call(this, new THREE.CircleGeometry(0.35, 64, 64), new THREE.MeshBasicMaterial({
      map: oINFO.fetchedPic
    })));

    _defineProperty(_assertThisInitialized(_this), "removeFromGroup", function (Group) {
      log('REMOVE <E');
      var index = RUNNING_INDEXES.indexOf(_this.name);
      RUNNING_INDEXES.splice(index);
      Group.remove(_assertThisInitialized(_this));
    });

    _defineProperty(_assertThisInitialized(_this), "run", function (vector) {
      // this.position.set(mod(camera.position.x,vector.x)+vector.x,mod(camera.position.y,vector.y)+vector.y,mod(camera.position.z,vector.z)+vector.z);
      _this.position.set(vector.x, vector.y, vector.z);
    });

    _defineProperty(_assertThisInitialized(_this), "camFocusMe", function (t) {
      return camTweenFocusMe = new TWEEN.Tween(camera.position).to({
        x: _this.position.x + 0.4,
        y: _this.position.y,
        z: _this.position.z + 3
      }, 1000).easing(TWEEN.Easing.Quadratic.InOut);
    });

    _defineProperty(_assertThisInitialized(_this), "updateSize", function () {
      return _this.dissolving ? (_this.enlargeTween.stop(), _this.dissolveTween.start()) : (_this.dissolveTween.stop(), _this.enlargeTween.start());
    });

    _this.name = AnchorPointIndex;
    _this.info = {
      name: oINFO.name,
      location: oINFO.location,
      audio: oINFO.audio ? oINFO.audio : 'https://cdn.glitch.com/ff820234-7fc5-4317-a00a-ad183b72978d%2Fmoonlight.mp3?1512000557559'
    }; // console.table(this.info)

    _this.dissolving = true; //Dissolving by default

    _this.resizingChain = true;
    _this.dissolveTween = new TWEEN.Tween(_this.scale).to({
      x: 0.001,
      y: 0.001,
      z: 0.001
    }, 8000).easing(TWEEN.Easing.Quadratic.Out);
    _this.enlargeTween = new TWEEN.Tween(_this.scale).to({
      x: 1,
      y: 1,
      z: 1
    }, 650).easing(TWEEN.Easing.Quadratic.Out).onStart(function () {
      return _this.material.opacity = 1;
    }).onUpdate(function () {
      if (_this.scale.z > 0.999 && _this.resizingChain) {
        //About to complete
        _this.dissolving = true; //Now shall dissolve again by default
      }
    }); // this.camTweenFocusMe; //init variable

    _Group.add(_assertThisInitialized(_this));

    return _this;
  }

  return PlaneAvatar;
}(THREE.Mesh); //rotation on mouse click and drag


function groupRotation() {
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
    rotateScene(deltaX / 7, deltaY / 7);
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

  function rotateScene(deltaX, deltaY) {
    Globus.rotation.y += deltaX / 100;
    Globus.rotation.x += deltaY / 100;
    pointsClouds.rotation.y += deltaX / 100;
    pointsClouds.rotation.x += deltaY / 100;
  }
}

groupRotation();

var animate = function animate() {
  window.requestAnimationFrame(animate);
  var time = clock.getElapsedTime();
  render(time);

  if (!Selected || focusPlaneName == -1) {
    Globus.rotation.x -= 0.0003;
    Globus.rotation.y -= 0.0003;
    pointsClouds.rotation.x -= 0.0002;
    pointsClouds.rotation.y -= 0.0002;
  }

  CosmoDust.children.map(function (i, j) {
    return i.rotation.y = Date.now() * 0.0004;
  });
};

window.requestAnimationFrame(animate);