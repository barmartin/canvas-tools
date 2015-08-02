// Gruntfile

module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    build: "dist",

    app: "src/app",
    kit: "src/canvas",
    assets: "src/assets",

    copy: {
      setup: {
        files: [
          /*{
            cwd: '<%= assets %>',
            expand: true,
            dest: '<%= build %>',
            src: 'scripts/**'
          },*/
          {
            cwd: 'src/assets',
            expand: true,
            dest: '<%= build %>/assets',
            src: ["styles/img/**", "styles/ext/**"]
          }
        ]
      },
      templates: {
        files: [
          {
            cwd: '<%= app %>',
            expand: true,
            dest: '<%= build %>',
            src: "**/*.html"
          }
        ]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['node_modules/angular/angular.js', 'node_modules/angular-ui-router/release/angular-ui-router.js',
          'node_modules/jquery/dist/jquery.js', 'node_modules/jsxgraph/JSXCompressor/jsxcompressor.min.js',
          'src/assets/scripts/lib/dhtmlxcommon.js', 'src/assets/scripts/lib/dhtmlxcolorpicker.js'],
        dest: '<%= build %>/scripts/lib.js'
      }
    },
    less: {
      development: {
        options: {
          compress: false,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'dist/assets/styles/main.css': 'src/assets/styles/less/main.less'
        }
      }
    },

    // this builds cKit.js
    typescript: {
      kit: {
        src: ['canvasReferences.ts', '<%= kit %>/**/*.ts'],
        dest: 'dist/scripts/cKit.js',
        options: {
          module: 'amd', //or commonjs
          target: 'es5', //or es3
          sourceMap: false,
          declaration: false
        }
      },
      // this builds app.js
      app: {
        src: ['references.ts', '<%= app %>/**/*.ts', '!**/*.d.ts'],
        dest: 'dist/scripts/app.js',
        options: {
          module: 'amd', //or commonjs
          target: 'es5', //or es3
          sourceMap: false,
          declaration: false
        }
      }
    },

    watch: {
      appTS: {
        files: ['references.ts', '<%= app %>/**/*.ts'],
        tasks: ['typescript:app']
      },
      kitTS: {
        files: ['canvasReferences.ts', '<%= kit %>/**/*.ts'],
        tasks: ['typescript:kit']
      },
      less: {
        files: ['<%= assets %>/**/*.less'],
        tasks: ['less']
      },
      templates: {
        files: ['<%= app %>/**/*.html'],
        tasks: ['copy:templates']
      },

      libJS: {
        files: ['node_modules/**/*.js'],
        tasks: ['concat']
      },

      /* Working on removing some of these anonymous assets */
      www: {
        files: ['<%= assets %>/**/*'],
        tasks: ['copy:setup']
      }
    }
  });

  /**
   * Copies files to /dist
   * Rebuilds cKit.js and app.js
   * Compiles less into /dist
   */
  grunt.registerTask('build', [
    'typescript',
    'less',
    'copy:setup',
    'concat',
    'copy:templates'
  ]);

  grunt.registerTask('default', [
    'build',
    'watch'
  ]);
};
