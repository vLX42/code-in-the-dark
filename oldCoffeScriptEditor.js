(function() {
  var $, App, ace, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require("../styles/index");

  _ = require("underscore");

  $ = require("jquery");

  ace = require("brace");

  require("brace/mode/html");

  require("brace/theme/vibrant_ink");

  require("brace/ext/searchbox");

  App = (function() {
    App.prototype.POWER_MODE_ACTIVATION_THRESHOLD = 200;

    App.prototype.STREAK_TIMEOUT = 10 * 1000;

    App.prototype.MAX_PARTICLES = 500;

    App.prototype.PARTICLE_NUM_RANGE = [5, 6, 7, 8, 9, 10, 11, 12];

    App.prototype.PARTICLE_GRAVITY = 0.075;

    App.prototype.PARTICLE_SIZE = 8;

    App.prototype.PARTICLE_ALPHA_FADEOUT = 0.96;

    App.prototype.PARTICLE_VELOCITY_RANGE = {
      x: [-2.5, 2.5],
      y: [-7, -3.5]
    };

    App.prototype.PARTICLE_COLORS = {
      "text": [255, 255, 255],
      "text.xml": [255, 255, 255],
      "keyword": [0, 221, 255],
      "variable": [0, 221, 255],
      "meta.tag.tag-name.xml": [0, 221, 255],
      "keyword.operator.attribute-equals.xml": [0, 221, 255],
      "constant": [249, 255, 0],
      "constant.numeric": [249, 255, 0],
      "support.constant": [249, 255, 0],
      "string.attribute-value.xml": [249, 255, 0],
      "string.unquoted.attribute-value.html": [249, 255, 0],
      "entity.other.attribute-name.xml": [129, 148, 244],
      "comment": [0, 255, 121],
      "comment.xml": [0, 255, 121]
    };

    App.prototype.EXCLAMATION_EVERY = 10;

    App.prototype.EXCLAMATIONS = ["Super!", "Radical!", "Fantastic!", "Great!", "OMG", "Whoah!", ":O", "Nice!", "Splendid!", "Wild!", "Grand!", "Impressive!", "Stupendous!", "Extreme!", "Awesome!"];

    App.prototype.currentStreak = 0;

    App.prototype.powerMode = false;

    App.prototype.particles = [];

    App.prototype.particlePointer = 0;

    App.prototype.lastDraw = 0;

    function App() {
      this.onChange = __bind(this.onChange, this);
      this.onClickFinish = __bind(this.onClickFinish, this);
      this.onClickReference = __bind(this.onClickReference, this);
      this.onClickInstructions = __bind(this.onClickInstructions, this);
      this.deactivatePowerMode = __bind(this.deactivatePowerMode, this);
      this.activatePowerMode = __bind(this.activatePowerMode, this);
      this.drawParticles = __bind(this.drawParticles, this);
      this.onFrame = __bind(this.onFrame, this);
      this.saveContent = __bind(this.saveContent, this);
      this.$streakCounter = $(".streak-container .counter");
      this.$streakBar = $(".streak-container .bar");
      this.$exclamations = $(".streak-container .exclamations");
      this.$reference = $(".reference-screenshot-container");
      this.$nameTag = $(".name-tag");
      this.$result = $(".result");
      this.$editor = $("#editor");
      this.canvas = this.setupCanvas();
      this.canvasContext = this.canvas.getContext("2d");
      this.$finish = $(".finish-button");
      this.$body = $("body");
      this.debouncedSaveContent = _.debounce(this.saveContent, 300);
      this.debouncedEndStreak = _.debounce(this.endStreak, this.STREAK_TIMEOUT);
      this.throttledShake = _.throttle(this.shake, 100, {
        trailing: false
      });
      this.throttledSpawnParticles = _.throttle(this.spawnParticles, 25, {
        trailing: false
      });
      this.editor = this.setupAce();
      this.loadContent();
      this.editor.focus();
      this.editor.getSession().on("change", this.onChange);
      $(window).on("beforeunload", function() {
        return "Hold your horses!";
      });
      $(".instructions-container, .instructions-button").on("click", this.onClickInstructions);
      this.$reference.on("click", this.onClickReference);
      this.$finish.on("click", this.onClickFinish);
      this.$nameTag.on("click", (function(_this) {
        return function() {
          return _this.getName(true);
        };
      })(this));
      this.getName();
      if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(this.onFrame);
      }
    }

    App.prototype.setupAce = function() {
      var editor;
      editor = ace.edit("editor");
      editor.setShowPrintMargin(false);
      editor.setHighlightActiveLine(false);
      editor.setFontSize(20);
      editor.setTheme("ace/theme/vibrant_ink");
      editor.getSession().setMode("ace/mode/html");
      editor.session.setOption("useWorker", false);
      editor.session.setFoldStyle("manual");
      editor.$blockScrolling = Infinity;
      return editor;
    };

    App.prototype.setupCanvas = function() {
      var canvas;
      canvas = $(".canvas-overlay")[0];
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      return canvas;
    };

    App.prototype.getName = function(forceUpdate) {
      var name;
      name = (!forceUpdate && localStorage["name"]) || prompt("What's your name?");
      localStorage["name"] = name;
      if (name) {
        return this.$nameTag.text(name);
      }
    };

    App.prototype.loadContent = function() {
      var content;
      if (!(content = localStorage["content"])) {
        return;
      }
      return this.editor.setValue(content, -1);
    };

    App.prototype.saveContent = function() {
      return localStorage["content"] = this.editor.getValue();
    };

    App.prototype.onFrame = function(time) {
      this.drawParticles(time - this.lastDraw);
      this.lastDraw = time;
      return typeof window.requestAnimationFrame === "function" ? window.requestAnimationFrame(this.onFrame) : void 0;
    };

    App.prototype.increaseStreak = function() {
      this.currentStreak++;
      if (this.currentStreak > 0 && this.currentStreak % this.EXCLAMATION_EVERY === 0) {
        this.showExclamation();
      }
      if (this.currentStreak >= this.POWER_MODE_ACTIVATION_THRESHOLD && !this.powerMode) {
        this.activatePowerMode();
      }
      this.refreshStreakBar();
      return this.renderStreak();
    };

    App.prototype.endStreak = function() {
      this.currentStreak = 0;
      this.renderStreak();
      return this.deactivatePowerMode();
    };

    App.prototype.renderStreak = function() {
      this.$streakCounter.text(this.currentStreak).removeClass("bump");
      return _.defer((function(_this) {
        return function() {
          return _this.$streakCounter.addClass("bump");
        };
      })(this));
    };

    App.prototype.refreshStreakBar = function() {
      this.$streakBar.css({
        "webkit-transform": "scaleX(1)",
        "transform": "scaleX(1)",
        "transition": "none"
      });
      return _.defer((function(_this) {
        return function() {
          return _this.$streakBar.css({
            "webkit-transform": "",
            "transform": "",
            "transition": "all " + _this.STREAK_TIMEOUT + "ms linear"
          });
        };
      })(this));
    };

    App.prototype.showExclamation = function() {
      var $exclamation;
      $exclamation = $("<span>").addClass("exclamation").text(_.sample(this.EXCLAMATIONS));
      this.$exclamations.prepend($exclamation);
      return setTimeout(function() {
        return $exclamation.remove();
      }, 3000);
    };

    App.prototype.getCursorPosition = function() {
      var left, top, _ref;
      _ref = this.editor.renderer.$cursorLayer.getPixelPosition(), left = _ref.left, top = _ref.top;
      left += this.editor.renderer.gutterWidth + 4;
      top -= this.editor.renderer.scrollTop;
      return {
        x: left,
        y: top
      };
    };

    App.prototype.spawnParticles = function(type) {
      var color, numParticles, x, y, _ref;
      if (!this.powerMode) {
        return;
      }
      _ref = this.getCursorPosition(), x = _ref.x, y = _ref.y;
      numParticles = _(this.PARTICLE_NUM_RANGE).sample();
      color = this.getParticleColor(type);
      return _(numParticles).times((function(_this) {
        return function() {
          _this.particles[_this.particlePointer] = _this.createParticle(x, y, color);
          return _this.particlePointer = (_this.particlePointer + 1) % _this.MAX_PARTICLES;
        };
      })(this));
    };

    App.prototype.getParticleColor = function(type) {
      return this.PARTICLE_COLORS[type] || [255, 255, 255];
    };

    App.prototype.createParticle = function(x, y, color) {
      return {
        x: x,
        y: y + 10,
        alpha: 1,
        color: color,
        velocity: {
          x: this.PARTICLE_VELOCITY_RANGE.x[0] + Math.random() * (this.PARTICLE_VELOCITY_RANGE.x[1] - this.PARTICLE_VELOCITY_RANGE.x[0]),
          y: this.PARTICLE_VELOCITY_RANGE.y[0] + Math.random() * (this.PARTICLE_VELOCITY_RANGE.y[1] - this.PARTICLE_VELOCITY_RANGE.y[0])
        }
      };
    };

    App.prototype.drawParticles = function(timeDelta) {
      var particle, _i, _len, _ref, _results;
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      _ref = this.particles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        if (particle.alpha <= 0.1) {
          continue;
        }
        particle.velocity.y += this.PARTICLE_GRAVITY;
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.alpha *= this.PARTICLE_ALPHA_FADEOUT;
        this.canvasContext.fillStyle = "rgba(" + (particle.color.join(", ")) + ", " + particle.alpha + ")";
        _results.push(this.canvasContext.fillRect(Math.round(particle.x - this.PARTICLE_SIZE / 2), Math.round(particle.y - this.PARTICLE_SIZE / 2), this.PARTICLE_SIZE, this.PARTICLE_SIZE));
      }
      return _results;
    };

    App.prototype.shake = function() {
      var intensity, x, y;
      if (!this.powerMode) {
        return;
      }
      intensity = 1 + 2 * Math.random() * Math.floor((this.currentStreak - this.POWER_MODE_ACTIVATION_THRESHOLD) / 100);
      x = intensity * (Math.random() > 0.5 ? -1 : 1);
      y = intensity * (Math.random() > 0.5 ? -1 : 1);
      this.$editor.css("margin", y + "px " + x + "px");
      return setTimeout((function(_this) {
        return function() {
          return _this.$editor.css("margin", "");
        };
      })(this), 75);
    };

    App.prototype.activatePowerMode = function() {
      this.powerMode = true;
      return this.$body.addClass("power-mode");
    };

    App.prototype.deactivatePowerMode = function() {
      this.powerMode = false;
      return this.$body.removeClass("power-mode");
    };

    App.prototype.onClickInstructions = function() {
      $("body").toggleClass("show-instructions");
      if (!$("body").hasClass("show-instructions")) {
        return this.editor.focus();
      }
    };

    App.prototype.onClickReference = function() {
      this.$reference.toggleClass("active");
      if (!this.$reference.hasClass("active")) {
        return this.editor.focus();
      }
    };

    App.prototype.onClickFinish = function() {
      var confirm;
      confirm = prompt("This will show the results of your code. Doing this before the round is over WILL DISQUALIFY YOU. Are you sure you want to proceed? Type \"yes\" to confirm.");
      if ((confirm != null ? confirm.toLowerCase() : void 0) === "yes") {
        this.$result[0].contentWindow.postMessage(this.editor.getValue(), "*");
        return this.$result.show();
      }
    };

    App.prototype.onChange = function(e) {
      var insertTextAction, pos, range, token;
      this.debouncedSaveContent();
      insertTextAction = e.data.action === "insertText";
      if (insertTextAction) {
        this.increaseStreak();
        this.debouncedEndStreak();
      }
      this.throttledShake();
      range = e.data.range;
      pos = insertTextAction ? range.end : range.start;
      token = this.editor.session.getTokenAt(pos.row, pos.column);
      return _.defer((function(_this) {
        return function() {
          if (token) {
            return _this.throttledSpawnParticles(token.type);
          }
        };
      })(this));
    };

    return App;

  })();

  $(function() {
    return new App;
  });

}).call(this);