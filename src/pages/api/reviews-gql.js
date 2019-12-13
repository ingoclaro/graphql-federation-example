import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro'
import { buildFederatedSchema } from '@apollo/federation'

const reviewsByProduct = {
    'aaa': [
        {
            score: 4,
            description: 'great product!',
            product: {
                id: 'aaa'
            }
        },
        {
            score: 1,
            description: 'worst thing ever',
            product: {
                id: 'aaa'
            }
        }
    ],
    'bbb': [
        {
            score: 4,
            description: 'love how B works!!1',
            product: {
                id: 'bbb'
            }
        },
        {
            score: 5,
            description: 'would recommend',
            product: {
                id: 'bbb'
            }
        }
    ]
}

const typeDefs = gql`
    type Review {
        score: Int
        description: String
        product: Product
    }

    extend type Product @key(fields: "id") {
        id: ID! @external
        reviews: [Review]
    }

    type Query {
        getReviews(productId: String!): [Review]
    }
`

const resolvers = {
    Query: {
        getReviews(parent, args, context) {
            if (!args.productId) {
                throw new Error('productId is required')
            }
            return reviewsByProduct[args.productId]
        },
    },
    Product: {
        reviews(product) {
            return reviewsByProduct[product.id]
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

export default apolloServer.createHandler({ path: '/api/reviews-gql' })
