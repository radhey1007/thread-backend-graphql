import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors';
import bodyParser from 'body-parser';

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

 // Create GraphQL server
 const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        name:String
        say(name:String):String
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'Hi there, I am graphql test server',
        name: () => 'radhey',
        say: (_: any, { name }: { name: string }) => `Hey ${name}, how are you!`

      },
    },
  });
  // start graphql server
await gqlServer.start();

  // Middlewares
  app.use(cors());
  app.use(bodyParser.json());

  app.get("/", (req, res) => {
    res.json({ msg: "Server is up and running." });
  });

   // GraphQL endpoint with required context
   app.use(
    '/graphql',
    expressMiddleware(gqlServer, {})
  );

  // Root route
  app.get('/', (_req, res) => {
    res.json({ msg: 'Server is up and running.' });
  });

  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}

init();
