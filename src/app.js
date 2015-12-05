
var app = angular.module('showroomNodes', ['ngResource','ngMaterial','ngMdIcons']);

app.factory('socket', function ($rootScope) {
  var socket = io.connect(location.host);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});


app.directive('animated', function (){
    var o = {
        restrict: 'E',
        scope: {
            'id': '='
        },
        link: function(scope, element, attrs){
            console.log(scope.$parent.elements);
            scope.className = element.attr('class');
            scope.id = element.attr('id');
            console.log(scope.id);
            scope.animated = {
                currentDisplay: false,
                nextDisplay: false,
                type: 'normal'
            };
            scope.$parent.elements[scope.id] = scope.animated;
            console.log(scope.$parent.elements);

            scope.$watchGroup(['animated.currentDisplay', 'animated.nextDisplay', 'animated.type'], function(){
                var animation = 'bounce';
                if(!scope.animated.currentDisplay && scope.animated.nextDisplay){
                    animation += 'In';
                } else if(scope.animated.currentDisplay && !scope.animated.nextDisplay){
                    animation += 'Out';
                }

                if(scope.animated.type == 'left'){
                    animation += 'Left';
                } else if(scope.animated.type == 'right'){
                    animation += 'Right';
                }

                element.attr('class', scope.className+' animated '+animation);
            });
        }
    };
    return o;
});
app.controller('mainCtrl', function($scope, socket) {

    this.menuIsOpen = false;
    
    $scope.synchronizing = true;
    $scope.direction = '';
    $scope.currentNodeId = '';
    $scope.nodes = [];
    $scope.currentNode = {id:'', isPrimary:false};
    $scope.primaryNode = null;

    $scope.elements = {};

    socket.on('current-node-id', function(id){
        console.log('current-node-id'+id);
        $scope.currentNodeId = id;
    });

    socket.on('nodes', function (nodes) {
        $scope.nodes = nodes;
        for(var i = 0 ;  i < $scope.nodes.length ; i++){
            if($scope.nodes[i].id == $scope.currentNodeId){
                $scope.currentNode = $scope.nodes[i];
            }
        }
    });

    socket.on('step', function(id){
        console.log('step '+id);

        $scope.elements['file'].currentDisplay = $scope.elements['file'].nextDisplay;
        if($scope.currentNode.isPrimary){
            if(id == 0){
                $scope.elements['file'].type = 'normal';
                $scope.elements['file'].nextDisplay = true;
            } else if(id == 1){
                $scope.elements['file'].type = 'right';
                $scope.elements['file'].nextDisplay = false;
            }
        } else {
            if(id == 0){
                $scope.elements['file'].type = 'left';
                $scope.elements['file'].nextDisplay = true;
            } else if(id == 1){
                $scope.elements['file'].type = 'normal';
                $scope.elements['file'].nextDisplay = false;
            }

        }
    });

    $scope.selectPrimaryNode = function(node){
        for(var i = 0 ; i < $scope.nodes.length ; i++){
            $scope.nodes[i].isPrimary = false;
        }
        node.isPrimary = true;
        socket.emit('nodes', $scope.nodes);
    };

    $scope.quitSynchronization = function(){
        $scope.synchronizing = false;

        $scope.play();
    };

    $scope.toLeft = function(){
        $scope.direction = 'left';
    };
    
    $scope.toRight = function(){
        $scope.direction = 'right';
    };

    $scope.pause = function(){
        $scope.direction = '';
    };

    $scope.play = function(){
        socket.emit('play');
    };

    $scope.stop = function(){
        socket.emit('stop');
    };

    $scope.moveToLeft = function(node){
        var index = $scope.nodes.indexOf(node);
        $scope.nodes.splice(index, 1);
        $scope.nodes.splice(index-1, 0, node);
        socket.emit('nodes', $scope.nodes);
    };
    
    $scope.moveToRight = function(node){
        var index = $scope.nodes.indexOf(node);
        $scope.nodes.splice(index, 1);
        $scope.nodes.splice(index+1, 0, node);
        socket.emit('nodes', $scope.nodes);
    };

    //$scope.menu = {
        //open: true
    //};

    //$scope.direction = 'left';

    $scope.move = '';

    //setTimeout(function(){
        //console.log('timeout');
        ////if($scope.direction == 'left'){
            ////$scope.move = typeOfMove+'Left';
        ////} else if($scope.direction == 'right'){
            ////$scope.move = typeOfMove+'Right';
        ////}
        ////console.log($scope.move);
        //$scope.direction = 'left';
    //}, 2000);


    //$scope.getClass = function(){
        //return $scope.direction;
    //};
    //$scope.getNodeClass = function(node){
        //console.log('getNodeClass');
        //var classes = '';
        //if(node.isPrimary){
            //classes += ' synchronization-node-primary';
        //} 
        //if(node === $scope.currentNode){
            //classes += ' md-primary';
        //}

        //return classes;
    //}
});
