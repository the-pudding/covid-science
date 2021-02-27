import {
  Group,
  Mesh,
  Vector3,
  TextureLoader,
  RawShaderMaterial,
  Vector2,
  Box3,
  BoxGeometry,
  PlaneGeometry,
  MeshBasicMaterial,
  Color
} from 'three';
import { Utils } from '../../js/Utils.js';
import {
  visibleHeightAtZDepth,
  visibleWidthAtZDepth
} from '../../js/THREE_Utils';
import { shuffle, descending } from 'd3-array';

const createGeometry = require('three-bmfont-text');
const MSDFShader = require('three-bmfont-text/shaders/msdf');

import TitleFont from '@bmfonts/Georgia.json';
import heroDataCSV from './assets/heroDataFiltered.csv';
import fragShader from './assets/shaders/frag.glsl';
import vertShader from './assets/shaders/vert.glsl';
import covidFrag from './assets/shaders/covidFrag.glsl';
import covidVert from './assets/shaders/covidVert.glsl';
import titleFrag from './assets/shaders/titleFrag.glsl';

export default class Hero {
  constructor(config) {
    // parse heroData csv
    this.articles = heroDataCSV.slice(1).map((d) => {
      return {
        title: `${d[0]}`,
        journal: d[1]
      };
    });
    //this.article = shuffle(this.articles);

    // passed in config (optional)
    this.cam = config.camera || null;
    this.renderer = config.renderer;

    // internal vars
    this.titleTexture = null;
    this.titleMat = null;
    this.activeTitles = [];
    this.currentArtIdx = 0; // index to keep track of articles from full list
    this.nRows = 0;
    this.rowSpeeds = {};
    this.titleScale = 0.005;
    this.padding = {
      x: 0.1,
      y: 0.01
    };
    this.mouse = new Vector2(0, 0);

    // build scene elements
    this.obj = new Group();

    // get visible edges
    this.vHeight = visibleHeightAtZDepth(0, this.cam);
    this.vWidth = visibleWidthAtZDepth(0, this.cam);
    this.bufferResolution = this.renderer.getDrawingBufferSize(new Vector2());

    // debug stuff
    //this.showDebugMoving = false;
    //this.showDebugStatic = false;

    //this.showDebugMoving = true;
    //this.addDebugMoving();

    //this.showDebugStatic = true;
    //this.addDebugStatic();

    window.addEventListener('mousemove', (e) => {
      this.mouse = new Vector2(
        e.clientX / window.innerWidth,
        e.clientY / window.innerHeight
      );
    });

    this.initScene();
  }

  addDebugMoving() {
    // load textures
    const textureLoader = new TextureLoader();
    const overlayTexture = textureLoader.load('/textures/covid_outline.jpg');

    //const geo = new PlaneGeometry(9, 7, 10, 10);
    const geo = new PlaneGeometry(2, 2, 10, 10);
    const mat = new RawShaderMaterial({
      vertexShader: covidVert,
      fragmentShader: covidFrag,
      transparent: true
    });
    mat.uniforms.u_time = { value: 0.0 };
    mat.uniforms.u_resolution = {
      value: this.bufferResolution.clone()
    };
    mat.uniforms.u_overlay = {
      value: overlayTexture
    };

    this.debugMoving = new Mesh(geo, mat);
    this.debugMoving.position.set(-this.vWidth * 0.5, 1, 0);

    this.obj.add(this.debugMoving);
  }

  addDebugStatic() {
    // load textures
    const textureLoader = new TextureLoader();
    const overlayTexture = textureLoader.load('/textures/covid_outline.jpg');

    const geo = new PlaneGeometry(9, 7, 10, 10);
    const mat = new RawShaderMaterial({
      vertexShader: covidVert,
      fragmentShader: covidFrag,
      transparent: true
    });
    mat.uniforms.u_time = { value: 0.0 };
    mat.uniforms.u_resolution = {
      value: this.bufferResolution.clone()
    };
    mat.uniforms.u_overlay = {
      value: overlayTexture
    };

    this.debugStatic = new Mesh(geo, mat);

    this.obj.add(this.debugStatic);
  }

  initScene() {
    // --- build scene elements

    // textures
    const textureLoader = new TextureLoader();
    const overlayTexture = textureLoader.load('/textures/covid_outline.jpg');

    // load the font texture and use it to instantiate the text objects
    textureLoader.load('/bmfonts/Georgia.png', (fontTex) => {
      this.titleTexture = fontTex;

      // create the shader for the font material, set necessary uniforms
      this.titleMat = new RawShaderMaterial(
        MSDFShader({
          vertexShader: vertShader,
          fragmentShader: titleFrag,
          map: this.titleTexture,
          side: THREE.DoubleSide,
          transparent: false,
          negate: false
        })
      );
      this.titleMat.uniforms.u_time = { value: 0.0 };
      this.titleMat.uniforms.u_resolution = {
        value: this.bufferResolution.clone()
      };
      this.titleMat.uniforms.u_overlay = {
        value: overlayTexture
      };
      this.titleMat.uniforms.u_mouse = {
        value: this.mouse.clone()
      };

      // Add the first set of active titles to fill the screen
      let filled = false;
      let yPos = this.vHeight * 0.5; // start with top left of visible space
      let xPos = this.vWidth * -0.5;
      let rowIdx = 0;
      this.rowSpeeds[rowIdx] = Utils.randBw(0.012, 0.003);
      while (!filled) {
        const thisTitle = this.createArtTitle();
        thisTitle.obj.position.set(xPos, yPos, 0);
        thisTitle.rowIdx = rowIdx;

        // update the positions for the next title
        xPos += thisTitle.width + this.padding.x;
        if (xPos > this.vWidth * 0.5) {
          xPos = this.vWidth * -0.5;
          thisTitle.isLastInRow = true;
          yPos -= thisTitle.height + this.padding.y; // new row
          rowIdx++;
          this.rowSpeeds[rowIdx] = Utils.randBw(0.012, 0.003);
        }

        // check if full height filled
        if (yPos < this.vHeight * -0.5) {
          filled = true;
        }

        // add this title to the activeTitles array
        this.activeTitles.push(thisTitle);
      }

      // add all active titles to scene
      for (let title of this.activeTitles) {
        this.obj.add(title.obj);
      }

      // figure out how many unique rows
      this.nRows = new Set(this.activeTitles.map((d) => d.rowIdx)).size;
    });
  }

  createArtTitle() {
    // --- create a mesh for the next article title in the list
    const titleText = this.articles[this.currentArtIdx].title;
    const titleGeo = createGeometry({
      font: TitleFont,
      text: titleText
    });

    const meshName = `title-${this.currentArtIdx}`; // for easy retrieving later
    const titleMesh = new Mesh(titleGeo, this.titleMat);
    titleMesh.name = meshName;
    titleMesh.rotation.set(Math.PI, 0, 0);
    titleMesh.scale.set(this.titleScale, this.titleScale, this.titleScale);

    // compute the bounding box on scaled mesh
    let bbox = new Box3();
    bbox.setFromObject(titleMesh);

    // update (or reset) article idx
    this.currentArtIdx++;
    this.currentArtIdx =
      this.currentArtIdx === this.articles.length ? 0 : this.currentArtIdx;

    return {
      obj: titleMesh,
      meshName: meshName,
      title: titleText,
      width: bbox.max.x - bbox.min.x,
      height: bbox.max.y - bbox.min.y,
      keepAlive: true,
      isLastInRow: false
    };
  }

  resize() {
    this.vHeight = visibleHeightAtZDepth(0, this.cam);
    this.vWidth = visibleWidthAtZDepth(0, this.cam);

    // update canvas buffer resolution
    this.bufferResolution = this.renderer.getDrawingBufferSize(new Vector2());

    // update uniforms that depend on buffer res
    this.activeTitles.forEach((title) => {
      title.obj.material.uniforms.u_resolution.value = this.bufferResolution.clone();
      title.obj.material.uniformsNeedUpdate = true;
    });

    // update debuggers
    if (this.showDebugMoving) {
      this.debugMoving.material.uniforms.u_resolution.value = this.bufferResolution.clone();
      this.debugMoving.material.uniformsNeedUpdate = true;
    }
    if (this.showDebugStatic) {
      this.debugStatic.material.uniforms.u_resolution.value = this.bufferResolution.clone();
      this.debugStatic.material.uniformsNeedUpdate = true;
    }
  }

  removeDeadTitles() {
    // remove all of the titles that have been flagged for removal
    if (this.activeTitles.length === 0) {
      return;
    }

    for (let i = this.activeTitles.length - 1; i >= 0; i--) {
      const title = this.activeTitles[i];
      if (!title.keepAlive) {
        const meshName = title.meshName;
        this.obj.remove(this.obj.getObjectByName(meshName)); // remove from parent group
        this.activeTitles.splice(i, 1);
      }
    }
  }

  // --- Animation loop
  update(time) {
    if (this.showDebugMoving) {
      this.debugMoving.position.x += 0.05;
      if (this.debugMoving.position.x > this.vWidth * 0.5) {
        this.debugMoving.position.x = -this.vWidth * 0.5;
      }
    }

    let titlesToAdd = [];

    // update all titles
    this.activeTitles.forEach((title, i) => {
      title.obj.position.x -= this.rowSpeeds[title.rowIdx];

      // update shader uniforms
      title.obj.material.uniforms.u_time.value += time;
      title.obj.material.uniforms.u_mouse.value = this.mouse.clone();
      title.obj.material.uniformsNeedUpdate = true;

      // check if any titles moved offscreen and should be flagged for removal
      if (title.obj.position.x + title.width < this.vWidth * -0.5) {
        title.keepAlive = false;
      }
    });

    // check if any of the 'lastInRow' are fully on screen
    let rightMostTitles = this.activeTitles.filter(
      (title) => title.isLastInRow
    );
    rightMostTitles.forEach((title) => {
      // if title is fully on screen, create new title behind it
      if (title.obj.position.x + title.width < this.vWidth * 0.5) {
        const newTitle = this.createArtTitle();
        newTitle.obj.position.set(
          title.obj.position.x + title.width + this.padding.x,
          title.obj.position.y,
          title.obj.position.z
        );

        newTitle.rowIdx = title.rowIdx;
        newTitle.isLastInRow = true;
        titlesToAdd.push(newTitle); // add this title to list of new titles to add

        // current title is no longer last in row
        title.isLastInRow = false;
      }
    });

    // add/remove any new/old titles
    this.removeDeadTitles();
    for (let t of titlesToAdd) {
      this.activeTitles.push(t); // add to arr of active titles
      this.obj.add(t.obj); // add to group obj
    }
  }
}
