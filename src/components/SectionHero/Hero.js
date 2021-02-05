import {
  BoxGeometry,
  PlaneGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Vector3,
  FontLoader,
  TextGeometry,
  Color
} from 'three';
import * as THREEConst from 'three/src/constants';
import { Utils } from '../../js/Utils.js';

import heroDataCSV from './heroData.csv';

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
    this.group = new Group();
    this.titles = [];

    this.initScene();
  }

  initScene() {
    // --- build scene elements

    // -- Text
    this.generateTitles();
  }

  generateTitles() {
    // create a new title object3D and animation parameters for each article
    const textMat = new MeshBasicMaterial({
      color: new Color('rgb(100, 100, 100)')
    });
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/Georgia_Regular.json', (font) => {
      let counter = 0;
      for (let art of this.articles.slice(1, 10)) {
        const textGeo = new TextGeometry(art.title, {
          font: font,
          size: 0.2,
          height: 0,
          bevelEnabled: false
        });
        textGeo.computeBoundingBox(); // compute the bounding box so we can compute width later
        const textObj = new Mesh(textGeo, textMat);

        const startPos = this.generateStartPos();
        textObj.position.copy(startPos);
        this.titles.push({
          obj: textObj,
          width: textGeo.boundingBox.max.x - textGeo.boundingBox.min.x,
          speedFactor: Utils.randBw(0.04, 0.001)
        });

        // add to the scene
        this.group.add(textObj);
        console.log(`${counter}`);
      }
    });
  }

  generateStartPos() {
    // return a random vec3 for title starting position
    return new Vector3(
      Utils.randBw(5, 10),
      Utils.randBw(-5, 5),
      Utils.randBw(0, -5)
    );
  }

  // --- Animation loop
  update(time) {
    // update this scene
    this.titles.forEach((title, i) => {
      title.obj.position.x -= title.speedFactor;

      if (title.obj.position.x + title.width < -5) {
        title.obj.position.copy(this.generateStartPos());
      }
    });
  }
}
