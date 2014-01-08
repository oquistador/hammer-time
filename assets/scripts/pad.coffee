class App.Pad
	@prototype.resolution = 60 / App.config.bpm * App.config.resolution * 4 * 1000
	constructor: (opts)->
		@id = opts.id
		@sound = App.audio.sounds[@id]
		@sprite = App.sprites[@id]
		
		@spriteDuration = Math.floor(@sound.buffer.duration * 1000 / @sprite.length) * @sprite.length
		@spriteDuration = 500 unless @spriteDuration

		@duration = 
		
		@queue = []

	update: (ts)->
		@ts = ts unless @ts
		
		dt = ts - @ts
		@ts = ts

		if @triggerAt and @ts >= @triggerAt
			@sound.play(0)
			@sprite.play(@spriteDuration)
			
			@triggerAt = null
		
		@sprite.render(dt)

	trigger: ->
		unless @triggerAt or @sprite.isPlaying
			@triggerAt = @ts + @resolution - (@ts % @resolution)