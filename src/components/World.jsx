import React, { Component } from 'react';
import { gsap } from 'gsap';
import {
  AxesHelper,
  Clock,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGL1Renderer,
  Color,
  Fog
} from 'three';

import Hero from './SectionHero/Hero.js';
import Scene1 from './Section1/Scene1.js';

export default class World extends Component {
  constructor(props) {
    super(props);

    // config
    this.winSize = {
      w: window.innerWidth,
      h: window.innerHeight
    };
    this.currentSection = null;

    // instantiate basic THREE components
    this.canvasRef = React.createRef();
    this.scene = new Scene();
    this.clock = new Clock();
    this.camera = new PerspectiveCamera(
      75,
      this.winSize.w / this.winSize.h,
      0.1,
      50
    );
  }

  initScene = () => {
    // configure and initialize the first draw
    this.camera.position.z = 5;

    // create the renderer
    this.renderer = new WebGL1Renderer({
      canvas: this.canvasRef.current,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.winSize.w, this.winSize.h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // add the helper axes and ground reference
    const ground = new Mesh(
      new PlaneGeometry(150, 150, 40, 40),
      new MeshBasicMaterial({
        color: new Color('#666'),
        wireframe: true
      })
    );
    ground.rotateX(Math.PI * 0.5);
    ground.position.y = -6;
    // this.scene.add(ground);
    // this.scene.add(new AxesHelper(3));

    // add fog
    //this.scene.fog = new Fog(0xffffff, 0, 3);

    // Add all sub-scenes
    this.sceneHero = new Hero({ camera: this.camera, renderer: this.renderer });
    this.sceneHero.obj.position.set(0, 0, 0);
    this.scene.add(this.sceneHero.obj);

    this.scene1 = new Scene1();
    this.scene1.obj.position.set(0, -50, 0);
    this.scene.add(this.scene1.obj);

    // create a mapping between section names and scenes
    this.sceneMapping = {
      'section-hero': this.sceneHero,
      'section-1': this.scene1,
      'section-2': this.scene1,
      'section-3': this.scene1,
      'section-methods': this.scene1
    };

    // set the current scene
    this.currentScene = this.sceneHero;

    // start animation
    this.tick();
  };

  handleResize = () => {
    this.winSize.w = window.innerWidth;
    this.winSize.h = window.innerHeight;

    // update camera and renderer
    this.camera.aspect = this.winSize.w / this.winSize.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.winSize.w, this.winSize.h);

    // update scenes
    this.sceneHero.resize();
  };

  tick = () => {
    // --- main animation loop
    const delta = this.clock.getDelta(); // seconds

    // update everything
    this.currentScene.update(delta);
    this.renderer.render(this.scene, this.camera);

    // call it again on next frame
    requestAnimationFrame(this.tick);
  };

  componentDidMount() {
    this.initScene();
    window.onresize = () => this.handleResize();
  }

  componentDidUpdate(prevProps) {
    const { currentSection } = this.props;
    if (currentSection !== prevProps.currentSection) {
      console.log('new section:', currentSection);

      const nextScene = this.sceneMapping[currentSection];
      if (nextScene !== this.currentScene) {
        gsap.to(this.currentScene.obj.position, { duration: 3, x: -30 });
        gsap.to(nextScene.obj.position, { duration: 3, y: 0, x: 0, z: 0 });
      }

      this.currentScene = nextScene;
    }
  }

  render() {
    return (
      <div className="World">
        <canvas className="three-canvas" ref={this.canvasRef}></canvas>
      </div>
    );
  }
}
