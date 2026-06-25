document.addEventListener("DOMContentLoaded", function(){

let arr = [], searchArr = [], stackArr = [], queueArr = [], arrayOps = [];
let root = null;

// NAVIGATION
window.showPage = id => {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
};

window.toggleTheme = () => document.body.classList.toggle('light');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ================= SORTING =================
window.setArray = () => {
  arr = document.getElementById('arrayInput').value.split(',').map(Number).filter(n => !isNaN(n));
  drawArray(arr, 'array');
};

async function drawArray(a, id) {
  let container = document.getElementById(id);
  container.innerHTML = '';
  a.forEach((v, i) => {
    let bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = Math.max(v * 4, 20) + 'px';
    bar.dataset.value = v;
    container.appendChild(bar);
  });
}

window.startSort = async () => {
  let type = document.getElementById('sortType').value;
  
  switch(type) {
    case 'bubble': await bubbleSort(); break;
    case 'selection': await selectionSort(); break;
    case 'insertion': await insertionSort(); break;
    case 'merge': await mergeSort(); break;
  }
};

async function bubbleSort() {
  for(let i = 0; i < arr.length; i++) {
    for(let j = 0; j < arr.length - i - 1; j++) {
      highlightBars(j, j+1, 'array');
      await sleep(300);
      
      if(arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        drawArray(arr, 'array');
        await sleep(200);
      }
      clearHighlight('array');
    }
  }
}

async function selectionSort() {
  for(let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for(let j = i+1; j < arr.length; j++) {
      highlightBars(minIdx, j, 'array');
      await sleep(300);
      if(arr[j] < arr[minIdx]) minIdx = j;
    }
    if(minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      drawArray(arr, 'array');
    }
    clearHighlight('array');
  }
}

async function insertionSort() {
  for(let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    highlightBars(i, 'array');
    await sleep(300);
    
    while(j >= 0 && arr[j] > key) {
      arr[j+1] = arr[j];
      j--;
      drawArray(arr, 'array');
      await sleep(200);
    }
    arr[j+1] = key;
    clearHighlight('array');
  }
}

async function mergeSort() {
  await mergeSortHelper(0, arr.length - 1);
}

async function mergeSortHelper(left, right) {
  if(left < right) {
    let mid = Math.floor((left + right) / 2);
    await mergeSortHelper(left, mid);
    await mergeSortHelper(mid + 1, right);
    await merge(left, mid, right);
  }
}

async function merge(left, mid, right) {
  let temp = [];
  let i = left, j = mid + 1, k = 0;
  
  while(i <= mid && j <= right) {
    highlightBars(i, j, 'array');
    await sleep(200);
    if(arr[i] <= arr[j]) {
      temp[k++] = arr[i++];
    } else {
      temp[k++] = arr[j++];
    }
    clearHighlight('array');
  }
  
  while(i <= mid) temp[k++] = arr[i++];
  while(j <= right) temp[k++] = arr[j++];
  
  for(let p = left; p <= right; p++) {
    arr[p] = temp[p - left];
  }
  drawArray(arr, 'array');
}

function highlightBars(...indices) {
  let containerId = arguments[arguments.length - 1];
  let bars = document.querySelectorAll(`#${containerId} .bar`);
  indices.slice(0, -1).forEach(idx => {
    if(bars[idx]) bars[idx].classList.add('highlight');
  });
}

function clearHighlight(containerId) {
  document.querySelectorAll(`#${containerId} .highlight`).forEach(bar => {
    bar.classList.remove('highlight');
  });
}

// ================= SEARCHING =================
window.setSearch = () => {
  searchArr = document.getElementById('searchInput').value.split(',').map(Number).filter(n => !isNaN(n));
  drawArray(searchArr, 'searchArray');
};

window.startSearch = async () => {
  let val = Number(document.getElementById('searchValue').value);
  let type = document.getElementById('searchType').value;
  
  if(type === 'linear') {
    await linearSearch(val);
  } else {
    searchArr.sort((a,b) => a-b); // Binary search needs sorted array
    drawArray(searchArr, 'searchArray');
    await sleep(500);
    await binarySearch(val);
  }
};

async function linearSearch(val) {
  for(let i = 0; i < searchArr.length; i++) {
    highlightBars(i, 'searchArray');
    await sleep(400);
    
    if(searchArr[i] === val) {
      document.querySelectorAll('#searchArray .bar')[i].classList.add('visited');
      alert(`✅ Found ${val} at index ${i}`);
      return;
    }
    clearHighlight('searchArray');
  }
  alert(`❌ ${val} not found`);
}

async function binarySearch(val) {
  let left = 0, right = searchArr.length - 1;
  
  while(left <= right) {
    let mid = Math.floor((left + right) / 2);
    highlightBars(mid, 'searchArray');
    await sleep(500);
    
    if(searchArr[mid] === val) {
      document.querySelectorAll('#searchArray .bar')[mid].classList.add('visited');
      alert(`✅ Found ${val} at index ${mid}`);
      return;
    } else if(searchArr[mid] < val) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
    clearHighlight('searchArray');
  }
  alert(`❌ ${val} not found`);
}

// ================= ARRAY OPERATIONS =================
window.arrayInsert = () => {
  let val = prompt("Enter value to insert:");
  if(val !== null && !isNaN(val)) {
    arrayOps.push(Number(val));
    renderArrayOps();
  }
};

window.arrayDelete = () => {
  if(arrayOps.length > 0) {
    arrayOps.pop();
    renderArrayOps();
  } else {
    alert("Array is empty!");
  }
};

window.arraySearch = () => {
  let val = prompt("Enter value to search:");
  let idx = arrayOps.indexOf(Number(val));
  if(idx !== -1) {
    alert(`✅ Found ${val} at index ${idx}`);
  } else {
    alert(`❌ ${val} not found`);
  }
};

window.reverseArray = () => {
  arrayOps.reverse();
  renderArrayOps();
};

function renderArrayOps() {
  drawArray(arrayOps, 'arrayDisplay');
}

// ================= GRAPH =================
const graph = {
  A: ['B', 'C'], B: ['D', 'E'], C: ['F'], 
  D: [], E: ['F'], F: []
};

const nodePositions = {
  A: {x: 100, y: 100}, B: {x: 250, y: 50}, C: {x: 250, y: 150},
  D: {x: 400, y: 30}, E: {x: 400, y: 100}, F: {x: 550, y: 120}
};

window.resetGraph = () => {
  document.getElementById('graphSVG').innerHTML = createGraphSVG();
};

window.bfs = async () => {
  let queue = ['A'], seen = [];
  while(queue.length) {
    let node = queue.shift();
    if(!seen.includes(node)) {
      seen.push(node);
      highlightNode(node, 'highlight');
      await sleep(800);
      highlightNode(node, 'visited');
      queue.push(...graph[node]);
    }
  }
};

window.dfs = async (start = 'A') => {
  let seen = [];
  await dfsHelper(start, seen);
};

async function dfsHelper(node, seen) {
  if(seen.includes(node)) return;
  seen.push(node);
  
  highlightNode(node, 'highlight');
  await sleep(800);
  highlightNode(node, 'visited');
  
  for(let neighbor of graph[node]) {
    await dfsHelper(neighbor, seen);
  }
}

function createGraphSVG() {
  return `
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" 
              refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#74b9ff" />
      </marker>
    </defs>
    ${Object.entries(graph).map(([node, neighbors]) => 
      neighbors.map(neighbor => `
        <line class="line" x1="${nodePositions[node].x + 30}" y1="${nodePositions[node].y}" 
              x2="${nodePositions[neighbor].x - 30}" y2="${nodePositions[neighbor].y}" />
      `).join('')
    ).join('')}
    ${Object.entries(nodePositions).map(([node, pos]) => `
      <g>
        <circle class="node-circle" cx="${pos.x}" cy="${pos.y}" r="35" />
        <text class="node-text" x="${pos.x}" y="${pos.y + 6}" text-anchor="middle">${node}</text>
      </g>
    `).join('')}
  `;
}

function highlightNode(node, className) {
  let circles = document.querySelectorAll('.node-circle');
  circles.forEach(circle => circle.className = 'node-circle');
  
  let targetCircle = Array.from(circles).find(c => 
    c.nextElementSibling?.textContent === node
  );
  if(targetCircle) targetCircle.classList.add(className);
}

// ================= STACK & QUEUE =================
window.push = () => {
  let val = document.getElementById('stackVal').value;
  if(val) {
    stackArr.push(val);
    document.getElementById('stackVal').value = '';
    renderStack();
  }
};

window.pop = () => {
  if(stackArr.length > 0) {
    stackArr.pop();
    renderStack();
  }
};

function renderStack() {
  let container = document.getElementById('stack');
  container.innerHTML = '';
  stackArr.slice().reverse().forEach(val => {
    let box = document.createElement('div');
    box.className = 'stackBox';
    box.textContent = val;
    container.appendChild(box);
  });
}

window.enqueue = () => {
  let val = document.getElementById('queueVal').value;
  if(val) {
    queueArr.push(val);
    document.getElementById('queueVal').value = '';
    renderQueue();
  }
};

window.dequeue = () => {
  if(queueArr.length > 0) {
    queueArr.shift();
    renderQueue();
  }
};

function renderQueue() {
  let container = document.getElementById('queue');
  container.innerHTML = '';
  queueArr.forEach(val => {
    let box = document.createElement('div');
    box.className = 'queueBox';
    box.textContent = val;
    container.appendChild(box);
  });
}

// ================= BINARY SEARCH TREE =================
function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

window.insertBST = () => {
  let val = Number(document.getElementById('treeVal').value);
  if(!isNaN(val)) {
    root = insert(root, val);
    renderTree();
    document.getElementById('treeVal').value = '';
  }
};

function insert(node, val) {
  if(!node) return new Node(val);
  if(val < node.val) {
    node.left = insert(node.left, val);
  } else {
    node.right = insert(node.right, val);
  }
  return node;
}

window.inorder = () => {
  let res = [];
  inorderHelper(root, res);
  document.getElementById('output').textContent = `Inorder: ${res.join(', ')}`;
};

window.preorder = () => {
  let res = [];
  preorderHelper(root, res);
  document.getElementById('output').textContent = `Preorder: ${res.join(', ')}`;
};

window.postorder = () => {
  let res = [];
  postorderHelper(root, res);
  document.getElementById('output').textContent = `Postorder: ${res.join(', ')}`;
};

function inorderHelper(node, res) {
  if(node) {
    inorderHelper(node.left, res);
    res.push(node.val);
    inorderHelper(node.right, res);
  }
}

function preorderHelper(node, res) {
  if(node) {
    res.push(node.val);
    preorderHelper(node.left, res);
    preorderHelper(node.right, res);
  }
}

function postorderHelper(node, res) {
  if(node) {
    postorderHelper(node.left, res);
    postorderHelper(node.right, res);
    res.push(node.val);
  }
}

function renderTree() {
  let svg = document.getElementById('treeSVG');
  svg.innerHTML = '';
  
  if(!root) return;
  
  let nodes = [];
  let edges = [];
  
  function assignPositions(node, x, y, level) {
    if(!node) return;
    
    node.x = x;
    node.y = y;
    nodes.push(node);
    
    if(node.left) {
      edges.push({from: node.val, to: node.left.val});
      assignPositions(node.left, x - 100/Math.pow(2, level+1), y + 80, level + 1);
    }
    
    if(node.right) {
      edges.push({from: node.val, to: node.right.val});
      assignPositions(node.right, x + 100/Math.pow(2, level+1), y + 80, level + 1);
    }
  }
  
  assignPositions(root, 400, 50, 0);
  
  // Draw edges
  edges.forEach(edge => {
    let fromNode = nodes.find(n => n.val === edge.from);
    let toNode = nodes.find(n => n.val === edge.to);
    if(fromNode && toNode) {
      svg.innerHTML += `
        <path d="M ${fromNode.x} ${fromNode.y + 35} Q ${fromNode.x} ${toNode.y - 35} ${toNode.x} ${toNode.y - 35}" 
              class="line" stroke-dasharray="5,5" fill="none"/>
      `;
    }
  });
  
  // Draw nodes
  nodes.forEach(node => {
    svg.innerHTML += `
      <g>
        <circle class="node-circle" cx="${node.x}" cy="${node.y}" r="35"/>
        <text class="node-text" x="${node.x}" y="${node.y + 8}" text-anchor="middle">${node.val}</text>
      </g>
    `;
  });
}

// Initialize
document.getElementById('graphSVG').innerHTML = createGraphSVG();
});

