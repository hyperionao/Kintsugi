const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#dbe9ff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('click', function(event){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log('Clicked at: ', x, y);

    all_cracks = [];
    let angle = Math.random() * Math.PI * 2;
    let main = crack_logic(x, y, angle, 0, all_cracks);
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


function crack_logic(x, y, angle, depth, all_cracks){
    let path = [];
    path.push({x,y});

    let n = 15 - depth * 3;
    for (let i = 0; i < n; i++){
        let distance = Math.random() * 5 + 5;
        angle += (Math.random() * 2 - 1) * Math.PI /4;
        x += Math.cos(angle) * distance;
        y += Math.sin(angle) * distance;
        
        // make sure new point is within the canvas bounds
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) break;
        path.push({x,y});

        // branching logic!!
        if (Math.random() < 0.1 && depth < 2){
            let direction = (Math.random() > 0.5 ? 1 : -1);
            let offset = Math.random() * Math.PI / 16;
            let new_angle = angle + direction * offset;


            let branch = crack_logic(x, y, new_angle, depth + 1, all_cracks);
            all_cracks.push(branch);
        }
    }
    return path;
}

