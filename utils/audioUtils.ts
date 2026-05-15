/**
 * Generates a typewriter-like 'khat khat' sound using the Web Audio API
 */
export function playTypingSound(volume = 0.3): void {
  try {
    const AudioContext =
      window.AudioContext ||
      (window as { webkitAudioContext?: { new (): AudioContext } })
        .webkitAudioContext;
    if (!AudioContext) return;

    const audioCtx = new AudioContext();

    // Create noise buffer for the 'khat' sound
    const bufferSize = audioCtx.sampleRate * 0.1; // 100ms of sound
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);

    // Fill the buffer with noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1; // Generate white noise
    }

    // Create noise source
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    // Create filter for the 'khat' sound
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000 + Math.random() * 1000; // Random frequency between 1000-2000Hz
    filter.Q.value = 5;

    // Create gain envelope for the 'khat' sound
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

    // Connect the audio nodes
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Play the sound with a quick attack and decay
    const now = audioCtx.currentTime;
    gainNode.gain.linearRampToValueAtTime(volume, now + 1); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1); // Fast decay

    // Start and stop the noise
    noise.start(now);
    noise.stop(now + 0.1);

    // Create a second 'khat' sound with slightly different timing for the 'khat khat' effect
    setTimeout(() => {
      const noise2 = audioCtx.createBufferSource();
      noise2.buffer = buffer;

      const filter2 = audioCtx.createBiquadFilter();
      filter2.type = "highpass";
      filter2.frequency.value = 1200 + Math.random() * 1000; // Slightly different frequency
      filter2.Q.value = 4;

      const gainNode2 = audioCtx.createGain();
      gainNode2.gain.setValueAtTime(0, audioCtx.currentTime);

      noise2.connect(filter2);
      filter2.connect(gainNode2);
      gainNode2.connect(audioCtx.destination);

      const now2 = audioCtx.currentTime;
      gainNode2.gain.linearRampToValueAtTime(volume * 0.8, now2 + 0.008); // Slightly softer second 'khat'
      gainNode2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.08);

      noise2.start(now2);
      noise2.stop(now2 + 0.08);
    }, 30); // Slight delay between 'khat' sounds
  } catch (e) {
    console.warn("Could not play typing sound:", e);
  }
}
