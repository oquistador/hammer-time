class App.Background
	@prototype.radius = App.config.pad.width / 2 - 6
	
	constructor: (opts)->
		@centerX = opts.col * App.config.pad.width + (App.config.pad.width / 2)
		@centerY = opts.row * App.config.pad.width + (App.config.pad.width / 2)
		@color = opts.background

	drawBackground: ->
		App.canvas.ctx.save()
		App.canvas.ctx.beginPath()
		App.canvas.ctx.arc @centerX, @centerY, @radius, 0, 2 * Math.PI, false
		App.canvas.ctx.fillStyle = @color
		App.canvas.ctx.fill()
		App.canvas.ctx.lineWidth = 6
		App.canvas.ctx.strokeStyle = '#000'
		App.canvas.ctx.stroke()
		App.canvas.ctx.restore()

	drawMask: (dt)->
		App.canvas.ctx.save()
		App.canvas.ctx.beginPath()
		App.canvas.ctx.arc @centerX, @centerY, @radius - 10, 0, 2 * Math.PI, false
		App.canvas.ctx.fillStyle = '#fff'
		App.canvas.ctx.fill()
		App.canvas.ctx.restore()
	
	render: (dt)->
		@drawBackground()
		@drawMask()

		
		
