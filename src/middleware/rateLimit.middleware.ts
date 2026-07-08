import { error } from "console";
import { Request , Response ,NextFunction} from "express"; 
import { redis } from "../redis/client";

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 5;


export async function productRateLimiter(
     req: Request, res: Response, next: NextFunction
){
     try {

          // each ip will get its own counter in redis
          // rate_limit:products:127.0.5.5.
          // rate)limit:products:::1

          // lets say one user is crossing the limit - it will not going to block evey 
          // real prod pattern - behind a proxy or load balancer

          const ip = req.ip || 'unknown';

          const rateLimiterKey =`rate_limit:products:${ip}`

          const requestCount = await redis.incr(rateLimiterKey);

          //after 60 sec redis will delete this key start counting from fresh
          if( requestCount === 1){
               await redis.expire(rateLimiterKey, RATE_LIMIT_WINDOW_SECONDS);
          }

          res.setHeader('X-RateLimit-Limit',RATE_LIMIT_MAX_REQUESTS)
          res.setHeader('X-RateLimit-Remaining',Math.max(
               0, RATE_LIMIT_MAX_REQUESTS- requestCount
          ))

          if(requestCount> RATE_LIMIT_MAX_REQUESTS){
               return res.status(429).json({
                    success: false,
                    message: "Too many requests. Please try again later"
               })
          }
          next();
     } catch (err) {
          console.error("rate limit redis error", err);
          next(err)
     }
}
