
import {createClient} from 'redis'

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

export const redis = createClient({url :redisUrl});

redis.on("connect",()=>{
     console.log("Redis client connected");
})
redis.on("ready",()=>{
     console.log("Redis client ready");
})
redis.on("error",(err)=>{
     console.log("Redis client error",err);
})
redis.on("error",()=>{
     console.log("Redis client connection closed");
})

export async function connectRedis():Promise<void>{
if(!redis.isOpen){
     await redis.connect();
}
const pong = await redis.ping();
console.log("Redis ping response ",pong)
}

export async function disConnectRedis():Promise<void>{
if(redis.isOpen){
     await redis.quit();
}
}
