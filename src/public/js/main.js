$(function(){   //$ es un selector de jQuery
   
    const socket = io();  //corremos el archivo js de web sockets que hace la conexion en tiempo real

    //Obtaining DOM elements from the interface

   const $messageForm = $('#message-form'); //manera de obtener desde jQuery, no es necesario asignarlo en la constante, pero lo hago para saber que trae jQuery
   const $messageBox = $('#message'); 
   const $chat = $('#chat'); 

    //Obtaining DOM elements from the NickName Form

       const $nickForm = $('#nickForm'); //manera de obtener desde jQuery, no es necesario asignarlo en la constante, pero lo hago para saber que trae jQuery
       const $nickError = $('#nickError'); 
       const $nickname = $('#nickname'); 

       const $users = $('#usernames');
       const $totalUsers = $('#totalUsers'); 

       $nickForm.submit(e => {
           e.preventDefault();
           socket.emit('new user', $nickname.val(), data => { //data seria un callback
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
                modifyUsersTotal();
            }else{
                $nickError.html(`<div class="alert alert-danger">
                That username already exist in the chat.
                </div>`)
                
            }
            $nickname.val('');
           });
       })


   //events
   $messageForm.submit( e => {  //manera de crear el evento al hacer submit
    e.preventDefault(); //quitar valores por defecto del submit (de refrescar pantalla)
    socket.emit('send message',$messageBox.val(), data => {  //creamos un callback por si hay errores
        $chat.append(`<p class="error">${data}</p>`)
    }); //mandamos como evento 'send message' lo que tenemos en messageBox.val()
    $messageBox.val(''); //limpiamos el input text
   })

   socket.on('new message', function (data){  //al recibir el evento new message creamos en el card-body (del index.html) lo que tenemos en data
       $chat.append(`<b>${data.nick}:</b> ${data.msg} <br>`);  //append crea un nuevo segmento que en esta caso es texto y despues damos un salto 
   });


   socket.on('privateMsg', function (data){  //al recibir el evento new message creamos en el card-body (del index.html) lo que tenemos en data
    $chat.append(`<p class="privateMsg"><b>${data.nick} (private):</b> ${data.msg}</p>`);  //append crea un nuevo segmento que en esta caso es texto y despues damos un salto 
});

   //Recepcion del evento USERNAMES para listar en usuarios (la lista de gente online)
   socket.on('usernames', (data) => {
       let html ='';
       for (let i = 0; i < data.length; i++) {
          
            html += `<p><i class="fas fa-user"></i>  ${data[i]}</p>`
           
       }
       $totalUsers.html(`<h3>Users (${data.length})</h3>`)
       $users.html(html)
   });

   


});