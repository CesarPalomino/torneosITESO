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
    list: [1, 2, 3],
    limit: 5
};

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


const gameUserToHTML = (game) => {
    return `
    <div class="media">
        <img class="rounded-circle width" style="width: 30px; height: 30px;"
        src="${game.image}"
        class="mr-3" alt="...">
        <div class="media-body border-1">
        <h5 class="mt-0">${game.nombre}</h5>
        </div>
    </div>
    `
}

const tourneyToHtml = (tourney) => {
    return `
    <div class="col-8 mt-2" >
        <div class="media col-11 mt-2 border text-center">
            <div class="media-left align-self-center mr-3">
                <img class="rounded-circle width" style="width: 200px; height: 200px"
                        src="${tourney.image}">
            </div>
            <div class="media-body">
                <h4>${tourney.nombre}</h4>
                <p>Juego: ${tourney.juego} </p>
                <p>Fecha de inicio: ${tourney.fechai}</p>
                <p>Hora: ${tourney.hora}</p>
                <p>Costo: ${tourney.cost}</p>
                <p>Lugar: ${tourney.place}</p>
            </div>
        </div>
    </div>
    <div class="align-self-center text-right bg-light mx-2">
        <div class="row">
            <a id="editTourney" class="btn btn-primary mt-2" data-tourney='${JSON.stringify(tourney)}' data-toggle="modal" data-target="#updateFormModal"><i class="fas fa-pencil-alt edit"></i></a>
        </div>
        <div class="row">
            <a id="deleteTourney" class="btn btn-primary mt-2" data-toggle="modal" data-target="#deleteFormModal"><i class="fas fa-trash-alt  remove"></i></a>
        </div>
    </div>
    `
}

const gameUserListToHTML = (list, id) => {
    console.log("list: " + list)
    if (id && list && document.getElementById(id)) {
        console.log("ok")
        document.getElementById(id).innerHTML = list.map(gameUserToHTML).join('');
    }
}

const userToHTML = (user) => {
    return `
    <div class="media col-11 mt-2 border text-center">
        <div class="media-left align-self-center mr-3">
            <img class="rounded-circle" style="width: 150px; height: 150px"
                src="${user.image}" alt="user image">
        </div>
        <div class="media-body">
            <h4>${user.nick}</h4>
            <p>${user.nombre} ${user.apellidos}</p>
            <p>Correo: ${user.email}</p>
        </div>
    </div>
        <div class="align-self-center text-right mx-2">
            <div class="row justify-content-end px-3">
            <div class="btn btn-primary mx-3" data-user='${JSON.stringify(user)}' data-toggle="modal" data-target="#updateFormModal"><i class="fas fa-pencil-alt edit"></i></div>
        </div>
    </div>
`
}
const userListToHTML = (list, id) => {
    if (id && list && document.getElementById(id)) {   
        document.getElementById(id).innerHTML = list.map(userToHTML).join(' ');
    }
}

const tourneyDataToHTML = (tourney, id) => {
    if (id && tourney && document.getElementById(id)) {
        console.log("ok")
        document.getElementById(id).innerHTML = tourneyToHtml(tourney);
    }
}

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError,) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log(TOKEN);
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

function updateTourney() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');

    let form = document.getElementById('updateFormModal');
    let listInputs = form.querySelectorAll('input');

    let url = APIURL + `/tourneys/${myParam} `;

    let data = {
        nombre: listInputs[0].value,
        fechai: listInputs[1].value,
        fechaf: listInputs[2].value,
        cost: listInputs[3].value,
        place: listInputs[4].value,
        image: listInputs[5].value
    }

    sendHTTPRequest(url, JSON.stringify(data), HTTTPMethods.put, (res) => {
        console.log(res.data)
        getTourney();
    }, (err) => {
        console.log("error" + err);
    });
}

function getTourney() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    //agrega codigo..
    sendHTTPRequest(APIURL + `/tourneys/${myParam}`, "data", HTTTPMethods.get, (tourney) => {
        let tourneyData = JSON.parse(tourney.data);
        tourneyDataToHTML(tourneyData, 'tourney');
        gameUserListToHTML(tourneyData.gamelist, 'listGamesAccount');
    }, (err) => {
        console.log("error" + err)
    });
}

function deleteTourney() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    //agrega codigo..
    sendHTTPRequest(APIURL + `/tourneys/${myParam}`, "", HTTTPMethods.delete, (res) => {
        console.log(res)
        window.location.href = "../html/tourneybrowser.html"
    }, (err) => {
        console.log("error" + err)
    });
}

function signupTourney() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');

    let tokSep = TOKEN.split("-");
    let uid = tokSep[tokSep.length - 1];
    //agrega codigo..
    sendHTTPRequest(APIURL + `/tourneys/${myParam}/participant/${uid}`, "", HTTTPMethods.put, (res) => {
        console.log(res.data)
        getTourney();
    }, (err) => {
        console.log("error" + err)
    });
}

function getUser() {
    let tokSep = TOKEN.split("-");
    let uid = tokSep[tokSep.length - 1];
    //agrega codigo..
    sendHTTPRequest(APIURL+`/users/${uid}`, "getUser", HTTTPMethods.get, (us) => {
        console.log("HOLA"+us.data);
        let usData = JSON.parse(us.data);
        let user = [{
            "nombre": usData.nombre,
            "apellidos":  usData.apellidos,
            "email":  usData.email,
            "nick": usData.nick,
            "image": usData.image
        }]
        userListToHTML(user,'listaUser');
        let gamesOfUser = [];
        sendHTTPRequest(APIURL + '/games', undefined, HTTTPMethods.get, (res) => {
            let gamesList = JSON.parse(res.data);
            if(usData.gamelist !==undefined){
                for (let i = 0; i < usData.gamelist.length; i++) {
                    gamesOfUser.push(gamesList.find(element => element.gid === usData.gamelist[i].game));
                }
                let listgAndu = [];
                for (let i in gamesOfUser) {
                    listgAndu.push({
                        image: gamesOfUser[i].image,
                        nombre: gamesOfUser[i].nombre,
                        clas: usData.gamelist[i].clas
                    })
                }
                gameUserListToHTML(listgAndu,'listGamesOfUser');
            }
        }, (err) => {
            console.log(err)
        }, TOKEN);
    }, (err) => {
        console.log("error" + err)
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getUser();
    getTourney();

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
                if (user.gamelist !== undefined) {
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
    
    let tourneyStatus = document.getElementById('editTourney')
    tourneyStatus.onclick = () => {
        $('#updateFormModal').modal('show');
    }

    $('#updateFormModal').on('show.bs.modal', function (event) {
        let user = JSON.parse(event.relatedTarget.getAttribute('data-tourney'));

        let listInputs = document.getElementById('updateFormModal').querySelectorAll('input');
        listInputs[0].value = user.nombre;
        listInputs[1].valueAsDate = new Date(user.fechai);
        listInputs[2].valueAsDate = new Date(user.fechaf);
        listInputs[3].value = user.cost;
        listInputs[4].value = user.place;
        listInputs[5].value = user.image;

        let updateBtn = document.getElementById('updatebtn');
        updateBtn.addEventListener('click', () => {
            updateTourney();
        });
    });

    $('#updateFormModal').on('hide.bs.modal', function (event) {
        // Eliminar event listeners repetidos de click
        var old_element = document.getElementById('updatebtn');
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
    });

    let tourneyDelete= document.getElementById('deleteTourney')
    tourneyDelete.onclick = () => {
        $('#deleteFormModal').modal('show');
    }

    $('#deleteFormModal').on('show.bs.modal', function (event) {
        let deleteBtn = document.getElementById('deletebtn');
        deleteBtn.addEventListener('click', () => {
            deleteTourney();
        });
    });

    $('#deleteFormModal').on('hide.bs.modal', function (event) {
        var old_element = document.getElementById('deletebtn');
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
    });

    let addParticipant= document.getElementById('addParticipant')
    addParticipant.onclick = () => {
        $('#addFormModal').modal('show');
    }

    $('#addFormModal').on('show.bs.modal', function (event) {
        let deleteBtn = document.getElementById('addbtn');
        deleteBtn.addEventListener('click', () => {
            signupTourney();
        });
    });

    $('#addFormModal').on('hide.bs.modal', function (event) {
        var old_element = document.getElementById('addbtn');
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
    });

});