var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.Hammer = (function(App) {
  App.config = {
    bpm: 120,
    resolution: 1 / 8,
    sprite: {
      width: 200,
      height: 200,
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
      soloDuration: 4,
      row: 0,
      col: 0
    }, {
      id: 'blue',
      sprite: 'hexagon_blue.png',
      audio: 'button-2.mp3',
      soloDuration: 1 / 8,
      row: 0,
      col: 1
    }, {
      id: 'green',
      sprite: 'hexagon_green.png',
      audio: 'button-3.mp3',
      soloDuration: 1 / 8,
      row: 0,
      col: 2
    }, {
      id: 'red',
      sprite: 'hexagon_red.png',
      audio: 'button-4.mp3',
      soloDuration: 1 / 8,
      row: 0,
      col: 3
    }
  ];
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
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
    this.canvas.el = document.querySelector('canvas');
    this.canvas.el.width = window.innerWidth;
    this.canvas.el.height = window.innerHeight;
    this.canvas.ctx = this.canvas.el.getContext('2d');
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
    return this.manifest.forEach(function(item) {
      loadAudio(item);
      return loadImage(item);
    });
  };
  App.init = function() {
    var pads;
    pads = [];
    this.manifest.forEach(function(item) {
      return pads.push(new App.Pad(item));
    });
    this.state = new App.State(pads);
    return this.canvas.el.addEventListener('click', function() {
      App.state.pads[0].trigger();
      return App.state.pads[2].trigger();
    });
  };
  App.State = (function() {
    function State(pads) {
      this.pads = pads;
      this.update = __bind(this.update, this);
      this.update();
    }

    State.prototype.update = function(ts) {
      if (ts) {
        App.canvas.ctx.clearRect(0, 0, App.canvas.el.width, App.canvas.el.height);
        this.pads.forEach(function(pad) {
          return pad.update(ts);
        });
      }
      requestAnimationFrame(this.update);
    };

    State.prototype.render = function(dt) {};

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
    Pad.prototype.resolution = 60 / App.config.bpm * App.config.resolution * 4 * 1000;

    function Pad(opts) {
      this.id = opts.id;
      this.sound = App.audio.sounds[this.id];
      this.sprite = App.sprites[this.id];
      this.spriteDuration = Math.floor(this.sound.buffer.duration * 1000 / this.sprite.length) * this.sprite.length;
      if (!this.spriteDuration) {
        this.spriteDuration = 500;
      }
      this.duration = this.queue = [];
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
      if (!(this.triggerAt || this.sprite.isPlaying)) {
        return this.triggerAt = this.ts + this.resolution - (this.ts % this.resolution);
      }
    };

    return Pad;

  })();
  return App;
})(window.Hammer || {});

window.addEventListener('load', window.Hammer.load.bind(window.Hammer));
