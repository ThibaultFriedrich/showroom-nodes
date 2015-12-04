
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


app.directive('item', function (){
    var o = {
        restrict: 'A',
        scope: {
            'item': '='
        },
        link: function(scope, element, attrs){
            console.log(scope.item);
            scope.$watchGroup(['item.currentDisplay', 'item.nextDisplay', 'item.type'], function(){
                console.log(scope.item);
                var animation = 'bounce';
                if(!scope.item.currentDisplay && scope.item.nextDisplay){
                    animation += 'In';
                } else if(scope.item.currentDisplay && !scope.item.nextDisplay){
                    animation += 'Out';
                }

                if(scope.item.type == 'left'){
                    animation += 'Left';
                } else if(scope.item.type == 'right'){
                    animation += 'Right';
                }

                element.attr('class', 'file animated '+animation);
            });
            //console.log(attrs.element);
            //var e = "elements['"+attrs.ngElement+"']";
            //element.attr("ng-class", "{"
            //+"'animated bounceOutLeft':"+e+".type=='left'&&"+e+".currentDisplay&&!"+e+".nextDisplay,"
            //+"'animated bounceOutRight':"+e+".type=='right'&&"+e+".currentDisplay&&!"+e+".nextDisplay,"
            //+"'animated bounceInLeft':"+e+".type=='left'&&!"+e+".currentDisplay&&"+e+".nextDisplay,"
            //+"'animated bounceInRight':"+e+".type=='left'&&!"+e+".currentDisplay&&"+e+".nextDisplay,"
            //+"'animated pulse':"+e+".type=='normal'&&!"+e+".currentDisplay&&"+e+".nextDisplay,"
            //+"'animated bouceOut':"+e+".type=='normal'&&"+e+".currentDisplay&&!"+e+".nextDisplay"
            //+"}");
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

    $scope.elements = {
        file:{
            type:'normal',
            nextDisplay: false,
            currentDisplay: false
        }
    };

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
