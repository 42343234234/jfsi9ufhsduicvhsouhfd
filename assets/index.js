// IndexedDB baza
const dbPromise = idb.openDB('myDatabase', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('session')) {
      db.createObjectStore('session');
    }
  }
});

// Dane do losowania
const randomMaleSurnames = ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kamiński'];
const randomFemaleSurnames = ['Kowalska', 'Nowak', 'Wiśniewska', 'Wójcik', 'Kamińska'];
const randomCities = ['Warszawa', 'Kraków', 'Łódź', 'Wrocław', 'Poznań'];
const randomStreets = ['Mickiewicza', 'Słowackiego', 'Kościuszki', 'Reymonta', 'Piłsudskiego'];

// Płeć domyślna
let sex = 'm';

// Obsługa rozwijania selektora płci
const selector = document.querySelector('.selector_box');
selector.addEventListener('click', () => {
  selector.classList.toggle('selector_open');
});

// Obsługa wyboru opcji płci
document.querySelectorAll('.selector_option').forEach((opt) => {
  opt.addEventListener('click', (e) => {
    e.stopPropagation();
    sex = opt.id;
    document.querySelector('.selected_text').innerHTML = opt.innerHTML;
    selector.classList.remove('selector_open');
  });
});

// Upload zdjęcia do Imgur
const input = document.querySelector('#image'),
  previewModal = document.querySelector('.image-preview-modal'),
  previewImage = document.querySelector('.preview-image'),
  closePreview = document.querySelector('.close-preview'),
  fileUpload = document.querySelector('#file-upload');

fileUpload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: { Authorization: 'Client-ID cc8a9cbb22eb0ef' },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      input.value = data.data.link;
      previewImage.src = data.data.link;
      previewModal.style.display = 'flex';
    } else {
      alert('Błąd podczas przesyłania zdjęcia');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Błąd podczas przesyłania zdjęcia');
  }
});

input.addEventListener('input', (e) => {
  const value = e.target.value;
  if (value.includes('imgur.com')) {
    previewImage.src = value;
    previewModal.style.display = 'flex';
  }
});

closePreview.addEventListener('click', () => {
  previewModal.style.display = 'none';
});
previewModal.addEventListener('click', (e) => {
  if (e.target === previewModal) previewModal.style.display = 'none';
});

// Przycisk GENERUJ — losowanie danych i zapis do IndexedDB
document.querySelector('.generate-btn').addEventListener('click', async () => {
  const db = await dbPromise;

  document.querySelectorAll('.input_holder').forEach(async (holder) => {
    const input = holder.querySelector('.input');
    let value = '';

    switch (input.id) {
      case 'name':
        value = sex === 'm' ? 'Jan' : 'Anna';
        break;
      case 'surname':
        value = sex === 'm'
          ? getRandomElement(randomMaleSurnames)
          : getRandomElement(randomFemaleSurnames);
        break;
      case 'familyName':
        value = sex === 'm'
          ? getRandomElement(randomMaleSurnames)
          : getRandomElement(randomFemaleSurnames);
        break;
      case 'fathersFamilyName':
        value = getRandomElement(randomMaleSurnames);
        break;
      case 'mothersFamilyName':
        value = getRandomElement(randomFemaleSurnames);
        break;
      case 'birthPlace':
      case 'city':
        value = getRandomElement(randomCities);
        break;
      case 'countryOfBirth':
      case 'nationality':
        value = 'POLSKA';
        break;
      case 'adress1':
        value = 'ul. ' + getRandomElement(randomStreets) + ' ' + Math.floor(Math.random() * 100 + 1);
        break;
      case 'adress2':
        value = generateRandomPostcode();
        break;
    }

    if (value) {
      input.value = value;
      await db.put('session', value, input.id);
    }
  });

  const dateInputs = document.querySelectorAll('.date_input');
  const day = Math.floor(Math.random() * 28 + 1);
  const month = Math.floor(Math.random() * 12 + 1);
  const year = Math.floor(Math.random() * (2005 - 1960) + 1960);

  dateInputs[0].value = day;
  dateInputs[1].value = month;
  dateInputs[2].value = year;

  await db.put('session', day, 'birthDay');
  await db.put('session', month, 'birthMonth');
  await db.put('session', year, 'birthYear');
});

// Wczytywanie danych z IndexedDB przy starcie
window.addEventListener('load', async () => {
  const db = await dbPromise;

  document.querySelectorAll('.input_holder').forEach(async (holder) => {
    const input = holder.querySelector('.input');
    if (input) {
      const value = await db.get('session', input.id);
      if (value !== undefined) {
        input.value = value;
      }
    }
  });

  const dateInputs = document.querySelectorAll('.date_input');
  const birthDay = await db.get('session', 'birthDay');
  const birthMonth = await db.get('session', 'birthMonth');
  const birthYear = await db.get('session', 'birthYear');

  if (birthDay) dateInputs[0].value = birthDay;
  if (birthMonth) dateInputs[1].value = birthMonth;
  if (birthYear) dateInputs[2].value = birthYear;
});

// Pomocnicze
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomPostcode() {
  return String(Math.floor(Math.random() * 90 + 10)) + '-' + String(Math.floor(Math.random() * 900 + 100));
}
