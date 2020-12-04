const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host + '/api';
let TOKEN = getTokenValue('token');


function getTokenValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, authToken) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (authToken)
        xhr.setRequestHeader('x-auth-user', authToken);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}

function login(user) {
    console.log('login...');
    //agrega tu codigo...
    sendHTTPRequest(APIURL + "/login", user, HTTTPMethods.post, function (dataUser) {
        // data contiene el status y el token que se parsea a objeto.
        if (dataUser) {
            setCookie('token', JSON.parse(dataUser.data).token, 2);
            window.location.href = "../html/index.html";
        }

    }, (error) => {
        console.log(error); ///devuelve string error
    }, TOKEN);

}

function createUser(valforms) {
    console.log('createUser');
    //agrega tu codigo...

    let newUser = {
        nick: valforms[0],
        nombre: valforms[1],
        apellidos: valforms[2],
        email: valforms[3],
        password: valforms[4],
        image: "https://icon-library.com/images/8-bit-mario-icon/8-bit-mario-icon-2.jpg"
    }
    console.log(JSON.stringify(newUser));

    sendHTTPRequest(APIURL + "/register", JSON.stringify(newUser), HTTTPMethods.post, (userAdd) => {
        console.log("Usuario agregado" + userAdd)
        document.getElementById('responseMSG').innerHTML = '<div class="alert alert-success" role="alert">Ususario Agregado! Por favor logeate para poder ingresar</div>';
    }, (err) => {
        document.getElementById('responseMSG').innerHTML = '<div class="alert alert-danger" role="alert">Este usuario ya existe!</div>';
    }, TOKEN);

}


const gameToHTML = (game) => {
    return `
    <div class="media">
        <img style="width: 30px; height: 30px;"
        src="${game.image}"
        class="mr-3" alt="...">
        <div class="media-body border-1">
        <h5 class="mt-0">${game.nombre}</h5> Puntaje: ${game.clas}
        </div>
    </div>
    `
}

const gameListToHTML = (list, id) => {
    if (id && list && document.getElementById(id)) {
        document.getElementById(id).innerHTML = list.map(gameToHTML).join('');
    }
}

// aqui esta cabron

const carouselToHTML = (tourney) => {
    return ` 
    <div class="${tourney.pos == 1 ? "carousel-item active" : "carousel-item"}">
        <img src="${tourney.image}" class="d-block w-100" alt="...">
        <div class="carousel-caption d-none d-md-block">
            <span class="d-block p-2 bg-dark text-white">
                <h5>${tourney.nombre}</h5>
                <p>${tourney.juego}</p>
                <p>${tourney.fechai}</p>
                <a href="../html/oneTourney.html?id=${tourney.tid}" type="button" class="btn btn-primary btn-lg btn-block">Ver Torneo</a>
            </span>
        </div>
    </div>`
}

const gameListToCarouselHTML = () => {
    sendHTTPRequest(APIURL + "/tourneys/carousel?order=highlighted&limit=5", undefined, HTTTPMethods.get, function (dataTourney) {
        let listTourneys = JSON.parse(dataTourney.data).content;
        document.getElementById('tourneysDestacados').innerHTML = listTourneys.map(carouselToHTML).join('');
    }, function (f) {
        console.log(f)
    }, TOKEN)
}

const gameListToCarousel2HTML = () => {
    sendHTTPRequest(APIURL + "/tourneys/carousel?order=old&limit=5", undefined, HTTTPMethods.get, function (dataTourney) {
        let listTourneys = JSON.parse(dataTourney.data).content;
        document.getElementById('tourneysRecientes').innerHTML = listTourneys.map(carouselToHTML).join('');
    }, function (f) {
        console.log(f)
    }, TOKEN)
}

const gameListToCarousel3HTML = () => {
    sendHTTPRequest(APIURL + "/tourneys/carousel?order=next&limit=5", undefined, HTTTPMethods.get, function (dataTourney) {
        let listTourneys = JSON.parse(dataTourney.data).content;
        document.getElementById('tourneysProximos').innerHTML = listTourneys.map(carouselToHTML).join('');
    }, function (f) {
        console.log(f)
    }, TOKEN)
}

function minusDate(fechaF, fechaI) {
    let fechaNum1 = parseInt("" + fechaF.getFullYear() + ((fechaF.getMonth() + 1) > 10 ? (fechaF.getMonth() + 1) : "0" + (fechaF.getMonth() + 1)) + (fechaF.getDate() > 10 ? fechaF.getDate() : "0" + fechaF.getDate()) + (fechaF.getHour > 10 ? fechaF.getHour : "0" + fechaF.getHour) + (fechaF.getMinutes > 10 ? fechaF.getMinutes : "0" + fechaF.getMinutes) + 00);
    let fechaNum2 = parseInt("" + fechaF.getFullYear() + ((fechaF.getMonth() + 1) > 10 ? (fechaI.getMonth() + 1) : "0" + (fechaI.getMonth() + 1)) + (fechaI.getDate() > 10 ? fechaI.getDate() : "0" + fechaI.getDate()) + (fechaI.getHour > 10 ? fechaI.getHour : "0" + fechaI.getHour) + (fechaI.getMinutes > 10 ? fechaI.getMinutes : "0" + fechaI.getMinutes) + 00);
    return fechaNum1 - fechaNum2;
}

document.addEventListener('DOMContentLoaded', () => {
    let search = document.getElementById('search')
    gameListToCarouselHTML();
    gameListToCarousel2HTML();
    gameListToCarousel3HTML();
    //agrega tu codigo de asignación de eventos...
    search.onclick = () => {
        $('.example-popover').popover({
            container: 'body'
        })
    }
    //boton de login.....
    let loginBtn = document.getElementById('loginBtn');
    let userStatus = document.getElementById('user-status')
    let addTourney = document.getElementById('addTourney')

    userStatus.onclick = () => {
        let token = getTokenValue('token');
        if (!token) {
            $('#idModalLogin').modal('show');
        } else {
            $('#exampleModal').modal('show');
        }

    }

    addTourney.onclick = () => {
        let token = getTokenValue('token');
        console.log("HOLAA");
        if (!token) {
            $('#idModalLogin').modal('show');
        } else {
            window.location.href = "../html/tourneys.html"
        }

    }

    loginBtn.onclick = () => {
        let email = document.getElementById('modalLRInput10').value;
        let password = document.getElementById('modalLRInput11').value;
        let objLogin = JSON.stringify({
            email: email,
            password: password
        });
        login(objLogin);
    };

    //modal perfil usuario
    $('#exampleModal').on('show.bs.modal', function (event) {
        let tokSep = TOKEN.split("-");
        let uid = tokSep[tokSep.length - 1];
        let gamesOfUser = [];
        sendHTTPRequest(APIURL + '/users/' + `${uid}`, undefined, HTTTPMethods.get, (corr) => {
            //corr.data
            let user = JSON.parse(corr.data);
            sendHTTPRequest(APIURL + '/games', undefined, HTTTPMethods.get, (res) => {
                let gamesList = JSON.parse(res.data);
                let changeText = document.querySelectorAll('.userData');
                changeText[0].src = user.image;
                changeText[1].textContent = user.nick;
                changeText[2].textContent = user.nombre + " " + user.apellidos;
                changeText[3].textContent = user.email;
                if (user.gamelist!==undefined) {
                    for (let i = 0; i < user.gamelist.length; i++) {
                        gamesOfUser.push(gamesList.find(element => element.gid === user.gamelist[i].game));
                    }

                    let listgAndu = [];
                    for (let i in gamesOfUser) {
                        listgAndu.push({
                            image: gamesOfUser[i].image,
                            nombre: gamesOfUser[i].nombre,
                            clas: user.gamelist[i].clas
                        })
                    }
                    gameListToHTML(listgAndu, 'listGamesOfUser');
                }
            }, (err) => {
                console.log(err)
            }, TOKEN);
        }, (F) => {
            console.log(F)
        }, TOKEN);


    });

    //registro de usuario y boton guardar1
    $('#idModalLogin').on('show.bs.modal', function (event) {
        //agrega tu codigo...
        //console.log(event);
        let form = document.getElementById('panel8');
        let SaveUserBtn = document.getElementById('createUserBtn');
        let listForm;
        let valForm = []; //cambiable
        form.addEventListener('change', function () {
            if (!form.querySelector('input:invalid') && document.getElementById('password1').value == document.getElementById('password2').value) {
                listForm = form.querySelectorAll('input').values();
                let valuesForm = [];
                for (const i of listForm) {
                    if (!(i.type == 'radio' && !i.checked))
                        valuesForm.push(i.value);
                }
                valForm = valuesForm; //cambiable
                SaveUserBtn.disabled = false;

            } else {
                SaveUserBtn.disabled = true;
            }
            listInputs = form.querySelector('input:invalid');
            console.log(listInputs);
        });

        SaveUserBtn.onclick = () => {
            createUser(valForm);

        };


    });
});