//init
var canvas=document.getElementsByTagName("canvas")[0],
    ctx=canvas.getContext("2d");

//init level
var level=1,
    score=0,
    ennemy=0;

//colors
//transparent,brown,lightpurple,flesh,blue,lightgreen,darkgreen,blood,darkgrey
var colors=["rgba(0,0,0,0)","#630","#95F","#FA8","#20C","#495","#362","#820","#333"];

//objects
var objects=[];

//add the player
objects.push({n:'player',x:250,y:250,dx:0,dy:0,z:4,w:4,h:4,f:0,a:0.15,s:3,b:0,t:[[0,0,0,0,2,1,1,2,2,1,1,2,0,0,0,0],[0,4,0,3,2,1,1,2,2,1,1,2,3,0,4,0],[0,0,0,0,2,1,1,2,2,1,1,2,0,0,0,0],[3,0,4,0,2,1,1,2,2,1,1,2,0,4,0,3]]});

//keys
document.onkeydown=function(event) {
	var key_code = event.keyCode;
    //Z=90 Q=81 S=83 D=68 Echap=27
    if (key_code==81) objects[0].dx=-1;//S
    if (key_code==68) objects[0].dx=1;//D
    if (key_code==90) objects[0].dy=-1;//Z
    if (key_code==83) objects[0].dy=1;//Q
    if (key_code==27){clearInterval(interval);console.log('stop')}//TODO:remove
};

document.onkeyup=function(event) {
    var key_code = event.keyCode;
    if (key_code==81||key_code==68) objects[0].dx=0;
    if (key_code==90||key_code==83) objects[0].dy=0;
};

//new game
function newGame() {
    level++;
    //add the ennemies
    for (o=0;o<level+3;o++) {
        objects.push({n:'ennemy',x:Math.floor(Math.random()*500),y:Math.floor(Math.random()*500),dx:0,dy:0,z:5+Math.random()*level,w:4,h:4,b:Math.random()*80,f:Math.random()*3,a:0.3,s:1.1,t:[[7,6,5,7,0,5,6,0,7,6,5,7,0,8,8,0],[7,6,5,0,0,5,6,7,0,6,5,7,7,8,8,0],[0,6,5,0,7,5,6,7,0,6,5,0,7,8,8,7],[0,6,5,7,7,5,6,0,7,6,5,0,0,8,8,7]]});
        ennemy++;
    }
}

//create a bullet
function newBullet(o,x,y,nx,ny,s,z){
    var bx=nx-x;
    var by=ny-y;
    if (Math.abs(bx)<Math.abs(by)) {
        bx=bx/Math.abs(by);
        by=by/Math.abs(by);
    } else {
        by=by/Math.abs(bx);
        bx=bx/Math.abs(bx);
    }
    objects.push({n:'bullet',x:x,y:y,dx:bx,dy:by,z:z,w:1,h:1,f:0,a:1,s:s,o:o,t:[[3],[7],[0]]});
}

//collision
function isCollision(obj,target){
    return !(target.x>=obj.x+obj.z||target.x+target.z<=obj.x||target.y>=obj.y+obj.z||target.y+target.z<=obj.y);
}

//destroy an object
function destroy(obj) {
    objects.splice(objects.indexOf(obj),1);
}

//player fire a bullet
canvas.addEventListener('click', function(event) {
    var player=objects[0];
    if (player.b<=0) {
        var rect = canvas.getBoundingClientRect();
        newBullet('player',player.x,player.y,event.clientX-rect.left,event.clientY-rect.top,6,4);
        player.b=20;
    }
}, false);

//cycle
newGame();
var interval=setInterval(function () {
    //clear the scene
    canvas.width = canvas.width;

    //show level & score
    ctx.font="10pt Arial";
    ctx.fillText('level'+level+' score:'+score, 5, 15);
    
    //manage objects
    objects.forEach(function(obj){
        //do things
        obj.b-=1;
        switch(obj.n) {
            case 'ennemy':
                obj.dx=obj.x<objects[0].x?1:-1;
                obj.dy=obj.y<objects[0].y?1:-1;
                if (obj.b<=0){
                    newBullet('ennemy',obj.x,obj.y,objects[0].x,objects[0].y,obj.s*4,obj.z);
                    obj.b=80-2*obj.z;
                }
                break;
            case 'bullet':
                if (obj.x<0||obj.x>500||obj.y<0||obj.y>500) {
                    destroy(obj);
                } else {
                    objects.every(function(target){
                        if (target.n=='ennemy'&&obj.o=='player'&&isCollision(obj,target)) {
                            destroy(target);
                            destroy(obj);
                            score++;
                            if (--ennemy<=0) newGame();
                            return false;
                        } else if (target.n=='player'&&obj.o=='ennemy'&&isCollision(obj,target)) {
                            clearInterval(interval);
                            ctx.font="50pt Arial";
                            ctx.fillStyle='#F00';
                            ctx.fillText('GAME OVER', 40, 270);
                        }
                        return true;
                    });
                }
        }
        
        //move the object
        obj.x+=obj.s*obj.dx;
        obj.y+=obj.s*obj.dy;

        //animate the object
        width=obj.w;
        height=obj.h;
        zoom=obj.z;
        frame=Math.floor(obj.f);
        if(obj.dx!==0||obj.dy!==0) Math.floor(obj.f+obj.a)<=obj.t.length-1?obj.f+=obj.a:obj.f=0;

        //draw the object
        for(i=0;i<width*height;i++) {
            var tile=obj.t[frame][i];
            ctx.fillStyle=colors[tile];
            ctx.fillRect(obj.x+zoom*(i%width),obj.y+zoom*(Math.floor(i/height)),zoom,zoom);
        }
    });

},33);