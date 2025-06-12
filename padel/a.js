<script>
  // Horarios disponibles por defecto
  const horariosBase = [];
  for (let i = 9; i <= 23; i++) {
    horariosBase.push((i < 10 ? '0' : '') + i + ':00');
  }

  // Carga horarios en selects y carga reservas guardadas para el usuario actual
  function cargarHorariosYReservas() {
    ['1', '2', '3'].forEach(cancha => {
      const select = document.getElementById('horario' + cancha);
      select.innerHTML = ''; // limpio opciones antes de agregar

      // Cargar horarios disponibles para esta cancha (los que no están reservados)
      const horariosReservados = getReservasCancha(cancha).map(r => r.hora);
      horariosBase.forEach(hora => {
        if (!horariosReservados.includes(hora)) {
          const option = document.createElement('option');
          option.value = hora;
          option.textContent = hora;
          select.appendChild(option);
        }
      });

      // Actualizo botón reservar según disponibilidad
      document.getElementById('btn' + cancha).disabled = (select.options.length === 0);

      // Cargar lista visible de reservas
      mostrarListaReservas(cancha);
    });
  }

  // Obtener usuario logueado
  function getUsuarioActual() {
    return sessionStorage.getItem('usuarioActivo');
  }

  // Guardar reserva en localStorage
  function guardarReserva(cancha, hora) {
    const usuario = getUsuarioActual();
    if (!usuario) return;
    const reservas = JSON.parse(localStorage.getItem('reservas_' + usuario)) || {};
    if (!reservas[cancha]) reservas[cancha] = [];
    reservas[cancha].push({ hora });
    localStorage.setItem('reservas_' + usuario, JSON.stringify(reservas));
  }

  // Eliminar reserva en localStorage
  function eliminarReserva(cancha, hora) {
    const usuario = getUsuarioActual();
    if (!usuario) return;
    const reservas = JSON.parse(localStorage.getItem('reservas_' + usuario)) || {};
    if (!reservas[cancha]) return;
    reservas[cancha] = reservas[cancha].filter(r => r.hora !== hora);
    localStorage.setItem('reservas_' + usuario, JSON.stringify(reservas));
  }

  // Obtener reservas para cancha
  function getReservasCancha(cancha) {
    const usuario = getUsuarioActual();
    if (!usuario) return [];
    const reservas = JSON.parse(localStorage.getItem('reservas_' + usuario)) || {};
    return reservas[cancha] || [];
  }

  // Mostrar lista de reservas en la UL correspondiente
  function mostrarListaReservas(cancha) {
    const lista = document.getElementById('lista' + cancha);
    lista.innerHTML = '';
    const reservas = getReservasCancha(cancha);
    reservas.forEach(r => {
      const li = document.createElement('li');
      li.textContent = r.hora;
      const btn = document.createElement('button');
      btn.textContent = 'Eliminar';
      btn.className = 'delete-btn';
      btn.onclick = () => {
        eliminarReserva(cancha, r.hora);
        cargarHorariosYReservas();
      };
      li.appendChild(btn);
      lista.appendChild(li);
    });
  }

  // Login actualizado: almacena usuario activo en sessionStorage y carga reservas
  function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const storedPass = localStorage.getItem('user_' + user);

    if (storedPass === pass) {
      sessionStorage.setItem('usuarioActivo', user);
      document.getElementById('login-section').classList.add('hidden');
      document.getElementById('reservas-section').classList.remove('hidden');
      cargarHorariosYReservas();
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  }

  // Logout: limpia usuario activo y muestra login
  function logout() {
    sessionStorage.removeItem('usuarioActivo');
    document.getElementById('reservas-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
  }

  // Registrar usuario sin cambios
  function register() {
    const user = document.getElementById('newUsername').value;
    const pass = document.getElementById('newPassword').value;

    if (user === '' || pass === '') {
      alert('Completa todos los campos');
      return;
    }

    if (localStorage.getItem('user_' + user)) {
      alert('El usuario ya existe');
      return;
    }

    localStorage.setItem('user_' + user, pass);
    alert('Cuenta creada. Ahora podés iniciar sesión.');
    hideRegister();
  }

  // Mostrar y ocultar registro sin cambios
  function showRegister() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('register-section').classList.remove('hidden');
  }
  function hideRegister() {
    document.getElementById('register-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
  }

  // Reservar horario para cancha
  function reservar(cancha) {
    const select = document.getElementById('horario' + cancha);
    const hora = select.value;

    if (!hora) {
      alert('Seleccioná un horario');
      return;
    }

    guardarReserva(cancha, hora);
    cargarHorariosYReservas();
  }
</script>
