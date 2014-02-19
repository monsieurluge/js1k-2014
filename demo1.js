/**
 * JS1K 2014
 * http://js1k.com/2014-dragons/
 * 
 * Demo author: monsieurluge
 * Demo name : xxxxx
**/

//init
level = step = 0;
arenaSize = 500;

//add the player
//type, x, y, dx, dy, zoom, speed, timebeforefire, tiles, size
objects = [['p', 9, 9, 0, 0, 4, 3, 0, '04403334411001000440433301140010', 4]];
player = objects[0];

//keys
//left=37 up=38 right=39 down=40
b.onkeydown=function(event) {
	keyCode = event.keyCode;
    keyCode == 37 || keyCode == 39 ? player[3] = keyCode-38 : 0;
    keyCode == 38 || keyCode == 40 ? player[4] = keyCode-39 : 0;
};

b.onkeyup=function(event) {
    keyCode = event.keyCode;
    keyCode == 37 || keyCode == 39 ? player[3] = 0 : 0;
    keyCode == 38 || keyCode == 40 ? player[4] = 0 : 0;
};

//new game
function newGame() {
    level++;

    //add the ennemies
    //type, x, y, dx, dy, zoom, speed, timebeforefire, tiles, size
    for (object = 0; object < level; object++)
        objects.push(['e', Math.random()*arenaSize, Math.random()*arenaSize, 0, 0, 5+Math.random()*level, 1.1, Math.random()*80, '10210111111010101021011311101010', 4]);
}

//fires a bullet
function newBullet(origintype, originx, originy, targetx, targety, speed, zoom) {
    dx = targetx-originx;
    dy = targety-originy;
    
    if (Math.abs(dx) < Math.abs(dy)) {
        dx = dx/Math.abs(dy);
        dy = dy/Math.abs(dy);
    } else {
        dy = dy/Math.abs(dx);
        dx = dx/Math.abs(dx);
    }
    
    //create the bullet
    //type, x, y, dx, dy, zoom, speed, N#A, tiles, size, origin
    objects.push(['b', originx, originy, dx, dy, zoom, speed, 0, '43', 1, origintype]);
}

//collision (approximation)
function isCollision(obj, target) {
    distX = obj[1] - target[1];
    distY = obj[2] - target[2];

    return Math.sqrt(distX*distX + distY*distY) < 14;
}

//destroy an object
function destroy(obj) {
    objects.splice(objects.indexOf(obj), 1);
}

//player fire a bullet
a.addEventListener('click', function(event) {
    if (player[7] < 0) {
        newBullet('p', player[1], player[2], event.x, event.y, 6, 4);
        player[7] = 20;
    }
}, 0);

//cycle
interval = setInterval(function () {
    //clear the scene
    a.width += 0;

    //show the score
    c.fillText('lvl' + level, 7, 15);

    //manage objects
    objects.forEach(function(obj) {
        //reduce the 'next time before firing again'
        obj[7]--;
        
        //ennemy
        if (obj[0] == 'e') {
            //move to the player
            obj[3] = obj[1] < player[1] ? 1 : -1;
            obj[4] = obj[2] < player[2] ? 1 : -1;

            if (obj[7] < 0) {
                //fire a bullet
                newBullet('e', obj[1], obj[2], player[1], player[2], obj[6]*4, obj[5]);
                obj[7] = 30;
            }
        }

        //bullet
        if (obj[0] == 'b') {
            //check for bullet collision
            objects.forEach(function(target) {
                //collision between a player bullet and an ennemy ?
                if (obj[10] == 'p' && target[0] == 'e' && isCollision(obj, target)) {
                    destroy(target);
                    destroy(obj);
                }
                
                //collision between an emmeny bullet and the player ?
                obj[10] == 'e' && target[0] == 'p' && isCollision(obj, target) ? clearInterval(interval) : 0;
            });

            //destroy the bullet if out of the arena
            obj[1] < 0 || obj[1] > arenaSize || obj[2] < 0 || obj[2] > arenaSize ? destroy(obj) : 0;
        }

        //move the object
        obj[1] += obj[3]*obj[6];
        obj[2] += obj[4]*obj[6];

        //draw the object
        zoom = obj[5];
        size = obj[9];

        for(i = 0; i < size*size; i++) {
            tile = obj[8].charAt(i+size*size*(step%20 == 0));
            c.fillStyle = '#' + ['FFF','294','000','E21','DAA'][tile]; //colors : white,green,black,red,flesh
            c.fillRect(obj[1]+zoom*(i%size), obj[2]+zoom*(Math.floor(i/size)), zoom, zoom);
        }

        //next frame
        step++;
        
        //new game ?
        objects.length < 2 ? newGame() : 0;
    });
},33);