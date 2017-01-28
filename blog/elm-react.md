## Elm for React Focussed People

Just before the Christmas break in 2016 I had the urge to build something. I didn't want to spend masses amounts of time on it, something I could get out in a couple of days. In the end I created [Relaweather](https://relaweather.com), a small _react_ application that compares the weather where you are today, with yesterdays. The idea being that one remembers how they felt yesterday, so should be better informed with how today should be!

I've been building front-end stuff with JavaScript and React for the last few years, most recently at [thetrainline.com](https://thetrainline.ccom), where we have been re-platforming, utilising _react_, _redux_, _rxjs_, _ramda_, and _[Typescript](https://engineering.thetrainline.com/2017/01/13/trainline-replatforming-our-front-end-journey/)_. For the last year or so I have been trying to take my programming focus in a more functional direction; and while JavaScript isn't a functional language, it certainly allows for a functional style. To enable this I've been using tools like _ramda_, _rxjs_, _flow_, and some _fantasyland_ classes.

As you cand guess from the title of this post, I wanted to write some notes after venturing into elm, specifically on coming from a react perspective. The experience that I will be drawing from, comes from porting relaweather from react into elm, which is now running successfully in production!

These notes intend to liken similarities and concepts that are common to both react and elm; and also to break down some of the barriers that stopped me from experimenting with elm sooner:

1. The syntax
2. The types
3. Effects

What this post won't do is: 

1. Pit react again elm
2. Cover build tools
3. Compare speeds

So, with that out of the way... The notes below assume that you have a working knowledge of react, used in conjunction with some state management implementation (redux, flux).

### Architecture

```text
+------+   action   +---------+
| VIEW | +--------> | REDUCER |
+--+---+            +---+-----+
   ^                    |
   |                    |
   +--------------------+


```

### Modules

#### Importing

Importing modules in ES2015 and Elm is pretty straightforward; you can have both named and default exports in both:

```javascript
import React from 'react';
import { log } from 'logger';
import Header from './Components/Header';
```

```elm
import Html
import Components.Header
import Debug exposing (log)
import Html exposing (..)
```

As you can see, while we might use `{ destructuring }` to import named exports in JavaScript, in Elm you can choose to explicitly import each named thing: `exposing (log, error)`, or to import them all into the module namespace: `exposing (..)`. In Elm, if you import a module that has exposed values, but you don't provide the `exposing` part to the import, everything will be namespaced to the module name, e.g.

```elm
import Debug

Debug.log "here"
```

#### Exporting

Exports work pretty similarly too:

```javascript
export const NAME = 'HEADER';
export default Header;
```
```elm
module Header exposing (view, name)
type Name = HEADER
```

### Syntax
These are some syntax things like look kind of scary to start with, but are incredibly useful.

#### Currying
While not really a syntax feature, currying is particularly important in functional languages, and is something that you need to understand to allow the following code samples to make sense. 

> A curried function is one which will keep returning a function, delaying the execution, until it receives all of it's arguments. Arguments can be applied as many, or as few at a time, the function length permitting.

A trivial example (this will use `curry` from Ramda):

```javascript
const add = curry((a, b) => a + b);
// function

const addTen = add(10);
// function

addTen(5);
// 15
```

```elm
add a b = a + b
-- <function> : number -> number -> number
    
addTen = add 10
-- <function> : number -> number

addTen 5
-- 15 : number
```

(I've added the some type signatures here, if they don't make any sense don't worry! We'll cover types later on.)

As you can see in the JS example, the `add` function keeps returning until it receives all it's arguments. One of the major benefits of curried functions is that you are able to "preload" a function with arguments, to make it more useful later on. In this case we have a contextually useful function `addTen`, rather than having to supply `10` as an argument each time you want to add.

In Elm, all functions are "curried", in that they are `unary` (they have only one argument). This is evident by the automatically generate type signature for `add`

```elm
add : Number -> Number -> Number
```

In the above you can consider the `->` a function, from the left type to the right type. In this case the function with take a `Number` argument, and return a `Number`. We will look at some more useful uses of currying later on, but for now understand when you see a function that _should_ take more that one argument provided with one, it is just returning another function.

#### `|>` - Forward function application
Consider this piece of Elm code:

```elm
add 10 (multiple 10 (add 10 10))
-- 210
```

It's fairly straightforward at the moment, but a little difficult to grok; and the more you add to it, the more complex it will get. We can simplify this with just syntax in Elm:

```javascript
add(10, multiply(10, add(10, 10)));
// 210
```

```elm
add 10 10
  |> multiply 10
  |> add 10
-- 210
```

The great thing about the `|>` operator is that you can continually add to it, without compromising the readibility of your code. If you were using a library like Ramda, you might use `pipe` to emulate a similar kind of operation in a clean way: [ramda repl](http://ramdajs.com/repl/?v=0.23.0#?const%20piper%20%3D%20pipe%28%0A%20%20add%2810%29%2C%0A%20%20multiply%2810%29%2C%0A%20%20add%2810%29%0A%29%3B%0Apiper%2810%29%3B):

```javascript
const piper = pipe(
  add(10),
  multiply(10),
  add(10)
);
piper(10);
// 210
```

#### `<|` - Backward function application
This operator is very similar to the previous, just a backward version. 

```javascript
multiply(add(10, 10), 10);
// 200
```

```elm
multiply 10 <| add 10 10
-- 200
```

Generally you see it use on a single line in Elm, unlike the forwards applicator.

#### `::` - List `cons` (prepend)
```javascript
const people = ['rachel', 'monica'];
const friends = ['ross'].concat(people);
// ['ross', 'rachel', 'monica']
```

```elm
friends = "ross" :: ["rachel", "monica"]
-- ["ross", "rachel", "monica"]
```


<sup>note how in Elm you have to use double quotes for string literals</sup>

`cons` is a function found in many functional programming languages, and is used to push a value to the head position of a List. Obvsiously in Elm where Lists are immutable, a new List is returned. In JavaScript you can use `arr.unshift`, but this will mutate the array, which we all know is bad!

Ramda has both `prepend` (identical to `::`) and `append` methods.
 
#### `++` - string and list concat
```javascript
'hello ' + 'world!'
// 'hello world!'

['hello'].concat('world');
// ['hello', 'world']
```

```elm
"hello " ++ "world!"
-- "hello world!"

["hello"] ++ ["world"]
-- ["hello", "world"]
```

#### `>>` - compose left to right

#### `<<` - compose right to left
#### maths
Javascript and Elms maths operators are pertty much identical. In Javascript all maths based functions are [`infix operators`](http://softwareengineering.stackexchange.com/a/2509), meaning they can only be used between two values:

```javascript
10 + 10 * 10 / 10
// 20
```

```elm
10 + 10 * 10 / 10
-- 20
```

Elm is somewhat similar in that it's maths operators can be use in an infix position, but they can also be used like "normal" functions:

```elm
(+) 10 10
  |> (*) 10
  |> (+) 10
-- 210
```


### Types
#### Records
#### Lists
#### Arrays
#### Maybe
#### Type

### Model

### Views

### Updaters
