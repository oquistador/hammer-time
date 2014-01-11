module.exports = function(grunt) {
	grunt.initConfig({
		connect: {
			server: {
				options: {
					hostname: '*',
					base: 'public',
					keepalive: true
				}
			}
		},

		coffee: {
			compile: {
				options: {
					join: true
				},
				files: {
					'public/scripts/main.js': [
						'assets/scripts/header.coffee',
						'assets/scripts/config.coffee',
						'assets/scripts/manifest.coffee',
						'assets/scripts/app.coffee',
						'assets/scripts/state.coffee',
						'assets/scripts/sound.coffee',
						'assets/scripts/sprite.coffee',
						'assets/scripts/background.coffee',
						'assets/scripts/pad.coffee',
						'assets/scripts/footer.coffee',
					]
				}
			}
		},

		sass: {
			dist: {
				files: [{
					cwd: 'assets/stylesheets/',
					expand: true,
					src: '*.scss',
					dest: 'public/stylesheets/',
					ext: '.css'
				}]
			}
		},

		watch: {
			css: {
				files: 'assets/stylesheets/*.scss',
				tasks: ['sass']
			},
			scripts: {
				files: 'assets/scripts/*.coffee',
				tasks: ['coffee']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['connect', 'watch']);
};