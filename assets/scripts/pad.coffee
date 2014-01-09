class App.Pad
	constructor: (opts)->
		@id = opts.id
		@sound = App.audio.sounds[@id]
		@sprite = App.sprites[@id]
		@resolution = 60 / App.config.bpm * opts.resolution * 4 * 1000
		
		@spriteDuration = Math.floor(@sound.buffer.duration * 1000 / @sprite.length) * @sprite.length
		@spriteDuration = 500 unless @spriteDuration

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
		@triggerAt = @ts + @resolution - (@ts % @resolution)
