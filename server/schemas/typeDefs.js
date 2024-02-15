const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        password: String
        savedBooks: [String]!
    },

    type Auth {
        token: ID!
        user: User
    },

    type Query {
        users: [User]!
        user(userId: ID!): User
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth

        addBook(userId: ID!, book: String!): User
        #removeUser(userId: ID!): User
        removeBook(userId: ID!, book: String!): User
    }
`;

module.exports = typeDefs;