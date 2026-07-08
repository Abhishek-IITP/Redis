import { log } from 'console';
import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();
const redisUrl = process.env.REDIS_URL;

const redis = createClient({url: redisUrl});

//cache key there

const cacheKey = "demo:products"
const cachleTtlSeconds = 60 // cache will expire after 60 seconds


let products = ["keyboard","mouse", "webcam","laptop"];

async function run() {
     await redis.connect();

     let cached = await redis.get(cacheKey);

     if(cached){
          console.log("Cache HIT");
          console.log("Data",JSON.parse(cached));
     }else{
          console.log("cache MISS")
          const items = products;

          // set/save the products in redis cache
          // setEx = also saves ttl so that your cache doesn't live forever

          await redis.setEx(cacheKey,cachleTtlSeconds,JSON.stringify(items))

     }
     //stale cache problem 
     products = ["keyboard","mouse", "webcam","laptop","dekstop"];
     console.log(products);

     cached = await redis.get(cacheKey);
     console.log("cached data",JSON.parse(cached!));


     //Cache invalidation
     //when DB changes - delete your old cacahe immedietaly

     await redis.del(cacheKey);
     console.log("cached deleted");

     cached= await redis.get(cacheKey)
     if(!cached){
          console.log("Cached data after delete");
          // dat from ur db changes 
          const freshProducts = products
          await redis.setEx(cacheKey,cachleTtlSeconds,JSON.stringify(freshProducts))
          console.log("Fresh data", freshProducts);
     }
     await redis.quit();
}


run().catch((err)=>{
     console.log(err);
     process.exit(1);
})