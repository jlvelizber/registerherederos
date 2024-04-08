// import http from "http";
// import cors from "cors";
// import app from "./app";
// import { Server } from "socket.io";

import App from "./app";

// const PORT = process.env.PORT || 3000;
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'https://localhost',
//     methods: ['GET', 'HEAD', 'POST'],
//   }
// });


// // Middleware de CORS
// app.use(cors());

// // Manejo de sockets
// io.on('connection', (socket) => {
//   console.log('Cliente conectado');

//   socket.on('qrRead', (data: string) => {
//     console.log('Datos recibidos desde el cliente:', data);
//     // Aquí puedes procesar los datos como desees

//     // Por ejemplo, emitir una respuesta al cliente
//     socket.emit('qrProcessed', 'Datos procesados exitosamente');
//   });

//   socket.on('disconnect', () => {
//     console.log('Cliente desconectado');
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

new App()