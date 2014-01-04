window.Hammer = ((App)->
	App.data = 
		[
			{
				id: 'brushfill'
				name: 'Brush Fill'
				image: 'drum.png'
				audio: 'brushfill.120.mp3'
			}
			{
				id: 'mellowrhodes'
				name: 'Mellow Rhodes'
				image: 'piano.png'
				audio: 'mellowrhodes_Cmi_120.mp3'
			}
			{
				id: 'sawtooth'
				name: 'Sawtooth Wave'
				image: 'sawtooth.png'
				audio: '220_Hz_sawtooth_wave.ogg'
			}
		]

	App.load = ->
		manifest = @data.map (item)-> id: item.id, src: item.audio

		@pendingAudioCount = @data.length
		
		createjs.Sound.alternateExtensions = ["mp3"]
		
		handleLoad = App.init.bind App

		createjs.Sound.addEventListener 'fileload', handleLoad
		createjs.Sound.registerManifest manifest, 'audio/'

	App.init = (target)->
		@pendingAudioCount--

		$pad = $ document.createElement('div')
		$pad.attr(id: target.id, class: 'pad')
		$pad.on 'click', -> createjs.Sound.play @id

		$('.pads').append $pad

	App
)(window.Hammer or {})

window.Hammer.load()