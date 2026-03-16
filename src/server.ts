// import app from './app';
// import { Server } from 'http';
// import config from './app/config';
import app from './app';
import config from './app/config';
import { seedSuperAdmin } from './seedSuperAdmin';

import { Server } from "http";

// let server: Server;

// const main = async () => {
//   try {
//     // Seed Super Admin
// await seedSuperAdmin();

//     server = app.listen(config.port, () => {
//       // use structured logger
//       const url = `http://${config.host}:${config.port}`;

//       console
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// main();

// // Graceful shutdown handling
// const shutdown = () => {
//   console.log('🛑 Shutting down servers...');

//   if (server) {
//     server.close(() => {
//       console.log('Servers closed');
//       process.exit(0);
//     });
//   } else {
//     process.exit(0);
//   }
// };

// process.on('unhandledRejection', (reason) => {
//   console.error(`❌ unhandledRejection is detected, shutting down...`, reason);
//   shutdown();
// });

// process.on('uncaughtException', (err) => {
//   console.error(`❌ uncaughtException is detected, shutting down...`, err);
//   shutdown();
// });

let server: Server;

async function main() {
  server = app.listen(config.port, async () => {
    await seedSuperAdmin();
    console.log("Sever is running on port ", config.port);
  });
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };
  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}

main();
