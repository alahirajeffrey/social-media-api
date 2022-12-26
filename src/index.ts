import server from "./server";

const port: number = Number(process.env.PORT) || 5000;

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
