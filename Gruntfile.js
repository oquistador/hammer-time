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
				options: {bare: true},
				files: [{
					cwd: 'assets/scripts/',
					expand: true,
					src: '*.coffee',
					dest: 'public/scripts/',
					ext: '.js'
				}]
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