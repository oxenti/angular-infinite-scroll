// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = function(grunt) {
    var sauceKey, sauceUser;
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-protractor-runner');
    sauceUser = 'pomerantsevp';
    sauceKey = '497ab04e-f31b-4a7b-9b18-ae3fbe023222';
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      meta: {
        banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      /*eslint: {
        target: ['src/infinite-scroll.js']
      },*/
      clean: {
        options: {
          force: true
        },
        build: ["compile/**", "build/**"]
      },
      concat: {
        options: {
          banner: '<%= meta.banner %>'
        },
        dist: {
          src: 'src/**/*.js',
          dest: 'build/angular-infinite-scroll.js'
        }
      },
      uglify: {
        options: {
          banner: '<%= meta.banner %>'
        },
        dist: {
          src: ['build/angular-infinite-scroll.js'],
          dest: 'build/angular-infinite-scroll.min.js'
        }
      },
      connect: {
        testserver: {
          options: {
            port: 8000,
            hostname: '0.0.0.0',
            middleware: function(connect, options) {
              var base;
              base = Array.isArray(options.base) ? options.base[options.base.length - 1] : options.base;
              return [connect["static"](base)];
            }
          }
        }
      },
      protractor: {
        local: {
          options: {
            configFile: 'test/protractor-local.conf.js',
            args: {
              params: {
                testThrottleValue: 500
              }
            }
          }
        },
        travis: {
          options: {
            configFile: 'test/protractor-travis.conf.js',
            args: {
              params: {
                testThrottleValue: 10000
              },
              sauceUser: sauceUser,
              sauceKey: sauceKey
            }
          }
        }
      }
    });
    grunt.registerTask('webdriver', function() {
      var done, p;
      done = this.async();
      p = require('child_process').spawn('node', ['node_modules/protractor/bin/webdriver-manager', 'update']);
      p.stdout.pipe(process.stdout);
      p.stderr.pipe(process.stderr);
      return p.on('exit', function(code) {
        if (code !== 0) {
          grunt.fail.warn('Webdriver failed to update');
        }
        return done();
      });
    });
    grunt.registerTask('sauce-connect', function() {
      var done;
      done = this.async();
      return require('sauce-connect-launcher')({
        username: sauceUser,
        accessKey: sauceKey
      }, function(err, sauceConnectProcess) {
        if (err) {
          return console.error(err.message);
        } else {
          return done();
        }
      });
    });

    //grunt.loadNpmTasks("grunt-contrib-eslint");
    grunt.registerTask('default', [/*'eslint', */'clean', 'concat', 'uglify']);
    grunt.registerTask('test:protractor-local', ['default', 'webdriver', 'connect:testserver', 'protractor:local']);
    return grunt.registerTask('test:protractor-travis', ['connect:testserver', 'sauce-connect', 'protractor:travis']);
  };

}).call(this);
