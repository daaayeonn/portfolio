const splitLines = new SplitType('.split-line', {types: 'lines'});
$('.line').wrap('<div class="line-wrap">')

// --스크롤 부드럽게--
const lenis = new Lenis()

lenis.on('scroll', (e) => {
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)
// -----


// ---------------------공통 시작----------------------
// !!cursor!!
const $cursor = $('.cursor');
let lastX = 0, lastY = 0;

// 마우스 움직임을 추적하여 커서 위치와 잔상 업데이트
$(document).mousemove(function(e) {
  let mouseX = e.clientX;
  let mouseY = e.clientY;

  // 커서 위치 업데이트
  $cursor.css({
    top: mouseY + 'px',
    left: mouseX + 'px',
    'transform': 'translate(-50%, -50%)'
  });

  // 잔상 생성
  if (lastX !== 0 && lastY !== 0) {
    createTrail(lastX, lastY, mouseX, mouseY);
  }

  // 현재 좌표를 이전 좌표로 갱신
  lastX = mouseX;
  lastY = mouseY;
});

// 잔상 선을 생성하는 함수
function createTrail(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let length = Math.sqrt(dx * dx + dy * dy); // 두 점 사이의 거리
  let angle = Math.atan2(dy, dx) * 180 / Math.PI; // 각도 계산

  const $trail = $('<div class="trail"></div>');
  $('.cursor-trail-wrap').append($trail);

  // trail 요소가 생성될 때 cursor가 hv 클래스라면 hv 클래스 추가
  if ($('.cursor').hasClass('hv')) {
    $trail.addClass('hv');
  }

  $trail.css({
    width: length + 'px',
    left: x1 + 'px',
    top: y1 + 'px',
    transform: 'rotate(' + angle + 'deg)'
  });

  // 일정 시간이 지나면 잔상을 제거
  setTimeout(function() {
    $trail.remove();
  }, 700); // 잔상이 사라지는 시간과 일치
}

// a, button에 hover 했을 때 모양 변경을 위한 클래스 추가
$('a, button').on('mouseenter', function() {
  $('.cursor').addClass('hv');
  $('.cursor-trail-wrap .trail').addClass('hv');
}).on('mouseleave', function() {
  $('.cursor').removeClass('hv');
  $('.cursor-trail-wrap .trail').removeClass('hv');
});
// !!cursor 부분 끝!!

// !!headline 시작!!
$('.headline').each(function(i, el) {
  gsap.to($(el), {
    scrollTrigger: {
      trigger: $(el).closest('.hs'),
      start: '0% 0%',
      end: '100% 0%',
      toggleActions: 'restart reset restart reset',
    },
    opacity: 1,
  })
})
// !!headline 끝!!
// ---------------------공통 끝-----------------------




// --------------------visual 시작--------------------
// !!.visual 영역을 참조하여 캔버스를 초기화!!
const visualEl = document.querySelector('.visual');
let canvas, c, w, h;

function init(elemid) {
  canvas = document.getElementById(elemid);
  c = canvas.getContext("2d");
  
  // canvas 크기를 .visual의 크기로 설정
  resizeCanvas();

  c.fillStyle = "rgba(166, 225, 43, 1)";
  c.fillRect(0, 0, w, h);
  return c;
}

// .visual 크기에 맞춰 캔버스 크기 조정 함수
function resizeCanvas() {
  w = canvas.width = visualEl.clientWidth;
  h = canvas.height = visualEl.clientHeight;
}

// Firefly 클래스 정의
class firefly {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.s = Math.random() * 2;
    this.ang = Math.random() * 2 * Math.PI;
    this.v = this.s * this.s / 4;
  }

  move() {
    this.x += this.v * Math.cos(this.ang);
    this.y += this.v * Math.sin(this.ang);

    // .visual 영역을 벗어나는 경우 각도를 반전시켜 영역 안에서만 이동하도록 설정
    if (this.x < 0 || this.x > w) {
      this.ang = Math.PI - this.ang; // x 방향 반전
    }
    if (this.y < 0 || this.y > h) {
      this.ang = -this.ang; // y 방향 반전
    }

    this.ang += Math.random() * 20 * Math.PI / 180 - 10 * Math.PI / 180;
  }

  show() {
    c.beginPath();
    c.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
    c.fillStyle = "#a6e12b";
    c.fill();
  }
}

let f = [];

function draw() {
  // 767px 이하일 때 50, 그 이상일 때 100
  let maxFireflies = window.innerWidth <= 767 ? 50 : 100; 

  if (f.length < maxFireflies) {
    for (let j = 0; j < 10; j++) {
      f.push(new firefly());
    }
  }

  for (let i = 0; i < f.length; i++) {
    f[i].move();
    f[i].show();
  }
}

function loop() {
  window.requestAnimationFrame(loop);
  c.clearRect(0, 0, w, h);
  draw();
}

// 창 크기 변경 시 .visual 크기에 맞춰 canvas 크기 조정
window.addEventListener("resize", function() {
  resizeCanvas();
  draw();
});

// 페이지 로드 후 canvas 초기화
document.addEventListener("DOMContentLoaded", function() {
  init("canvas");
  loop();
});
// -----------------
// !!scroll 글자!!
const texts = ["Scroll", "Dcroll", "Dowoll", "Downll", "Downl", "Down"];
const scrollText = document.getElementById("scrollText");
let index = 0;
let isReversing = false;

function animateText() {
  // 현재 텍스트 설정
  scrollText.textContent = texts[index];

  // 지연 시간 설정: "Scroll" 또는 "Down"일 때는 1초, 나머지는 0.2초
  const delay = (texts[index] === "Scroll" || texts[index] === "Down") ? 1000 : 150;

  // 다음 인덱스 계산
  if (!isReversing) {
    // 정방향 진행
    index++;
    if (index === texts.length - 1) {
      isReversing = true; // 마지막 인덱스에 도달하면 방향을 반대로
    }
  } else {
    // 역방향 진행
    index--;
    if (index === 0) {
      isReversing = false; // 첫 번째 인덱스에 도달하면 다시 정방향으로
    }
  }

  // 지정한 시간 후 animateText 호출
  setTimeout(animateText, delay);
}

// 애니메이션 시작
animateText();

// --- 스크롤 시 scroll text 사라지게 하기
$(window).scroll(function() {
  if ($(this).scrollTop() > 0) {
    $('.visual .scroll-text').addClass('hide');
  } else {
    $('.visual .scroll-text').removeClass('hide');
  }
})
// --------------------visual 끝--------------------


// --------------------preview 시작--------------------
const preview = gsap.timeline({
  scrollTrigger: {
    trigger: '.preview',
    start: '0% 100%',
    end: '100% 0%',
    scrub: 0,
  }
})
preview.to($('.preview .preview-item .preview-img'), {
  y: '10%',
  ease: 'power1.inOut'
}, 'preview')

ScrollTrigger.matchMedia({
  "(min-width: 768px)": function () {
    preview.to($('.preview .preview-list'), {
      y: '-70%',
      ease: 'power1.inOut'
    }, 'preview')
    
  },
})
// --------------------preview 끝----------------------


// --------------반딧불이 불 밝혀지는 부분------------
const fireflyLight = gsap.timeline({
  scrollTrigger: {
    trigger: '.preview',
    start: '80% 20%',
    end: '100% 0%',
    scrub: 0,
    // toggleActions: 'restart none reset none'
  }
})
fireflyLight.to($('.firefly-light'), {
  opacity: 1,
})

// --------------------project 시작--------------------
$('.project .project-list .project-item:not(:last-child)').each(function(i, el) {
  gsap.to($(el), {
    scrollTrigger: {
      trigger: el,
      start: '100% 100%',
      end: '100% 0%',
      pin: true,
      pinSpacing: false,
      scrub: 0
    },
    opacity: 0,
    ease: 'power1.inOut'
  })
})
$('.project .project-list .project-item').each(function(i, el) {
  gsap.to($(el).find('.img'), {
    scrollTrigger: {
      trigger: el,
      start: '0% 100%',
      end: '100% 100%',
      scrub: 0,
    },
    scale: 1,
    ease: 'power1.inOut'
  })
})
$('.project .project-list .project-item').each(function(i, el) {
  gsap.to($(el).find('.dimmed'), {
    scrollTrigger: {
      trigger: el,
      start: '100% 100%',
      end: '100% 10%',
      toggleActions: 'play none none reset'
    },
    opacity: 0.5,
  })
})
// --------------------project 끝--------------------


// --------------------about 시작------------------
const aboutKey = gsap.timeline({
  scrollTrigger: {
    trigger: '.about .keyword-wrapper',
    start: '0% 0%',
    end: '100% 100%',
    scrub: 0,
  }
})
for (let i = 1; i <= 19; i++) {
  aboutKey.to($(`.about .keyword .keyword-text.${i}`), {
    filter: 'blur(0px)',
    opacity: 1,
    duration: 3,
    ease: 'linear'
  });
}
// --------------------about 끝--------------------