import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro'
import { buildFederatedSchema } from '@apollo/federation'

const products = {
    'aaa': {
        id: 'aaa',
        name: 'Product AAA'
    },
    'bbb': {
        id: 'bbb',
        name: 'Product BBB'
    },
}

const typeDefs = gql`
    type Product @key(fields: "id") {
        id: ID!
        name: String
    }

    extend type Query {
        getProduct (id: String!): Product
        getProducts: [Product]
    }
`

const resolvers = {
    Product: {
        __resolveReference(object) {
            return products[object.id];
        }
    },
    Query: {
        getProduct(parent, args, context) {
            if (!args.id) {
                throw new Error('id is required')
            }
            return products[args.id]
        },
        getProducts(parent, args, context) {
            return Object.values(products)
        }
    }
}

const schema = buildFederatedSchema({ typeDefs, resolvers })

const apolloServer = new ApolloServer({
    schema,
    tracing: true,
    subscriptions: false
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apolloServer.createHandler({ path: '/api/products-gql' })
