window.Hammer = (function(App) {
  App.data = [
    {
      id: 'brushfill',
      name: 'Brush Fill',
      image: 'drum.png',
      audio: 'brushfill.120.mp3'
    }, {
      id: 'mellowrhodes',
      name: 'Mellow Rhodes',
      image: 'piano.png',
      audio: 'mellowrhodes_Cmi_120.mp3'
    }, {
      id: 'sawtooth',
      name: 'Sawtooth Wave',
      image: 'sawtooth.png',
      audio: '220_Hz_sawtooth_wave.ogg'
    }
  ];
  App.load = function() {
    var handleLoad, manifest;
    manifest = this.data.map(function(item) {
      return {
        id: item.id,
        src: item.audio
      };
    });
    this.pendingAudioCount = this.data.length;
    createjs.Sound.alternateExtensions = ["mp3"];
    handleLoad = App.init.bind(App);
    createjs.Sound.addEventListener('fileload', handleLoad);
    return createjs.Sound.registerManifest(manifest, 'audio/');
  };
  App.init = function(target) {
    var $pad;
    this.pendingAudioCount--;
    $pad = $(document.createElement('div'));
    $pad.attr({
      id: target.id,
      "class": 'pad'
    });
    $pad.on('click', function() {
      return createjs.Sound.play(this.id);
    });
    return $('.pads').append($pad);
  };
  return App;
})(window.Hammer || {});

window.Hammer.load();
