(function() {
  window.onload = init;

  var observer = {
    next: function(data) {
      console.log(data);
    },
    error: function(error) {
      console.error(error);
    },
    complete: function() {
      console.log('complete');
    }
  };
  var subscription;

  var selectorDOM, unsubscribeDOM, codeDOM;
  var options = [{
    name: 'create',
    cb: function() {
      subscription = Rx.Observable.create(function(observer) {
          observer.next(1);
          observer.next(2);
          setTimeout(function() {
            observer.next(3);
            observer.complete();
          }, 1000);
        })
        .draw('create')
        .subscribe(observer);
    }
  }, {
    name: 'of',
    cb: function() {
      subscription = Rx.Observable.of(1, 'A', true)
        .draw('of')
        .subscribe(observer);
    }
  }, {
    name: 'from',
    cb: function() {
      subscription = Rx.Observable.from([1, 2, 3])
        .draw('from')
        .subscribe(observer);
    }
  }, {
    name: 'fromEvent',
    cb: function() {
      subscription = Rx.Observable.fromEvent(document.body, 'click')
        .draw('fromEvent')
        .subscribe(observer);
    }
  }, {
    name: 'fromPromise',
    cb: function() {
      subscription = Rx.Observable.fromPromise(fetch('https://api.ipify.org?format=json'))
        .draw('fromPromise')
        .subscribe(observer);
    }
  }, {
    name: 'interval',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .draw('interval')
        .subscribe(observer);
    }
  }, {
    name: 'timer',
    cb: function() {
      subscription = Rx.Observable.timer(500, 2000)
        .draw('timer')
        .subscribe(observer);
    }
  }, {
    name: 'range',
    cb: function() {
      subscription = Rx.Observable.range(1, 5)
        .draw('range')
        .subscribe(observer);
    }
  }, {
    name: 'throw',
    cb: function() {
      subscription = Rx.Observable.throw('error')
        .draw('throw')
        .subscribe(observer);
    }
  }, {
    name: 'map',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .draw('interval')
        .map(function(x) {
          return x * 3000;
        })
        .draw('map: x * 3000')
        .subscribe(observer);
    }
  }, {
    name: 'mapTo',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .draw('interval')
        .mapTo('A')
        .draw('mapTo: "A"')
        .subscribe(observer);
    }
  }, {
    name: 'pluck',
    cb: function() {
      subscription = Rx.Observable.fromEvent(document.body, 'click')
        .draw('click')
        .pluck('clientX')
        .draw('pluck: clientX')
        .subscribe(observer);
    }
  }, {
    name: 'pairwise',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .draw('interval')
        .pairwise()
        .draw('pairwise')
        .subscribe(observer);
    }
  }, {
    name: 'groupBy',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .draw('interval')
        .groupBy(function(x) {
          return x % 2;
        })
        .draw('groupBy: x % 2')
        .subscribe(observer);
    }
  }, {
    name: 'scan',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .draw('data')
        .scan(function(origin, next) {
          return origin + next;
        })
        .draw('scan')
        .subscribe(observer);
    }
  }, {
    name: 'filter',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .draw('interval')
        .filter(function(x) {
          return x % 2;
        })
        .draw('filter: x % 2')
        .subscribe(observer);
    }
  }, {
    name: 'take',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .take(5)
        .draw('interval take: 5')
        .subscribe(observer);
    }
  }, {
    name: 'takeUntil',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .takeUntil(Rx.Observable.interval(5000))
        .draw('takeUntil')
        .subscribe(observer);
    }
  }, {
    name: 'first',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .take(5)
        .draw('interval')
        .first()
        .draw('first')
        .subscribe(observer);
    }
  }, {
    name: 'skip',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .draw('interval')
        .skip(3)
        .draw('skip: 3')
        .subscribe(observer);
    }
  }, {
    name: 'last',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .take(5)
        .draw('interval')
        .last()
        .draw('last')
        .subscribe(observer);
    }
  }, {
    name: 'throttleTime',
    cb: function() {
      subscription = Rx.Observable.fromEvent(document.body, 'click')
        .draw('click')
        .throttleTime(1000)
        .draw('throttleTime')
        .subscribe(observer);
    }
  }, {
    name: 'auditTime',
    cb: function() {
      subscription = Rx.Observable.fromEvent(document.body, 'click')
        .draw('click')
        .auditTime(1000)
        .draw('auditTime')
        .subscribe(observer);
    }
  }, {
    name: 'debounceTime',
    cb: function() {
      subscription = Rx.Observable.fromEvent(document.body, 'click')
        .draw('click')
        .debounceTime(1000)
        .draw('debounceTime')
        .subscribe(observer);
    }
  }, {
    name: 'concat',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .take(2)
        .draw('source 1')
        .concat(Rx.Observable.interval(500).take(2).draw('source 2'))
        .draw('concat')
        .subscribe(observer);
    }
  }, {
    name: 'concatAll',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .take(5)
        .draw('interval')
        .map(function(x) {
          return Rx.Observable.of(1, 2, 3);
        })
        .draw('source 2')
        .concatAll()
        .draw('source 3')
        .subscribe(observer);
    }
  }, {
    name: 'delay',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .take(3)
        .draw('interval')
        .delay(500)
        .draw('delay')
        .subscribe(observer);
    }
  }, {
    name: 'findIndex',
    cb: function() {
      subscription = Rx.Observable.fromEvent(document.body, 'click')
        .draw('click')
        .findIndex(function(evt) {
          return evt.clientX > 500;
        })
        .draw('findIndex')
        .subscribe(observer);
    }
  }, {
    name: 'max',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .take(5)
        .map(function() {
          return Math.floor(Math.random() * 10);
        })
        .draw('random numbers')
        .max()
        .draw('max')
        .subscribe(observer);
    }
  }, {
    name: 'min',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
        .take(5)
        .map(function() {
          return Math.floor(Math.random() * 10);
        })
        .draw('random numbers')
        .min()
        .draw('min')
        .subscribe(observer);
    }
  }, {
    name: 'count',
    cb: function() {
      subscription = Rx.Observable.fromEvent(document.body, 'click')
        .takeUntil(Rx.Observable.interval(5000))
        .draw('click')
        .count()
        .draw('count')
        .subscribe(observer);
    }
  }, {
    name: 'example: mouse position',
    cb: function() {
      subscription = Rx.Observable.fromEvent(document.body, 'click')
        .draw('click')
        .map(function(evt) {
          return {
            x: evt.clientX,
            y: evt.clientY
          };
        })
        .draw('map')
        .subscribe(observer);
    }
  }, {
    name: 'example: api pulling',
    cb: function() {
      subscription = Rx.Observable.interval(1000)
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
        .draw('response')
        .subscribe(observer);
    }
  }];

  function init() {
    selectorDOM = document.getElementById('selector');
    unsubscribeDOM = document.getElementById('unsubscribe');
    codeDOM = document.getElementById('code');

    Rx.Observable.fromEvent(selectorDOM, 'change')
      .map(function(evt) {
        return options.find(function(o) {
          return o.name === evt.target.value;
        });
      })
      .subscribe(onSelect);

    Rx.Observable.fromEvent(unsubscribeDOM, 'click')
      .subscribe(function() {
        if (subscription) {
          subscription.unsubscribe();
          rxjsDraw.stop();
        }
      });

    for (var i = 0; i < options.length; i++) {
      var option = document.createElement('option');
      option.value = options[i].name;
      option.innerText = options[i].name;
      selectorDOM.appendChild(option);
    }

    onSelect(options[0]);
  }

  function onSelect(option) {
    clean();
    option.cb();
    var codes = option.cb.toString().split('\n');
    codeDOM.innerHTML = codes.slice(1, codes.length - 1).join('\n');
  }

  function clean() {
    if (subscription) {
      subscription.unsubscribe();
      rxjsDraw.stop();
    }
    rxjsDraw.groups = [];
    rxjsDraw.boxDOM.innerHTML = '';
  }

})();