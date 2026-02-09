    document.addEventListener('DOMContentLoaded', () => {
      const audio = document.getElementById('audio');
      const playPauseBtn = document.getElementById('play-pause');
      const prevBtn = document.getElementById('prev');
      const nextBtn = document.getElementById('next');
      const progressContainer = document.getElementById('progress-container');
      const progress = document.getElementById('progress');
      const currentTimeEl = document.getElementById('current-time');
      const durationEl = document.getElementById('duration');
      const disk = document.getElementById('disk');

      function togglePlayPause() {
        if (audio.paused) {
          audio.play();
          playPauseBtn.textContent = '❚❚';
          disk.classList.add('rotating');
        } else {
          audio.pause();
          playPauseBtn.textContent = '▶';
          disk.classList.remove('rotating');
        }
      }

      function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
      }

      function updateProgress() {
        const { currentTime, duration } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
      }

      function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
      }

      playPauseBtn.addEventListener('click', togglePlayPause);
      audio.addEventListener('timeupdate', updateProgress);
      progressContainer.addEventListener('click', setProgress);

      audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
      });

      audio.addEventListener('ended', () => {
        playPauseBtn.textContent = '▶';
        progress.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        disk.classList.remove('rotating');
      });

      prevBtn.addEventListener('click', () => {
        audio.currentTime -= 10;
      });

      nextBtn.addEventListener('click', () => {
        audio.currentTime += 10;
      });
    });

    function playSound() {
      const audio = document.getElementById('laugh-sound');
      audio.currentTime = 0;
      audio.play();
    }