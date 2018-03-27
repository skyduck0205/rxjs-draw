# RxJS Draw

RxJS Draw is an extension of [RxJS](https://reactivex.io/rxjs/) observable operator that draws marble diagrams of observables.

This extension is created for learning purpose. It visualizes timeline and output marbles of a subscribed observable to help comprehending how those operators influence your observable. Though it might not be drawn precisely due to the execution and rendering time, still good for an introduction of RxJS.

An unminified RxJS library is required to display the names of chained operators correctly.

[Demo](https://skyduck0205.github.io/rxjs-draw/)

## Usage

Include scripts and styles in your page. RxJS 5.0 is used in this version.
```html
<script src="path/to/Rx.js"></script>
<script src="path/to/rxjs-draw.js"></script>
<link rel="stylesheet" href="path/to/rxjs-draw.css">
```

Add a container of the diagram:
```html
<div id="draw"></div>
```

Initialize and start drawing your diagram:
```javascript
// window.rxjsDraw is an instance of RxjsDraw
rxjsDraw.init('#draw');

Rx.Observable
  .interval(1000)
  .take(5)
  .draw('interval take: 5')
  .subscribe();
```

Browse the result:
![demo](https://i.imgur.com/7Otg8Hf.gif)

## API

### RxjsDraw.init(selector)

Initialize RxjsDraw by giving a css selector of a diagram container element.

### RxjsDraw.stop()

Stop timelines in the diagram from drawing. This method **will NOT unsubscribe** your subscription of observable.

### RxjsDraw.clean()

Remove all contents in the diagram. This method **will NOT unsubscribe** your subscription of observable.

### Observable.draw(name)

The `.draw()` function is added to `Rx.Observable.prototype`. `name` is an unique id for each diagram source.

