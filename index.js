const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const gql = require("graphql-tag");


const { User } = require('./models')

const typeDefs = gql`

scalar Date

  type Query {
    getUsers:[User]
    getUser(id:ID!):User
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password:String!
  }

  type Mutation { 
    createUser(firstName:String! , lastName:String! , email:String! , password:String!):User
  }
  
`;

const resolvers = {
    Query: {
        getUsers: async ()=> {return await User.findAll()},
        getUser : async (parent, args) => { return await User.findByPk(args.id)}
    },
    Mutation:{
        createUser : async(parent , args) => {
            const user = await User.findOne({where: {email:args.email}});
            if(!user){

                return await User.create({
                    firstName:args.firstName,
                    lastName:args.lastName,
                    email:args.email,
                    password:args.password,
                    createdAt:new Date(),
                    updatedAt:new Date()
                })

            }else{
                return await User.findOne({where:{email:args.email}})
            }
            
        }
    }
};


const startServer = function () {

    const server = new ApolloServer({ typeDefs, resolvers });

    startStandaloneServer(server, {
        listen: { port: 4000 },
    }).then(({ url }) => {
        console.log(`Server ready at ${url}`);
    });

}

startServer()

