App.canvas = {}

App.audio = 
	context: new AudioContext()
	sounds: {}

App.sprites = {}

App.load = ->
	totalItems = App.manifest.length * 2
	remainingItems = totalItems
	loadingBar = document.querySelector '#loading-bar'
	App.canvas.el = document.querySelector 'canvas'
	App.canvas.ctx = App.canvas.el.getContext '2d'

	updateLoader = ->
		remainingItems--
		width = Math.ceil(((totalItems - remainingItems) / totalItems) * 80)
		loadingBar.setAttribute 'width', width

		unless remainingItems
			setTimeout (->
					loading = document.querySelector('#loading')
					transitionEnd = (evt)->
						return unless evt.propertyName is 'opacity'
					
						loading.parentNode.style.display = 'none'
						App.init()

					loading.style.opacity = 0

					loading.addEventListener 'transitioned', transitionEnd
					loading.addEventListener 'webkitTransitionEnd', transitionEnd
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
	App.state = new App.State App.manifest

window.addEventListener 'load', App.load.bind(App)