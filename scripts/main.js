

jQuery(($) => {
  const model = {};

  const view = {
    windowIsShortLandscape: function windowIsShortLandscape() {
      const width =
        Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const height =
        Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      return (width / height) >= (4 / 3);
    },

    hideProject: function hideProject(current, target) {
      if (this.windowIsShortLandscape()) {
        target.children('h3, .project-links').animate({opacity: 0}, 300);
      }
      current.addClass('project-collapse');
      setTimeout(() => {
        current.addClass('project-hide');
        if (this.windowIsShortLandscape()) {
          current.css('opacity', 0).animate({opacity: 1}, 300);
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
    },

    setupListeners: function setupListeners() {
      $('.projects-grid').on('click', '.project-hide', this.toggleProject);
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
  };

  controller.initialize();
});





const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const width = canvas.width = 
Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const height = canvas.height = 
Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

function random(min, max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}




function skillModule() {
  const skillList = [
    'ES6', 'CSS3', 'HTML5', 'Gulp', 'MVC', 'JavaScript', 'Foundation', 'Bootstrap',
    'Node.js', 'npm', 'postcss', 'bash', 'git', 'gitHub', 'Photoshop', 'DRY code',
    'clean code', 'self-documenting code', 'mobile-first', 'responsive design',
    'functional programming', 'object-oriented programming', 'hella APIs'
  ];
  const colors = ['hsl(290, 6%, 18%)', '#fbf579'];

  let y = height + 60;
  const speed = random(1, 4)
  const color = colors[random(0, colors.length)]
  const skill = skillList[random(0, skillList.length)]

  function getY() {
    return y;
  }

  context.font = 'bold 5rem Open Sans';
  let textWidth = context.measureText(skill).width
  const x = random(0, width - textWidth)

  function draw() {
    context.fillStyle = color;
    context.fillText(skill, x, y);
  }

  function update() {
    y -= speed;
  }

  return {
    draw: draw,
    update: update,
    getY: getY,
    skill: skill,

  }
}

let skills = [];

function loop(updateTime = performance.now()) {
  context.fillStyle = 'rgba(250, 98, 95, 1)';
  context.fillRect(0, 0, width, height);

  // timing function to create new word
  while(updateTime + 1000 < performance.now()) {
    const skill = skillModule()
    if (!skills.some(item => item.skill === skill.skill)) {
      skills.push(skill);
      updateTime = performance.now()
    }
  }

  for (let j = 0; j < skills.length; j++) {
    skills[j].draw();
    skills[j].update();
    if (skills[j].getY() < 0) {
      skills.splice(j, 1);
    }
  }
  requestAnimationFrame(loop.bind(null, updateTime));
}

loop()