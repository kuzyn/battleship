////////////////////////////////
// Client page's script       //
////////////////////////////////

(function() {

  $(document).on('ready', initiateGame(), function() {
    console.info('document.ready');
  });

  // scope-wide vars
  var shotCounter = 0;


  //////////////
  // Handlers //
  //////////////

  $('#debug-mode').click(function(e) {
    e.stopPropagation();
    $('.grid .content, .output-raw').toggleClass('hidden');
    $('.hit .content').removeClass('hidden'); // never hide our hit tiles
  });


  $('#reset').click(function(e) {
    e.stopPropagation();
    initiateGame();

    (function reset() {
      shotCounter = 0;
      $('#coordinates').val('');
      $('.output').html('');
      $('.results').html('');
      $('.fire-counter').html('<span>' + shotCounter + '</span>');
    })();

  });


  // on submit, get and send our #coordinates to the backend
  $('#fire').submit(function(e) {
    e.preventDefault();
    var url = this.action; // bind to the action property in our markup
    var results;
    var remaining;
    var coordinates = $('#coordinates').val().match('(\\D)(\\d+)');
    var rawCoordinates = $('#coordinates').val();
    coordinates = [convertAlphaNumeric(coordinates[1]), parseInt(coordinates[2])];

    console.log(coordinates);

    // post to our api
    $.post(url, {
        coordinates: coordinates,
        rawCoordinates: rawCoordinates
      })
      .done(function(data) {
        console.log(data);

        var $tile = $('.tile-' + convertAlphaNumeric(coordinates[0]) + '_' + coordinates[1]);
        results = '<span>' + data.message + ' ' + data.type + ' ' + convertAlphaNumeric(coordinates) + '</span>';
        remaining = JSON.stringify(data.remaining).replace(/["'{\[\]}]/g, '').replace(/,/g, ',\x20');

        // if the api returns a hit message
        if (data.impact !== undefined) {
          if (data.impact) {
            $tile.addClass('hit');
            $tile.find('span').removeClass('hidden');
          } else {
            $tile.addClass('missed');
          }
        }

      })
      .fail(function(error) {
        console.log(error);
      })
      .always(function() {
        shotCounter++;
        $('#coordinates').val('');
        $('.remaining-evils').html('<p>EVILS LEFT: ' + remaining + '</p>');
        $('.results').html(results);
        $('.fire-counter').html('<span>' + shotCounter + '</span>');
      });

  }); // $('#fire').submit


  /**
   * Get our grid, called after document ready
   * @return {undefined}
   */
  function initiateGame() {
    var url = '/api/game';
    var result;
    var remaining;

    $.get(url)
      .done(function(data) {
        console.info(JSON.stringify(data));
        result = data;
        remaining = JSON.stringify(data._fleet).replace(/["'{\[\]}]/g, '').replace(/,/g, ',\x20');
      })
      .fail(function(jqXHR, textStatus, err) {
        console.error(jqXHR.status + ' ' + err + ' ' + jqXHR);
        result = jqXHR.status + ' ' + err;
      })
      .always(function() {
        $('.output-raw').html(JSON.stringify(result, null, 2));
        $('.remaining-evils').html('<p>EVILS LEFT: ' + remaining + '</p>');
        formatGrid(result);
      });

  }


  /**
   * Given our game object, parse & format our grid
   * @param  {object} result Our full result from GET /api/game
   * @return {undefined}
   */
  function formatGrid(game) {
    var $output = $('.output');
    var $letterCoordinates;
    var $rowX;
    var grid = game._grid;
    var max = grid.length;
    var x = 0;
    var y = 0;
    var tileType = '';
    var convertedX = '';

    // start walking...
    for (; x < max; x++) {

      if (y === 0) {
        $output.prepend('<div class="row letter-coordinates"></div>');
      }

      // caching selectors & return values
      $output.append('<div class="row grid row-' + x + '"></div>');
      $letterCoordinates = $('.letter-coordinates');
      $rowX = $('.row-' + x);
      convertedX = convertAlphaNumeric(x);

      for (y = 0; y <= max; y++) {
        tileType = $.isNumeric(grid[x][y]) ? 'not-occupied' : 'occupied';

        if (y === 0) {
          $letterCoordinates.append('<div class="tile"><span class="content">' + convertedX + '</span></div>');
        }

        if (y === max) {
          $rowX.append('<div class="number-coordinates tile">' + x + '</div>');
        } else {
          $rowX.append(
            '<div class="tile tile-' + convertAlphaNumeric(y) + '_' + x + '">' +
            '<span class="content hidden ' + tileType + '">' +
            grid[x][y] + '</span>' + '</div>'
          );
        }

      }

    } // for (; x < max; x++)

  } // function formatGrid


  /////////////
  // Helpers //
  /////////////

  // Given a input (string or array), return a sanitized version of the input
  function convertAlphaNumeric(input) {

    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numeric = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    var string = input;

    // if we give an array of coordinates
    if ($.isArray(string)) {

      var x = string[0];
      var y = string[1];

      if (!$.isNumeric(x)) {
        return [numeric[alpha.indexOf(x.toUpperCase())], y];
      }

      return [alpha.charAt(x), y];
    }

    // if we give a single coordinate to convert
    if (!$.isNumeric(input)) {
      return numeric[alpha.indexOf(input.toUpperCase())];
    }

    return alpha.charAt(input);

  }

})(); //(function()
