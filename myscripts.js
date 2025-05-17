const canvas = document.getElementById('myCanvas');
const button = document.getElementById('myButton')
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#dbe9ff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
let all_cracks = [];

canvas.addEventListener('click', function(event){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log('Clicked at: ', x, y);

    let all_segments = [];
    let all_points = [];
    let angle = Math.random() * Math.PI * 2;
    let main = crack_logic(x, y, angle, 0, all_cracks, all_segments, all_points);
    all_cracks.push(main); 

    for (let crack of all_cracks){
        ctx.beginPath();
        ctx.moveTo(crack[0].x, crack[0].y);
        for (let pt of crack.slice(1)){
            ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }
    
});


function crack_logic(x, y, angle, depth, all_cracks, all_segments, all_points){
    let path = [];
    path.push({x,y});

    let n = 25 - depth * 3;
    for (let i = 0; i < n; i++){
        let prev = {x, y};
        let distance = Math.random() * 5 + 5;
        let turn = (Math.random() * 2 - 1) * Math.PI / 12; // ±15°
        angle += turn;

        let influence_x = 0;
        let influence_y = 0;
        let total_weight = 0;

        for (let pt of all_points) {
            let dx = pt.x - x;
            let dy = pt.y - y;
            let dist = Math.hypot(dx, dy);
            if (dist > 10 && dist < 60) { 
                let weight = 1 / dist; 
                influence_x += dx * weight;
                influence_y += dy * weight;
                total_weight += weight;
            }
        }

        if (total_weight > 0) {
            influence_x /= total_weight;
            influence_y /= total_weight;
            let target_angle = Math.atan2(influence_y, influence_x);
            let blend = 0.02; 
            angle = (1 - blend) * angle + blend * target_angle;
        }



        x += Math.cos(angle) * distance;
        y += Math.sin(angle) * distance;
        
        
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) break;
        
        //make sure no intersection
        let intersects = false;
        for (let seg of all_segments){
            if (checkCollision(prev.x, prev.y, x, y, seg.x1, seg.y1, seg.x2, seg.y2)){
                intersects = true;
                break;
            }
        }


        path.push({x, y});
        all_points.push({x, y});
        all_segments.push({x1: prev.x, y1: prev.y, x2: x, y2: y});

        // branching logic!!
        if (Math.random() < 0.25 && depth < 2){
            let direction = (Math.random() > 0.5 ? 1 : -1);
            let offset = Math.PI / 8 + Math.random() * Math.PI / 8; // 22°–45°
            let new_angle = angle + direction * offset;


            let branch = crack_logic(x, y, new_angle, depth + 1, all_cracks, all_segments, all_points);
            all_cracks.push(branch);
        }
    }
    return path;
}

function ccw(A, B, C){
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
}

function checkCollision(x1, y1, x2, y2, x3, y3, x4, y4){
    const A = {x: x1, y: y1}, B = {x: x2, y: y2};
    const C = {x: x3, y: y3}, D = {x: x4, y: y4};
    return (ccw(A, C, D) !== ccw(B, C, D)) && (ccw(A, B, C) !== ccw(A, B, D)); 
}


button.addEventListener('click', function(event){
    renderKintsugi(all_cracks)
});

function renderKintsugi(cracks){
    
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 4;
    ctx.shadowColor = '#d4af37'

    for (let crack of cracks) {
        if (crack.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(crack[0].x, crack[0].y);
        for (let pt of crack.slice(1)) {
            ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
    }

    ctx.shadowBlur = 0;
}