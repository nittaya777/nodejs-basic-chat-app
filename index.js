const { log } = require("console");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = socketIO(server);

const PORT = 5000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//รอการ connect จาก client โดยเรียก method on connect
io.on("connect", (socket) => {
  socket.on("newuser", (name) => {
    let newUser = name;
    console.log(`${newUser} connected`);
    //เมื่อ client ตัดการเชื่อมต่อแล้ว
    socket.on("disconnect", () => {
      console.log(`${newUser} disconnected`);
      io.emit("disconnected", `${newUser} disconnected`);
    });
  });
  //ถ้ามีการพิมพ์ข้อความมา
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  //method emit คือ ใช้สำหรับส่งข้อมูลไปยัง client ต่างๆ ที่กำลังเชื่อมต่ออยู่
});

server.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});
