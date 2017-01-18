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

### Modules

This is pretty straight-forward in both React and Elm:
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

as you can see, while we might use `{ destructuring }` to import named exports in JavaScript, in Elm you can choose to explicitly import each named thing: `exposing (log, error)`, or to import them all into the module namespace: `exposing (..)`.

```javascript
export default Header;
```

```elm
module Header exposing (..)
```

ome test