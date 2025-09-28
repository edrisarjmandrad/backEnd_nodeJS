//#region packages
import http from "http";
import dotenv from "dotenv";
import app from "../app.js"; // Adjust the path if your app file is named differently


dotenv.config();
const port = normalizePort(process.env.PORT || "8080");
app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}