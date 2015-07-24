module cKit.app.directives.filters {
  export var NAME = "cKit.app.directives.filters";

  function objectFilter() {
    return function(input, query){
      var result = {};
      angular.forEach(input, (value, key) => {
        if(value[query] === true)
          result[key] = value;
      });
      return result;
    };
  }

  export function run() {
    var mod = angular.module(NAME, []);
    mod.filter("objectFilter", objectFilter);
  }
}
cKit.app.directives.filters.run();