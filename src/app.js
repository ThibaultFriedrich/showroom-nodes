
var app = angular.module('showroomNodes', ['ngResource','ngMaterial','ngMdIcons']);

app.controller('mainCtrl', function($scope) {

    this.menuIsOpen = false;
    
    $scope.synchronizing = false;

    $scope.direction = '';

    $scope.getNodeClass = function(node){
        console.log('getNodeClass');
        if(node === $scope.primaryNode){
            return 'md-primary';
        } else if(node === $scope.currentNode){
            return 'md-primary md-hue-1';
        } else {
            return '';
        }
    }
    
    $scope.selectPrimaryNode = function(node){
        $scope.primaryNode = node;
    };

    $scope.nodes = [
        {
            name: 'laptop1',
            socket: null
        },
        {
            name: 'laptop2',
            socket: null
        },
        {
            name: 'laptop3',
            socket: null
        },
        {
            name: 'laptop4',
            socket: null
        }
    ];
    
    $scope.currentNode = $scope.nodes[1];
    $scope.primaryNode = $scope.nodes[2];




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
