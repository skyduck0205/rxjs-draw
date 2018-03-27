function createObservable() {
  var observer = {
    next: function(data) { console.log(data); },
    error: function(error) { console.error(error); },
    complete: function() { console.log('complete'); }
  };
  return Rx.Observable
    .create(function(observer) {
      observer.next(1);
      observer.next(2);
      setTimeout(function() {
        observer.next(3);
        observer.complete();
      }, 1000);
    })
    .draw('create');
}

function ofObservable() {
  return Rx.Observable
    .of(1, 'A', true)
    .draw('of');
}

function fromObservable() {
  return Rx.Observable
    .from([1, 2, 3])
    .draw('from');
}

function fromEventObservable() {
  return Rx.Observable
    .fromEvent(document.body, 'click')
    .draw('fromEvent');
}

function fromPromiseObservable() {
  return Rx.Observable
    .fromPromise(fetch('https://api.ipify.org?format=json'))
    .draw('fromPromise');
}

function intervalObservable() {
  return Rx.Observable
    .interval(1000)
    .draw('interval');
}

function timerObservable() {
  return Rx.Observable
    .timer(500, 2000)
    .draw('timer');
}

function rangeObservable() {
  return Rx.Observable
    .range(1, 5)
    .draw('range');
}

function throwObservable() {
  return Rx.Observable
    .throw('error')
    .draw('throw');
}

function mapObservable() {
  return Rx.Observable
    .interval(1000)
    .draw('interval')
    .map(function(x) {
      return x * 3000;
    })
    .draw('map: x * 3000');
}

function mapToObservable() {
  return Rx.Observable
    .interval(1000)
    .draw('interval')
    .mapTo('A')
    .draw('mapTo: "A"');
}

function pluckObservable() {
  return Rx.Observable
    .fromEvent(document.body, 'click')
    .draw('click')
    .pluck('clientX')
    .draw('pluck: clientX');
}

function pairwiseObservable() {
  return Rx.Observable
    .interval(1000)
    .draw('interval')
    .pairwise()
    .draw('pairwise');
}

function groupByObservable() {
  return Rx.Observable
    .interval(1000)
    .draw('interval')
    .groupBy(function(x) {
      return x % 2;
    })
    .draw('groupBy: x % 2');
}

function scanObservable() {
  return Rx.Observable
    .interval(1000)
    .draw('data')
    .scan(function(origin, next) {
      return origin + next;
    })
    .draw('scan');
}

function filterObservable() {
  return Rx.Observable
    .interval(1000)
    .draw('interval')
    .filter(function(x) {
      return x % 2;
    })
    .draw('filter: x % 2');
}

function takeObservable() {
  return Rx.Observable
    .interval(1000)
    .take(5)
    .draw('interval take: 5');
}

function takeUntilObservable() {
  return Rx.Observable
    .interval(1000)
    .takeUntil(Rx.Observable.interval(5000))
    .draw('takeUntil');
}

function firstObservable() {
  return Rx.Observable
    .interval(1000)
    .take(5)
    .draw('interval')
    .first()
    .draw('first');
}

function skipObservable() {
  return Rx.Observable
    .interval(1000)
    .draw('interval')
    .skip(3)
    .draw('skip: 3');
}

function lastObservable() {
  return Rx.Observable
    .interval(1000)
    .take(5)
    .draw('interval')
    .last()
    .draw('last');
}

function throttleTimeObservable() {
  return Rx.Observable
    .fromEvent(document.body, 'click')
    .draw('click')
    .throttleTime(1000)
    .draw('throttleTime');
}

function auditTimeObservable() {
  return Rx.Observable
    .fromEvent(document.body, 'click')
    .draw('click')
    .auditTime(1000)
    .draw('auditTime');
}

function debounceTimeObservable() {
  return Rx.Observable
    .fromEvent(document.body, 'click')
    .draw('click')
    .debounceTime(1000)
    .draw('debounceTime');
}

function concatObservable() {
  return Rx.Observable
    .interval(1000)
    .take(2)
    .draw('source 1')
    .concat(Rx.Observable.interval(500).take(2).draw('source 2'))
    .draw('concat');
}

function concatAllObservable() {
  return Rx.Observable
    .interval(1000)
    .take(5)
    .draw('interval')
    .map(function(x) {
      return Rx.Observable.of(1, 2, 3);
    })
    .draw('source 2')
    .concatAll()
    .draw('source 3');
}

function delayObservable() {
  return Rx.Observable
    .interval(1000)
    .take(3)
    .draw('interval')
    .delay(500)
    .draw('delay');
}

function findIndexObservable() {
  return Rx.Observable
    .fromEvent(document.body, 'click')
    .draw('click')
    .findIndex(function(evt) {
      return evt.clientX > 500;
    })
    .draw('findIndex');
}

function maxObservable() {
  return Rx.Observable
    .interval(1000)
    .take(5)
    .map(function() {
      return Math.floor(Math.random() * 10);
    })
    .draw('random numbers')
    .max()
    .draw('max');
}

function minObservable() {
  return Rx.Observable
    .interval(1000)
    .take(5)
    .map(function() {
      return Math.floor(Math.random() * 10);
    })
    .draw('random numbers')
    .min()
    .draw('min');
}

function countObservable() {
  return Rx.Observable
    .fromEvent(document.body, 'click')
    .takeUntil(Rx.Observable.interval(5000))
    .draw('click')
    .count()
    .draw('count');
}

function exMousePositionObservable() {
  return Rx.Observable
    .fromEvent(document.body, 'click')
    .draw('click')
    .map(function(evt) {
      return {
        x: evt.clientX,
        y: evt.clientY
      };
    })
    .draw('map');
}
exMousePositionObservable.alias = 'Example: Mouse position';

function exApiPullingObservable() {
  return Rx.Observable
    .interval(1000)
    .take(5)
    .draw('interval')
    .map(function(x) {
      return fetch('https://api.ipify.org?format=json')
        .then(function(res) {
          return res.json();
        });
    })
    .draw('promise')
    .concatAll()
    .draw('response');
}
exApiPullingObservable.alias = 'Example: API pulling';
