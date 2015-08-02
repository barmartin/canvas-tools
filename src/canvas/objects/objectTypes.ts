/* seperating this in order to keep WIP object types outside the project git */
/* Must disable ignore in .gitignore to commit changes */
module cKit.objects {
  export var objectTypes: Dictionary<string> = {
    petalFlower: "Petal Flower",
    imageLayer: "Image Layer",
    textLayer: "Text"
    //GENERIC: "Generic"
  };
}