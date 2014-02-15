// ------------------------------------------------------------ CIRCUIT

// Get canvas, context, set size, cache Math functions
d=document;
b=d.body.children[0];
c=b.getContext('2d');
bw=b.width=600;
bh=b.height=400;
M=Math;
C=M.cos;
S=M.sin;
P=M.PI/180;
// Initialise player state
x=99;y=290;
w=s=p=r=0;
// position (x,y), bearing (w), speed (s), left turn amount (p), right turn amount (r)
U=L=R=0;
// keypress states: up, left, right
// Keypress handlers
d.onkeydown=d.onkeyup=function(e) {
    z=e.keyCode-38;
    // z = left(-1)||up(0)||right(1)
    v=e.type!="keyup";
    // v = keydown(true)||keyup(false)
    z||(U=v);
    // up (on/off)
    ~z||(L=v);
    // left (on/off)
    if(z==1)R=v;
    // right (on/off)
};
function _() {
    with(c){
        c.q=quadraticCurveTo;
        c.l=lineTo;
        c.m=moveTo;
        c.b=beginPath;
        // Draw grass fillStyle='#4d0';
        c.fillRect(0,0,bw,bh);
        // Draw racetrack strokeStyle='#333';
        lineWidth=40;
        lineJoin='round';
        c.b();
        c.m(99,300);
        c.l(99,200);
        c.q(99,160,50,160);
        c.q(20,90,170,40);
        c.l(300,60);
        c.q(350,80,240,130);
        c.q(220,150,300,155);
        c.q(600,100,520,300);
        c.q(530,330,250,310);
        c.l(200,370);
        c.q(99,370,99,298);
        c.stroke();
        // Draw start/finish line
        strokeStyle='#fff';
        lineWidth=3;
        c.b();
        c.m(79,280);
        c.l(120,280);
        c.stroke();
        // Update key inputs
        if (U) {
            // Accelerate (max speed 25)
            s+=s<25;
        } else {
            // Decelerate (stop if speed == 1, don't go below 0)
            s-=s>1||s;
        }
        if (L) {
            // Turn left
            p+=p<4;
            w-=s?p:0;
        } else if (R) {
            // Turn right
            r+=r<4;
            w+=s?r:0;
        }
        // Update car position
        x+=s/9*S(w*P);
        y+=s/9*-C(w*P);
        // Draw car
        shadowBlur=9;
        shadowColor='#000';
        fillStyle='red';
        c.m(x+9*S((w+30)*P),y+9*-C((w+30)*P));
        c.l(x+9*S((w-30)*P),y+9*-C((w-30)*P));
        c.l(x+9*-S((w+40)*P),y+9*C((w+40)*P));
        c.l(x+9*-S((w-40)*P),y+9*C((w-40)*P));
        c.fill();
        shadowBlur=0;
    }
}
setInterval(_,20);