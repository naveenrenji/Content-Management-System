var app=angular.module('insert',[]);

app.controller('insertCtrl',function($scope,$http){
    $scope.data = {};
    $scope.data.list=[];
    $scope.item={};
    $scope.response = "";	
    $scope.add=function()
    {
       var obj={
                 "author":$scope.item.author ,
                 "content":$scope.item.content,
                 "rating":$scope.item.rating
               };
       $scope.data.list.push(obj); 
       $scope.item={};
    };
    $scope.insert = function() 
    {        
        $http.post("http://localhost:3000/api/insert", JSON.stringify($scope.data)).then((response)=>{
            $scope.response = response;
        });
    };
});