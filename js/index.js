/**
 * Render, hooks function
 */
function renderStatus(status) {
  document.getElementById('speakStatus').innerHTML = status;
}

function changeBtnBasedStatus({ eleName, isDisabled, text }) {
  const btn = document.getElementById(eleName);
  if (btn) {
    if (text) btn.innerHTML = text;
    if (typeof isDisabled === 'undefined') isDisabled = false;
    btn.disabled = isDisabled;
  }
}

function updateSpeakStatus() {
  const speakStatus = document.getElementById('speakStatus');
  speakStatus.innerHTML = s.getCurrentStatus('string');
}

function updateSpeakValue({ eleName, text }) {
  const speakVal = document.getElementById(eleName);
  speakVal.innerHTML = text;
}

function updateSpeakStatusAndValue(ob) {
  updateSpeakStatus();
  updateSpeakValue(ob);
}

/**
 * Event callback function
 */
const onStart = ({ startTime }) => {
  console.log('onStart cb');
  changeBtnBasedStatus({ eleName: 'btnPlayPause', text: '<i class="fas fa-pause"></i>' });
  changeBtnBasedStatus({ eleName: 'btnReset' });
  // update info
  updateSpeakStatus();
  updateSpeakValue({ eleName: 'speakTimeEnd', text: 'NaN' });
  updateSpeakValue({ eleName: 'speakTimeStart', text: startTime });
};

const onResume = ({ startTime }) => {
  console.log('onResume cb');
  changeBtnBasedStatus({ eleName: 'btnPlayPause', text: '<i class="fas fa-pause"></i>' });
  changeBtnBasedStatus({ eleName: 'btnReset' });
  // update info
  updateSpeakStatus();
};

const onEnd = ({ endTime }) => {
  console.log('onEnd cb');
  changeBtnBasedStatus({ eleName: 'btnPlayPause', text: '<i class="fas fa-play"></i>' });
  changeBtnBasedStatus({ eleName: 'btnReset', isDisabled: true });
  // update info
  updateSpeakStatus();
  updateSpeakValue({ eleName: 'speakTimeEnd', text: endTime });
};

const onPause = () => {
  console.log('onPause cb');
  changeBtnBasedStatus({ eleName: 'btnPlayPause', text: '<i class="fas fa-play"></i>' });
  // update info
  updateSpeakStatus();
};

const onBoundary = ({ elapsedTime }) => {
  const speakTimeLive = document.getElementById('speakTimeLive');
  speakTimeLive.innerHTML = elapsedTime;
};

const listnerSpeaking = (eventName, data) => {
  switch (eventName) {
    case UNIQUE_SPEAK_EVENT.onpause:
      onPause();
      break;
    case UNIQUE_SPEAK_EVENT.onerror:
      console.log('onError cb');
      break;
    case UNIQUE_SPEAK_EVENT.onstart:
      onStart(data);
      break;
    case UNIQUE_SPEAK_EVENT.onend:
      onEnd(data);
      break;
    case UNIQUE_SPEAK_EVENT.onresume:
      onResume(data);
      break;
    case UNIQUE_SPEAK_EVENT.onboundary:
      onBoundary(data);
      break;
    default:
      break;
  }
};

// Create Speak instance
const s = new Speak();
s.setListener(listnerSpeaking);

/**
 * Init function
 */
function populateVoiceList() {
  const speakVoice = document.getElementById('speakVoice');
  const voices = s.getVoices();
  console.log('All voices: ', voices);

  function renderText(voice) {
    const defaultText = voice.default ? ' -- DEFAULT' : '';
    return `${voice.name} (${voice.lang})${defaultText}`;
  }

  voices.forEach((voice, index) =>
    speakVoice.insertAdjacentHTML(
      'beforeend',
      `<option
        value="${index}"
        data-lang="${voice.lang}"
        data-name="${voice.name}"
      >${renderText(voice)}</option>`
    )
  );
}

window.onload = function () {
  if (!window.speechSynthesis) {
    alert('Your browser not support Web Speech API');
    return;
  }
  // Elements
  const speakForm = document.getElementById('speakForm');
  const speakText = document.getElementById('speakText');
  const speakVoice = document.getElementById('speakVoice');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const btnReset = document.getElementById('btnReset');
  const speakVolume = document.getElementById('speakVolume');
  const speakSpeed = document.getElementById('speakSpeed');
  // Init
  populateVoiceList();
  updateSpeakStatus();
  speakText.value =
    'The cat (Felis catus) is a domestic species of small carnivorous mammal. It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it from the wild members of the family.';
  s.setText(speakText.value);
  
  // Adding Events
  speakForm.addEventListener('submit', (e) => e.preventDefault());
  speakSpeed.addEventListener('change', (e) => s.setRate(e.target.value));
  speakVoice.addEventListener('change', (e) => s.setVoice(e.target.value));
  speakText.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    btnPlayPause.disabled = !!(value === '');
    s.setText(value);
  });
  speakVolume.addEventListener('input', (e) => s.setVolume(e.target.value / 100));
  btnPlayPause.addEventListener('click', () => s.togglePlayPause());
  btnReset.addEventListener('click', () => s.cancel());
};
