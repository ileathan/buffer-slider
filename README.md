# buffer-slider
Slide buffer streams recursive copywithins, hopefully this is scalable, but it solved my needs.

1.) You have a raw buffer that you want to leave otherwise intact.

2.) You know certain byte ranges within the buffer stream, or you have a callback to set them up dynamically (before recurssion)

# CODE

```javascript
bufferSlider = require('buffer-slider')
bs = new bufferSlider(BUFFER_SIZE/Buffer, [[1, 250], [78,79,80,90], 54, 100]);
// Here byte indexes 1-250, 78-90 and 54-100 are removed, there are lots of other configuration options
// Like a callback, that I wont document because I havnt bug tested them extensivly.

bs.slide() // your patched buffer is returned, optionall stored in _final.

// If performance is not an issue, but data preservasion is the buffer will be internally padded, otherwise you 
// lose any potential matches at the end, by defualt performance is sub optimal and everything is logged.
//
// so _preservedBuffer is the original buffer, _final is the patched, _slidBuffer is what got copied over
```

At the moment it is very suboptimal in terms of effeciency. Ill fix that soon.

```javascript
require('buffer-slider').setBad([["1..250"], [78,79,80,90], 54, 100]).slide()

       /* OR */

BS = require('buffer-slider');
BS.from(buffer).setBad(calculateBitcoinIndexes).slide();

```
