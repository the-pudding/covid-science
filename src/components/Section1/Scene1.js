import { SphereGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import * as THREEConst from 'three/src/constants';

export default class Hero {
  constructor() {
    // build scene elements
    this.group = new Group();
    this.initScene();
  }

  initScene() {
    // --- build scene elements
    // cubes
    this.spheres = [];
    for (let c = 0; c < 3; c++) {
      const geo = new SphereGeometry(1, 5, 5);
      const mat = new MeshBasicMaterial({ color: 0xf4fa4e });
      const sphere = new Mesh(geo, mat);
      const xPos = c * 2 - 2;
      sphere.position.set(xPos, 0, 0);
      this.spheres.push(sphere);
      this.group.add(sphere);
    }
  }

  update(time) {
    // update this scene
    this.spheres.forEach((sphere, i) => {
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.005;
    });
  }
}
