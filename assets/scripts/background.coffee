class App.Background
	@prototype.radius = App.config.pad.width / 2 - 8
	@prototype.borderWidth = 10
	
	constructor: (opts)->
		@centerX = opts.col * App.config.pad.width + (App.config.pad.width / 2)
		@centerY = opts.row * App.config.pad.width + (App.config.pad.width / 2)
		@color = opts.background
		@reset()

	play: (@fadeRemaining, @solidRemaining)->
		@isPlaying = true
		@fadeTotal = @fadeRemaining
		@

	reset: ->
		@isPlaying = false
		@fadeRemaining = 0
		@fadeTotal = 0
		@solidRemaining = 0
		@isPlaying = false
		@

	drawBackground: (dt)->
		return unless @isPlaying

		@fadeRemaining -= dt
		@solidRemaining -= dt

		if @fadeRemaining > 0
			opacity = ((@fadeTotal - @fadeRemaining) / @fadeTotal) * .5
		else if @solidRemaining > 0
			opacity = .5
		else
			return @reset()

		App.canvas.ctx.save()
		App.canvas.ctx.beginPath()
		App.canvas.ctx.arc @centerX, @centerY, @radius - (@borderWidth / 2), 0, 2 * Math.PI, false
		App.canvas.ctx.fillStyle = @color
		App.canvas.ctx.globalAlpha = opacity
		App.canvas.ctx.fill()
		App.canvas.ctx.restore()

	drawBorder: ->
		App.canvas.ctx.save()
		App.canvas.ctx.beginPath()
		App.canvas.ctx.arc @centerX, @centerY, @radius, 0, 2 * Math.PI, false
		App.canvas.ctx.lineWidth = @borderWidth
		App.canvas.ctx.strokeStyle = @color
		App.canvas.ctx.globalAlpha = .8
		App.canvas.ctx.stroke()
		App.canvas.ctx.restore()

	render: (dt)->
		@drawBackground dt
		@drawBorder()

		
		
