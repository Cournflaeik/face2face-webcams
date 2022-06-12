//very basic code for getting our server running
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
// const connection = mysql.createConnection(
//     {host: "localhost", user: "root", password: "", database: "face2face", port: 3306})

//     connection.connect();
    // connection.query


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/css' , express.static(__dirname + 'public/css'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/test', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    console.log('1');
    socket.on('join-room', (roomId, userId) => {
        console.log('2');

        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(process.env.PORT)