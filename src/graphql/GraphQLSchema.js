import {makeExecutableSchema} from "graphql-tools";

import typeDefs from "./types";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({
    typeDefs: typeDefs, 
    resolvers: resolvers,
});

export default schema;