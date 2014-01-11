class App.State
	constructor: (items)->
		@canvas = App.canvas.el
		@padWidth = App.config.pad.width
		@padHeight = App.config.pad.height
		@numCols = @canvas.width / @padWidth

		@pads = []

		@scaleCanvas()

		window.addEventListener 'resize', @scaleCanvas.bind(@)
		window.addEventListener 'orientationchange', @scaleCanvas.bind(@)

		for item in items
			pad = new App.Pad item
			@pads[item.row * @numCols + item.col] = pad

		if 'ontouchstart' of window
			@activeTouches = {}
			@canvas.addEventListener 'touchstart', @handleTouchStart
			@canvas.addEventListener 'touchmove', @handleTouchMove
			@canvas.addEventListener 'touchend', @handleTouchEnd
		else
			@canvas.addEventListener 'click', @handleClick

		@update()

	scaleCanvas: (evt)->
		@size = if window.innerWidth < window.innerHeight then window.innerWidth else window.innerHeight
		@pixelRatio = @canvas.width / @size

		@canvas.style.width = "#{@size}px"
		@canvas.style.height = "#{@size}px"

	getOffsetPadIndex: (x, y)->
		offsetX = (window.innerWidth - @size) / 2
		offsetY = (window.innerHeight - @size) / 2
		x = (x - offsetX) * @pixelRatio
		y = (y - offsetY) * @pixelRatio

		if window.orientation is 0
			col = Math.floor(y / @padWidth)
			row = Math.floor((@canvas.width - x)/ @padHeight)

		else
			col = Math.floor(x / @padWidth)
			row = Math.floor(y / @padHeight)

		row * @numCols + col

	handleClick: (evt)=>
		@pads[@getOffsetPadIndex(evt.clientX, evt.clientY)].trigger()

	handleTouchStart: (evt)=>
		evt.preventDefault()
		
		for touch in evt.changedTouches
			padIdx = @getOffsetPadIndex touch.clientX, touch.clientY
			@activeTouches[touch.identifier] = padIdx
			@pads[padIdx].trigger()

	handleTouchMove: (evt)=>
		evt.preventDefault()
		
		for touch in evt.changedTouches
			padIdx = @getOffsetPadIndex touch.clientX, touch.clientY
			
			if padIdx isnt @activeTouches[touch.identifier]
				@activeTouches[touch.identifier] = padIdx
				@pads[padIdx].trigger()

	handleTouchEnd: (evt)=>
		evt.preventDefault()
		delete @activeTouches[touch.identifier] for touch in evt.changedTouches
			
	update: (ts)=>
		if ts
			App.canvas.ctx.clearRect 0, 0, @canvas.width, @canvas.height
			@pads.forEach (pad)-> pad.update ts

		requestAnimationFrame @update

		return