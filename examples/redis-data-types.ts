
import dotenv from 'dotenv';

import { createClient } from 'redis';


dotenv.config();

const redisUrl = process.env.REDIS_URL;

const redis = createClient({url: redisUrl});

// async function stopWatch(){
//    await redis.connect();

//    const timer = "stopwatch:seconds";

//    await redis.set(timer, Date.now().toString());

//    const interval = setInterval(async()=>{
//        const start = Number(await redis.get(timer));
//       const elapsed = Math.floor((Date.now() - start) / 1000);

//       console.clear();
//       console.log(`⏱️" ${elapsed} sec`);

//       if(elapsed === 10){
//          clearInterval(interval);
//          await redis.quit();
//       }
//    },1000)
// }

// stopWatch().catch((err)=>{
//    console.log(err);
//    process.exit(1);
// })

async function run() {
     await redis.connect();
     console.log("connected to redis");
     console.log("ping", await redis.ping());


     const stringKey = "demo:page_views";

     await redis.set(stringKey,"100");

     const pageViews= await redis.get(stringKey);
     console.log(pageViews);

     //redis strigns can also work like counters

     const afterIncr = await redis.incr(stringKey);
     console.log(afterIncr)


     //hash
     //stores many small fields under one key- small object or map inside redis

     const hashKey = "demo:user:profile";
      await redis.hSet(hashKey,{
      name:"Abhi",
      city:"Jamshedpur"
     })
     const {name,city} = await redis.hGetAll(hashKey);
     console.log(name);
     console.log(city);


     //list
     //redis list ordered collection of values 

     const listKey = "run:messages";

await redis.del(listKey);

await redis.lPush(listKey, "Hello");
await redis.lPush(listKey, "How are you");

const messages = await redis.lRange(listKey, 0, -1);

console.log(messages);

//lPush = add a new item at beginning
//lrange=  reads items from the list
//rPush = add a new item at end
//ltrim = keep only part of the list 


//set
//set stores unique sets of values only

const setKey = "run:set";

await redis.sAdd(setKey,"Node.Js")
await redis.sAdd(setKey,"React.Js")
await redis.sAdd(setKey,"Next Js")
await redis.sAdd(setKey,"Node.Js")

const setData = await redis.sCard(setKey);

console.log("no of element in the set:",setData)

const rankKey= "run:leaderboard";

await redis.zAdd(rankKey,{score:100,value:"Player_1"})
await redis.zAdd(rankKey,{score:50,value:"Player_6"})
await redis.zAdd(rankKey,{score:80,value:"Player_5"})
await redis.zAdd(rankKey,{score:90,value:"Player_2"})

const newScore = await redis.zIncrBy(rankKey,43,"Player_6");

console.log(newScore)
const rank = await redis.zRevRank(rankKey,"Player_2");
console.log(rank)
// 0-> consider as the top rank or rank-1


//ttl / expiry
// time to live

// it tells redis how long a key should exists before being deleted automatically
// key-a
// value:'435
// ttl : 300 second
// after 5 mint redis is going to delete this key automatically

const otpKey = "run:otp";
await redis.set(otpKey,
   "328476"
)
await redis.expire(otpKey,60);

const ttl = await redis.ttl(otpKey);
console.log(ttl)

// async function isOptValid() {

//    const key = Number("328476");
//    const otp = Number(await redis.get(otpKey));
//    if (otp === null) {
//     console.log("OTP has expired.");
//     return;
//   }
//    if(key === otp){
//       console.log("Otp validate successfully")
//    }else{
//       console.log("Invalid OTP");
//    }   
// }
// await isOptValid();

await redis.quit();
}

// async function test(){

//    await redis.connect()
   
   
//    const nums = "test:page_view";
//    await redis.set(nums,"10");
   
//    const interval = setInterval(async()=>{
//      try {

//       const decCounter = await redis.decr(nums);
//       console.log(decCounter);
      
//       if(decCounter === 0){
//          clearInterval(interval);
//          await redis.quit();
//       }
    
//    } catch (err) {
//       console.error(err);
//       clearInterval(interval);
//       await redis.quit();
//     }
   
//    },1000) 
// }

// test().catch((err)=>{
//    console.log("test failed",err);
//    process.exit(1);
// })



run().catch((error)=>{
   console.log("demo failed", error);
   process.exit(1);  
})