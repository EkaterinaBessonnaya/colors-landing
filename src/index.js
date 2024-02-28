const cols = document.querySelectorAll('.col');

document.addEventListener('keydown', (event) => {
  event.preventDefault();

  if (event.code.toLocaleLowerCase() === 'space')  {
    setRandomColours();
  }
})

document.addEventListener('click', event => {
  const type = event.target.dataset.type;

  if (type === 'lock') {
    const node =
      event.target.tagName.toLocaleLowerCase() === 'i'
        ? event.target
        : event.target.children[0]

    node.classList.toggle('fa-lock-open');
    node.classList.toggle('fa-lock');
  } else if (type === 'copy') {
    copyToClickBoard(event.target.textContent);
  }
})

function generateRandomColor() {
  const hexCodes = '0123456789ABCDEF';
  let color = '';
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }

  return '#' + color;
}

function copyToClickBoard(text) {
  return navigator.clipboard.writeText(text);
}

function setRandomColours(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock');
    const text = col.querySelector('h2');
    const button = col.querySelector('button');

    if(isLocked) {
      colors.push(text.textContent);
      return;
    }

    const color = isInitial 
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random()

    if (!isInitial) {
      colors.push(color);
    }

    text.textContent = color;
    col.style.background = color;

    setTextColor(text, color);
    setTextColor(button, color);
  })

  updateColorsHash(colors);
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? 'black' : 'white';
}

function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map(col => col.toString().substring(1))
    .join('-')
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
   return document.location.hash
     .substring(1)
     .split('-')
     .map(color => '#' + color)
  }

  return [];
}

function copyToClickBoard(text, targetElement) {
  const copySuccess = navigator.clipboard.writeText(text);
  if (copySuccess) {
    showHelpMessage(targetElement);
    setTimeout(hideHelpMessage, 2000); // Hide message after 2 seconds
  } else {
    console.error('Failed to copy color to clipboard.');
  }
}

function showHelpMessage(targetElement) {
  const helpMessage = document.getElementById('helpMessage');
  const rect = targetElement.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  const left = rect.left + window.scrollX + targetElement.offsetWidth + 10; // Adjust this value as needed for spacing
  helpMessage.style.top = `${top}px`;
  helpMessage.style.left = `${left}px`;
  helpMessage.style.display = 'block';
}

function hideHelpMessage() {
  const helpMessage = document.getElementById('helpMessage');
  helpMessage.style.display = 'none';
}

document.addEventListener('click', event => {
  const target = event.target;
  const isLockButton = target.closest('[data-type="lock"]');

  if (isLockButton) {
    const icon = isLockButton.querySelector('i');
    icon.classList.toggle('fa-lock-open');
    icon.classList.toggle('fa-lock');
  } else if (target.dataset.type === 'copy') {
    const text = target.textContent;
    copyAndShowMessage(text, target);
  }
});

function copyAndShowMessage(text, targetElement) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Color copied to clipboard');
      const helpMessage = document.getElementById('helpMessage');
      const rect = targetElement.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const left = rect.left + window.scrollX + targetElement.offsetWidth + 10; // Adjust as needed
      helpMessage.style.top = `${top}px`;
      helpMessage.style.left = `${left}px`;
      helpMessage.style.display = 'block';

      setTimeout(() => {
        helpMessage.style.display = 'none';
      }, 2000); // Hide after 2 seconds
    })
    .catch(error => console.error('Failed to copy color to clipboard:', error));
}

setRandomColours(true);