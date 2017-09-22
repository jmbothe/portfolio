jQuery(($) => {
  const model = {
    canvas: document.querySelector('canvas'),
    context: document.querySelector('canvas').getContext('2d'),

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
    flameColors: ['hsla(57, 94%, 73%, 1)', 'hsla(57, 94%, 73%, .75)', 'hsla(57, 94%, 73%, .5)', 'hsla(57, 94%, 73%, .25)'],

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

    flameModule: function flameModule2() {
      const aspect = this.getAspect();
      let r = this.random(2, 9);
      let x = this.random(0, aspect.x);
      let y = aspect.y - r;
      let velY = this.random(1, 3);

      function draw() {
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
        draw: draw,
        update: update,
        getY: getY,
        x: x,
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
      let y = aspect.y + font;
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
      model.activeFlames.a.push(flame);
      model.activeFlames.b.push(flame2);
      model.activeFlames.c.push(flame3);
      const flame4 = model.flameModule();
      model.activeFlames.d.push(flame);

      model.context.lineWidth = 3;

      model.context.strokeStyle = model.flameColors[0];
      model.context.beginPath();
      model.activeFlames.a.forEach((item) => {
        item.draw.call(model);
        item.update.call(model);
      });
      model.context.stroke();
      model.context.closePath();

      model.context.fillStyle = model.flameColors[1];
      model.context.beginPath();
      model.activeFlames.b.forEach((item) => {
        item.draw.call(model);
        item.update.call(model);
      });
      model.context.fill();
      model.context.closePath();

      model.context.strokeStyle = model.flameColors[2];
      model.context.beginPath();
      model.activeFlames.c.forEach((item) => {
        item.draw.call(model);
        item.update.call(model);
      });
      model.context.stroke();
      model.context.closePath();

      model.activeSkills.forEach((item) => {
        item.draw.call(model);
        item.update.call(model);
      });

      model.context.fillStyle = model.flameColors[3];
      model.context.beginPath();
      model.activeFlames.d.forEach((item) => {
        item.draw.call(model);
        item.update.call(model);
      });
      model.context.fill();
      model.context.closePath();

      model.activeFlames.a = model.activeFlames.a.filter(item =>
        !(item.getY.call(model) < height - model.random(50, 800)));
      model.activeFlames.b = model.activeFlames.b.filter(item =>
        !(item.getY.call(model) < height - model.random(50, 800)));
      model.activeFlames.c = model.activeFlames.c.filter(item =>
        !(item.getY.call(model) < height - model.random(50, 800)));
      model.activeFlames.d = model.activeFlames.d.filter(item =>
        !(item.getY.call(model) < height - model.random(50, 800)));

      model.activeSkills = model.activeSkills.filter(item =>
        !(item.getY.call(model) < 0));

      requestAnimationFrame(canvasLoop.bind(null, updateTime, updateTime2));
    },
  };
  controller.initialize();
});