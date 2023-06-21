// const socket = io(
//   {
//     auth: {
//       token : 12345,
//     }
// }
// );

const Socket =io();
const chatNamespase=io('/chat')

//!Query DOM

const chatform = document.getElementById('chatform');
const inputmessage = document.getElementById('inputmessage');
const chatbox = document.getElementById('chatbox');
const chatbox1 = document.getElementById('chatbox1');
const feedback = document.getElementById('feedback');
const onlineuser = document.getElementById('onlineuser');
const chatconntiner = document.getElementById('chatconntiner');
const singout = document.getElementById('singout');
const pvchatinput = document.getElementById('pvchatinput');
const pvchatform = document.getElementById('pvchatform');
const pvmessage = document.getElementById('pvmessage');
const modalTitle = document.getElementById('modalTitle');
const titleroom = document.getElementById('titleroom');
const fullname = document.getElementById('fullname');


const nikname=localStorage.getItem('nikname');

const rumnum=localStorage.getItem('rumnum');
let socketId;

//!emit event

chatNamespase.emit('login',{nikname,rumnum})


chatform.addEventListener('submit', (e) => {

    e.preventDefault();

    if (inputmessage.value) {
        chatNamespase.emit('inputemessage', {
            message: inputmessage.value,
            id:chatNamespase.id,
            rumnum
        });
        inputmessage.value = '';
    }
});

inputmessage.addEventListener('keypress',()=>{
    chatNamespase.emit('typing',{name:nikname,rumnum:rumnum});
})

pvchatform.addEventListener('submit',(e)=>{
       e.preventDefault();
       chatNamespase.emit("pvchat",{
        message:pvchatinput.value,
        name:nikname,
        to:socketId,
        from:chatNamespase.id,
       })


  pvchatinput.value='';
  $('#pvchat').modal('hide');
  $('.modal-backdrop').remove();
})


//!lisenetr
fullname.innerHTML=nikname
chatNamespase.on('chatmessage', (data) => {
   const time=new Date();
   const timechat=`${time.getHours()}:${time.getMinutes()}`
   
    feedback.innerHTML='';


   if(data.id == chatNamespase.id){
    chatbox.innerHTML += `
    <div class="col-sm-12 message-main-sender">
    <div class="sender">
     
  
    <span  style="color:#fdfdfd85">you </span>
    <div class="message-text">
     ${data.data.message}
    </div>
    <span class="message-time pull-right">
     ${timechat}
    </span>
    </div>
    </div>
    `

   }else{
  

    const namee=data.user[data.id].nikname;
  
    chatbox.innerHTML += `
    <div class="col-sm-12 message-main-receiver">
              <div class="receiver">
                <span style="color:#ce0879">${namee} </span>
                <div class="message-text">
                ${data.data.message}
                </div>
                <span class="message-time pull-right ">
                 ${timechat}
                </span>
              </div>
            </div>
    `
   }


  chatconntiner.scrollTop = chatconntiner.scrollHeight - chatconntiner.clientHeight;
    
})

chatNamespase.on('typ',(data)=>{
   if(rumnum === data.rumnum){
    feedback.innerHTML =`
    <p> ${data.name} is typing... </p>
    `}
});


chatNamespase.on('online',(users)=>{

  
  onlineuser.innerHTML="";

for(const socketId in users){
  if(rumnum === users[socketId].rumnum){
  onlineuser.innerHTML += `
  <button type="button" class="btn btn-primary useron btnuser" data-toggle="modal" data-target="#pvchat" data-id=${socketId} data-client=${users[socketId].nikname}
   ${users[socketId].nikname === nikname ? "disabled" : ""}>
  <div class="row sideBar-body ">
  <div class="col-sm-3 col-xs-3 sideBar-avatar">
    <div class="avatar-icon">
        <img src="images/picpro.jpg">
    </div>
  </div>
  <div class="col-sm-9 col-xs-9 sideBar-main">
    <div class="row">
      <div class="col-sm-8 col-xs-8 sideBar-name">
        <span class="name-meta">${users[socketId].nikname}
      </span>
      </div>
      <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
        <span class="time-meta text-success pull-right">online
      </span>
      </div>
    </div>
  </div>
</div>
</button>
  
  
  
  `
}

}



})


singout.addEventListener('click',()=>{

  window.location.replace('/index.html')
  chatNamespase.emit("disconnect",chatNamespase.id);
 

});



chatNamespase.on('pvchat',(data)=>{
  $("#pvchat").modal("show");

   socketId=data.from;
   modalTitle.innerHTML = "Recive Message from : "+data.name;
   pvmessage.style.display="block";
   pvmessage.innerHTML= data.message;  

});


  

titleroom.innerHTML = `
<p class="heading-name-meta"> ${
  rumnum
}
</p>
` ;

//!Jquery
$('#pvchat').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var user = button.data('client') // Extract info from data-* attributes
  socketId=button.data('id')


  modalTitle.innerHTML = "Sent Message To : "+ user;
  pvmessage.style.display='none';
})