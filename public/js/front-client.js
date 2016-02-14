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
    })
    .always(function() {
      console.info('$.ajax.complete');
      formatGrid(result);
    });
  });

  function formatGrid(_result) {
    var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var $output = $('.output');
    for (var y = 0, grid = _result.grid; y < grid.length; y++) {
      $output.append('<div class="row row-' + y + '"></div>');
      for (var x = 0; x < grid[y].length; x++) {
        $('.row-' + y).append('<div class="tile tile-' + ALPHA.charAt(y) + '_' + x + '">' + grid[x][y] + '</div>');
      }
    }
  }
})();
