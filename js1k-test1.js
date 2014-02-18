//misc
M=Math,
Mf=M.floor,
Mr=M.random,
Ma=M.abs;

//init level
level=score=ennemy=frame=0;

//colors
//white,green,black,red,flesh
colors=["#FFF","#294","#000","#E21","#DAA"];

//add the player
//type,x,y,dx,dy,zoom,speed,timebeforefire,tiles,size
objects=[];
objects.push(['p',250,250,0,0,4,3,0,'04403334411001000440433301140010',4]);

//keys
b.onkeydown=function(e) {
    //LEFT=37 UP=38 RIGHT=39 DOWN=40
	keyCode = e.keyCode;
    keyCode==37||keyCode==39?objects[0][3]=keyCode-38:0;
    keyCode==38||keyCode==40?objects[0][4]=keyCode-39:0;
};

b.onkeyup=function(e) {
    //LEFT=37 UP=38 RIGHT=39 DOWN=40
    keyCode = e.keyCode;
    keyCode==37||keyCode==39?objects[0][3]=0:0;
    keyCode==38||keyCode==40?objects[0][4]=0:0;
};

//new game
function newGame() {
    level++;
    //add the ennemies
    for (o=0;o<level+3;o++) {
        //type,x,y,dx,dy,zoom,speed,timebeforefire,tiles,size
        objects.push(['e',Mr()*500,Mr()*500,0,0,5+Mr()*level,1.1,Mr()*80,'10210111111010101021011311101010',4]);
        ennemy++;
    }
}

//fires a bullet (origintype,originx,originy,targetx,targety,speed,zoom)
function newBullet(o,x,y,nx,ny,s,z){
    bx=nx-x;
    by=ny-y;
    if (Ma(bx)<Ma(by)) {
        bx=bx/Ma(by);
        by=by/Ma(by);
    } else {
        by=by/Ma(bx);
        bx=bx/Ma(bx);
    }
    //create the bullet
    //type,x,y,dx,dy,zoom,speed,N#A,tiles,size,origin
    objects.push(['b',x,y,bx,by,z,s,0,'43',1,o]);
}

//collision
function isCollision(obj,target){
    objx=obj[1],
    objy=obj[2],
    objz=obj[5],
    targetx=target[1],
    targety=target[2],
    targetz=target[5];
    return !(targetx>=objx+objz||targetx+targetz<=objx||targety>=objy+objz||targety+targetz<=objy);
}

//destroy an object
function destroy(obj) {
    objects.splice(objects.indexOf(obj),1);
}

//player fire a bullet
a.addEventListener('click', function(event) {
    player=objects[0];
    if (player[7]<0) {
        newBullet('p',player[1],player[2],event.x,event.y,6,4);
        player[7]=20;
    }
}, false);

//cycle
newGame();
interval=setInterval(function () {
    //clear the scene
    a.width = a.width;

    //show level & score
    c.fillText('lv'+level+' pt'+score, 5, 15);
    
    //manage objects
    objects.forEach(function(obj){
        //reduce the 'next time before firing again'
        obj[7]-=1;
        
        //ennemy
        if (obj[0]=='e') {
            obj[3]=obj[1]<objects[0][1]?1:-1;
            obj[4]=obj[2]<objects[0][2]?1:-1;
            if (obj[7]<0){
                newBullet('e',obj[1],obj[2],objects[0][1],objects[0][2],obj[6]*4,obj[5]);
                obj[7]=30;
            }
        }
        
        //bullet
        if (obj[0]=='b') {
            if (obj[1]<0||obj[1]>500||obj[2]<0||obj[2]>500) {
                //destroy the bullet if out of the arena
                destroy(obj);
            } else {
                //check for bullet collision
                objects.forEach(function(target){
                    if (target[0]=='e'&&obj[10]=='p'&&isCollision(obj,target)) {
                        destroy(target);
                        destroy(obj);
                        score++;
                        if (--ennemy<=0) newGame();
                    }
                    if (target[0]=='p'&&obj[10]=='e'&&isCollision(obj,target)) {
                        clearInterval(interval);
                    }
                });
            }
        }
        
        //move the object
        obj[1]+=obj[3]*obj[6];
        obj[2]+=obj[4]*obj[6];

        //draw the object
        zoom=obj[5];
        size=obj[9];
        for(i=0;i<size*size;i++) {
            tile=obj[8].charAt(i+size*size*Mf(frame));
            c.fillStyle=colors[tile];
            c.fillRect(obj[1]+zoom*(i%size),obj[2]+zoom*(Mf(i/size)),zoom,zoom);
        }

        //next frame
        frame<0?frame=1.9:frame-=0.02;
    });
},33);