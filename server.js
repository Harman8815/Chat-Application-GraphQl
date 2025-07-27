import { apolloServer, gql } from 'apollo-server';
const server = apolloServer({ typedef, resolver });
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
}).catch(error => {
    console.error('Error starting server:', error);
});