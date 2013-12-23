// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array or 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('premet', ['ionic', 'ngTouch', 'ngAnimate', 'premet.controllers'])

/**
 * @description
 * The sideMenuCtrl lets you quickly have a draggable side
 * left and/or right menu, which a center content area.
 */

// angular.module('ionic.ui.sideMenu', ['ionic.service.gesture'])

/**
 * The internal controller for the side menu controller. This
 * extends our core Ionic side menu controller and exposes
 * some side menu stuff on the current scope.
 */

.directive('sideMenusPremet', function() {
  return {
    restrict: 'ECA',
    controller: ['$scope', function($scope) {
      var _this = this;

      angular.extend(this, ionic.controllers.SideMenuController.prototype);

      ionic.controllers.SideMenuController.call(this, {
        // Our quick implementation of the left side menu
        left: {
          width: 275,
        },

        // Our quick implementation of the right side menu
        right: {
          width: 275,
        }
      });

      $scope.sideMenuContentTranslateX = 0;

      $scope.sideMenuController = this;
    }],
    replace: true,
    transclude: true,
    template: '<div class="pane" ng-transclude></div>'
  };
})

.directive('sideMenuContentPremet', ['$timeout', 'Gesture', function($timeout, Gesture) {
  return {
    restrict: 'AC',
    require: '^sideMenusPremet',
    scope: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {

        $element.addClass('menu-content');

        $scope.dragContent = $scope.$eval($attr.dragContent) === false ? false : true;

        var defaultPrevented = false;
        var isDragging = false;

        ionic.on('mousedown', function(e) {
          // If the child element prevented the drag, don't drag
          defaultPrevented = e.defaultPrevented;
        });

        // Listen for taps on the content to close the menu
        ionic.on('tap', function(e) {
          sideMenuCtrl.close();
        }, $element[0]);
        

        var dragFn = function(e) {
          if($scope.dragContent) {
            if(defaultPrevented) {
              return;
            }
            isDragging = true;
            sideMenuCtrl._handleDrag(e);
            e.gesture.srcEvent.preventDefault();
          }
        };

        var dragVertFn = function(e) {
          if(isDragging) {
            e.gesture.srcEvent.preventDefault();
          }
        };
        
        var dragRightFn = function(e) {
          var apr_sym = document.getElementById('premet-approved');
          apr_sym.style.display = 'inline';
          var den_sym = document.getElementById('premet-denied');
          den_sym.style.display = 'none';
        }
        
        var dragLeftFn = function(e) {
          var apr_sym = document.getElementById('premet-approved');
          apr_sym.style.display = 'none';
          var den_sym = document.getElementById('premet-denied');
          den_sym.style.display = 'inline';
        }
        
        var dragRightGesture = Gesture.on('dragright', dragRightFn, $element);
        var dragLeftGesture = Gesture.on('dragleft', dragLeftFn, $element);
        
        //var dragGesture = Gesture.on('drag', dragFn, $element);
        // var dragRightGesture = Gesture.on('dragright', dragFn, $element);
        // var dragLeftGesture = Gesture.on('dragleft', dragFn, $element);
        var dragUpGesture = Gesture.on('dragup', dragVertFn, $element);
        var dragDownGesture = Gesture.on('dragdown', dragVertFn, $element);

        var dragReleaseFn = function(e) {
          isDragging = false;
          if(!defaultPrevented) {
            sideMenuCtrl._endDrag(e);
          }
          defaultPrevented = false;
        };

        var releaseGesture = Gesture.on('release', dragReleaseFn, $element);

        sideMenuCtrl.setContent({
          onDrag: function(e) {},
          endDrag: function(e) {},
          getTranslateX: function() {
            return $scope.sideMenuContentTranslateX || 0;
          },
          setTranslateX: function(amount) {
            $element[0].style.webkitTransform = 'translate3d(' + amount + 'px, 0, 0)';
            $timeout(function() {
              $scope.sideMenuContentTranslateX = amount;
            });
          },
          enableAnimation: function() {
            //this.el.classList.add(this.animateClass);
            $scope.animationEnabled = true;
            $element[0].classList.add('menu-animated');
          },
          disableAnimation: function() {
            //this.el.classList.remove(this.animateClass);
            $scope.animationEnabled = false;
            $element[0].classList.remove('menu-animated');
          }
        });

        // Cleanup
        $scope.$on('$destroy', function() {
          Gesture.off(dragLeftGesture, 'dragleft', dragFn);
          Gesture.off(dragRightGesture, 'dragright', dragFn);
          Gesture.off(dragUpGesture, 'dragup', dragFn);
          Gesture.off(dragDownGesture, 'dragdown', dragFn);
          Gesture.off(releaseGesture, 'release', dragReleaseFn);
        });
      };
    }
  };
}])


.directive('sideMenuPremet', function() {
  return {
    restrict: 'E',
    require: '^sideMenusPremet',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="menu menu-{{side}}"></div>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {
        $scope.side = $attr.side;

        if($scope.side == 'left') {
          sideMenuCtrl.left.isEnabled = true;
          sideMenuCtrl.left.pushDown = function() {
            $element[0].style.zIndex = -1;
          };
          sideMenuCtrl.left.bringUp = function() {
            $element[0].style.zIndex = 0;
          };
        } else if($scope.side == 'right') {
          sideMenuCtrl.right.isEnabled = true;
          sideMenuCtrl.right.pushDown = function() {
            $element[0].style.zIndex = -1;
          };
          sideMenuCtrl.right.bringUp = function() {
            $element[0].style.zIndex = 0;
          };
        }

        $element.append(transclude($scope));
      };
    }
  };
});








.config(function ($compileProvider){
  // Needed for routing to work
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

// .config(function($routeProvider, $locationProvider) {
// 
//   // Set up the initial routes that our app will respond to.
//   // These are then tied up to our nav router which animates and
//   // updates a navigation bar
//   $routeProvider.when('/home', {
//     templateUrl: 'templates/app.html',
//     controller: 'AppCtrl'
//   });
// 
//   // if the url matches something like /pet/2 then this route
//   // will fire off the PetCtrl controller (controllers.js)
//   $routeProvider.when('/pet/:petId', {
//     templateUrl: 'templates/pet.html',
//     controller: 'PetCtrl'
//   });
// 
//   // if none of the above routes are met, use this fallback
//   // which executes the 'AppCtrl' controller (controllers.js)
//   $routeProvider.otherwise({
//     redirectTo: '/home'
//   });
// 
// });
// 
