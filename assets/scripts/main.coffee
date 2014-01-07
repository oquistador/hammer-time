window.Hammer = ((App)->
	App.config = 
		targetFPS: 40
		sprite:
			width: 200
			height: 200
			numFrames: 4
		paths: 
			sprite: 'images/sprites/'
			audio: 'audio/'
	
	App.manifest = 
		[
			{
				id: 'black'
				sprite: 'hexagon_black.png'
				audio: 'button-1.mp3'
			}
			{
				id: 'blue'
				sprite: 'hexagon_blue.png'
				audio: 'button-2.mp3'
			}
			{
				id: 'green'
				sprite: 'hexagon_green.png'
				audio: 'button-3.mp3'
			}
			{
				id: 'red'
				sprite: 'hexagon_red.png'
				audio: 'button-4.mp3'
			}
		]

	window.AudioContext = window.AudioContext or window.webkitAudioContext

	App.audio = 
		context: new AudioContext()
		sounds: {}

	App.sprites = {}

	App.load = ->
		totalItems = App.manifest.length * 2
		remainingItems = totalItems
		loaderBar = document.querySelector '#loader .bar'

		xhr = (src, callback)->
			req = new XMLHttpRequest()
			req.open 'GET', src, true
			req.responseType = 'arraybuffer'

			req.addEventListener 'load', ->
				callback req.response
				updateLoader()

			req.send()

		updateLoader = ->
			remainingItems--
			loaderBar.style.width = "#{Math.ceil(((totalItems - remainingItems) / totalItems) * 100)}%"
			
			unless remainingItems
				setTimeout (->
						document.body.removeChild document.querySelector('#loader')
						App.init()
					), 500


		loadAudio = (item)->
			ctx = App.audio.context

			xhr "#{App.config.paths.audio}#{item.audio}", (res)->
				ctx.decodeAudioData res, (buffer)->
					App.audio.sounds[item.id] = new App.Sound buffer

		loadImage = (item)->
			xhr "#{App.config.paths.sprite}#{item.sprite}", (res)->
				blob = new Blob [res], type: 'image/png'
				App.sprites[item.id] = new App.Sprite blob

		for item in @manifest
			loadAudio item
			loadImage item

	App.init = ->
		pads = []
		pads.push( new App.Pad item.id ) for item in @manifest

		@state = new App.State pads

	class App.State
		constructor: (@pads)->
			canvas = document.createElement 'canvas'
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight

			document.body.appendChild canvas

			@initPads()

			@time = 0

		update: (evt)->
			@stage.update()

		initPads: ->

	class App.Sound
		constructor: (@buffer)->

		play: (time)->
			source = App.audio.context.createBufferSource()
			source.buffer = @buffer
			source.connect App.audio.context.destination
			
			source.start time

	class App.Sprite
		constructor: (@blob)->

	class App.Pad
		constructor: (@id)->
			@sound = App.audio.sounds[@id]
			@sprite = App.sprites[@id]
	
	App
)(window.Hammer or {})

window.addEventListener 'load', window.Hammer.load.bind(window.Hammer)