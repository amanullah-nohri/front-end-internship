/* script.js — TaskBoard interactivity: add/edit/delete, drag & drop, localStorage persistence */
const STORAGE_KEY = 'taskboard:v1';

let state = {
  tasks: [] // {id, text, status}
};

const template = document.getElementById('task-template');
const lists = {
  todo: document.getElementById('todo-list'),
  inprogress: document.getElementById('inprogress-list'),
  done: document.getElementById('done-list')
};
const input = document.getElementById('new-task-input');
const clearBtn = document.getElementById('clear-storage');

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw) {
    try{
      state = JSON.parse(raw);
    }catch(e){ state = {tasks:[]} }
  }
}

function render(){
  // clear lists
  Object.values(lists).forEach(l => l.innerHTML = '');
  state.tasks.forEach(task => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.id = task.id;
    node.querySelector('.task-content').textContent = task.text;
    node.querySelector('.edit').addEventListener('click', ()=> editTask(task.id));
    node.querySelector('.delete').addEventListener('click', ()=> deleteTask(task.id));
    addDragHandlers(node);
    lists[task.status].appendChild(node);
  });
}

function addTask(text){
  if(!text.trim()) return;
  const t = { id: cryptoRandomId(), text: text.trim(), status: 'todo' };
  state.tasks.push(t);
  save(); render();
}

function editTask(id){
  const t = state.tasks.find(x=>x.id===id);
  if(!t) return;
  const newText = prompt('Edit task text', t.text);
  if(newText === null) return;
  t.text = newText.trim();
  save(); render();
}

function deleteTask(id){
  state.tasks = state.tasks.filter(x=>x.id!==id);
  save(); render();
}

function cryptoRandomId(){
  // fallback for older browsers
  return 't_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9);
}

/* Drag & drop */
function addDragHandlers(node){
  node.addEventListener('dragstart', (e)=>{
    e.dataTransfer.setData('text/plain', node.dataset.id);
    node.classList.add('dragging');
  });
  node.addEventListener('dragend', ()=> node.classList.remove('dragging'));
}

Object.entries(lists).forEach(([status, el])=>{
  el.addEventListener('dragover', (e)=>{
    e.preventDefault();
    const dragging = document.querySelector('.task.dragging');
    const after = getDragAfterElement(el, e.clientY);
    if(!dragging) return;
    if(after == null) el.appendChild(dragging);
    else el.insertBefore(dragging, after);
  });
  el.addEventListener('drop', (e)=>{
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const task = state.tasks.find(x=>x.id===id);
    if(task){
      task.status = status;
      // reorder based on DOM order:
      const ids = Array.from(el.querySelectorAll('.task')).map(n=>n.dataset.id);
      // place tasks of this status in new order at the end of state.tasks while preserving others
      const others = state.tasks.filter(t => t.status !== status);
      const reordered = ids.map(i=>state.tasks.find(t=>t.id===i)).filter(Boolean);
      state.tasks = [...others, ...reordered];
      save(); render();
    }
  });
});

function getDragAfterElement(container, y){
  const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
  return draggableElements.reduce((closest, child)=>{
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height/2;
    if(offset < 0 && offset > closest.offset){
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* UI events */
input.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    addTask(input.value);
    input.value = '';
  }
});
clearBtn.addEventListener('click', ()=>{
  if(confirm('Reset and remove all saved tasks?')){
    localStorage.removeItem(STORAGE_KEY);
    state = {tasks:[]};
    render();
  }
});

/* initialize with some sample tasks if empty */
load();
if(state.tasks.length === 0){
  state.tasks = [
    {id: cryptoRandomId(), text: 'Onboard: meet mentor and setup dev environment', status:'todo'},
    {id: cryptoRandomId(), text: 'Build project skeleton (HTML/CSS/JS)', status:'inprogress'},
    {id: cryptoRandomId(), text: 'Write README and demo notes', status:'done'}
  ];
  save();
}
render();
