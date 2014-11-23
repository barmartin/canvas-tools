require.config({
  baseUrl: 'scripts/',

  // alias libraries paths.  Must set 'angular'
  paths: {
    'angular': 'ext/angular',
    'angular-route': 'ext/angular-route',
    'ui-bootstrap': 'ext/ui-bootstrap',
    'angular-ui-router': 'ext/angular-ui-router',
    'angularAMD': 'ext/angularAMD',
    'ngload': 'ext/ngload',
    'angular-resource': 'ext/angular-resource',
    'cKit': 'cKit'
  },

  // Add angular modules that does not support AMD out of the box, put it in a shim
  shim: {
    'angular-route': [ 'angular' ],
    'angularAMD': [ 'angular' ],
    'ngload': [ 'angularAMD' ],
    'angular-resource': [ 'angular' ],
    'angular-ui-router': [ 'angular' ],
    'ui-bootstrap': [ 'angular' ]
  },

  // kick start application
  deps: ['app']
});
