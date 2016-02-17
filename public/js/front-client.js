////////////////////////////////
// Client page's script       //
////////////////////////////////

(function() {
  $(document).on('ready', function() {
    console.info('document.ready');
    var result;
    var request = $.ajax({
          type: "GET",
          url: "/api/game",
          data: "jsonp"
    })
    .done(function(data) {
      console.info(JSON.stringify(data));
      result = data;
    })
    .fail(function(jqXHR, textStatus, err) {
      console.error(jqXHR.status + ' ' + err + ' ' + jqXHR);
      result = jqXHR.status + ' ' + err;
      $('.output-raw').html(JSON.stringify(jqXHR, null, 2));
    })
    .always(function() {
      console.info('$.ajax.complete');
      formatGrid(result);
      $('.output-raw').html(JSON.stringify(result, null, 2));
      $('.board .content, .output-raw').toggleClass('hidden');
    });
  });

  $('#debug-mode').click(function() {
    $('.board .content, .output-raw').toggleClass('hidden');
  });

  $('#fire').submit(function(event) {
    var url = this.action;
    var coordinates = $('#coordinates').val().match('(\\D)(\\d+)');
    var rawCoordinates = $('#coordinates').val();
    coordinates = [convertAlphaNumeric(coordinates[1]), parseInt(coordinates[2])];

    // Don't want to follow the post URL...
    event.preventDefault();

    console.log(coordinates);

    // Ajax POST to our API
    $.post(url, {coordinates: coordinates, rawCoordinates: rawCoordinates})
    .done(function(data) {
      // Success callback
      console.log('POST.done', data);
    })
    .fail(function(error) {
      // Error callback
      console.log('POST.fail', error);
    })
    .always(function() {
      // Always callback
      $('#coordinates').val('');
    });
  });

  function convertAlphaNumeric(_what) {
    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numeric = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

    if (!$.isNumeric(_what)) {
      var uc = _what.toUpperCase();
      return numeric[alpha.indexOf(uc)];
    }

    return alpha.charAt(_what);
  }

  function formatGrid(_result) {
    var board = _result.grid;
    var $output = $('.output');
    var tileType;
    var max = board.length;
    var x = 0;
    var y = 0;

    for (x = 0; x < max; x++) {
      if (y === 0) {
        $output.prepend('<div class="row letter-coordinates"></div>');
      }

      $output.append('<div class="row board row-' + x + '"></div>');

      for (y = 0; y < max + 1; y++) {
        tileType = $.isNumeric(board[x][y]) ? 'not-occupied' : 'occupied';
        if (y === 0) {
          $('.letter-coordinates').append('<div class="tile"><span class="content">' + convertAlphaNumeric(x) + '</span></div>');
        }
        if (y === max) {
            $('.row-'+x).append('<div class="number-coordinates tile">' + x + '</div>');
        } else {
        $('.row-'+x).append(
          '<div class="tile tile-' + convertAlphaNumeric(y) + '_' + x + '">' +
          '<span class="content hidden ' + tileType + '">' +
          board[x][y] + '</span>' + '</div>'
        );
      }
      }
    }
  }
})();
