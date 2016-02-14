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
    for (var x = 0, xz = _result.length; x < xz; x++) {
      $output.append('<div class="row row-' + x + '"></div>');
      for (var y = 0, yz = _result[x].length; y < yz; y++) {
        $('.row-'+x).append('<div class="tile tile-' + ALPHA.charAt(y) + '_' + x + '">' + _result[x][y] + '</div>');
      }
    }
  }
})();
