const { ApolloServer, gql } = require('apollo-server-micro');
const { RedisCache } = require( 'apollo-redis-cache');

const typeDefs = `
  type Movie {
    id: Int!
    title: String
  }

  type Query {
    movie: Movie
  }
`;
const resolvers = {
  Query: {
    movie: async (_source, { id }, { dataSources }) => {
      return dataSources.moviesAPI.getMovie(id);
    },
  },
};

const { RESTDataSource } = require('apollo-datasource-rest');

class MoviesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://movies-api.example.com/';
  }

  async getMovie(id) {
    return this.get(`movies/${id}`);
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: new RedisCache({
    host: '127.0.0.1',
    port: '6379',
    maxRetriesPerRequest: 3,
  }),
  dataSources: () => ({
    moviesAPI: new MoviesAPI(),
  }),
});
