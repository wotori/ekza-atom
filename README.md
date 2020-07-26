# ekza-atom
[WebGL](https://en.wikipedia.org/wiki/WebGL) user visualisation interface based on [three.js](https://github.com/mrdoob/three.js/) library

![gif](https://s7.gifyu.com/images/2020-07-25-06-41-30.gif)

### Run SoulSphere App
- install js libraries <br>
``% yarn install``

- create virtual environment and activate it <br>
Unix - ``% virtualenv venv && source venv/bin/activate``
PC - ``% virtualenv venv && venv\Scripts\activate``

- install python dependencies <br>
``% pip install -r requirements.txt``

- run python flask server <br>
``% pip install -r requirements.txt``

### testing environment with hot reloading <br>
- install python live-server <br>
``% pip install live-server``

- run server in root directory <br>
``% live-server``

- create a parcel build if you want better multiple browser support [optional] <br>
``
% parcel watch static/app.js --out-file polyapp.js --out-dir static --no-hmr
``

### Preview the ekza-atom here
current version at [heroku](http://soulsphere.herokuapp.com/)
