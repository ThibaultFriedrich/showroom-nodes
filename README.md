# showroom-nodes
NodeJS webserver using socket.io to manage several synchronized laptop screens with animations between them.

# Getting started

## Installation

    git clone https://github.com/ThibaultFriedrich/showroom-nodes.git 

## How to use it

Use custom directive <animated> to animate html element according to the scheduler. Each animated html element must have its own animated-id.

Html: src/index.html
    
    <animated animated-id="file">
        <!-- ... -->
    </animated>

Js: server.js  __Configure the max step in the available__

    var stepMaxIs = ... 


Js: src/app.js __Configure the scheduler__

    socket.on('step', function(id){
        //...
        if(id == 0){
            $scope.element['file'].type = 'left';
            $scope.element['file'].nextDisplay = false;
        }

        //...
    });



# Todo

* Move the scheduler in a specific json file with a easier way.
* Manage several secondary nodes for the animations.


# Using

* animate.css
* nodeJS
* express
* socket.io
* less
* angularJS
* material-angular
