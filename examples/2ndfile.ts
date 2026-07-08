import dotenv from 'dotenv';

import {createClient} from 'redis' 

dotenv.config();

const redisUrl = process.env.REDIS_URL;

const redis = createClient({url: redisUrl});

const cacheKey = "demo:cache";

const cacheTTl = 60;

let product =['mobile','laptop','webcam','gopro'];

async function run(){
     await redis.connect();

     let cached  = await redis.get(cacheKey)

     if(cached){
          console.log("Hit");
          console.log("Cached data: ", JSON.parse(cached));
     }else{
          console.log("Miss");
          const item = product;
          await redis.setEx(cacheKey, cacheTTl,JSON.stringify(item))
     }

     
     product = ['mobile','laptop','webcam','go-pro','dekstop',"mic"];
     
     console.log("new product added: ",product);
     
     cached = await redis.get(cacheKey);
     console.log("cached data",JSON.parse(cached!));

     await redis.del(cacheKey);
     console.log("cached deleted");

     cached = await redis.get(cacheKey);
     
     if(!cached){
          console.log("Cached data after delete ");
          const freshProducts = product;

          await redis.setEx(cacheKey,cacheTTl, JSON.stringify(freshProducts))

          console.log("Fresh data", freshProducts);;
          
     }
     
     
     await redis.quit();
}


run().catch((err)=>{
     console.log(err);
     process.exit(1);
})















