window.Hammer = ((App)->
	App.config = 
		bpm: 120
		resolution: 1/8
		sprite:
			width: 200
			height: 200
			numFrames: 4
			fps: 16
		paths: 
			sprite: 'images/sprites/'
			audio: 'audio/'
	
	App.manifest = 
		[
			{
				id: 'black'
				sprite: 'hexagon_black.png'
				audio: 'shuffled_house_120.mp3'
				soloDuration: 4
				row: 0
				col: 0
			}
			{
				id: 'blue'
				sprite: 'hexagon_blue.png'
				audio: 'button-2.mp3'
				soloDuration: 1/8
				row: 0
				col: 1
			}
			{
				id: 'green'
				sprite: 'hexagon_green.png'
				audio: 'button-3.mp3'
				soloDuration: 1/8
				row: 0
				col: 2
			}
			{
				id: 'red'
				sprite: 'hexagon_red.png'
				audio: 'button-4.mp3'
				soloDuration: 1/8
				row: 0
				col: 3
			}
		]

	window.AudioContext = window.AudioContext or window.webkitAudioContext
	window.requestAnimationFrame = window.requestAnimationFrame or window.webkitRequestAnimationFrame

	App.canvas = {}

	App.audio = 
		context: new AudioContext()
		sounds: {}

	App.sprites = {}

	App.load = ->
		totalItems = App.manifest.length * 2
		remainingItems = totalItems
		loaderBar = document.querySelector '#loader .bar'

		@canvas.el = document.querySelector 'canvas'
		@canvas.el.width = window.innerWidth
		@canvas.el.height = window.innerHeight
		@canvas.ctx = @canvas.el.getContext '2d'

		updateLoader = ->
			remainingItems--
			loaderBar.style.width = "#{Math.ceil(((totalItems - remainingItems) / totalItems) * 100)}%"
			
			unless remainingItems
				setTimeout (->
						loader = document.querySelector('#loader')
						transitionEnd = (evt)->
							return unless evt.propertyName is 'opacity'
						
							document.body.removeChild loader
							App.init()

						loader.style.opacity = 0

						loader.addEventListener 'transitioned', transitionEnd
						loader.addEventListener 'webkitTransitionEnd', transitionEnd
					), 500


		loadAudio = (item)->
			ctx = App.audio.context

			req = new XMLHttpRequest()
			req.open 'GET', "#{App.config.paths.audio}#{item.audio}", true
			req.responseType = 'arraybuffer'

			req.addEventListener 'load', ->
				ctx.decodeAudioData req.response, (buffer)->
					App.audio.sounds[item.id] = new App.Sound buffer
					updateLoader()				

			req.send()

		loadImage = (item)->
			image = document.createElement 'img'
			image.addEventListener 'load', ->
				opts =
					image: image
					col: item.col
					row: item.row

				App.sprites[item.id] = new App.Sprite opts

				updateLoader()

			image.src = "#{App.config.paths.sprite}#{item.sprite}"

		@manifest.forEach (item)->
			loadAudio item
			loadImage item

	App.init = ->
		pads = []
		@manifest.forEach (item)-> pads.push( new App.Pad item )

		@state = new App.State pads

		@canvas.el.addEventListener 'click', ->
			App.state.pads[0].trigger()
			App.state.pads[2].trigger()

	class App.State
		constructor: (@pads)->
			@update()

		update: (ts)=>
			if ts
				App.canvas.ctx.clearRect 0, 0, App.canvas.el.width, App.canvas.el.height
				@pads.forEach (pad)-> pad.update ts

			requestAnimationFrame @update

			return

		render: (dt)->

	class App.Sound
		constructor: (@buffer)->

		play: (time)->
			source = App.audio.context.createBufferSource()
			source.buffer = @buffer
			source.connect App.audio.context.destination
			
			source.start time

	class App.Sprite
		@prototype.fps = App.config.sprite.fps
		@prototype.numFrames = App.config.sprite.numFrames
		@prototype.length = (1000 / @prototype.fps) * @prototype.numFrames
		@prototype.width = App.config.sprite.width
		@prototype.height = App.config.sprite.height

		constructor: (opts)->
			@image = opts.image
			@x = opts.col * @width
			@y = opts.row * @height
			@reset()

		play: (@timeRemaining = 0)->
			@isPlaying = true
			@index = 1
			@

		reset: ->
			@isPlaying = false
			@duration = 0
			@index = 0
			@

		update: (dt)->
			if @isPlaying
				@timeRemaining -= dt

				if @timeRemaining > 0
					@index = (@index + dt * @fps / 1000) % @numFrames
				else 
					@reset()
			@

		render: (dt)->
			@update dt

			App.canvas.ctx.save()
			App.canvas.ctx.drawImage @image, Math.floor(@index) * @width, 0, @width, @height, @x, @y, @width, @height
			App.canvas.ctx.restore()
			@

	class App.Pad
		@prototype.resolution = 60 / App.config.bpm * App.config.resolution * 4 * 1000
		constructor: (opts)->
			@id = opts.id
			@sound = App.audio.sounds[@id]
			@sprite = App.sprites[@id]
			
			@spriteDuration = Math.floor(@sound.buffer.duration * 1000 / @sprite.length) * @sprite.length
			@spriteDuration = 500 unless @spriteDuration

			@duration = 
			
			@queue = []

		update: (ts)->
			@ts = ts unless @ts
			
			dt = ts - @ts
			@ts = ts

			if @triggerAt and @ts >= @triggerAt
				@sound.play(0)
				@sprite.play(@spriteDuration)
				
				@triggerAt = null
			
			@sprite.render(dt)

		trigger: ->
			unless @triggerAt or @sprite.isPlaying
				@triggerAt = @ts + @resolution - (@ts % @resolution)

	App
)(window.Hammer or {})

window.addEventListener 'load', window.Hammer.load.bind(window.Hammer)