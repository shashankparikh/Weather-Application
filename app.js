var weatherApp = angular.module('weatherApp',['ui.router','ngResource']);



//route
weatherApp.config(function($stateProvider,$urlRouterProvider){
	//$urlRouterProvider.otherwise('/home');

	$stateProvider
	.state('home',{

		url : '/',
		templateUrl : 'pages/home.html',
		controller : 'homeController'
	})
   .state('forecast', {
               url : '/forecast',
               templateUrl : 'pages/forecast.html',
               controller : 'forecastController'
        })
   .state('forecastday', {
               url : '/forecast/:days',
               templateUrl : 'pages/forecast.html',
               controller : 'forecastController'
        });

});

//services

weatherApp.service('cityService',function(){
    this.city = "Mumbai";
})



//controller
weatherApp.controller('homeController',['$scope','$state','cityService',function($scope,$state,cityService){
      
    $scope.city = cityService.city;
   
    
    $scope.$watch('city',function(){
        cityService.city = $scope.city;
    })
    
    $scope.submit = function(){
      
        $state.go('forecast');
    };
    
}]);

weatherApp.controller('forecastController',['$scope','$resource','$stateParams','cityService',function($scope,$resource,$stateParams,cityService){
    
     $scope.city = cityService.city;
     $scope.days = $stateParams.days;
    console.log($scope.days);
        
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily",{callback : "JSON_CALLBACK"},{get:{method:"JSONP"}});
    
    $scope.weatherResult = $scope.weatherAPI.get({q:$scope.city , cnt:$scope.days , appid:'cbd64d18ca7d28205ea7158f3b715c0c'},function(res){
        console.log(res.list);
    })
    console.log($scope.weatherResult);
    
  /*  $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q='+$scope.city+'&mode=json&units=metric&cnt=7&appid=cbd64d18ca7d28205ea7158f3b715c0c').success(function(res){
        console.log(res);
    }).error(function(res){
        console.log(res);
    })*/
    
    $scope.convertToFarenheit = function(degK){
        return Math.round((1.8*(degK - 273)) + 32 );
    }
    
    $scope.convertToDate = function(dt){
        return new Date(dt*1000);
    }
    
}]);


//directive
weatherApp.directive('weatherReport',function(){
    
    return{
        restrict : 'E',
        templateUrl: 'directives/weatherreport.html',
        replace:true,
        scope:{
            weatherDay : "=",
            convertToStandard : "&",
            convertToDate:"&",
            dateFormat:"@"
        }
    }
    
});