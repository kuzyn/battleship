## Description
### BATTLESHIP!

Express, nodejs... a simple battleship game. Ahoy!

Play at https://battleship-kuzyn.herokuapp.com/

:boat: => :boom:

## Deploy

Run locally in develop mode:  
`npm install`  
`gulp`  
And test a browser-sync proxied version on `localhost:4000`  

Alternatively you can:  
`npm run serve` or `npm run serve:debug`  
And play at `localhost:3000` 


## API
This is first and foremost a super-minimal API. Here are the default routes:  

Route | Type | Return | Payload | Description
--- | --- | --- | --- | ---
*/api/game*       | **[GET]**     | Object  | n/a | Returns a populated board {} ready for a new game
*/api/fire*       |  **[POST]**   | Object  | {coordinates: *[0,5]*, rawCoordinates: *"a5"*} | Returns an object with this construction *{hit: boolean, message: String, coordinates: Array(2), rawCoordinates: String, type: String, ship: Object}*

Go on, try it with curl:  
1. instantiate the game with `curl --url http://localhost:3000/api/game`  
2. fire away with `curl -d "coordinates=05"  --url http://localhost:3000/api/fire `  
3. 

![alt tag](http://cdn-static.denofgeek.com/sites/denofgeek/files/styles/insert_main_wide_image/public/part_5_image_2.jpg)

## License
The MIT License (MIT)
Copyright (c) 2016 Samuel Cousin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
