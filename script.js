const svg = document.getElementById('graph-svg');
const nodes = {
    'A': { x: 150, y: 250 }, 'B': { x: 350, y: 150 },
    'C': { x: 350, y: 350 }, 'D': { x: 550, y: 150 },
    'E': { x: 550, y: 350 }, 'F': { x: 750, y: 250 }
};

const edges = [
    ['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1],
    ['B', 'D', 5], ['C', 'E', 8], ['D', 'E', 2],
    ['D', 'F', 6], ['E', 'F', 3]
];

function init() {
    // Draw Edges first (so they are behind nodes)
    edges.forEach(([u, v, w]) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", nodes[u].x); line.setAttribute("y1", nodes[u].y);
        line.setAttribute("x2", nodes[v].x); line.setAttribute("y2", nodes[v].y);
        line.setAttribute("class", "edge");
        line.setAttribute("id", `edge-${u}-${v}`);
        svg.appendChild(line);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", (nodes[u].x + nodes[v].x) / 2);
        label.setAttribute("y", (nodes[u].y + nodes[v].y) / 2 - 10);
        label.setAttribute("class", "weight-text");
        label.textContent = w;
        svg.appendChild(label);
    });

    // Draw Nodes
    Object.entries(nodes).forEach(([id, pos]) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", pos.x); circle.setAttribute("cy", pos.y);
        circle.setAttribute("r", 20);
        circle.setAttribute("class", "node-circle");
        circle.setAttribute("id", `node-${id}`);
        svg.appendChild(circle);

        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("x", pos.x - 5); txt.setAttribute("y", pos.y + 5);
        txt.setAttribute("class", "node-text");
        txt.textContent = id;
        svg.appendChild(txt);
    });
}

async function runDijkstra() {
    const start = 'A', end = 'F';
    let distances = {}, prev = {}, pq = [];
    Object.keys(nodes).forEach(n => { distances[n] = Infinity; pq.push(n); });
    distances[start] = 0;

    while (pq.length > 0) {
        pq.sort((a, b) => distances[a] - distances[b]);
        let u = pq.shift();

        document.getElementById(`node-${u}`).classList.add('node-visited');
        await new Promise(r => setTimeout(r, 1000));

        for (let [from, to, weight] of edges) {
            let v = from === u ? to : (to === u ? from : null);
            if (v && pq.includes(v)) {
                const line = document.getElementById(`edge-${from}-${to}`);
                line.classList.add('edge-active');
                await new Promise(r => setTimeout(r, 600));

                let newDist = distances[u] + weight;
                if (newDist < distances[v]) {
                    distances[v] = newDist;
                    prev[v] = u;
                }
                line.classList.remove('edge-active');
            }
        }
    }
    drawFinalPath(prev, end);
}

function drawFinalPath(prev, target) {
    let curr = target;
    while (prev[curr]) {
        let u = prev[curr], v = curr;
        const line = document.getElementById(`edge-${u}-${v}`) || document.getElementById(`edge-${v}-${u}`);
        line.classList.add('edge-path');
        curr = prev[curr];
    }
}

init();