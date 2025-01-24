function makeItRain() {
    // document.getElementById("makeItRain").disabled = true;
    var end = Date.now() + (2 * 1000);
  
  // go Buckeyes!
  var colors = ['#bb0000', '#ffffff'];
  
  function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });
  
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
    else {
      // document.getElementById("makeItRain").disabled = false;
    }
  };
    frame();
  }
  
  const canvas = document.getElementById('confetti-canvas');
  
  canvas.confetti = canvas.confetti || confetti.create(
    canvas, 
    { resize: true }
  );
  
  const runConfetti = () => { 
  
  makeItRain();
  
    };