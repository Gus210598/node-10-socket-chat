
const url = 'http://localhost:4000/api/auth/'

let usuario = null;
let socket  = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


// Validar el token de local storage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if ( token <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay tokern en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem( 'token', tokenDB );
    usuario= userDB;
    document.title = usuario.nombre

    await conectarSocket();
    
};


const conectarSocket = async() => {
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket online')
    })
    socket.on('disconnect', () => {
        console.log('Socket offline')
    })

    socket.on('recibir-mensajes', dibujarMensajes )

    socket.on('usuarios-activos',  dibujarUsuairos ) 

    socket.on('mensaje-privado', ( payload ) => {
        console.log('Privado... ', payload )
    })

}

const dibujarUsuairos = ( usuarios = [] )=> {
    
    let mensajesHtml = '';
    usuarios.forEach( ({ nombre, uid }) => {

        mensajesHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6" text-muted"> ${ uid } </span>
                </p>
            </li>
        `;

    })
    ulUsuarios.innerHTML = mensajesHtml;
}

const dibujarMensajes = ( mensajes = [] )=> {
    
    let mensajesHtml = '';
    mensajes.forEach( ({ nombre, mensaje }) => {

        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary"> ${ nombre }: </span>
                    <span> ${ mensaje } </span>
                </p>
            </li>
        `;

    })
    ulMensajes.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    
    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;

    if( keyCode !== 13 ){ return; }
    if ( mensaje.length === 0 || mensaje.trim()==='' ){ return; }

  
    socket.emit('enviar-mensaje', { mensaje, uid } );
    txtMensaje.value = '';


})


const main = async() => {

    await validarJWT();

}

main();

