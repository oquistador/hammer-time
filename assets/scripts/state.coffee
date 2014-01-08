class App.State
	constructor: (@pads)->
		@update()

	update: (ts)=>
		if ts
			App.canvas.ctx.clearRect 0, 0, App.canvas.el.width, App.canvas.el.height
			@pads.forEach (pad)-> pad.update ts

		requestAnimationFrame @update

		return