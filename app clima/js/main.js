const btn = document.getElementById('btn');
const contenedor  = document.getElementById('containerClima');
const contenedorHora = document.getElementById('containerHora');
const contenedorGeneral = document.getElementById('general');
const contenedorCarga = document.getElementById('carga');

btn.addEventListener('click', () => {
    const ciudad = document.getElementById('search').value;
    llamado(ciudad);
});

function llamado(ciudad) {
    const API = 'd1c308e7b69b9dcddac0b03810f710e2';
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API}`;
        fetch(URL)
            .then( data =>{
                return data.json();
            })
            .then( data =>{ 
                limpiar()
                cargando();
                //si ya hay una tarjeta esta sera eliminada
                //si la promesa es exitosa llamara a todas las funciones
                if (data.cod == '200') {
                    setTimeout(()=>{
                        const eliminar = document.getElementById('eliminar');
                        // Verifica si el elemento existe antes de intentar eliminarlo
                        if (eliminar) {
                            eliminar.remove();// Elimina el elemento
                        }
                        pronosticoHorario(ciudad,API);
                        //imprime la tarjeta
                        tarjetaPrincipal(data);
                        //imprime los datos generales
                        datosGenerales(data);
                        //imprime pronostico de cada hora
                    },3000)
                }

            }).catch(error =>{
                console.log(error);
                msgError(ciudad, error);
                }) 
}


// pronostico de las 7 horas  de mañana 
function pronosticoHorario(ciudad, API) {
    
    const URL = `http://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${API}`;
    fetch(URL)
    .then(data => {
        return data.json();
    })
    .then(data => {
        //for que recorre e imprime cada hora dentro del rango definido
        for (let i = 0 ; i < 8 ; i++) {
            obtenerHora(i, data);
        }
    }).catch(error =>{
        console.log(error);
    })
}
// crea la tarjeta principal
function tarjetaPrincipal(data) {
    const descripcion = data.weather[0].description;
    const temperatura = tranformador(data.main.temp);
    const maxTemp =  tranformador(data.main.temp_max);
    const minTemp = tranformador(data.main.temp_min);
    const icono = data.weather[0].icon;
    const clima = document.createElement('div');
    clima.innerHTML = `
                    <div class="card bg-dark shadow-lg ps-3 pe-3 mb-3 rounded" style="width: 20rem"id="clima">
                    <div class="card-body rounded">
                    <div class="principal_card">
                        <div class="d-flex justify-content-center">
                        <p class="blanco m-0">Ahora mismo en: ${data.name}</p>
                        </div>
                        <div
                        class="d-flex justify-content-between text-center align-items-center"
                        >
                        <span class="blanco text-center" style="font-size: 50px"
                            >${temperatura}°C</span
                        >
                        <img
                            src="https://openweathermap.org/img/wn/${icono}@2x.png"
                            alt="icon"
                        />
                        </div>
                    </div>
                    <div class="info_card text-center pt-2">
                        <p class="blanco txt_card">
                        <i class="bi bi-thermometer-sun"></i>Max: ${maxTemp}°C<br />
                        <i class="bi bi-thermometer-snow"></i>Min: ${minTemp}°C
                        </p>
                        <p class="blanco txt_card">Descripcion: ${descripcion}</p>
                    </div>
                    </div>
                </div>
    `;
    contenedor.appendChild(clima);
    mostrar();
}


// crea las tarjetas de cada hora
function obtenerHora(i, data) {
    const hora = new Date(data.list[i].dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });    
    const temp = tranformador(data.list[i].main.temp);
    const icono = data.list[i].weather[0].icon;
    const desc = data.list[i].weather[0].description;
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('elemento');
    tarjeta.innerHTML = `
                        <!-- elemneto : ${i}  -->
                        <div class="card bg-dark shadow-lg text-center  rounded" style="width: 8rem; "
                            <div class="card-body rounded pt-2 pb-2 ">
                                <p class="txt blanco m-0" style="font-size: 8px;">${hora}</p>
                                    <div class="d-flex justify-content-center">
                                        <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="icon">
                                    </div>
                                <p class="txt blanco m-0 pb-1" style="font-size: 10px;"> ${desc}</p>
                                <p class="txt blanco m-0 pb-1" style="font-size: 10px;">temp: ${temp}°C</p>
                            </div>
                        </div>
    `;
    contenedorHora.appendChild(tarjeta);
    return tarjeta
}

//muestra la animacion de carga 
function cargando() {
    const animacion = document.createElement('div');
    animacion.innerHTML = `
            <div class="spinner-border text-primary d-flex justify-content-center" role="status">
                <span class="visually-hidden" style="width: 50px;">Loading...</span>
            </div>
            <p>Buscando tu informacion :)</p>
    `;
    contenedor.appendChild(animacion)
    setTimeout(()=>{
        contenedor.removeChild(animacion)
    },3200)
}


//crea las tarjetas que muestra la informacion general
function datosGenerales(data) {
    // contenedorGeneral.style.display = 'block'
    //obtencion de los datos
    const vientoValor = tranformadorKm(data.wind.speed);
    const presionValor = data.main.pressure;
    const humedadValor = data.main.humidity;
    const sensaciónValor  = tranformador(data.main.feels_like); // sensación térmica
    //llamado al DOM 
    const spViento = document.getElementById('Viento');
    spViento.textContent = vientoValor;

    const spPresion = document.getElementById('Presion');
    spPresion.textContent = presionValor;

    const spHumedad = document.getElementById('Humedad');
    spHumedad.textContent = humedadValor;

    const spSensacion = document.getElementById('Sensacion');
    spSensacion.textContent = sensaciónValor;

}

//funcion para eliminar el parrafo al pasar 3 segundos
function msgError(ciudad, error) {
    console.log('captao');
    console.log(error);
    const nav = document.getElementById('parrafo');
    const msg = document.createElement('p');
    if (ciudad !== '') {
        msg.innerHTML = `La ciudad "${ciudad}" no ha sido encontrada`;
        nav.appendChild(msg);
        setTimeout(() => {
            nav.removeChild(msg);
        }, 3000);
    } else{
        msg.innerHTML = 'debe ingresar una ciudad';
        nav.appendChild(msg);
        setTimeout(() => {
            nav.removeChild(msg);
        }, 3000);
    }

}

//muestra todos los titulos
function mostrar() {
        const titulo_1 = document.getElementById('titulo_1');
        const titulo_2 = document.getElementById('titulo_2');
        const general = document.getElementById('general');
        titulo_1.style.display = 'block';
        titulo_2.style.display = 'block';
        general.style.display = 'block';
}

//limpia los contenedores para que su informacion sea renovada
function limpiar() {
    contenedor.innerHTML = '';
    contenedorHora.innerHTML = '';
    contenedorGeneral.style.display = 'none';
    contenedorCarga.style.display = 'none';
}

// funcion para transformar los grados de Fahrenheit a celcius
function tranformador(temperatura ) {
    return  parseInt(temperatura - 273.15);
}
function tranformadorKm(viento ) {
    return  parseInt(viento * 1.60934);
}

































// https://api.openweathermap.org/data/2.5/weather?q=BOGOTA&appid=d1c308e7b69b9dcddac0b03810f710e2
