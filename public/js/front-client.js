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
    var url = $(document.activeElement).attr('url');
    var target = $('#coordinates').val();
    // Don't want to follow the post URL...
    event.preventDefault();

    // Ajax POST to our API
    $.post(url, target)
    .done(function(data) {
      // Success callback
    })
    .fail(function(error) {
      // Error callback
    })
    .always(function() {
      // Always callback
      $('#coordinates').val('');
    });
  });

  function formatGrid(_result) {
    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
          $('.letter-coordinates').append('<div class="tile"><span class="content">' + alpha.charAt(x) + '</span></div>');
        }
        if (y === max) {
            $('.row-'+x).append('<div class="number-coordinates tile">' + x + '</div>')
        } else {
        $('.row-'+x).append(
          '<div class="tile tile-' + alpha.charAt(y) + '_' + x + '">' +
          '<span class="content hidden ' + tileType + '">' +
          board[x][y] + '</span>' + '</div>'
        );
      }
      }
    }
  }
})();
