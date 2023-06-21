const http=require('http');

const express=require('express');
const {Server}=require('socket.io');


const app=express();

const users={};

const server=http.createServer(app);



//!static folder
app.use(express.static('public'));


const io= new Server(server);

server.listen(3000,()=>{
    console.log('RUN SERVER');
})

// io.use((socket,next)=>{
//     if(socket.handshake.auth.token == 12345) next();
//     else console.log('user it not login');
// })

const chatNamespase = io.of('/chat');

chatNamespase.on('connection',(socket)=>{

    socket.on('login',(data)=>{
        socket.join(data.rumnum);

          users[socket.id]={
            nikname:data.nikname,
            rumnum:data.rumnum
        };
   
          chatNamespase.emit('online',users);
    })

    socket.on('disconnect',()=>{
      delete users[socket.id];
      chatNamespase.emit('online',users);
    });


    socket.on('inputemessage',(data)=>{
   
        chatNamespase.to(data.rumnum).emit('chatmessage',{data : data,id:socket.id,user:users});
      
    })

    socket.on('typing',(data)=>{
    
        socket.broadcast.in(data.rumnum).emit('typ',data);
    })

    socket.on('pvchat',(data)=>{
        chatNamespase.to(data.to).emit('pvchat',data)
    })

})