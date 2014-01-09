App.canvas = {}

App.audio = 
	context: new AudioContext()
	sounds: {}

App.sprites = {}

App.load = ->
	totalItems = App.manifest.length * 2
	remainingItems = totalItems
	loaderBar = document.querySelector '#loader .bar'
	App.canvas.el = document.querySelector 'canvas'
	App.canvas.ctx = App.canvas.el.getContext '2d'

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

	App.manifest.forEach (item)->
		loadAudio item
		loadImage item

App.init = ->
	pads = []
	App.manifest.forEach (item)-> pads.push( new App.Pad item )
	App.state = new App.State pads: pads, canvas: App.canvas.el

	App.checkOrientation()
	window.addEventListener 'orientationchange', App.checkOrientation

App.checkOrientation = (orientation)->
	if window.orientation is 0
		App.canvas.el.style.webkitTransform = 'rotate(90deg)'
	else
		App.canvas.el.style.webkitTransform = 'rotate(0deg)'

window.addEventListener 'load', App.load.bind(App)