// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import redis from 'redis'
import { promisify } from 'util'

const client = redis.createClient();
client.on("error", function(error) {
  console.error(error);
});

const dbsizeAsync = promisify(client.dbsize).bind(client)
const authAsync = promisify(client.auth).bind(client)

export default async (req, res) => {
  process.env.REDIS_AUTH_REQ !== 'false' && await authAsync(process.env.REDIS_AUTH)
  console.log('Received req for card count')
  if(req.method === 'GET') {
    const remainingCards = await dbsizeAsync()
    
    res.status(200).json({
      remainingCards
    })
  }
}
