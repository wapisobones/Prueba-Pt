"use strict";

/* CUSTOMIZATIONS */
const AUTO_MOVE = false;
const ANIMATION_TIME = 1000;
const AUTO_MOVE_DELAY = 5000;

/* CODE */

const STATE = {
  currentInd: null
};

const triggers = Array.from(document.querySelectorAll(".trigger"));
const targets = triggers.map((trigger) => {
  return document.querySelector(trigger.dataset.target);
});
const triggerSpec = document.querySelector(".trigger-spec");
triggerSpec.style.width = `${100 / triggers.length}%`;

triggers.forEach((trigger, ind) => {
  trigger.addEventListener("click", async () => {
    await setActiveCard(ind);
  });
});

setActiveCard(0);

async function setActiveCard(ind) {
  if (STATE.currentInd === ind) return;

  if (STATE.currentInd !== null) {
    triggers[STATE.currentInd].classList.remove("active");
    targets[STATE.currentInd].classList.remove("active");
  }

  triggers[ind].classList.add("active");
  targets[ind].classList.add(
    ind < STATE.currentInd ? "slideLeft" : "slideRight"
  );
  triggerSpec.style.transform = `translateX(${ind}00%)`;

  const prevInd = STATE.currentInd;
  STATE.currentInd = ind;

  await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIME));

  targets[STATE.currentInd].classList.add("active");
  targets[ind].classList.remove(ind < prevInd ? "slideLeft" : "slideRight");
}

async function autoLoop() {
  let currIter = 0;
  while (true) {
    await setActiveCard(currIter);
    await new Promise((resolve) => setTimeout(resolve, AUTO_MOVE_DELAY));
    currIter = (STATE.currentInd + 1) % triggers.length;
  }
}

if (AUTO_MOVE && AUTO_MOVE_DELAY) autoLoop();



document.addEventListener("DOMContentLoaded", function() {
  let fullpage = document.querySelector('#fullpage');
  let body = document.querySelector('body');
  let transition = true;
  var lastScrollTop = 0;
  window.addEventListener('scroll',function(e) {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    console.log(st);
    if (st < lastScrollTop && st < 10) {
      fullpage.classList.remove('position--relative');
      body.classList.remove('overflow--allow');
      // var nodes = document.querySelectorAll('.section');
      // var last = nodes[nodes.length- 1];
      // last.classList.add('current');
    }
    lastScrollTop = st <= 0 ? 0 : st;
  });
  fullpage.addEventListener('wheel',function(e) {
    if (e.deltaY < 0) {
      if(!body.classList.contains('overflow--allow')) {
        let current = document.querySelector('.section.current');
        var sibling = current.previousElementSibling || 'ignore';
        console.log(sibling);
        transitionScroll('up',current,sibling);
      }
    }
    if (e.deltaY > 0) {
      if(!body.classList.contains('overflow--allow')) {
        let current = document.querySelector('.section.current');
        var sibling = current.nextElementSibling;
        transitionScroll('down',current,sibling);
      }
    }
  });
  function transitionScroll(direction,current,sibling) {
    if(transition) {
      transition = false;
      if(sibling && sibling !== 'ignore') {
        current.classList.remove('current');
        if(direction === 'down') current.nextElementSibling.classList.add('current');
        else if(direction === 'up') current.previousElementSibling.classList.add('current');
        let tO = setTimeout(function() {
          transition = true;
        },2000);
      } else if(sibling === 'ignore') {
        let tO = setTimeout(function() {
          transition = true;
        },2000);
        return;
      }
      else {
        fullpage.classList.add('position--relative');
        body.classList.add('overflow--allow');
        let tO = setTimeout(function() {
          transition = true;
        },2000);
      }
    }
  }
});
