const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

redisClient.on("ready", () => {
  console.log('redis have ready !')
 })
 
redisClient.on("connect", () => {
  console.log('connect redis success !')
 })

redisClient.on("error", function(error) {
  console.error(error);
});

const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
  console.log(message)
});
sub.subscribe('insert');
