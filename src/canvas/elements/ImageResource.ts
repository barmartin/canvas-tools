module cKit.elements {

  export class ImageResource {
    kit: any;
    src: string;
    page: string;
    label: string;
    image: any;
    loaded: boolean = false;

    id: number; // Index

    constructor(kit: CanvasKit, src, page, label) {
      this.kit = kit;
      this.src = src;
      this.page = page;
      this.label = label;

      this.image = new Image();
      var till = function() {
        this.loaded = true;
        /* Use .bind to attach scope? */
        cKit.kit.redraw();
      };
      this.image.addEventListener('load', till.bind(this), false);
      this.image.src = src;

      this.id = kit.resourceList.images.length;
    }
    exportImage() {
      return {src: this.src, page: this.page, label: this.label};
    }
  }
}