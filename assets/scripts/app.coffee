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

window.addEventListener 'load', App.load.bind(App)