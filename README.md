# showroom-nodes
NodeJS webserver using socket.io to manage several synchronized laptop screens with animations between them.

# Getting started

## Installation

    git clone https://github.com/ThibaultFriedrich/showroom-nodes.git 

## How to use it


### Define components

Html: src/index.html
    
    <animated animated-id="file">
        <!-- ... -->
    </animated>

Use custom directive animated to animate html element according to the scheduler. Each animated html element must have its own animated-id.

### Schedule animations

Json : timeline.json

    [
        [{"file":"appear on primary"}],
        [{"file":"move to children"}],
        [{"file":"move to primary"}],
        [{"file":"disappear on primary"}]
    ]

Each element of the first array represents a step of the scheduler. Each element like {"file":"appear on primary"} represents an animation on an element.
The key is the id of one html animated element. And the value is the action.

The actions must be constructed like this : movement + "to" or "on" + target.

The possible movements are:

* appear
* disappear
* move

The possible targets are:

* primary
* chidren


# Todo

* Manage several secondary nodes for the animations.


# Using

* animate.css
* nodeJS
* express
* socket.io
* less
* angularJS
* material-angular
