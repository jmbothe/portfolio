jQuery(($) => {
  const model = {
    canvas: document.querySelector('canvas'),
    context: document.querySelector('canvas').getContext('2d'),
    skillList: [
      'ES6', 'CSS3', 'HTML5', 'Gulp', 'MVC', 'JavaScript', 'Foundation', 'Bootstrap',
      'Node.js', 'npm', 'postcss', 'bash', 'git', 'gitHub', 'Photoshop', 'DRY code',
      'clean code', 'self-documenting code', 'mobile-first', 'responsive design',
      'functional programming', 'object-oriented programming', 'hella APIs',
      'click me', 'Atom', 'Visual Studio Code',
    ],
    activeSkills: [],
    skillColors: ['hsl(290, 6%, 18%)', '#fbf579'],

    flameList: ['.', '°', '•', '̑'],
    activeFlames: [],

    // in the event I want dimensions that DONT update on viewport changes
    viewHeight: $(window).height(),
    viewWidth: $(window).width(),

    // in the event that I DO want the latest and greatest dimensions
    getAspect: function getAspect() {
      const x = $(window).width();
      const y = $(window).height();

      return { x, y };
    },

    random: function random(min, max) {
      const num = Math.floor(Math.random() * (max - min)) + min;
      return num;
    },

    flameModule: function flameModule() {
      const flame = this.flameList[this.random(0, this.flameList.length)];

      const aspect = this.getAspect();
      const font =
        this.random((aspect.x / aspect.y) * 35, (aspect.x / aspect.y) * 70);
      this.context.font = `${font}px Open Sans`;
      const textWidth = this.context.measureText(flame).width;

      let x = this.random(0 - textWidth, aspect.x);
      let y = aspect.y + 60;
      let velY = this.random(1, 4);

      const color = `hsla(${this.random(0, 57)}, 94%, 73%, ${this.random(7, 11) * 0.1})`;

      function draw() {
        this.context.font = `${font}px Open Sans`;
        this.context.fillStyle = color;
        this.context.fillText(flame, x, y);
      }

      function update() {
        y -= velY;
      }

      function getY() {
        return y;
      }

      return {
        draw: draw,
        update: update,
        flame: flame,
        getY: getY,
        x: x,
        color: color,
      };
    },

    skillModule: function skillModule() {
      this.counter = this.counter || 0;
      this.counter++;
      const skill = this.skillList[this.counter % this.skillList.length];

      const aspect = this.getAspect();
      const font =
        this.random((aspect.x / aspect.y) * 20, (aspect.x / aspect.y) * 40);
      this.context.font = `${font}px Archivo Black`;
      const textWidth = this.context.measureText(skill).width;

      let x = this.random(0, aspect.x - textWidth);
      let y = aspect.y + 60;
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

      return {
        draw: draw,
        update: update,
        getY: getY,
        skill: skill,
        
      };
    },
  };

  const view = {
    setViewportHeight: function setViewportHeight() {
      $('.hero, .skills').css({ height: model.getAspect().y });
    },

    updateViewportHeight: function updateViewportHeight() {
      model.viewHeight = model.getAspect().y;
      this.setViewportHeight();
    },

    windowIsShortLandscape: function windowIsShortLandscape() {
      return (model.getAspect().x / model.getAspect().y) >= (4 / 3);
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
      this.setupListeners();
      this.canvasLoop();
      view.setViewportHeight();
    },

    setupListeners: function setupListeners() {
      $('.projects-grid').on('click', '.project-hide', this.toggleProject);
      $(window).on('orientationchange', view.updateViewportHeight.bind(view));
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

    canvasLoop: function canvasLoop(updateTime = performance.now(), updateTime2 = performance.now()) {
      const width = model.canvas.width =  model.getAspect().x;
      const height = model.canvas.height = model.viewHeight;

      model.context.fillStyle = 'rgba(250, 98, 95, 1)';
      model.context.fillRect(0, 0, width, height);

      // timing to create new word
      while(updateTime + 1000 < performance.now()) {
        const skill = model.skillModule();
        model.activeSkills.push(skill);
        updateTime = performance.now();
      }

      const flame = model.flameModule();
      const flame2 = model.flameModule();
      const flame3 = model.flameModule();
      model.activeFlames.push(flame);
      model.activeFlames.push(flame2);
      model.activeFlames.push(flame3);

      model.activeFlames.forEach((item) => {
        item.draw.call(model);
        item.update.call(model);
      });

      model.activeSkills.forEach((item) => {
        item.draw.call(model);
        item.update.call(model);
      });

      model.activeFlames = model.activeFlames.filter(item =>
        !(item.getY.call(model) < height - model.random(50, 800)));

      model.activeSkills = model.activeSkills.filter(item =>
        !(item.getY.call(model) < 0));

      requestAnimationFrame(canvasLoop.bind(null, updateTime, updateTime2));
    },
  };
  controller.initialize();
});