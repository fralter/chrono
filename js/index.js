(function() {

  window.Chronometer = function(options) {
    this.d = extend({
      /**
       * @param precision - int,
       * the speed at which the chronometer updates, in milliseconds
       */
      precision: 10,
      /**
       * @param ontimeupdate - callback (int:elapsedTimeInMilliseconds),
       * triggered every times the chronometer updates.
       * You might want to use the Chronometer.utils method to format the date to a more human readable format
       */
      ontimeupdate: function(elapsed) {

      }
    }, options);

    this._elapsed = 0;
    this._timerId = 0;
  };

  Chronometer.prototype = {
    start: function() {
      this._chrono();
    },
    pause: function() {
      this._stopChrono();
    },
    stop: function() {
      this._stopChrono();
      this._elapsed = 0;
      this.d.ontimeupdate(this._elapsed);
    },
    getElapsedTime: function() {
      return this._elapsed;
    },
    //------------------------------------------------------------------------------/
    // PRIVATE
    //------------------------------------------------------------------------------/
    _chrono: function() {
      var zis = this;
      this._timerId = setTimeout(function() {
        zis._chrono();
        zis._elapsed += zis.d.precision;
        zis.d.ontimeupdate(zis._elapsed);
      }, this.d.precision);
    },
    _stopChrono: function() {
      clearTimeout(this._timerId);
    }
  };

  Chronometer.utils = {
    humanFormat: function(t, sep) {
      if ('undefined' === typeof sep) {
        sep = ':';
      }
      var min = Math.floor(t/36000);
      var cent = Math.floor((t - 36000*min)/360);
      if (cent < 10) {
        cent = "0" + cent;
      }
      return min + sep + cent;
    }
  };
  //------------------------------------------------------------------------------/
  // UTILS
  //------------------------------------------------------------------------------/
  function extend() {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    }
    return arguments[0];
  }
})();

var jChrono = $('#chrono');
var jPickZone = $('#pickzone');
var emailZone = $('#emailZone')
var chronometer = new Chronometer({
  precision: 10,
  ontimeupdate: function(t) {
    jChrono.html(Chronometer.utils.humanFormat(t));
  }
});

//------------------------------------------------------------------------------/
// SOME EXTRA EVENTS
//------------------------------------------------------------------------------/
previousTimeElapsed = 0;
$('#start').on('click', function() {
  chronometer.start();
  $('#start').addClass('hidden');
  $('#pick').removeClass('hidden');
  return false;
});

$('#stop').on('click', function() {
  chronometer.stop();
  previousTimeElapsed = 0;
  chronoNumber = 0;
  $('#pick').addClass('hidden');
  $('#start').removeClass('hidden');
  jPickZone.html('');
  emailZone.html('');
  return false;
});

chronoNumber = 0;
$('#pick').on('click', function() {
  var timeElapsed = chronometer.getElapsedTime();
  var t = Chronometer.utils.humanFormat(timeElapsed);
  var difft = Chronometer.utils.humanFormat(timeElapsed-previousTimeElapsed);
  previousTimeElapsed = timeElapsed;
  chronoNumber++;
  textChrono = 'durée chrono n°'+ chronoNumber + ' - ' + difft + ' (picked @ ' + t + ')<br>';
  jPickZone.prepend(textChrono);
  emailZone.append(textChrono);
return false;
});

$('#send').click(function(){
    emailZone.removeClass('hidden');
    $(location).attr('href', 'mailto:?subject='
                             + encodeURIComponent("Chrono'minute du " + new Date().toLocaleDateString())
                             + "&body=" 
                             + encodeURIComponent(emailZone.html().split('<br>').join('\n'))
    );
    emailZone.addClass('hidden');
});
