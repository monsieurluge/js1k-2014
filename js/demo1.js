/**
 * JS1K 2014
 * http://js1k.com/2014-dragons/
 * 
 * Demo author: monsieurluge
 * Demo name : Marcel VS the Ugly Angry Little Dragons
**/

//init
level = 0;
arenaSize = 500;

//add the player
//type, x, y, dx, dy, zoom, speed, timebeforefire, tiles, size
objects = [[1, 9, 9, 1, 0, 4, 3, 0, 'faafa115f23af13f', 4]];
player = objects[0];

//keys
//left=37 up=38 right=39 down=40
onkeydown = function(event) {
	keyCode = event.keyCode;
    player[3] = Math.abs(keyCode-38) == 1 ? keyCode-38 : 0;
    player[4] = Math.abs(keyCode-39) == 1 ? keyCode-39 : 0;
};

//new game
function newGame() {
    //add the ennemies
    //type, x, y, dx, dy, zoom, speed, timebeforefire, tiles, size
    for (object = ++level; object > 0; object--)
        objects.push([2, Math.random()*arenaSize, Math.random()*arenaSize, 0, 0, 4+level, 1, 30, 'ffdb23bff223f6f6', 4]);
}

//create a bullet
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
    objects.push([3, originx, originy, dx, dy, zoom, speed, 0, '3', 1, origintype]);
}

//collision (or something like that)
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
onclick = function(event) {
    if (player[7] < 0) {
        newBullet(1, player[1], player[2], event.x, event.y, 6, 4);
        player[7] = 20;
    }
};

//cycle
interval = setInterval(function () {
    //clear the scene
    a.width += 0;

    //show the level
    c.fillText('lvl' + level, 5, 9);

    //manage objects
    objects.forEach(function(obj) {
        //reduce the 'next time before firing again'
        obj[7]--;
        
        //ennemy
        if (obj[0] == 2) {
            //move to the player
            obj[3] = obj[1] < player[1] ? 1 : -1;
            obj[4] = obj[2] < player[2] ? 1 : -1;

            if (obj[7] < 0) {
                //fire a bullet
                newBullet(2, obj[1], obj[2], player[1], player[2], obj[6]*4, obj[5]);
                obj[7] = 30;
            }
        }

        //bullet
        if (obj[0] == 3) {
            //check for bullet collision
            objects.forEach(function(target) {
                //collision between a player bullet and an ennemy ?
                if (obj[10] == 1 && target[0] == 2 && isCollision(obj, target)) {
                    destroy(target);
                    destroy(obj);
                }
                
                //collision between an emmeny bullet and the player ?
                obj[10] == 2 && target[0] == 1 && isCollision(obj, target) ? clearInterval(interval) : 0;
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
            color = obj[8].charAt(i);
            c.fillStyle = '#' + color + color + color;
            c.fillRect(obj[1]+zoom*(i%size), obj[2]+zoom*(Math.floor(i/size)), zoom, zoom);
        }

        //new game ?
        objects.length < 2 ? newGame() : 0;
    });
},33);