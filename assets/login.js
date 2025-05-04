async function login() {
  const passwordValue = document.getElementById('password').value.trim();

  // Jeśli pole hasła jest puste — zablokuj logowanie
  if (passwordValue === '') {
    alert('Wpisz hasło!');
    return;
  }

  // Symulacja bazy danych — tylko jedno poprawne hasło
  if (passwordValue !== 'pobywatelfree') {
    alert('Nieprawidłowe hasło.');
    return;
  }

  // Symulowane dane użytkownika
  const data = {
    loggedIn: true,
    hasGenerated: false // Możesz zmienić na true, jeśli chcesz symulować, że już wygenerowano
  };

  // Zaloguj użytkownika (symulacja zapisu)
  // W prawdziwej aplikacji możesz zapisać do localStorage lub podobnie
  alert('Zalogowano pomyślnie!');

  // Jeśli już generował — przekieruj od razu
  if (data.hasGenerated) {
    window.location.href = 'id.html';
  } else {
    document.getElementById('loginOverlay').style.display = 'none';
  }
}

// PRZYCISK
document.getElementById('loginBtn').addEventListener('click', login);
