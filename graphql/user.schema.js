import { gql } from "apollo-server-express";
import UserModel from "../models/user.model.js";


export const userTypeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        username: String
        surname: String
        phone: String
    }
    
    type Query {
        # Obtener todos los usuarios
        users: [User!]!
        
        # Obtener un usuario por ID
        user(id: ID!): User
    }

    type Mutation {
        # Crear un usuario
        createUser(
            name: String!
            email: String!
        ): User!

        # Actualizar un usuario
        updateUser(
            id: ID!
            name: String
            email: String
        ): User!

        # Eliminar un usuario
        deleteUser(id: ID!): Boolean!
    }
`;

export const userResolvers = {
    Query: {
        users: async () => {
            return UserModel.getUsers();
        },

        user: async (_, { id }) => {
            return UserModel.getUserById(id);
        },
    },

};