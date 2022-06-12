const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '/',
    port: process.env.PORT,
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        // peers[call.peer] = call //extra FYI comment
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        setTimeout( () => {
        connectToNewUser(userId, stream)
        }, 1000)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id) //userId is hardcoded for now
})

socket.on('user-disconnected', userId => {
    console.log('User connected: ' + userId)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

// socket.on('user-connected', userId => {
//     console.log('User-connected: ' + userId)
// })

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

let statement = document.querySelector(".pop--statement");
let statementTimer = document.querySelector(".pop__text__timer--statement")
let opinion = document.querySelector(".pop--opinion");
let sent = document.querySelector(".pop--sended");
let opinionTimer = document.querySelector(".pop__text__timer--opinion")
let opinionWaitTimer = document.querySelector(".pop__text__timer--opinion--wait");
let others = document.querySelector(".pop--others");
let othersTimer = document.querySelector(".pop__text__timer--others")
let othersWaitTimer = document.querySelector(".pop__text__timer--others--wait");
let votedStatement = document.querySelector(".pop--givenStatement");
let votedStatementTimer = document.querySelector(".pop__text__timer--statement");
let popbtn = document.querySelectorAll(".pop__btn");

let popup;
let n = 1;



//after 6 minutes first statement
setTimeout(() => {
    document.querySelector('#popup').style.background = 'rgba(0, 0, 0, 0.5)';
    statement.style.display = "inline-block";
    popup = statement;
    startTimer(5, statementTimer, popup)
}, 1000*2*n+1500);

//after 12 minutes give opinion
setTimeout(() => {
    document.querySelector('#popup').style.background = 'rgba(0, 0, 0, 0.5)';
    opinion.style.display = "inline-block";
    popup = opinion;
    startTimer(15, opinionTimer, popup);
}, 1000*10*n+1500);

//after time to wright opinion, show others opinions
setTimeout(() => {
    document.querySelector('#popup').style.background = 'rgba(0, 0, 0, 0.5)';
    others.style.display = "inline-block";
    popup = others;
    startTimer(10, othersTimer, popup);
}, 1000*28*n+1500);

//show most voted statement
setTimeout(() => {
    document.querySelector('#popup').style.background = 'rgba(0, 0, 0, 0.5)';
    votedStatement.style.display = "inline-block";
    popup = votedStatement;
    startTimer(10, votedStatementTimer, popup);
}, 1000*40*n+1500);

function startTimer(duration, display, popup){
    console.log(duration);
    let timeleft = 0;
    var timer = setInterval(function(){ 
        console.log("ok")
        display.innerHTML = duration - timeleft;
        timeleft += 1;
        var max = duration + duration/10;
        if(timeleft >= max){
            popup.style.display = "none";
            clearInterval(timer);
            document.querySelector('#popup').style.background = 'none';
            sent.style.display = "none";

        }
    }, 1000)
}


function runclicked (e) {
    e.preventDefault();
    document.querySelector('#popup').style.background = 'rgba(0, 0, 0, 0.5)';
    opinion.style.display = "none";
    others.style.display = "none";
    sent.style.display = "inline-block";
    popup = opinion;
    startTimer(9, opinionWaitTimer, popup);


    
};
