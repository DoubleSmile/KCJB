/**
* form Module
*
* Description
*/
angular.module('form', []).directive('ensure-unique', ['$http', function($http){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.log(dd)
			$scope.$watch(iAttrs.ngModel,function(n){
				if(!n) return;
				$http('post', 'url', {field:iAttrs.ensure-unique,value:$scope.ngModel}, function(status, response){
					// success
					controller.$setValidity('unique',true);
				}, function(status, response){
					// error
					console.log('false');
				});
			})
		}
	};
}]).controller('signupcontroller', ['$scope', function($scope){
	$scope.submitted = false;
	$scope.signupform = function  () {
		if($scope.signup_form.$valid)
			console.log('success');
		else
		{
			$scope.signup_form.submitted=true;
			console.log('false1');

		}
	}
}])