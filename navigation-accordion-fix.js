(()=>{'use strict';
function handle(e){
 const head=e.target.closest?.('.nav-group-head');
 if(!head)return;
 const group=head.closest('.nav-group');
 if(!group)return;
 const body=[...group.children].find(x=>x.classList?.contains('nav-group-body'));
 if(!body)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 const open=!group.classList.contains('is-open');
 group.classList.toggle('is-open',open);
 head.setAttribute('aria-expanded',String(open));
 body.hidden=!open;
 body.style.setProperty('display',open?'grid':'none','important');
 const arrow=head.querySelector('b');
 if(arrow)arrow.style.setProperty('transform',open?'rotate(0deg)':'rotate(-90deg)','important');
}
document.addEventListener('click',handle,true);
})();
