(function() {
  var App,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

  App = {};

  App.config = {
    bpm: 120,
    resolution: 1 / 8,
    sprite: {
      width: 100,
      height: 100,
      numFrames: 4,
      fps: 16
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
      audio: 'shuffled_house_120.mp3',
      resolution: 1 / 4,
      row: 0,
      col: 0
    }, {
      id: 'blue',
      sprite: 'hexagon_blue.png',
      audio: 'mellowrhodes_Cmi_120.mp3',
      resolution: 1 / 4,
      row: 0,
      col: 1
    }, {
      id: 'green',
      sprite: 'hexagon_green.png',
      audio: 'brushfill.120.mp3',
      resolution: 1 / 8,
      row: 0,
      col: 2
    }, {
      id: 'red',
      sprite: 'hexagon_red.png',
      audio: 'button-4.mp3',
      resolution: 1 / 16,
      row: 0,
      col: 3
    }, {
      id: 'black1',
      sprite: 'hexagon_black.png',
      audio: 'shuffled_house_120.mp3',
      resolution: 1 / 8,
      row: 0,
      col: 4
    }, {
      id: 'green1',
      sprite: 'hexagon_green.png',
      audio: 'button-3.mp3',
      resolution: 1 / 8,
      row: 1,
      col: 0
    }, {
      id: 'red1',
      sprite: 'hexagon_red.png',
      audio: 'button-4.mp3',
      resolution: 1 / 8,
      row: 1,
      col: 1
    }, {
      id: 'green2',
      sprite: 'hexagon_green.png',
      audio: 'button-3.mp3',
      resolution: 1 / 8,
      row: 1,
      col: 2
    }, {
      id: 'red2',
      sprite: 'hexagon_red.png',
      audio: 'button-4.mp3',
      resolution: 1 / 8,
      row: 1,
      col: 3
    }, {
      id: 'green3',
      sprite: 'hexagon_green.png',
      audio: 'button-3.mp3',
      resolution: 1 / 8,
      row: 1,
      col: 4
    }, {
      id: 'black4',
      sprite: 'hexagon_black.png',
      audio: 'shuffled_house_120.mp3',
      resolution: 1,
      row: 2,
      col: 0
    }, {
      id: 'blue4',
      sprite: 'hexagon_blue.png',
      audio: 'button-2.mp3',
      resolution: 1 / 8,
      row: 2,
      col: 1
    }, {
      id: 'green4',
      sprite: 'hexagon_green.png',
      audio: 'button-3.mp3',
      resolution: 1 / 8,
      row: 2,
      col: 2
    }, {
      id: 'red4',
      sprite: 'hexagon_red.png',
      audio: 'button-4.mp3',
      resolution: 1 / 8,
      row: 2,
      col: 3
    }, {
      id: 'red5',
      sprite: 'hexagon_red.png',
      audio: 'button-4.mp3',
      resolution: 1 / 8,
      row: 2,
      col: 4
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
    var pads;
    pads = [];
    App.manifest.forEach(function(item) {
      return pads.push(new App.Pad(item));
    });
    App.state = new App.State({
      pads: pads,
      canvas: App.canvas.el
    });
    App.checkOrientation();
    return window.addEventListener('orientationchange', App.checkOrientation);
  };

  App.checkOrientation = function(orientation) {
    if (window.orientation === 0) {
      return App.canvas.el.style.webkitTransform = 'rotate(90deg)';
    } else {
      return App.canvas.el.style.webkitTransform = 'rotate(0deg)';
    }
  };

  window.addEventListener('load', App.load.bind(App));

  App.State = (function() {
    function State(opts) {
      this.update = __bind(this.update, this);
      this.handleTouchEnd = __bind(this.handleTouchEnd, this);
      this.handleTouchMove = __bind(this.handleTouchMove, this);
      this.handleTouchStart = __bind(this.handleTouchStart, this);
      this.handleClick = __bind(this.handleClick, this);
      var pad, _i, _len, _ref;
      this.canvas = opts.canvas;
      this.pads = [];
      _ref = opts.pads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pad = _ref[_i];
        this.pads[this.getPadIndex(pad.sprite.x, pad.sprite.y)] = pad;
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

    State.prototype.handleClick = function(evt) {
      return this.pads[this.getPadIndex(evt.offsetX, evt.offsetY)].trigger();
    };

    State.prototype.handleTouchStart = function(evt) {
      var offsetX, offsetY, padIdx, touch, _i, _len, _ref, _results;
      evt.preventDefault();
      offsetX = evt.target.offsetLeft;
      offsetY = evt.target.offsetTop;
      _ref = evt.changedTouches;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        padIdx = this.getPadIndex(touch.clientX - offsetX, touch.clientY - offsetY);
        this.activeTouches[touch.identifier] = padIdx;
        _results.push(this.pads[padIdx].trigger());
      }
      return _results;
    };

    State.prototype.handleTouchMove = function(evt) {
      var offsetX, offsetY, padIdx, touch, _i, _len, _ref, _results;
      evt.preventDefault();
      offsetX = evt.target.offsetLeft;
      offsetY = evt.target.offsetTop;
      _ref = evt.changedTouches;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        padIdx = this.getPadIndex(touch.clientX - offsetX, touch.clientY - offsetY);
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

    State.prototype.getPadIndex = function(x, y) {
      if (x >= this.canvas.width || y >= this.canvas.height) {
        return -1;
      }
      return Math.floor(x / App.config.sprite.width) + Math.floor(y / App.config.sprite.height) * this.canvas.width / App.config.sprite.width;
    };

    State.prototype.update = function(ts) {
      if (ts) {
        App.canvas.ctx.clearRect(0, 0, App.canvas.el.width, App.canvas.el.height);
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
    Sprite.prototype.fps = App.config.sprite.fps;

    Sprite.prototype.numFrames = App.config.sprite.numFrames;

    Sprite.prototype.length = (1000 / Sprite.prototype.fps) * Sprite.prototype.numFrames;

    Sprite.prototype.width = App.config.sprite.width;

    Sprite.prototype.height = App.config.sprite.height;

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
      this.duration = 0;
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
      this.spriteDuration = Math.floor(this.sound.buffer.duration * 1000 / this.sprite.length) * this.sprite.length;
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
