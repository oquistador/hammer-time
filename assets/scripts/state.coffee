class App.State
	constructor: (items)->
		@canvas = App.canvas.el
		@pixelRatio = if window.devicePixelRatio > 1 then 2 else 1
		@padWidth = App.config.pad.width
		@padHeight = App.config.pad.height
		@numCols = @canvas.width / @padWidth

		@pads = []

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

	getOffsetPadIndex: (x, y)->

		if window.orientation is 0
			offsetX = (window.innerWidth - (@canvas.height / @pixelRatio)) / 2
			offsetY = (window.innerHeight - (@canvas.width / @pixelRatio)) / 2
			x = @canvas.height - ((x - offsetX) * @pixelRatio)
			y = (y - offsetY) * @pixelRatio
			col = Math.floor(y / @padWidth)
			row = Math.floor(x / @padHeight)

		else
			offsetX = (window.innerWidth - (@canvas.width / @pixelRatio)) / 2
			offsetY = (window.innerHeight - (@canvas.height / @pixelRatio)) / 2
			x = (x - offsetX) * @pixelRatio
			y = (y - offsetY) * @pixelRatio
			col = Math.floor(x / @padWidth)
			row = Math.floor(y / @padHeight)

		row * @numCols + col

	handleClick: (evt)=>
		@pads[@getPadIndex(evt.offsetX, evt.offsetY)].trigger()

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