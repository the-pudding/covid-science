import {
  BoxGeometry,
  PlaneGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Vector3
} from 'three';
import * as THREEConst from 'three/src/constants';

export default class Hero {
  constructor() {
    // build scene elements
    this.obj = this.initScene();
  }

  initScene() {
    // --- build scene elements
    let sceneGroup = new Group();

    // cubes
    this.cubes = [];
    for (let c = 0; c < 3; c++) {
      const geo = new BoxGeometry(1, 1, 1);
      const mat = new MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new Mesh(geo, mat);
      const xPos = c * 2 - 2;
      cube.position.set(xPos, 0, 0);
      this.cubes.push(cube);
      sceneGroup.add(cube);
    }

    // return group mesh
    return sceneGroup;
  }

  update(time) {
    // update this scene
    this.cubes.forEach((cube, i) => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.005;
    });
  }
}
