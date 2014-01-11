(function() {
  var App,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

  App = {};

  App.config = {
    bpm: 120,
    pad: {
      width: 200,
      height: 200,
      sprite: {
        numFrames: 4,
        fps: 16
      }
    },
    paths: {
      sprite: 'images/sprites/',
      audio: 'audio/'
    }
  };

  App.manifest = [
    {
      id: 'clap',
      sprite: 'hexagon_black.png',
      audio: 'TR-909-clap.mp3',
      resolution: 1 / 8,
      row: 0,
      col: 0
    }, {
      id: 'sleigh-bells',
      sprite: 'hexagon_black.png',
      audio: 'sleigh-bells.mp3',
      resolution: 1 / 8,
      row: 0,
      col: 1
    }, {
      id: 'raspberry',
      sprite: 'hexagon_black.png',
      audio: 'raspberry.mp3',
      resolution: 1 / 8,
      row: 0,
      col: 2
    }, {
      id: 'funky-drummer',
      sprite: 'hexagon_black.png',
      audio: 'funky-drummer.mp3',
      resolution: 1 / 4,
      row: 1,
      col: 0
    }, {
      id: 'cuckoo',
      sprite: 'hexagon_black.png',
      audio: 'cuckoo.mp3',
      resolution: 1 / 8,
      row: 1,
      col: 1
    }, {
      id: 'snort',
      sprite: 'hexagon_black.png',
      audio: 'snort.mp3',
      resolution: 1 / 8,
      row: 1,
      col: 2
    }, {
      id: 'meow',
      sprite: 'hexagon_black.png',
      audio: 'meow.mp3',
      resolution: 1 / 8,
      row: 2,
      col: 0
    }, {
      id: 'double-slide-whistle',
      sprite: 'hexagon_black.png',
      audio: 'double-slide-whistle.mp3',
      resolution: 1 / 8,
      row: 2,
      col: 1
    }, {
      id: 'laser',
      sprite: 'hexagon_black.png',
      audio: 'laser.mp3',
      resolution: 1 / 8,
      row: 2,
      col: 2
    }
  ];

  App.canvas = {};

  App.audio = {
    context: new AudioContext(),
    sounds: {}
  };

  App.sprites = {};

  App.load = function() {
    var loadAudio, loadImage, loaderBar, remainingItems, totalItems, updateLoader;
    totalItems = App.manifest.length * 2;
    remainingItems = totalItems;
    loaderBar = document.querySelector('#loader .bar');
    App.canvas.el = document.querySelector('canvas');
    App.canvas.ctx = App.canvas.el.getContext('2d');
    updateLoader = function() {
      remainingItems--;
      loaderBar.style.width = "" + (Math.ceil(((totalItems - remainingItems) / totalItems) * 100)) + "%";
      if (!remainingItems) {
        return setTimeout((function() {
          var loader, transitionEnd;
          loader = document.querySelector('#loader');
          transitionEnd = function(evt) {
            if (evt.propertyName !== 'opacity') {
              return;
            }
            document.body.removeChild(loader);
            return App.init();
          };
          loader.style.opacity = 0;
          loader.addEventListener('transitioned', transitionEnd);
          return loader.addEventListener('webkitTransitionEnd', transitionEnd);
        }), 500);
      }
    };
    loadAudio = function(item) {
      var ctx, req;
      ctx = App.audio.context;
      req = new XMLHttpRequest();
      req.open('GET', "" + App.config.paths.audio + item.audio, true);
      req.responseType = 'arraybuffer';
      req.addEventListener('load', function() {
        return ctx.decodeAudioData(req.response, function(buffer) {
          App.audio.sounds[item.id] = new App.Sound(buffer);
          return updateLoader();
        });
      });
      return req.send();
    };
    loadImage = function(item) {
      var image;
      image = document.createElement('img');
      image.addEventListener('load', function() {
        var opts;
        opts = {
          image: image,
          col: item.col,
          row: item.row
        };
        App.sprites[item.id] = new App.Sprite(opts);
        return updateLoader();
      });
      return image.src = "" + App.config.paths.sprite + item.sprite;
    };
    return App.manifest.forEach(function(item) {
      loadAudio(item);
      return loadImage(item);
    });
  };

  App.init = function() {
    return App.state = new App.State(App.manifest);
  };

  window.addEventListener('load', App.load.bind(App));

  App.State = (function() {
    function State(items) {
      this.update = __bind(this.update, this);
      this.handleTouchEnd = __bind(this.handleTouchEnd, this);
      this.handleTouchMove = __bind(this.handleTouchMove, this);
      this.handleTouchStart = __bind(this.handleTouchStart, this);
      this.handleClick = __bind(this.handleClick, this);
      var item, pad, _i, _len;
      this.canvas = App.canvas.el;
      this.padWidth = App.config.pad.width;
      this.padHeight = App.config.pad.height;
      this.numCols = this.canvas.width / this.padWidth;
      this.pads = [];
      this.scaleCanvas();
      window.addEventListener('resize', this.scaleCanvas.bind(this));
      window.addEventListener('orientationchange', this.scaleCanvas.bind(this));
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        pad = new App.Pad(item);
        this.pads[item.row * this.numCols + item.col] = pad;
      }
      if ('ontouchstart' in window) {
        this.activeTouches = {};
        this.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.canvas.addEventListener('touchmove', this.handleTouchMove);
        this.canvas.addEventListener('touchend', this.handleTouchEnd);
      } else {
        this.canvas.addEventListener('click', this.handleClick);
      }
      this.update();
    }

    State.prototype.scaleCanvas = function(evt) {
      this.size = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
      this.pixelRatio = this.canvas.width / this.size;
      this.canvas.style.width = "" + this.size + "px";
      return this.canvas.style.height = "" + this.size + "px";
    };

    State.prototype.getOffsetPadIndex = function(x, y) {
      var col, offsetX, offsetY, row;
      offsetX = (window.innerWidth - this.size) / 2;
      offsetY = (window.innerHeight - this.size) / 2;
      x = (x - offsetX) * this.pixelRatio;
      y = (y - offsetY) * this.pixelRatio;
      if (window.orientation === 0) {
        col = Math.floor(y / this.padWidth);
        row = Math.floor((this.canvas.width - x) / this.padHeight);
      } else {
        col = Math.floor(x / this.padWidth);
        row = Math.floor(y / this.padHeight);
      }
      return row * this.numCols + col;
    };

    State.prototype.handleClick = function(evt) {
      return this.pads[this.getOffsetPadIndex(evt.clientX, evt.clientY)].trigger();
    };

    State.prototype.handleTouchStart = function(evt) {
      var padIdx, touch, _i, _len, _ref, _results;
      evt.preventDefault();
      _ref = evt.changedTouches;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        padIdx = this.getOffsetPadIndex(touch.clientX, touch.clientY);
        this.activeTouches[touch.identifier] = padIdx;
        _results.push(this.pads[padIdx].trigger());
      }
      return _results;
    };

    State.prototype.handleTouchMove = function(evt) {
      var padIdx, touch, _i, _len, _ref, _results;
      evt.preventDefault();
      _ref = evt.changedTouches;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        padIdx = this.getOffsetPadIndex(touch.clientX, touch.clientY);
        if (padIdx !== this.activeTouches[touch.identifier]) {
          this.activeTouches[touch.identifier] = padIdx;
          _results.push(this.pads[padIdx].trigger());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    State.prototype.handleTouchEnd = function(evt) {
      var touch, _i, _len, _ref, _results;
      evt.preventDefault();
      _ref = evt.changedTouches;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        _results.push(delete this.activeTouches[touch.identifier]);
      }
      return _results;
    };

    State.prototype.update = function(ts) {
      if (ts) {
        App.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.pads.forEach(function(pad) {
          return pad.update(ts);
        });
      }
      requestAnimationFrame(this.update);
    };

    return State;

  })();

  App.Sound = (function() {
    function Sound(buffer) {
      this.buffer = buffer;
    }

    Sound.prototype.play = function(time) {
      var _ref;
      if ((_ref = this.source) != null) {
        _ref.stop(0);
      }
      this.source = App.audio.context.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.connect(App.audio.context.destination);
      return this.source.noteOn(time);
    };

    return Sound;

  })();

  App.Sprite = (function() {
    Sprite.prototype.fps = App.config.pad.sprite.fps;

    Sprite.prototype.numFrames = App.config.pad.sprite.numFrames;

    Sprite.prototype.duration = (1000 / Sprite.prototype.fps) * Sprite.prototype.numFrames;

    Sprite.prototype.width = App.config.pad.width;

    Sprite.prototype.height = App.config.pad.height;

    function Sprite(opts) {
      this.image = opts.image;
      this.x = opts.col * this.width;
      this.y = opts.row * this.height;
      this.reset();
    }

    Sprite.prototype.play = function(timeRemaining) {
      this.timeRemaining = timeRemaining != null ? timeRemaining : 0;
      this.isPlaying = true;
      this.index = 1;
      return this;
    };

    Sprite.prototype.reset = function() {
      this.isPlaying = false;
      this.index = 0;
      return this;
    };

    Sprite.prototype.update = function(dt) {
      if (this.isPlaying) {
        this.timeRemaining -= dt;
        if (this.timeRemaining > 0) {
          this.index = (this.index + dt * this.fps / 1000) % this.numFrames;
        } else {
          this.reset();
        }
      }
      return this;
    };

    Sprite.prototype.render = function(dt) {
      this.update(dt);
      App.canvas.ctx.save();
      App.canvas.ctx.drawImage(this.image, Math.floor(this.index) * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
      App.canvas.ctx.restore();
      return this;
    };

    return Sprite;

  })();

  App.Pad = (function() {
    function Pad(opts) {
      this.id = opts.id;
      this.sound = App.audio.sounds[this.id];
      this.sprite = App.sprites[this.id];
      this.resolution = 60 / App.config.bpm * opts.resolution * 4 * 1000;
      this.spriteDuration = Math.floor(this.sound.buffer.duration * 1000 / this.sprite.duration) * this.sprite.duration;
      if (!this.spriteDuration) {
        this.spriteDuration = 500;
      }
      this.queue = [];
    }

    Pad.prototype.update = function(ts) {
      var dt;
      if (!this.ts) {
        this.ts = ts;
      }
      dt = ts - this.ts;
      this.ts = ts;
      if (this.triggerAt && this.ts >= this.triggerAt) {
        this.sound.play(0);
        this.sprite.play(this.spriteDuration);
        this.triggerAt = null;
      }
      return this.sprite.render(dt);
    };

    Pad.prototype.trigger = function() {
      return this.triggerAt = this.ts + this.resolution - (this.ts % this.resolution);
    };

    return Pad;

  })();

  window.Hammer = App;

}).call(this);
