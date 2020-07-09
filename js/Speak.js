let Speak = (function () {
  const _getCurrentTime = () => {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return `${h}--${m}--${s}`;
  };

  const _rootSetListener = (that) => {
    const self = that; // bind this from Speak Class for using
    if (!self.msg || !self.cbListener) return;
    // Error Event
    self.msg.onerror = function () {
      console.log('>>>ERROR<<<');
      self.synth.cancel();
      self.status = SPEAK_STATUS.IDLE;
      self.cbListener(UNIQUE_SPEAK_EVENT.onerror, { isError: true });
    };
    // onstart Event
    self.msg.onstart = function () {
      console.log('>>>START<<<');
      self.status = SPEAK_STATUS.PLAYING;
      self.cbListener(UNIQUE_SPEAK_EVENT.onstart, {
        from: 'start',
        startTime: _getCurrentTime(),
      });
    };
    // onend Event
    self.msg.onend = function () {
      console.log('>>>END<<<');
      if (self.synth.paused) self.synth.resume(); // stop pause if reset when paused
      self.status = SPEAK_STATUS.IDLE;
      self.cbListener(UNIQUE_SPEAK_EVENT.onend, { endTime: _getCurrentTime() });
    };
    // onpause Event
    self.msg.onpause = function () {
      console.log('>>>PAUSE<<<');
      self.status = SPEAK_STATUS.PAUSED;
      self.cbListener(UNIQUE_SPEAK_EVENT.onpause, {});
    };
    // onresume Event
    self.msg.onresume = function () {
      console.log('>>>RESUME<<<');
      self.status = SPEAK_STATUS.PLAYING;
      self.cbListener(UNIQUE_SPEAK_EVENT.onresume, {
        from: 'resume',
        startTime: _getCurrentTime(),
      });
    };
    // onboundary Event
    self.msg.onboundary = function (event) {
      console.log('>>>BOUNDARY<<<');
      self.cbListener(UNIQUE_SPEAK_EVENT.onboundary, {
        elapsedTime: event.elapsedTime,
      });
    };
  };

  return class Speak {
    constructor() {
      this.msg = new SpeechSynthesisUtterance();
      this.synth = window.speechSynthesis;
      this.cbListner = null;
      this.status = SPEAK_STATUS.IDLE;
      console.log('this.msg: ', this.msg);
      console.log('this.synth: ', this.synth);
    }

    setListener(listenerEvent) {
      if (!this.msg) return;
      if (typeof listenerEvent === 'function') {
        this.cbListener = listenerEvent;
        _rootSetListener(this); // call private to regist listerner
      }
    }

    getCurrentStatus(type) {
      let currentStatus = this.status;
      if (type === 'string') {
        switch (currentStatus) {
          case SPEAK_STATUS.IDLE:
            currentStatus = 'IDLE';
            break;
          case SPEAK_STATUS.PLAYING:
            currentStatus = 'PLAYING';
            break;
          case SPEAK_STATUS.PAUSED:
            currentStatus = 'PAUSED';
            break;
        }
      }
      return currentStatus;
    }

    getVoices() {
      if (!this.synth) return [];
      return this.synth.getVoices();
    }

    setVoice(indexVoice) {
      if (!this.msg) return;
      const voices = this.getVoices();
      if (voices.length > 0) this.msg.voice = voices[parseInt(indexVoice)];
    }

    getText() {
      if (!this.msg) return;
      return this.msg.text;
    }

    setText(text) {
      if (!this.msg) return;
      this.msg.text = text;
    }

    setRate(newRate) {
      if (!this.msg) return;
      this.msg.rate = parseFloat(newRate);
    }

    setVolume(newVolume) {
      if (!this.msg) return;
      this.msg.volume = parseFloat(newVolume);
    }

    play() {
      if (!this.msg || !this.synth) return;
      if (this.synth.paused) {
        this.synth.resume();
      } else {
        this.synth.speak(this.msg);
      }
    }

    pause() {
      if (!this.synth) return;
      if (!this.synth.paused) this.synth.pause();
    }

    togglePlayPause () {
      if (!this.msg || !this.synth) return;
      if (this.synth.paused) {
        this.synth.resume();
      } else {
        if (this.synth.speaking) {
          this.synth.pause();
        } else {
          this.synth.speak(this.msg);
        }
      }
    }

    cancel() {
      if (!this.synth) return;
      this.synth.cancel();
    }
  };
})();
