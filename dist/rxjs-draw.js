(function() {

  var rxjsDraw = new RxjsDraw();

  /** 
   * Draw operator
   */
  function drawOperator(name) {
    var self = this;

    if (!rxjsDraw) {
      rxjsDraw = new RxjsDraw();
    }

    // Grouping diagrams by root observable
    var group = rxjsDraw.findGroup(this);
    if (!group) {
      group = new SourceGroup(rxjsDraw.boxDOM, findRootObservable(this));
      rxjsDraw.addGroup(group);
    }

    // Adding this observable to the source list and create operator boxes
    group.addSource(this);

    // Create source box
    var sourceBox = new SourceBox(group.dom, name);
    sourceBox.timeline.start();
    group.addSourceBox(sourceBox);

    // Handle observable
    var observable = Rx.Observable.create(function(subscriber) {
      var subscription = self.subscribe(
        function(value) {
          try {
            sourceBox.timeline.push(value);
            subscriber.next(value);
          } catch (err) {
            sourceBox.timeline.stop();
            sourceBox.timeline.error();
            subscriber.error(err);
          }
        },
        function(err) {
          sourceBox.timeline.stop();
          sourceBox.timeline.error();
          subscriber.error(err);
        },
        function() {
          sourceBox.timeline.stop();
          sourceBox.timeline.complete();
          subscriber.complete();
        }
      );
      return subscription;
    });
    observable.source = this;
    return observable;
  }

  /**
   * RxjsDraw
   */
  function RxjsDraw() {
    this.boxDOM = null; // Outer box element
    this.tooltipDOM = null; // Tooltip element
    this.groups = []; // A list of SourceGroup

    this.init = function() {
      // Create DOM
      if (!this.boxDOM) {
        this.boxDOM = createAndAppend('div', document.body, {
          class: 'rxjs-box'
        });
      }
      if (!this.tooltipDOM) {
        this.tooltipDOM = createAndAppend('pre', document.body, {
          class: 'rxjs-tooltip'
        });
      }
    };

    this.stop = function() {
      for (var i = 0; i < this.groups.length; i++) {
        this.groups[i].stop();
      }
    };

    this.findGroup = function(observable) {
      return this.groups.find(function(group) {
        return group.rootObservable === findRootObservable(observable);
      });
    };

    this.addGroup = function(group) {
      this.groups.push(group);
      return this.group;
    };

    this.init();
  }

  /**
   * SourceGroup
   */
  function SourceGroup(parentDOM, rootObservable) {
    this.dom = null; // Source group element
    this.rootObservable = rootObservable; // Root observable for grouping diagrams
    this.sources = []; // A list of Observables
    this.sourceBoxes = [];

    this.init = function() {
      // Create DOM
      this.dom = createAndAppend('div', parentDOM, {
        class: 'rxjs-group'
      });
    };

    this.stop = function() {
      for (var i = 0; i < this.sourceBoxes.length; i++) {
        this.sourceBoxes[i].timeline.stop();
      }
    };

    this.addSource = function(source) {
      this.sources.push(source);
      this.drawOperatorBoxes(source);
    };

    this.addSourceBox = function(sourceBox) {
      this.sourceBoxes.push(sourceBox);
    };

    this.drawOperatorBoxes = function(observable) {
      var parentObservable = observable;
      var operatorsDOM = createAndAppend('div', this.dom, {
        class: 'rxjs-operators'
      });
      while (parentObservable !== this.sources[this.sources.length - 2]) {
        if (parentObservable.operator) {
          createAndAppend('div', operatorsDOM, {
            class: 'rxjs-operator',
            innerHTML: parentObservable.operator.constructor.name
          });
        }
        parentObservable = parentObservable.source;
      }
    };

    this.init();
  }

  /**
   * SourceBox
   */
  function SourceBox(parentDOM, name) {
    this.dom = null; // Source box element
    this.name = name; // Title of the observable diagram
    this.timeline = null; // TimelineBox

    this.init = function() {
      // Create DOM
      this.dom = createAndAppend('div', parentDOM, {
        id: this.name,
        class: 'rxjs-source'
      });
      // Create title
      createAndAppend('div', this.dom, {
        class: 'rxjs-name',
        innerHTML: this.name
      });
      // Creat timeline
      this.timeline = new TimelineBox(this.dom);
    };

    this.init();
  }

  /**
   * TimelineBox
   */
  function TimelineBox(parentDOM) {
    var self = this;
    var PX_PER_SEC = 100;

    this.dom = null; // Timeline box element
    this.bar = {
      dom: null, // Bar element
      width: 0
    };
    this.startTime = 0;
    this.marbles = []; // Data sent by observable

    this.timerSubject = null;
    this.timerSubscription = null;
    this.scrollSubject = null;
    this.syncScrollSubscription = null;
    this.autoScrollSubscription = null;

    this.init = function() {
      // Create DOM
      this.dom = createAndAppend('div', parentDOM, {
        class: 'rxjs-timeline-container'
      });
      // Create bar
      this.bar.dom = createAndAppend('div', this.dom, {
        class: 'rxjs-timeline'
      });

      this.startTime = Date.now();
      this.timerSubject = Rx.Observable
        .of(0, Rx.Scheduler.animationFrame)
        .repeat()
        .map(function() {
          return Date.now();
        })
        .share();
      this.scrollSubject = Rx.Observable.fromEvent(this.dom, 'scroll').share();

      // Marble hover event
      Rx.Observable.fromEvent(this.dom, 'mousemove')
        .subscribe(function(evt) {
          var target = evt.target;
          if (target.matches('.rxjs-marble')) {
            var index = Array.prototype.indexOf.call(target.parentNode.childNodes, target);
            var data = self.marbles[index];
            var display = data.value;
            if (typeof data.value === 'object' && data.value) {
              if (data.value.constructor.name === 'Object') {
                try {
                  display = JSON.stringify(display, null, 2);
                } catch (err) {
                  display = data.value;
                }
              }
            }
            // Apply marble data to tooltip DOM
            rxjsDraw.tooltipDOM.innerHTML = display;
            createAndAppend('div', rxjsDraw.tooltipDOM, {
              innerHTML: 'Type: ' + typeof data.value
            });
            createAndAppend('div', rxjsDraw.tooltipDOM, {
              innerHTML: 'Time: ' + (data.time - self.startTime) + 'ms'
            });
            rxjsDraw.tooltipDOM.style.left = evt.clientX + 'px';
            rxjsDraw.tooltipDOM.style.top = evt.clientY + 'px';
            rxjsDraw.tooltipDOM.style.display = 'inline-block';
          } else {
            rxjsDraw.tooltipDOM.style.display = 'none';
          }
        });

      Rx.Observable.fromEvent(this.dom, 'mouseleave')
        .subscribe(function() {
          rxjsDraw.tooltipDOM.style.display = 'none';
        });

      // Timeline scroll synchronizing event
      this.syncScrollSubsciption = this.scrollSubject
        .subscribe(function(evt) {
          var groupDOM = self.dom.parentNode.parentNode;
          var containerDOMs = groupDOM.querySelectorAll('.rxjs-timeline-container');
          for (var i = 0; i < containerDOMs.length; i++) {
            containerDOMs[i].scrollLeft = self.dom.scrollLeft;
          }
        });

    };

    this.start = function() {
      this.timerSubscription = this.timerSubject
        .subscribe(function(data) {
          self.bar.width = (data - self.startTime) * PX_PER_SEC / 1000;
          self.bar.dom.style.width = self.bar.width + 'px';
        });

      // If timeline is scrolled back, stop auto scrolling.
      var scrollBackObservable = this.scrollSubject
        .throttleTime(100)
        .pluck('target', 'scrollLeft')
        .pairwise()
        .filter(function(scrollLeft) {
          return scrollLeft[0] > scrollLeft[1];
        });
      this.autoScrollSubscription = this.timerSubject
        .takeUntil(scrollBackObservable)
        .subscribe(function(data) {
          self.dom.scrollLeft = self.dom.scrollWidth;
        });
    };

    this.stop = function() {
      this.timerSubscription.unsubscribe();
      this.autoScrollSubscription.unsubscribe();
    };

    this.push = function(value) {
      var display = value;
      if (typeof value === 'number') {
        display = value.toString();
        if (display.length > 4) {
          display = '[N]';
        }
      } else if (typeof value === 'string') {
        if (value.length > 4) {
          display = '[S]';
        }
      } else if (typeof value === 'boolean') {
        display = value.toString();
      } else if (typeof value === 'function') {
        display = '[F]';
      } else if (typeof value === 'object') {
        if (value === null) {
          display = 'null';
        } else {
          display = '[O]';
        }
      } else if (typeof value === 'undefined') {
        display = '[U]';
      }

      var previous = this.marbles.length ? this.marbles[this.marbles.length - 1] : null;
      var top = 0;
      var left = this.bar.width;
      if (previous && previous.left === left) {
        top = previous.top + 5;
      }
      var marble = {
        time: new Date().getTime(),
        value: value,
        display: display,
        top: top,
        left: left
      };
      this.marbles.push(marble);

      var marbleDOM = createAndAppend('div', this.bar.dom, {
        class: 'rxjs-marble',
        innerHTML: display
      });
      marbleDOM.style.top = marble.top + 'px';
      marbleDOM.style.left = marble.left + 'px';
    };

    this.error = function() {
      this.bar.dom.classList.add('rxjs-timeline-error');
    };

    this.complete = function() {
      this.bar.dom.classList.add('rxjs-timeline-complete');
    };

    this.init();
  }

  /**
   * Utils
   */
  function createAndAppend(tagName, parentDOM, options) {
    var ele = document.createElement(tagName);
    if (options.id) {
      ele.id = options.id;
    }
    if (options.class) {
      if (typeof options.class === 'string') {
        ele.classList.add(options.class);
      } else {
        ele.classList.add.apply(ele.classList, options.class);
      }
    }
    if (options.innerHTML) {
      ele.innerHTML = options.innerHTML;
    }
    if (options.dataset) {
      for (var key in options.dataset) {
        ele.dataset[key] = options.dataset[key];
      }
    }
    parentDOM.appendChild(ele);
    return ele;
  }

  function findRootObservable(observable) {
    var rootObservable = observable;
    while (rootObservable.source) {
      rootObservable = rootObservable.source;
    }
    return rootObservable;
  }

  // Bind to RxJS
  Rx.Observable.prototype.draw = drawOperator;
  RxjsDraw.prototype.createAndAppend = createAndAppend;
  RxjsDraw.prototype.findRootObservable = findRootObservable;
  window.rxjsDraw = rxjsDraw;

})();