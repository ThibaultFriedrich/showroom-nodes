
var app = angular.module('showroomNodes', ['ngResource','ngMaterial','ngMdIcons']);
app.controller('mainCtrl', function($scope) {

    var typeOfMove = 'bounceOut';

    $scope.direction = '';

    $scope.move = '';

    setTimeout(function(){
        //console.log('timeout');
        //if($scope.direction == 'left'){
            //$scope.move = typeOfMove+'Left';
        //} else if($scope.direction == 'right'){
            //$scope.move = typeOfMove+'Right';
        //}
        //console.log($scope.move);
        $scope.direction = 'left';
    }, 2000);

});
