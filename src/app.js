
var app = angular.module('showroomNodes', ['ngResource','ngMaterial','ngMdIcons']);

app.factory('socket', function ($rootScope) {
  var socket = io.connect('http://localhost:1848');
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

app.controller('mainCtrl', function($scope, socket) {

    this.menuIsOpen = false;
    
    $scope.synchronizing = true;

    $scope.direction = '';

    $scope.currentNodeId = '';
    $scope.nodes = [];
    $scope.currentNode = null;
    $scope.primaryNode = null;

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
            //if($scope.nodes[i].isPrimary){
                //$scope.primaryNode = $scope.nodes[i];
            //}
        }
    });

    $scope.getNodeClass = function(node){
        console.log('getNodeClass');
        var classes = '';
        if(node.isPrimary){
            classes += ' synchronization-node-primary';
        } 
        if(node === $scope.currentNode){
            classes += ' md-primary';
        }

        return classes;
    }
    
    $scope.selectPrimaryNode = function(node){
        for(var i = 0 ; i < $scope.nodes.length ; i++){
            $scope.nodes[i].isPrimary = false;
        }
        node.isPrimary = true;
        socket.emit('nodes', $scope.nodes);
    };

    $scope.quitSynchronization = function(){
        $scope.synchronizing = false;
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
});
