class App.Sound
	constructor: (@buffer)->

	play: (time)->
		@source?.stop(0)
		@source = App.audio.context.createBufferSource()
		@source.buffer = @buffer
		@source.connect App.audio.context.destination
		
		@source.start time