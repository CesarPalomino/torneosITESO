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


const gameUserToHTML = (game) => {
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

const gameUserListToHTML = (list, id) => {
    console.log("Lista: "+list)
    if (id && list && document.getElementById(id)) {
        console.log("Funcion")
        document.getElementById(id).innerHTML = list.map(gameUserToHTML).join('');
    }
}

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

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, ) {
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
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP
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
                gameUserListToHTML(listgAndu, 'listGamesAccount');
            }
        }, (err) => {
            console.log(err)
        }, TOKEN);
    }, (err) => {
        console.log("error" + err)
    });
}

function updateUser(ele) {
    let tokSep = TOKEN.split("-");
    let uid = tokSep[tokSep.length - 1];
    let user = JSON.parse(ele.getAttribute('data-user'));
    let form = document.getElementById('updateFormModal');
    let listInputs = form.querySelectorAll('input');

    let url = APIURL + `/users/${uid}`;

    let data = {
        nombre: listInputs[0].value,
        apellidos:  listInputs[1].value,
        password: listInputs[2].value,
        image: listInputs[4].value
    }


    sendHTTPRequest(url, JSON.stringify(data), HTTTPMethods.put, (res) => {
        console.log(res.data)
        getUser();
    }, (err) => {
        console.log("error" + err);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    getUser();

    $('#updateFormModal').on('show.bs.modal', function (event) {
        let user = JSON.parse(event.relatedTarget.getAttribute('data-user'));

            let listInputs = document.getElementById('updateFormModal').querySelectorAll('input');
            listInputs[0].value = user.nombre;
            listInputs[1].value = user.apellidos;
            //listInputs[2].value = user.email;
            //listInputs[5].valueAsDate = new Date(user.fecha);
            //listInputs[8].value = user.image;

            let updateBtn = document.getElementById('updatebtn');
            updateBtn.addEventListener('click', () => {
                updateUser(event.relatedTarget);
        });

    });


    $('#updateFormModal').on('hide.bs.modal', function (event) {
        // Eliminar event listeners repetidos de click
        var old_element = document.getElementById('updatebtn');
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
    });

});