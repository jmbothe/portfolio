'use strict';

const rellax = new Rellax('.rellax');

jQuery(($) => {
  window.requestAnimFrame = (function setRequestAnimFrame() {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function requestAnimFrame(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  }());

  const model = {
    audio: (function initAudio() {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      return new AudioContext();
    }()),

    // basic web audio API playback function
    triggerSound: function triggerSound() {
      const source = this.audio.createBufferSource();
      source.buffer = this.coinSound;
      source.connect(this.audio.destination);
      source.start(0);
    },

    canvas: null,
    context: null,

    viewHeight: null,
    viewWidth: null,

    skillList: [
      'ES2015', 'CSS3', 'HTML5', 'Gulp', 'MVC', 'JavaScript', 'Foundation', 'Bootstrap',
      'Node.js', 'npm', 'postcss', 'bash', 'git', 'gitHub', 'Photoshop', 'DRY code',
      'clean code', 'self-documenting code', 'mobile-first', 'responsive design',
      'functional programming', 'OOP', 'hella APIs', 'Atom', 'Visual Studio Code',
      'jQuery', 'Flexbox', 'babel', 'sourcemaps', 'compatability', 'graphic design',
    ],
    activeSkills: [],
    skillColors: ['hsl(290, 6%, 18%)', '#fbf579'],

    activeFlames: {
      a: [], b: [], c: [], d: [],
    },
    flameColors: [
      'hsla(47, 94%, 73%, .8)',
      'hsla(47, 94%, 73%, .7)',
      'hsla(47, 94%, 73%, .6)',
      'hsla(47, 94%, 73%, .5)',
    ],
    drawMethod: 'fill',
    drawStyle: 'strokeStyle',

    random: function random(min, max) {
      const num = Math.floor(Math.random() * (max - min)) + min;
      return num;
    },

    skillModule: function skillModule(width, height) {
      this.skillCounter = this.skillCounter || 0;
      this.skillCounter++;
      const skill = this.skillList[this.skillCounter % this.skillList.length];

      const font = width > height
      ? this.random((height) * .09, (height) * .13)
      : this.random((width) * .06, (width) * .1)

      this.context.font = `${font}px Archivo Black`;
      const textWidth = this.context.measureText(skill).width;

      const x = this.random(0, this.canvas.width - textWidth);
      let y = this.canvas.height + font;
      const velY = this.random(1, 4);

      const color = this.skillColors[this.skillCounter % 2];

      function draw() {
        this.context.font = `${font}px Archivo Black`;
        this.context.fillStyle = color;
        this.context.fillText(skill, x, y);
      }
      function update() {
        y -= velY;
      }
      function getY() {
        return y;
      }

      return {
        draw, update, getY, skill,
      };
    },

    flameModule: function flameModule() {
      const r = this.random((this.canvas.height) * 0.01, (this.canvas.height) * 0.035);
      const x = this.random(0, this.canvas.width);
      let y = this.canvas.height + r * 2;
      const velY = this.random(1, 4);
      const deletePoint = this.random(this.canvas.height * 0.7, this.canvas.height * 0.95);

      function define() {
        this.context.moveTo(x + r, y);
        this.context.arc(x, y, r, 0, Math.PI * 2, true);
      }
      function update() {
        y -= velY;
      }
      function getY() {
        return y;
      }

      return {
        define, update, getY, deletePoint,
      };
    },

    fillFlameArray: function fillFlameArray(arr) {
      while (arr.length < 40) {
        const flame = this.flameModule();
        arr.push(flame);
      }
    },

    drawFlames: function drawFlames(width, arr, style, color, drawMethod) {
      this.context.lineWidth = width + 3;
      this.context[style] = color;
      this.context.beginPath();
      arr.forEach((item) => {
        item.define.call(model);
        item.update.call(model);
      });
      this.context[drawMethod]();
      this.context.closePath();
    },

    drawWaves: function drawWaves(width, height, orientation) {
      this.end = this.end || 0;
      const length = orientation ? width * 2 : width;
      let end = (0 - length * .08) + this.end;
      this.context.fillStyle = '#fbf579';
      this.context.beginPath();
      while (end < width) {
        model.context.moveTo(end, height * .95);
        model.context.bezierCurveTo(end + length * .02, height * .9, end + length * .06, height, end + length * .08, height * .95);
        end += length * .08
      }
      this.end = this.end < 0 ? this.end + 1 : 0 - length * .08
      model.context.lineTo(end, height)
      model.context.lineTo(0, height)
      model.context.lineTo(0, height * .95)
      model.context.fill();
    },
  };

  const view = {
    windowIsShortLandscape: function windowIsShortLandscape() {
      return (model.viewWidth / model.viewHeight) >= (4 / 3);
    },

    hideProject: function hideProject(current, target) {
      if (this.windowIsShortLandscape()) {
        target.children('h3, .project-links').animate({ opacity: 0 }, 300);
      }
      current.addClass('project-collapse');
      setTimeout(() => {
        current.addClass('project-hide');
        if (this.windowIsShortLandscape()) {
          current.css('opacity', 0).animate({ opacity: 1 }, 300);
        }
      }, 400);
    },

    showProject: function showProject(current, target) {
      target.removeClass('project-hide');
      if (this.windowIsShortLandscape()) {
        target.children('h3, .project-links').css('opacity', 1);
      }
      setTimeout(() => {
        target.removeClass('project-collapse');
      }, 400);
    },

    revealSecret: function revealSecret(parent, element, whenToReveal, scrollTop) {
      const parentTop = parent.offset().top;
      whenToReveal = parentTop + (parent.height() * whenToReveal);

      if (scrollTop > whenToReveal) {
        const percent = Math.round((100 - ((scrollTop - whenToReveal) * 0.1)) / 20) * 20;
        $(`${element}`).css('-webkit-clip-path', `polygon(0% ${percent}%, 100% ${percent}%, 100% 100%, 0% 100%)`);
      } else {
        $(`${element}`).css('-webkit-clip-path', 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)');
      }
    },

    hideSecretSection: function hideSecretSection(isMobile) {
      if (isMobile) $('.secret').hide();
    },
  };

  const controller = {
    initialize: function initialize() {
      this.loadSounds();
      model.canvas = document.querySelector('canvas');
      model.context = model.canvas.getContext('2d');
      this.setCanvasDimensions(true, true);
      this.setViewDimensions();
      this.setupListeners();
      this.canvasLoop();
      this.setSectionsHeight();
      view.hideSecretSection(this.isMobile());
    },

    setupListeners: function setupListeners() {
      $(window).on('resize', this.setViewDimensions.bind(this))
        .on('resize', this.setCanvasDimensions.bind(this, true, false))
        .on('orientationchange', this.setViewDimensions.bind(this))
        .on('orientationchange', this.setCanvasDimensions.bind(this, true, true))
        .on('orientationchange', this.setSectionsHeight);

      $('.projects-grid').on('click', '.project-hide', this.toggleProject);

      $(window).on('scroll', this.revealSecret);

      $('.nav-to-contact').on('click', this.scrollTo);

      $('a, span').on('click', model.triggerSound.bind(model));
    },

    getViewDimensions: function getViewDimensions() {
      return { x: $(window).width(), y: $(window).height() };
    },

    setViewDimensions: function setViewDimensions() {
      model.viewWidth = this.getViewDimensions().x;
      model.viewHeight = this.getViewDimensions().y;
    },

    setCanvasDimensions: function setCanvasDimensions(x, y) {
      if (x) model.canvas.width = this.getViewDimensions().x;
      if (y) model.canvas.height = this.getViewDimensions().y;
    },

    getViewAspect: function getViewAspect() {
      return this.getViewDimensions().x / this.getViewDimensions().y;
    },

    isShortLandscape: function isShortLandscape() {
      return this.getViewAspect() >= 4 / 3 && this.getViewAspect() < 16 / 9;
    },

    isLongLandscape: function isLongLandscape() {
      return this.getViewAspect() >= 16 / 9;
    },

    isShortPortrait: function isShortPortrait() {
      return this.getViewAspect() <= 3 / 4 && this.getViewAspect() > 9 / 16;
    },

    isLongPortrait: function isLongPortrait() {
      return this.getViewAspect() <= 9 / 16;
    },

    isSquareish: function isSquarish() {
      return this.getViewAspect() < 4 / 3 && this.getViewAspect() > 3 / 4;
    },

    getCanvasDimensions: function getCanvasDimensions() {
      return { x: model.canvas.width, y: model.canvas.height };
    },

    getCanvasAspect: function getCanvasAspect() {
      return model.canvas.width / model.canvas.height;
    },

    setSectionsHeight: function setSectionsHeight() {
      $('.hero, .skills').css({ height: model.viewHeight });
    },

    isMobile: function isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    toggleProject: function toggleProject(e) {
      const current = $('.project-shell:not(.project-hide)');
      const target = $(e.target).closest('.project-hide');
      const animationAlreadyInProgress = $('.project-collapse').length === 4;

      if (animationAlreadyInProgress) {
        return;
      }

      view.hideProject(current, target);
      setTimeout(() => {
        view.showProject(current, target);
      }, 400);
    },

    scrollTo: function scrollTo() {
      $.scrollTo('.contact h2', {
        duration: 1000,
        onAfter: function onAfter(direction) {
          if (direction !== 'up') {
            setTimeout(() => {
              $(".contact ul li").each((index, item) => {
                setTimeout(() => {
                  $(item).addClass('scrollFinish');
                }, (index) * 150);
                setTimeout(() => {
                  $(item).removeClass('scrollFinish');
                }, (index + 5) * 150);
              });
            }, 0);
          }
        },
      });
    },

    revealSecret: function revealSecret() {
      const scrollTop = $(window).scrollTop();
      const parent = $('.secret');

      view.revealSecret(parent, '.earth1', 0.001, scrollTop);
      view.revealSecret(parent, '.earth2', 0.02, scrollTop);
      view.revealSecret(parent, '.earth3', 0.04, scrollTop);
      view.revealSecret(parent, '.earthneg1', 0.07, scrollTop);
      view.revealSecret(parent, '.earthneg2', 0.09, scrollTop);
      view.revealSecret(parent, '.earthneg3', 0.11, scrollTop);
      view.revealSecret(parent, '.dont', 0.140, scrollTop);
      view.revealSecret(parent, '.comet', 0.21, scrollTop);
      view.revealSecret(parent, '.tiger', 0.28, scrollTop);
      view.revealSecret(parent, '.stop', 0.35, scrollTop);
      view.revealSecret(parent, '.godiva', 0.42, scrollTop);
      view.revealSecret(parent, '.rocket', 0.49, scrollTop);
      view.revealSecret(parent, '.me', 0.56, scrollTop);
      view.revealSecret(parent, '.satalite', 0.63, scrollTop);
      view.revealSecret(parent, '.bomb', 0.72, scrollTop);
      view.revealSecret(parent, '.now', 0.81, scrollTop);
      view.revealSecret(parent, '.explode', 0.89, scrollTop);
    },

    canvasLoop: function canvasLoop(updateTime = performance.now()) {
      const width = model.canvas.width;
      const height = model.canvas.height;

      model.context.fillStyle = 'rgba(250, 98, 95, 1)';
      model.context.fillRect(0, 0, width, height);
      while (updateTime + 1500 < performance.now()) {
        const skill = model.skillModule(width, height);
        model.activeSkills.push(skill);
        updateTime = performance.now();
      }
      model.activeSkills.forEach((item) => {
        item.draw.call(model);
        item.update.call(model);
      });

      Object.values(model.activeFlames).forEach((item, index) => {
        model.drawStyle = model.drawStyle === 'strokeStyle' ? 'fillStyle' : 'strokeStyle';
        model.drawMethod = model.drawMethod === 'fill' ? 'stroke' : 'fill';
        model.fillFlameArray(item);
        model.drawFlames(index, item, model.drawStyle, model.flameColors[index], model.drawMethod);
      });
      model.drawWaves(width, height, this.isShortPortrait() || this.isLongPortrait());

      requestAnimationFrame(canvasLoop.bind(this, updateTime));
    },

    canvasObjectManagement: setInterval(() => {
      Object.keys(model.activeFlames).forEach((key) => {
        model.activeFlames[key] = model.activeFlames[key]
          .filter(item => !(item.getY.call(model) < item.deletePoint));

        model.activeSkills = model.activeSkills.filter(item =>
          !(item.getY.call(model) < 0));
      });
    }, 100),

    loadSounds: function loadSounds() {
      const request = new XMLHttpRequest();
      const audioUrl = '/assets/sounds/coin.mp3';

      request.open('GET', audioUrl);
      request.responseType = 'arraybuffer';
      request.onload = function onload() {
        model.audio.decodeAudioData(request.response, (buffer) => {
          model.coinSound = buffer;
        });
      };
      request.send();
    },
  };

  controller.initialize();
});