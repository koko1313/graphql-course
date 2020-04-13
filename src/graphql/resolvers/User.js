import User from "../../models/User";

export default {
    Query: {
        user: (root, args) => {
            return new Promise((resolve, reject) => {
                User.findOne(args).exec((error, response) => {
                    error ? reject(error) : resolve(response);
                });
            });
        },
        users: () => {
            return new Promise((resolve, reject) => {
                User.find({}).populate().exec((error, response) => {
                    error ? reject(error) : resolve(response);
                });
            });
        }
    },
    Mutation: {
        addUser: (root, {username, email, password}) => {
            const newUser = new User({username, email, password});
            return new Promise((resolve, reject) => {
                newUser.save((error, response) => {
                    console.log(response);
                    error ? reject(error) : resolve(response);
                });
            });
        },
        deleteUser: (root, {_id}) => {
            return new Promise((resolve, reject) => {
                User.findByIdAndRemove({_id}).exec((error, response) => {
                    error ? reject(error) : resolve(response);
                });
            });
        },
        editUser: async (root, {_id, username, email, password, games}) => {
            // вариант с асинхронни функции (в този случай трябва и горната функция да е async)
            const response = await User.findByIdAndUpdate({_id}, {username, email, password, games}, {new: true}).exec();
            if(!response) {
                throw new Error(`Connot save user: ${_id}`);
            }
            return response;

            // вариант с promises
            // return new Promise((resolve, reject) => {
            //     User.findByIdAndUpdate({_id}, {$set: {username, email, password}}, {new: true}).exec((error, response) => {
            //         error ? reject(error) : resolve(response);
            //     });
            // });
        }
    }
}