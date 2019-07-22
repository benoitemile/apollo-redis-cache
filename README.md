# apollo-redis-cache

This package is a fork of [Apollo Server Cache Redis](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-cache-redis) but written in javascript and with the goal of having the Apollo Server always up even if Redis server is down.

## RedisCache

This package exports an implementation of `KeyValueCache` that allows using Redis as a backing store for resource caching in [Data Sources](https://www.apollographql.com/docs/apollo-server/v2/features/data-sources.html).

It currently supports a single instance of Redis.

## Usage

### Single instance

```js
import { RedisCache } from 'apollo-redis-cache';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: new RedisCache({
    host: 'redis-server',
    // Options are passed through to the Redis client
  }),
  dataSources: () => ({
    moviesAPI: new MoviesAPI(),
  }),
});
```

For documentation of the options you can pass to the underlying redis client, look [here](https://github.com/luin/ioredis).
