const redis = require("redis");

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const redisClient = redis.createClient(redisPort, redisHost);

const rateLimitWindowMs = 60000;
const rateLimitWindowMaxReqs = 5;
const refreshRate = rateLimitWindowMaxReqs / rateLimitWindowMs;

const getTokenBucket = ip => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(ip, (err, tokenBucket) => {
      if (err) reject(err);
      if (tokenBucket) {
        tokenBucket.tokens = parseFloat(tokenBucket.tokens);
      } else {
        tokenBucket = {
          tokens: rateLimitWindowMaxReqs,
          last: Date.now()
        };
      }
      resolve(tokenBucket);
    });
  });
};

const saveTokenBucket = (ip, bucket) => {
  return new Promise((resolve, reject) => {
    redisClient.hmset(ip, bucket, (err, resp) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};
rateLimit = async (req, res, next) => {
  let bucket;
  try {
    bucket = await getTokenBucket(req.ip);
  } catch (err) {
    next();
    return;
  }

  console.log(bucket)

  const timestamp = Date.now();
  const elapsedMs = timestamp - bucket.last;
  bucket.tokens += elapsedMs * refreshRate;
  bucket.tokens = Math.min(rateLimitWindowMaxReqs, bucket.tokens);
  bucket.last = Date.now();

  if (bucket.tokens > 1) {
    bucket.tokens -= 1;
    await saveTokenBucket(req.ip, bucket);
    next()
  } else {
    await saveTokenBucket(req.ip, bucket);
    res.status(429).send({ error: "too many requests" });
  }
};

module.exports = rateLimit;
