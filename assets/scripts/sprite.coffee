class App.Sprite
	@prototype.fps = App.config.sprite.fps
	@prototype.numFrames = App.config.sprite.numFrames
	@prototype.length = (1000 / @prototype.fps) * @prototype.numFrames
	@prototype.width = App.config.sprite.width
	@prototype.height = App.config.sprite.height

	constructor: (opts)->
		@image = opts.image
		@x = opts.col * @width
		@y = opts.row * @height
		@reset()

	play: (@timeRemaining = 0)->
		@isPlaying = true
		@index = 1
		@

	reset: ->
		@isPlaying = false
		@duration = 0
		@index = 0
		@

	update: (dt)->
		if @isPlaying
			@timeRemaining -= dt

			if @timeRemaining > 0
				@index = (@index + dt * @fps / 1000) % @numFrames
			else 
				@reset()
		@

	render: (dt)->
		@update dt

		App.canvas.ctx.save()
		App.canvas.ctx.drawImage @image, Math.floor(@index) * @width, 0, @width, @height, @x, @y, @width, @height
		App.canvas.ctx.restore()
		@