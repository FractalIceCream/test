const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (parent, { user = null, params }) => {
            return User.findOne({
                $or: [
                    { _id: user ? user._id : params.id },
                    { username: params.username },
                ],
            });
        },
    },

    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            // console.log(email);

            // (parent, { email, password }) => {
            const user = await User.findOne({ email });
             // $or: [{ username, email }],

            if (!user) throw AuthenticationError;

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) throw AuthenticationError;

            const token = signToken(user);
            return { token, user };
        },
        addBook: async (parent, { book }, context) => {
            console.log(context.user);

            if (!context.user) {
                return User.fineOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book } },
                    { runValidators: true, new: true }
                );
            }
            throw AuthenticationError;
        },
        // removeUser: async (parent, { userId }, context) => {
        //     return User.findOneAndDelete({ _id: userId });
        // },
        removeBook: async (parent, { book }, context) => {
            console.log(context.user);
            if (!context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: book } },
                    { new: true }
                );
            }
            throw AuthenticationError;
        },
    },
};

module.exports = resolvers;