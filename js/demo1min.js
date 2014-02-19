/**
 * JS1K 2014
 * http://js1k.com/2014-dragons/
 * 
 * Demo author: monsieurluge
 * Demo name : Marcel VS the Ugly Angry Little Dragons
**/

//misc
M=Math,
R=M.random,
A=M.abs;

//init
//L:level
//W:arena size (width & height)
L = 0,
W = 500;

//add the player
//type, x, y, dx, dy, zoom, speed, timebeforefire, tiles, size
//O:objects
//P:player
O = [[1, 9, 9, 1, 0, 4, 3, 0, '0440333441100100', 4]];
P = O[0];

//keys
//left=37 up=38 right=39 down=40
b.onkeydown=function(e) {
	k = e.keyCode;
    P[3] = A(k-38) == 1 ? k-38 : 0;
    P[4] = A(k-39) == 1 ? k-39 : 0;
};

//new game
function G() {
    L++;
    
    //add the ennemies
    //type, x, y, dx, dy, zoom, speed, timebeforefire, tiles, size
    for (o = 0; o < L; o++)
        O.push([2, R()*W, R()*W, 0, 0, 4+L, 1.1, 30, '1021011111101010', 4]);
}

//fires a bullet
//origintype, originx, originy, targetx, targety, speed, zoom
function B(o, x, y, v, w, s, z) {
    i = v-x;
    j = w-y;
    
    if (A(i) < A(j)) {
        i = i/A(j);
        j = j/A(j);
    } else {
        j = j/A(i);
        i = i/A(i);
    }
    
    //create the bullet
    //type, x, y, dx, dy, zoom, speed, N#A, tiles, size, origin
    O.push([3, x, y, i, j, z, s, 0, '3', 1, o]);
}

//collision (approximation)
function C(o, t) {
    x = o[1] - t[1];
    y = o[2] - t[2];

    return M.sqrt(x*x + y*y) < 14;
}

//destroy an object
function D(o) {
    O.splice(O.indexOf(o), 1);
}

//player fire a bullet
a.addEventListener('click', function(e) {
    if (P[7] < 0) {
        B(1, P[1], P[2], e.x, e.y, 6, 4);
        P[7] = 20;
    }
}, 0);

//cycle
I = setInterval(function () {
    //clear the scene
    a.width += 0;

    //show the score
    c.fillText('lvl' + L, 5, 9);

    //manage objects
    O.forEach(function(o) {
        //reduce the 'next time before firing again'
        o[7]--;

        //ennemy
        if (o[0] == 2) {
            //move to the player
            o[3] = o[1] < P[1] ? 1 : -1;
            o[4] = o[2] < P[2] ? 1 : -1;

            if (o[7] < 0) {
                //fire a bullet
                B(2, o[1], o[2], P[1], P[2], o[6]*4, o[5]);
                o[7] = 30;
            }
        }

        //bullet
        if (o[0] == 3) {
            //check for bullet collision
            O.forEach(function(t) {
                //collision between a player bullet and an ennemy ?
                if (o[10] == 1 && t[0] == 2 && C(o, t)) {
                    D(t);
                    D(o);
                    S++;
                }
                
                //collision between an emmeny bullet and the player ?
                o[10] == 2 && t[0] == 1 && C(o, t) ? clearInterval(I) : 0;
            });

            //destroy the bullet if out of the arena
            o[1] < 0 || o[1] > W || o[2] < 0 || o[2] > W ? D(o) : 0;
        }

        //move the object
        o[1] += o[3]*o[6];
        o[2] += o[4]*o[6];

        //draw the object
        z = o[5];
        s = o[9];

        for(i = 0; i < s*s; i++) {
            c.fillStyle = '#' + ['FFF','294','000','E21','DAA'][o[8].charAt(i)]; //colors : white,green,black,red,flesh
            c.fillRect(o[1]+z*(i%s), o[2]+z*(M.floor(i/s)), z, z);
        }

        //new game ?
        O.length < 2 ? G() : 0;
    });
},33);