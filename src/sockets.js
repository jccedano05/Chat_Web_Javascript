module.exports = function(io){
    
let users = {};

io.on('connection', socket => {

  


    socket.on('new user', (data, cb) => {
        if(data in users) {  //si el dato esta en usuario
            cb(false);
        }else{
            cb(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
     
        }
    });

    socket.on('send message', (data, cb) =>{  //escuchamos la peticion 'send message' creada en el main y guardamos el valor que tenia en data
      
        let msg = data.trim(); //quitamos espaciados de mas
    
        if(msg.substr(0,3) === '/p '){ //si las primeros 3 caracteres son iguales       "/p luis   hola luis"
            msg = msg.substr(3);        //cortamos el msg para que cuente a partir del 3er caracter  "luis   hola luis"
            const index =  msg.indexOf(' ');   //buscamos el siguente espacio en blanco
            if(index !== -1){
               let name =  msg.substring(0,index); //obtenemos el nombre desde el principio hasta donde tenga el espaciado del texto
               msg = msg.substring(index + 1); // y lo cortamos para que quede solo el nombre

               if(name in users){
                   users[name].emit('privateMsg', {  //si el usuario esta en el objeto enviamos un msj a un solo socket (que colocamos en name)
                       msg,
                       nick: socket.nickname
                   })
                   users[socket.nickname].emit('privateMsg', {  //si el usuario esta en el objeto enviamos un msj a un solo socket (que colocamos en name)
                    msg,
                    nick: socket.nickname
                })
               } else {
                cb('Error! Please enter a valid User.')
               }
            } else {
                cb('Error! Please enter your message')
            }
        }else{  //si no es privado manda en publico
            io.sockets.emit('new message', {
            msg: data,
            nick: socket.nickname
            });  //nos retrasmite a todos los usuarios que estan conectado al servidor (emit)
        }
    });


    socket.on('disconnect', data => {

        if(!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
       
    })

    function updateNicknames() {
        io.sockets.emit('usernames', Object.keys(users));
        

    }

   


})
}