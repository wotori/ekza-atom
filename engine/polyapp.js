// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"app.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var buildMsg = 'brave new babel + antispasm';
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
    ctx.resume().then(function () {
      log('Context resumed successfully');
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
    Info.removeClass('hidden');
    Info.addClass('appear');
    pause.addClass('hidden');
    play.removeClass('hidden');
    audio.playState = "paused"; // audio.playState = "paused"

    camTweenOut && camTweenOut.stop();
    preSelected && (preSelected.dissolving = true, preSelected.camTweenFocusMe.stop(), preSelected.resizingChain = true);
    preSelected = Selected;
    Selected.dissolving = false;
    focusPlaneName = Selected.name; //camFocusme

    Selected.camFocusMe().start(); //focus

    Selected.resizingChain = false;
    Global.map(function (i, j) {
      i.to1.stop(), i.to0.start();
    });
    CosmoDust.to1();
  } else if (event.target.tagName == "CANVAS") {
    // Move out
    focusPlaneName = -1;
    Selected && (Selected.camTweenFocusMe.stop(), Selected.dissolving = true, Selected.resizingChain = true); //Tweens activate

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

var createCanvasMaterial = function createCanvasMaterial(color, size) {
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
}, 1000).easing(TWEEN.Easing.Quadratic.InOut);
var renderer = new THREE.WebGLRenderer({
  antialias: true // alpha: true,

}); //Background Color

renderer.setClearColor('#13131b', 1);
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

for (var _i = 0; _i < parameterCount; _i++) {
  var color = parameters[_i][0];
  var size = parameters[_i][1];
  DustMaterials[_i] = new THREE.PointsMaterial({
    size: size,
    map: createCanvasMaterial('white', 256),
    transparent: true,
    depthWrite: true,
    opacity: 0
  });
  var particles = new THREE.Points(DustGeometry, DustMaterials[_i]);
  particles.rotation.x = Math.random() * 6;
  particles.rotation.y = Math.random() * 6;
  particles.rotation.z = Math.random() * 6;
  CosmoDust.add(particles);
}

scene.add(CosmoDust); //globus
//SoulSphere

var SphereGeometry = new THREE.IcosahedronGeometry(1.75, 1);
var SphereMaterial = new THREE.MeshPhongMaterial({
  color: 'white',
  transparent: true
});
var SphereMesh = new THREE.Mesh(SphereGeometry, SphereMaterial);
SphereMaterial.flatShading = true; //SoulSphere wireFrame

var lineMat = new THREE.LineBasicMaterial({
  color: "#fffc81"
});
var geometryWire = new THREE.IcosahedronBufferGeometry(2.2, 1);
var wireframe = new THREE.WireframeGeometry(geometryWire);
var line = new THREE.LineSegments(wireframe, lineMat);
line.material.opacity = 0.08;
line.material.transparent = true; //pointClouds
//Create Points

var pointGeo = new THREE.SphereGeometry(3.5, 17, 17);
var pointMat = new THREE.PointsMaterial({
  size: 0.04,
  map: createCanvasMaterial('white', 256),
  transparent: true,
  depthWrite: false
});
pointGeo.vertices.forEach(function (vertex) {
  vertex.color = vertex.x += Math.random() - 0.5;
  vertex.y += Math.random() - 0.5;
  vertex.z += Math.random() - 0.5;
});
console.log(pointMat);
var pointsClouds = new THREE.Points(pointGeo, pointMat);
var Globus = new THREE.Group();
Globus.add(line, SphereMesh);
var GlobusAndPoints = new THREE.Group();
GlobusAndPoints.add(Globus, pointsClouds); // scene.add(Globus);

scene.add(GlobusAndPoints);
var lightColor = '#e58237'; //createLight

var light = new THREE.PointLight(lightColor, 3, 15);
scene.add(light);
light.position.set(0, 0, 12); //ambient light

var envLight = new THREE.AmbientLight(lightColor, 0.88);
scene.add(envLight);
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

var Global = [Globus.children[0], Globus.children[1], pointsClouds];
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
window.addEventListener('resize', onWindowResize, false); // getUserDescript =(index)=> USERS.find((e)=> e.pic == index);
//RENDER

var render = function render(time) {
  TWEEN.update();

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

  function PlaneAvatar(Group, AnchorPointIndex, oINFO) {
    var _this;

    _classCallCheck(this, PlaneAvatar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PlaneAvatar).call(this, new THREE.CircleGeometry(0.35, 64, 64), new THREE.MeshBasicMaterial({
      map: oINFO.fetchedPic
    })));
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
    }, 325).easing(TWEEN.Easing.Quadratic.Out).onStart(function () {
      return _this.material.opacity = 1;
    }).onUpdate(function () {
      if (_this.scale.z > 0.999 && _this.resizingChain) {
        //About to complete
        _this.dissolving = true; //Now shall dissolve again by default
      }
    });
    _this.camTweenFocusMe; //init variable

    Group.add(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PlaneAvatar, [{
    key: "removeFromGroup",
    value: function removeFromGroup(Group) {
      log('REMOVE <E');
      var index = RUNNING_INDEXES.indexOf(this.name);
      RUNNING_INDEXES.splice(index);
      Group.remove(this);
    }
  }, {
    key: "run",
    value: function run(vector) {
      return this.position.set(vector.x, vector.y, vector.z + 0.01);
    }
  }, {
    key: "camFocusMe",
    value: function camFocusMe(t) {
      return this.camTweenFocusMe = new TWEEN.Tween(camera.position).to({
        x: this.position.x + 0.4,
        y: this.position.y,
        z: this.position.z + 6
      }, 850).easing(TWEEN.Easing.Quadratic.InOut);
    }
  }, {
    key: "updateSize",
    value: function updateSize() {
      return this.dissolving ? (this.enlargeTween.stop(), this.dissolveTween.start()) : (this.dissolveTween.stop(), this.enlargeTween.start());
    }
  }]);

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
},{}]},{},["app.js"], null)
//# sourceMappingURL=/polyapp.js.map