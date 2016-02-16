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
    });
  });

  $('#debug-mode').click(function() {
    $('.tile .content, .output-raw').toggleClass('hidden');
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
    var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var board = _result.grid;
    var $output = $('.output');
    for (var x = 0, xz = board.length; x < xz; x++) {
      $output.append('<div class="row row-' + x + '"></div>');
      for (var y = 0, yz = board[x].length; y < yz; y++) {
        $('.row-'+x).append('<div class="tile tile-' + ALPHA.charAt(y) + '_' + x + '">' + '<span class="content hidden">' + board[x][y] + "</span>" + '</div>');
      }
    }
  }
})();
