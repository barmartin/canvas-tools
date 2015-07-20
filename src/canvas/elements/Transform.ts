module cKit.elements {
  import constants = cKit.constants;

  export class Transform {
    position:any;
    scale:number;
    rotation:number;

    constructor(position, scale, rotation) {
      this.position = position;
      this.scale = scale;
      this.rotation = rotation;
    }

    getMatrix = () => {
      var cos = Math.cos(this.rotation);
      var sin = Math.sin(this.rotation);
      return [this.scale * cos, sin, -sin, this.scale * cos, this.position.x, this.position.y];
    }
  }
}
