var rellax = new Rellax('.rellax');

jQuery(($) => {
  const model = {
    canvas: null,
    context: null,

    skillList: [
      'ES6', 'CSS3', 'HTML5', 'Gulp', 'MVC', 'JavaScript', 'Foundation', 'Bootstrap',
      'Node.js', 'npm', 'postcss', 'bash', 'git', 'gitHub', 'Photoshop', 'DRY code',
      'clean code', 'self-documenting code', 'mobile-first', 'responsive design',
      'functional programming', 'object-oriented programming', 'hella APIs',
      'Atom', 'Visual Studio Code',
    ],
    activeSkills: [],
    skillColors: ['hsl(290, 6%, 18%)', '#fbf579'],

    activeFlames: { a: [], b: [], c: [], d: [] },
    flameColors: [
      'hsla(57, 94%, 73%, 1)',
      'hsla(57, 94%, 73%, .75)',
      'hsla(57, 94%, 73%, .5)',
      'hsla(57, 94%, 73%, .25)',
    ],
    drawMethod: 'fill',
    drawStyle: 'strokeStyle',

    random: function random(min, max) {
      const num = Math.floor(Math.random() * (max - min)) + min;
      return num;
    },

    skillModule: function skillModule(aspect) {
      this.counter = this.counter || 0;
      this.counter++;
      const skill = this.skillList[this.counter % this.skillList.length];

      const font = this.random((aspect) * 20, (aspect) * 40);
      this.context.font = `${font}px Archivo Black`;
      const textWidth = this.context.measureText(skill).width;

      let x = this.random(0, this.canvas.width - textWidth);
      let y = this.canvas.height + font;
      let velY = this.random(1, 4);

      const color = this.skillColors[this.random(0, this.skillColors.length)];

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

      return { draw, update, getY, skill };
    },

    flameModule: function flameModule(aspect) {
      let r = this.random((aspect) * 2, (aspect) * 12);
      let x = this.random(0, this.canvas.width);
      let y = this.canvas.height - r;
      let velY = this.random(1, 3);

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

      return { define, update, getY };
    },

    fillFlameArray: function fillFlameArray(arr, aspect) {
      const flame = this.flameModule(aspect);
      while (arr.length < 30) {
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
  };

  const view = {
    viewHeight: null,
    viewWidth: null,

    windowIsShortLandscape: function windowIsShortLandscape() {
      return (this.viewWidth / this.viewHeight) >= (4 / 3);
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
  };

  const controller = {
    initialize: function initialize() {
      model.canvas = document.querySelector('canvas');
      model.context = model.canvas.getContext('2d');
      this.setCanvasDimensions(true, true);
      this.setViewDimensions();
      this.setupListeners();
      this.canvasLoop();
      this.setSectionsHeight();
    },

    setupListeners: function setupListeners() {
      $(window).on('resize', this.setViewDimensions.bind(this))
        .on('resize', this.setCanvasDimensions.bind(this, true, false))
        .on('orientationchange', this.setViewDimensions.bind(this))
        .on('orientationchange', this.setCanvasDimensions.bind(this, true, true))
        .on('orientationchange', this.setSectionsHeight);

      $('.projects-grid').on('click', '.project-hide', this.toggleProject);
    },

    getViewDimensions: function getViewDimensions() {
      return { x: $(window).width(), y: $(window).height() };
    },

    setViewDimensions: function setViewDimensions() {
      view.viewWidth = this.getViewDimensions().x;
      view.viewHeight = this.getViewDimensions().y;
    },

    setCanvasDimensions: function setCanvasDimensions(x, y) {
      if (x) model.canvas.width = this.getViewDimensions().x;
      if (y) model.canvas.height = this.getViewDimensions().y;
    },

    getViewAspect: function getViewAspect() {
      return this.getViewDimensions().x / this.getViewDimensions().y;
    },

    getCanvasAspect: function getCanvasAspect() {
      return model.canvas.width / model.canvas.height;
    },

    setSectionsHeight: function setSectionsHeight() {
      $('.hero, .skills').css({ height: view.viewHeight });
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

    canvasLoop: function canvasLoop(updateTime = performance.now()) {
      const width = model.canvas.width;
      const height = model.canvas.height;

      model.context.fillStyle = 'rgba(250, 98, 95, 1)';
      model.context.fillRect(0, 0, width, height);

      while(updateTime + 1000 < performance.now()) {
        const skill = model.skillModule(this.getCanvasAspect());
        model.activeSkills.push(skill);
        updateTime = performance.now();
      }

      model.activeSkills.forEach((item) => {
        item.draw.call(model);
        item.update.call(model);
      });

      model.activeSkills = model.activeSkills.filter(item =>
        !(item.getY.call(model) < 0));

      Object.values(model.activeFlames).forEach((item, index) => {
        model.drawStyle = model.drawStyle === 'strokeStyle' ? 'fillStyle' : 'strokeStyle';
        model.drawMethod = model.drawMethod === 'fill' ? 'stroke' : 'fill';

        model.fillFlameArray(item, this.getCanvasAspect());
        model.drawFlames(index, item, model.drawStyle, model.flameColors[index], model.drawMethod);
      });

      Object.keys(model.activeFlames).forEach((key) => {
        model.activeFlames[key] = model.activeFlames[key]
          .filter(item => !(item.getY.call(model) < height - model.random(50, 800)));
      });

      requestAnimationFrame(canvasLoop.bind(this, updateTime));
    },
  };
  controller.initialize();
});
