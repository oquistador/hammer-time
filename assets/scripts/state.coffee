class App.State
	
	constructor: (opts)->
		@canvas = opts.canvas
		@pads = []
		@pads[@getPadIndex(pad.sprite.x, pad.sprite.y)] = pad for pad in opts.pads

		if 'ontouchstart' of window
			@activeTouches = {}
			@canvas.addEventListener 'touchstart', @handleTouchStart
			@canvas.addEventListener 'touchmove', @handleTouchMove
			@canvas.addEventListener 'touchend', @handleTouchEnd
		else
			@canvas.addEventListener 'click', @handleClick

		@update()

	handleClick: (evt)=>
		@pads[@getPadIndex(evt.offsetX, evt.offsetY)].trigger()

	handleTouchStart: (evt)=>
		evt.preventDefault()
		offsetX = evt.target.offsetLeft
		offsetY = evt.target.offsetTop
		
		for touch in evt.changedTouches
			padIdx = @getPadIndex touch.clientX - offsetX, touch.clientY - offsetY
			@activeTouches[touch.identifier] = padIdx
			@pads[padIdx].trigger()

	handleTouchMove: (evt)=>
		evt.preventDefault()
		offsetX = evt.target.offsetLeft
		offsetY = evt.target.offsetTop
		
		for touch in evt.changedTouches
			padIdx = @getPadIndex touch.clientX - offsetX, touch.clientY - offsetY
			
			if padIdx isnt @activeTouches[touch.identifier]
				@activeTouches[touch.identifier] = padIdx
				@pads[padIdx].trigger()

	handleTouchEnd: (evt)=>
		evt.preventDefault()
		delete @activeTouches[touch.identifier] for touch in evt.changedTouches
			
	getPadIndex: (x, y)->
		return -1 if x >= @canvas.width or y >= @canvas.height

		Math.floor(x / App.config.sprite.width) + Math.floor(y / App.config.sprite.height) * @canvas.width / App.config.sprite.width

	update: (ts)=>
		if ts
			App.canvas.ctx.clearRect 0, 0, App.canvas.el.width, App.canvas.el.height
			@pads.forEach (pad)-> pad.update ts

		requestAnimationFrame @update

		return