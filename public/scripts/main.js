window.Hammer = (function(App) {
  App.config = {
    targetFPS: 40,
    sprite: {
      width: 200,
      height: 200,
      numFrames: 4
    },
    paths: {
      sprite: 'images/sprites/',
      audio: 'audio/'
    }
  };
  App.manifest = [
    {
      id: 'black',
      sprite: 'hexagon_black.png',
      audio: 'button-1.mp3'
    }, {
      id: 'blue',
      sprite: 'hexagon_blue.png',
      audio: 'button-2.mp3'
    }, {
      id: 'green',
      sprite: 'hexagon_green.png',
      audio: 'button-3.mp3'
    }, {
      id: 'red',
      sprite: 'hexagon_red.png',
      audio: 'button-4.mp3'
    }
  ];
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  App.audio = {
    context: new AudioContext(),
    sounds: {}
  };
  App.sprites = {};
  App.load = function() {
    var item, loadAudio, loadImage, loaderBar, remainingItems, totalItems, updateLoader, xhr, _i, _len, _ref, _results;
    totalItems = App.manifest.length * 2;
    remainingItems = totalItems;
    loaderBar = document.querySelector('#loader .bar');
    xhr = function(src, callback) {
      var req;
      req = new XMLHttpRequest();
      req.open('GET', src, true);
      req.responseType = 'arraybuffer';
      req.addEventListener('load', function() {
        callback(req.response);
        return updateLoader();
      });
      return req.send();
    };
    updateLoader = function() {
      remainingItems--;
      loaderBar.style.width = "" + (Math.ceil(((totalItems - remainingItems) / totalItems) * 100)) + "%";
      if (!remainingItems) {
        return setTimeout((function() {
          document.body.removeChild(document.querySelector('#loader'));
          return App.init();
        }), 500);
      }
    };
    loadAudio = function(item) {
      var ctx;
      ctx = App.audio.context;
      return xhr("" + App.config.paths.audio + item.audio, function(res) {
        return ctx.decodeAudioData(res, function(buffer) {
          return App.audio.sounds[item.id] = new App.Sound(buffer);
        });
      });
    };
    loadImage = function(item) {
      return xhr("" + App.config.paths.sprite + item.sprite, function(res) {
        var blob;
        blob = new Blob([res], {
          type: 'image/png'
        });
        return App.sprites[item.id] = new App.Sprite(blob);
      });
    };
    _ref = this.manifest;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      loadAudio(item);
      _results.push(loadImage(item));
    }
    return _results;
  };
  App.init = function() {
    var item, pads, _i, _len, _ref;
    pads = [];
    _ref = this.manifest;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      pads.push(new App.Pad(item.id));
    }
    return this.state = new App.State(pads);
  };
  App.State = (function() {
    function State(pads) {
      var canvas;
      this.pads = pads;
      canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
      this.initPads();
      this.time = 0;
    }

    State.prototype.update = function(evt) {
      return this.stage.update();
    };

    State.prototype.initPads = function() {};

    return State;

  })();
  App.Sound = (function() {
    function Sound(buffer) {
      this.buffer = buffer;
    }

    Sound.prototype.play = function(time) {
      var source;
      source = App.audio.context.createBufferSource();
      source.buffer = this.buffer;
      source.connect(App.audio.context.destination);
      return source.start(time);
    };

    return Sound;

  })();
  App.Sprite = (function() {
    function Sprite(blob) {
      this.blob = blob;
    }

    return Sprite;

  })();
  App.Pad = (function() {
    function Pad(id) {
      this.id = id;
      this.sound = App.audio.sounds[this.id];
      this.sprite = App.sprites[this.id];
    }

    return Pad;

  })();
  return App;
})(window.Hammer || {});

window.addEventListener('load', window.Hammer.load.bind(window.Hammer));
