// Interactive concept demo: low-pass filter + crossfade, using the Web Audio API.
// Sources are synthesised so no audio files are needed. To use your own clips,
// replace makeLayerA / makeLayerB with <audio> elements via ctx.createMediaElementSource().
(function () {
  var playBtn = document.getElementById('demo-play');
  if (!playBtn) return;

  var cutoff = document.getElementById('demo-cutoff');
  var cutoffOut = document.getElementById('demo-cutoff-out');
  var fade = document.getElementById('demo-fade');
  var fadeOut = document.getElementById('demo-fade-out');

  var ctx = null, filter = null, gainA = null, gainB = null, master = null;
  var sources = [];
  var running = false;

  function noiseBuffer(ctx, seconds) {
    var len = ctx.sampleRate * seconds;
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    var last = 0;
    for (var i = 0; i < len; i++) {            // brown-ish noise: soft, wind-like
      var white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      d[i] = last * 3.5;
    }
    return buf;
  }

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.35;

    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 0.9;
    filter.frequency.value = Number(cutoff.value);

    gainA = ctx.createGain();
    gainB = ctx.createGain();

    // Room A: airy noise (like a windy hall)
    var noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer(ctx, 4);
    noise.loop = true;
    noise.connect(gainA);

    // Room B: low drone with a slow wobble (like a machine room)
    var osc1 = ctx.createOscillator(); osc1.type = 'sawtooth'; osc1.frequency.value = 55;
    var osc2 = ctx.createOscillator(); osc2.type = 'sawtooth'; osc2.frequency.value = 55.8;
    var droneGain = ctx.createGain(); droneGain.gain.value = 0.25;
    var lfo = ctx.createOscillator(); lfo.frequency.value = 0.3;
    var lfoGain = ctx.createGain(); lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain); lfoGain.connect(droneGain.gain);
    osc1.connect(droneGain); osc2.connect(droneGain);
    droneGain.connect(gainB);

    gainA.connect(filter);
    gainB.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    sources = [noise, osc1, osc2, lfo];
    applyFade();
  }

  function applyFade() {
    var v = Number(fade.value) / 100;           // 0 = all A, 1 = all B
    // equal-power crossfade keeps perceived loudness steady
    var a = Math.cos(v * Math.PI / 2);
    var b = Math.sin(v * Math.PI / 2);
    if (gainA) {
      var t = ctx.currentTime;
      gainA.gain.setTargetAtTime(a, t, 0.03);
      gainB.gain.setTargetAtTime(b, t, 0.03);
    }
    var pct = Math.round(v * 100);
    fadeOut.textContent = pct === 0 ? '100% A' : pct === 100 ? '100% B' : (100 - pct) + '% A / ' + pct + '% B';
  }

  cutoff.addEventListener('input', function () {
    cutoffOut.textContent = cutoff.value + ' Hz';
    if (filter) filter.frequency.setTargetAtTime(Number(cutoff.value), ctx.currentTime, 0.03);
  });
  fade.addEventListener('input', applyFade);

  playBtn.addEventListener('click', function () {
    if (!running) {
      build();
      sources.forEach(function (s) { s.start(); });
      running = true;
      playBtn.textContent = 'Stop sound';
      playBtn.classList.add('off');
    } else {
      sources.forEach(function (s) { try { s.stop(); } catch (e) {} });
      ctx.close();
      ctx = null; running = false;
      playBtn.textContent = 'Start sound';
      playBtn.classList.remove('off');
    }
  });
})();
