//init
var canvas = document.getElementsByTagName("canvas")[0],
    ctx = canvas.getContext("2d");

//colors
//transparent,brown,lightpurple,flesh,blue
var colors=["rgba(0,0,0,0)","#630","#95F","#FA8","#20C"];

//objects
var objects=[];

//perso
var perso={x:250,y:250,z:4,w:4,h:4,f:0,a:0.15,m:false,t:[[0,0,0,0,2,1,1,2,2,1,1,2,0,0,0,0],[0,4,0,3,2,1,1,2,2,1,1,2,3,0,4,0],[0,0,0,0,2,1,1,2,2,1,1,2,0,0,0,0],[3,0,4,0,2,1,1,2,2,1,1,2,0,4,0,3]]};

//baddies
//var baddies={x=0,y=0,z:7,w:4,h:4,f:0,a:0.5,}

document.onkeydown=function(event) {
	var key_code = event.keyCode;
    //Z=90 Q=81 S=83 D=68 Echap=27
    perso.m=false;
    if (key_code==90){perso.y-=2;perso.r=0;perso.m=true;}//Z
    if (key_code==83){perso.y+=2;perso.r=-90;perso.m=true;}//Q
    if (key_code==81){perso.x-=2;perso.r=180;perso.m=true;}//S
    if (key_code==68){perso.x+=2;perso.r=90;perso.m=true;}//D
    if (key_code==27){clearInterval(interval);console.log('stop')}//TODO:remove
};

document.onkeyup=function(event) {
    perso.m=false;
}

function draw() {
    //clear
    canvas.width = canvas.width;

    //draw perso
    var width=perso.w,
        height=perso.h,
        zoom=perso.z,
        frame=Math.floor(perso.f);  
    for(i=0;i<width*height;i++) {
        var tile=perso.t[frame][i];
        ctx.fillStyle=colors[tile];
        ctx.fillRect(perso.x+zoom*(i%width),perso.y+zoom*(Math.floor(i/height)),zoom,zoom);
    }

    //test anim
    if(perso.m) Math.floor(perso.f+perso.a)<=perso.t.length-1?perso.f+=perso.a:perso.f=0;
 
}

//draw();
var interval=setInterval(draw,33);