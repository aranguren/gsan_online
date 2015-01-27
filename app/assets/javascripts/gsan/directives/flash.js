(function (root, factory) {
    root.angularFlash = factory(root, root.angular);
}(this, function (window, angular) {
  return angular.module('flash', [])
    .factory('Flash', ['$rootScope', '$timeout', function($rootScope, $timeout) {
      var messages = [];

      var reset;
      var cleanup = function() {
        $timeout.cancel(reset);
        reset = $timeout(function() { messages = []; });
      };

      var emit = function() {
        $rootScope.$emit('flash:message', messages, cleanup);
      };

      $rootScope.$on('$locationChangeSuccess', emit);

      var asMessage = function(level, text) {
        if (!text) {
          text = level;
          level = 'success';
        }
        return { level: level, text: text };
      };

      var asArrayOfMessages = function(level, text) {
        if (level instanceof Array) return level.map(function(message) {
          return message.text ? message : asMessage(message);
        });
        return text ? [{ level: level, text: text }] : [asMessage(level)];
      };

      var flash = function(level, text) {
        emit(messages = asArrayOfMessages(level, text));
      };

      ['error', 'warning', 'info', 'success'].forEach(function (level) {
        flash[level] = function (text) { flash(level, text); };
      });

      return {
        setMessage: function(level, text) {
          emit(messages = asArrayOfMessages(level, text));
        }
      };
    }])

    .directive('flashMessages', [function() {
      var directive = { restrict: 'EA', replace: true };
      directive.template =
        '<div id="flash-messages" ng-show="messages">' +
          '<div ng-repeat="m in messages" class="alert alert-{{m.level}}">{{m.text}}</div>' +
        '</div>';

      directive.controller = ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.$on('flash:message', function(_, messages, done) {
          $scope.messages = messages;
          done();
        });
      }];

      return directive;
    }]);
}));