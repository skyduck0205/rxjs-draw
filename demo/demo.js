(function() {

'use strict';

angular.module('Demo', ['ui.router', 'hljs']);
angular.module('Demo')
  .config(function routes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'demo/home.html',
        controller: 'HomeController'
      })
      .state('demo', {
        url: '/:op',
        templateUrl: 'demo/demo.html',
        controller: 'OperatorController'
      });
  })
  .run(function rootScope($rootScope) {
    $rootScope.showSideNav = false;
    $rootScope.operators = {
      create: createObservable,
      of: ofObservable,
      from: fromObservable,
      fromEvent: fromEventObservable,
      fromPromise: fromPromiseObservable,
      interval: intervalObservable,
      timer: timerObservable,
      range: rangeObservable,
      throw: throwObservable,
      map: mapObservable,
      mapTo: mapToObservable,
      pluck: pluckObservable,
      pairwise: pairwiseObservable,
      groupBy: groupByObservable,
      scan: scanObservable,
      filter: filterObservable,
      take: takeObservable,
      takeUntil: takeUntilObservable,
      first: firstObservable,
      skip: skipObservable,
      last: lastObservable,
      throttleTime: throttleTimeObservable,
      auditTime: auditTimeObservable,
      debounceTime: debounceTimeObservable,
      concat: concatObservable,
      concatAll: concatAllObservable,
      delay: delayObservable,
      findIndex: findIndexObservable,
      max: maxObservable,
      min: minObservable,
      count: countObservable,
      exMousePosition: exMousePositionObservable,
      exApiPulling: exApiPullingObservable
    };
  })
  .run(function resetScroll($transitions) {
    $transitions.onSuccess({}, function() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  })
  .controller('HomeController', function($http) {
    var converter = new showdown.Converter();
    $http.get('README.md')
      .then(function(response) {
        document.getElementById('read-me').innerHTML = converter.makeHtml(response.data);
        document.querySelectorAll('pre code').forEach(function(code) {
          hljs.highlightBlock(code);
        });
      });
  })
  .controller('OperatorController', function OperatorController($scope, $rootScope, $stateParams, $timeout) {
    var op = $stateParams.op;
    var func = $rootScope.operators[op];

    $scope.subscription = null;
    $scope.title = func.alias ? func.alias : op;
    $scope.code = op ? func.toString() + '\n\nvar subscription = ' + func.name + '().subscribe();' : '';
    $scope.unsubscribe = unsubscribe;
    $scope.$on('$destroy', function() {
      clean();
    });

    $timeout(function() {
      rxjsDraw.init('#draw');
      $scope.subscription = func().subscribe();
    });

    function clean() {
      unsubscribe();
      rxjsDraw.clean();
    }

    function unsubscribe() {
      if ($scope.subscription) {
        $scope.subscription.unsubscribe();
        rxjsDraw.stop();
      }
    }
  });

})();

