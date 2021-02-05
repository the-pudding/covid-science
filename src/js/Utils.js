// General math functions to make certain, frequently used calculations easier for us
class Utils {
  // get rand Float value between min, max (exclusive)
  static randBw(min, max) {
    return Math.random() * (max - min) + min;
  }

  // get rand Int value between min, max (inclusive)
  static randIntBw(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // get random value from supplied array
  static randFromArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // map input value to new range
  static map(val, inputMin, inputMax, outputMin, outputMax) {
    return (
      (outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin)) +
      outputMin
    );
  }

  // LERP: linear interpolation
  static lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
  }

  // cosine interpolate between val1, val2, at progress (range 0-1)
  static cosineInterpolate(val1, val2, progress) {
    const m2 = (1 - Math.cos(progress * Math.PI)) / 2;
    return val1 * (1 - m2) + val2 * m2;
  }

  // clamp/constrain value to min/max range
  static clamp(val, min, max) {
    return Math.max(Math.min(val, max), min);
  }

  // given 1D index, return 2D indices based on given 2D array size
  static idx2D(idx, xSize, ySize) {
    let x = idx % xSize;
    let y = Math.floor(idx / ySize);
    return { x: x, y: y };
  }

  // given 2D index, return the corresponding 1D index
  static idx1D(xIdx, yIdx, xSize) {
    return xIdx + xSize * yIdx;
  }

  // convert degrees to radians
  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // convert radians to degrees
  static rad2deg(rad) {
    return rad * (180 / Math.PI);
  }

  // get random color
  static getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // test if number is between range (inclusive)
  static isBetween(val, min, max) {
    return val >= min && val <= max;
  }

  // shuffle array * https://stackoverflow.com/a/2450976/1293256
  static shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}

export { Utils };
