const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host + '/api';
let TOKEN = getTokenValue('token');
let PAGES = {
    current: 1,
    currentIndex: 0,
};
let NAME_FILTER = '';
let totalPages = 0;
let actualPage = 1;
let ban = true;
let ban2 = true;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getTokenValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.setRequestHeader('x-auth-user', TOKEN);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status !== 200) { // analizar el estatus de la respuesta HTTP
            // Ocurrió un error
            alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            // console.log(xhr.responseText); // Significa que fue exitoso
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

const tourneyToHTML = (tourneys) => {
    return `
    <div class="media col-8 mt-2">
        <div class="media-left align-self-center mr-3">
            <img class="rounded-circle" style="width: 200px; height: 200px" src="${tourneys.image}">
        </div>
        <div class="media-body">
                <h4>${tourneys.nombre}</h4>
                <p>Juego: ${tourneys.juego}</p>
                <p>Fecha: ${tourneys.fechai} </p>
                <p>Costo: ${tourneys.cost} </p>
                <p>Direccion: ${tourneys.place}</p>
            </div>
        <div class="media-right align-self-center">
            <div class="row">
                <div class="btn btn-primary" data-user='${JSON.stringify(tourneys)}' > <a class="text-white"
                 href="oneTourney.html?id=${tourneys.tid}"><i class="fas fa-search"></i></a></div>
            </div>
           
        </div>
    </div>`
}


const tourneyListToHTML = (list, id) => {
    if (id && list && document.getElementById(id)) {
        document.getElementById(id).innerHTML = list.map(tourneyToHTML).join('');
    }
}


function getTourneysPage(page, filter) {
    // const goTo = page <= 0 ? 1 : page;
    let nfilter = (filter) ? `${filter}` : '';
    let url = APIURL + "/tourneys?page=" + page + "&limit=3" + nfilter;

    sendHTTPRequest(url, "data", HTTTPMethods.get, (dataTourneys) => {
        let listTourneys = JSON.parse(dataTourneys.data).content;
        totalPages = JSON.parse(dataTourneys.data).totalPages;
        atualPage = JSON.parse(dataTourneys.data).totalPages;
        tourneyListToHTML(listTourneys, 'lista');
    }, (err) => {
        console.log(err);
    });

}

function paginado(listp, cases) {
    switch (cases) {
        case 1:
            listp[1].querySelector('a').innerHTML = actualPage - 1;
            listp[2].querySelector('a').innerHTML = actualPage;
            listp[3].querySelector('a').innerHTML = actualPage + 1;
            break
        case 2:
            listp[0].classList.remove('disabled');
            listp[1].classList.remove('active');
            listp[1].querySelector('a').innerHTML = actualPage - 1;
            listp[2].classList.add('active');
            listp[2].querySelector('a').innerHTML = actualPage;
            listp[3].innerHTML = `<a class="page-link" id="last" href="#">${actualPage + 1}</a>`;
            break;
        case 3:
            listp[1].querySelector('a').innerHTML = actualPage - 1;
            listp[2].querySelector('a').innerHTML = actualPage;
            listp[3].innerHTML = '';
            listp[4].classList.add('disabled');
            break;
        case 4:
            listp[1].querySelector('a').innerHTML = actualPage - 1;
            listp[2].querySelector('a').innerHTML = actualPage;
            listp[3].innerHTML = `<a class="page-link" id="last" href="#">${actualPage + 1}</a>`;
            listp[4].classList.remove('disabled');
            break;
        case 5:
            listp[0].classList.add('disabled');
            listp[1].classList.add('active');
            listp[2].classList.remove('active');
            listp[3].innerHTML = '';
            break;

        default:
            break;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    getTourneysPage(1, NAME_FILTER);

    let filterInput = document.getElementById('filterInput');

    filterInput.addEventListener('change', (e) => {
        NAME_FILTER = `&name=${e.target.value}`;
        getTourneysPage(PAGES.current, NAME_FILTER);
    })

    let ulHTML = document.getElementById('pagesList');
    let list = ulHTML.querySelectorAll('li');
    list[0].classList.add('disabled');
    list[3].innerHTML = '';

    ulHTML.addEventListener('click', (e) => {
        if ((e.target.id === 'second' && actualPage == 1) || e.target.id === 'next' || (e.target.id === 'last' && actualPage !== totalPages)) {
            getTourneysPage(++actualPage, NAME_FILTER);
            if (actualPage < totalPages) {
                if (!ban) {
                    paginado(list, 1);
                } else {
                    paginado(list, 2);
                    ban = false;
                }
            } else {
                paginado(list, 3);
                ban2 = true;
            }
        }
        if ((e.target.id === 'first' && actualPage == totalPages) || e.target.id === 'prev' || (e.target.id === 'first' && actualPage !== 1)) {
            getTourneysPage(--actualPage, NAME_FILTER);
            if (actualPage > 1) {
                if (!ban2) {
                    paginado(list, 1);
                } else {
                    paginado(list, 4);
                    ban2 = false;
                }
            } else {
                paginado(list, 5);
                actualPage = 1;
                ban = true;
            }
        }
    });

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
                changeText[4].textContent = user.fecha;
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

