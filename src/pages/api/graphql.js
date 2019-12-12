import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro'
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'products', url: 'http://localhost:3000/api/products-gql' },
        { name: 'reviews', url: 'http://localhost:3000/api/reviews-gql' }
    ],
    debug: true
})

const apolloServer = new ApolloServer({
    gateway,
    tracing: true,
    debug: true,
    subscriptions: false
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apolloServer.createHandler({ path: '/api/graphql' })
