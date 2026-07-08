// Publish and Subscribe
// Publisher sends a message
// Subscriber listens and recives the messages
// channel is the topic name both side use
import dotenv from 'dotenv';

import {createClient} from 'redis' 

dotenv.config();

const redisUrl = process.env.REDIS_URL;

const redis = createClient({url: redisUrl});

const channel = "demo:notification";

async function run(){
     // need two clients
     //one client will be publisher and second one subscriber

     const publisher = createClient({ url: redisUrl });
const subscriber = createClient({ url: redisUrl });

     await publisher.connect();
     await subscriber.connect();

     console.log('publisher connected');
     console.log('subsriber connected');
     console.log("ping ->", await publisher.ping());
     console.log("ping ->", await subscriber.ping());


     //subscriber must be active before publish

     await subscriber.subscribe(channel,(message)=>{
          const data = JSON.parse(message);

          console.log("subscriber received");
          console.log("title", data.title);
          console.log("message",data.message);
          
     })
     console.log("subscribed to channel", channel);
     
     console.log('publisher is now sending event');

     const evnet = {
          title: "AgentBench is live",
          message: "Do check the offical website"
     }

     const recivers = await publisher.publish(channel,JSON.stringify(evnet));
     console.log('published event');
     console.log("active subscribers", recivers);

     await new Promise((resolve)=> setTimeout(resolve,3000))
      await subscriber.unsubscribe(channel);
      await subscriber.quit();
      await publisher.quit();
     

      console.log("Pub/Sub demo done");

     //  await redis.quit();
}

run().catch((err)=>{
     console.log(err);
     process.exit(1);
     
})
