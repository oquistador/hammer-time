class App.Pad
	constructor: (opts)->
		@id = opts.id
		
		@sound = App.audio.sounds[@id]
		@sprite = App.sprites[@id]
		@background = new App.Background opts

		@resolution = 60 / App.config.bpm * opts.resolution * 4 * 1000
		@playDurration = Math.floor(@sound.buffer.duration * 1000 / @sprite.duration) * @sprite.duration
		@playDurration = 500 unless @playDurration

		@queue = []

	update: (ts)->
		@ts = ts unless @ts
		
		dt = ts - @ts
		@ts = ts

		if @triggerAt and @ts >= @triggerAt
			@sound.play 0 
			@sprite.play @playDurration 
			
			@triggerAt = null

		@background.render dt
		@sprite.render dt

	trigger: ->
		@triggerAt = @ts + @resolution - (@ts % @resolution)
		@background.play @triggerAt - @ts, @playDurration

