import {
  BoxGeometry,
  PlaneGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Vector3,
  FontLoader,
  TextGeometry
} from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import * as THREEConst from 'three/src/constants';

import heroDataCSV from '../../data/heroData.csv';

export default class Hero {
  constructor() {
    // parse heroData csv
    this.articles = heroDataCSV.slice(1).map((d) => {
      return {
        title: d[0],
        journal: d[1]
      };
    });

    // build scene elements
    this.obj = this.initScene();
  }

  initScene() {
    // --- build scene elements
    let sceneGroup = new Group();

    // -- Text
    const fontLoader = new FontLoader();
    const font = fontLoader.load('/fonts/Georgia_Regular.json', (font) => {
      const textGeo = new TextGeometry('This is only a test', {
        font: font,
        size: 0.4,
        height: 0,
        curveSegments: 12,
        bevelEnabled: false
      });
      textGeo.center();
      const textMat = new MeshBasicMaterial({ color: 0xff0000 });
      const text = new Mesh(textGeo, textMat);
      sceneGroup.add(text);
    });

    // return group mesh
    return sceneGroup;
  }

  update(time) {
    // update this scene
    // this.cubes.forEach((cube, i) => {
    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.005;
    // });
  }
}
