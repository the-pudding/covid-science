import {
  PlaneGeometry,
  Color,
  SphereGeometry,
  Group,
  Mesh,
  MeshBasicMaterial
} from 'three';
import * as THREEConst from 'three/src/constants';

export default class Hero {
  constructor() {
    // build scene elements
    this.obj = new Group();
    this.initScene();
  }

  initScene() {
    // --- build scene elements
    // cubes
    const ground = new Mesh(
      new PlaneGeometry(5, 5, 10, 10),
      new MeshBasicMaterial({
        color: new Color('#666'),
        wireframe: true
      })
    );
    ground.rotateX(Math.PI * 0.5);
    ground.position.y = -2;
    this.obj.add(ground);
  }

  update(time) {
    // update this scene
    // this.spheres.forEach((sphere, i) => {
    //   sphere.rotation.x += 0.01;
    //   sphere.rotation.y += 0.005;
    // });
  }
}
