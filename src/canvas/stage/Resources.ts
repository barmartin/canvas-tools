module cKit.stage {

  import objects = cKit.objects;
  import elements = cKit.elements;
  import _u = cKit.util;

  export class ResourceList {
    kit: cKit.CanvasKit;
    objects: Array<objects.baseObject> = [];
    images: Array<elements.ImageResource> = [];
    constructor(kit: CanvasKit) {
      this.kit = kit;
    }

    addImage(src, page='', label='') {
      if(label === '') {
        label = src;
      }
      this.images.push(new elements.ImageResource(this.kit, src, page, label));
    }

    addObject(itemConfig) {
      if(itemConfig.id === 'petalFlower' || itemConfig.id === 'PETAL_FLOWER') {
        this.objects.push(new objects.PetalFlower(this.kit, itemConfig.states.petals, itemConfig.states.accent));
        if(_u.exists(itemConfig.states.fillImage) && itemConfig.states.fillImage != null) {
          this.objects[this.objects.length - 1].fillImage = this.images[itemConfig.states.fillImage];
        }
      } else if(itemConfig.id === 'imageLayer') {
        if(_u.exists(itemConfig.index) && this.images.length > itemConfig.index) {
          this.objects.push(new objects.ImageLayer(this.kit, this.images[itemConfig.index]));
        } else {
          this.objects.push(new objects.ImageLayer(this.kit));
        }
      } else if(itemConfig.id === 'textLayer') {
        this.objects.push(new objects.Text(this.kit));
      }
      return this.objects.length-1;
    }

    changeObjectType(selectedObject, itemType) {
      if(itemType === 'petalFlower') {
        this.objects[selectedObject] = new objects.PetalFlower(this.kit);
      } else if(itemType === 'imageLayer') {
        this.objects[selectedObject] = new objects.ImageLayer(this.kit);
      } else if(itemType === 'textLayer') {
        this.objects[selectedObject] = new objects.Text(this.kit);
      }
    }

    removeObject(index: number) {
      this.objects.splice(index, 1);
    }

    clearResources() {
      this.objects = [];
      this.images = [];
    }

    export() {
      var imageList = [];
      for(var i=0; i<this.images.length;i++){
        imageList.push(this.images[i].exportImage());
      }
      var objList = [];
      for(var i=0; i<this.objects.length;i++){
        objList.push(this.objects[i].exportObject());
      }
      return {imageList: imageList, objectList: objList};
    }
    import(resources) {
      var self = this;
      this.clearResources();
      resources.imageList.forEach(item=>self.addImage(item.src, item.page, item.label));
      resources.objectList.forEach(item=>self.addObject(item));
    }
  }
}