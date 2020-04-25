import User from "../../models/User";
import bcrypt from "bcrypt";
import jsonwebtoken, { JsonWebTokenError } from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

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
        addUser: async (root, {firstName, lastName, email, userType, password}) => {
            const newUser = await new User({
                firstName,
                lastName,
                email,
                userType,
                password: await bcrypt.hash(password, 10),
            });

            if(!newUser) {
                throw new Error(`Cannot create user ${email}`);
            }

            let savedUser = null;

            try {
                savedUser = await newUser.save();
            } catch(e) {
                console.log("something went wrong");
            }

            return JsonWebTokenError.toString(
                {
                    _id: newUser._id,
                    email: newUser.email,
                }, 
                prosess.env.JWT_SECRET, 
                {
                    expiresIn: '1d',
                }
            );
        },

        login: async (root, {email, password}) => {
            const user = await User.findOne({email});
            
            if(!user) {
                throw new Error(`Cannot find user with email: ${email}`);
            }

            const valid = await bcrypt.compare(password, user.password);

            if(!valid) {
                throw new Error(`Cannot match password for email: ${email}`);
            }

            return JsonWebTokenError.toString(
                {
                    _id: user._id,
                    email: user.email,
                }, 
                prosess.env.JWT_SECRET, 
                {
                    expiresIn: '1d',
                }
            ); 
        },

        deleteUser: (root, {_id}) => {
            return new Promise((resolve, reject) => {
                User.findByIdAndRemove({_id}).exec((error, response) => {
                    error ? reject(error) : resolve(response);
                });
            });
        },

        editUser: async (root, {_id, username, email, password, games}) => {
            const data = {};

            if(username) data.username = username;
            if(email) data.email = email;
            if(password) data.password = password;
            if(games) data.games = games;

            // вариант с асинхронни функции (в този случай трябва и горната функция да е async)
            const response = await User.findByIdAndUpdate({_id}, data, {new: true}).exec();
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