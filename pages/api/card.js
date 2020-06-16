// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import redis from 'redis'
import { promisify } from 'util'
import { v4 as uuidv4 } from 'uuid';

const client = redis.createClient();
client.on("error", function(error) {
  console.error(error);
});

const randomkeyAsync = promisify(client.randomkey).bind(client)
const dbsizeAsync = promisify(client.dbsize).bind(client)
const getAsync = promisify(client.get).bind(client)
const authAsync = promisify(client.auth).bind(client)


export default async (req, res) => {
  if(req.method === 'GET') {
    if(process.env.REDIS_AUTH_REQ !== 'false') {
      const auth = await authAsync(process.env.REDIS_AUTH)
    }
    const randomkey = await randomkeyAsync()
    const value = await getAsync(randomkey)
    const remainingCards = await dbsizeAsync()

    client.del(randomkey, (redis_err, redis_res) => {
      if (redis_err) {
        console.error(`Error deleting card with id ${randomkey}, value ${value}`)
      } else {
        console.log(`Deleted card id ${randomkey} with value ${value}:: ${redis_res}`)
      }
    })
    
    res.status(200).json({ 
      card: { text: value },
      remainingCards
    })
  } else if(req.method === 'POST') {
    const newCardValue = JSON.parse(req.body).newCard

    if(process.env.REDIS_AUTH_REQ !== 'false') {
      const auth = await authAsync(process.env.REDIS_AUTH)
    }

    client.set(uuidv4(), newCardValue, (redis_err, redis_res) => {
      if(redis_err) {
        console.error(`Error submitting value ${newCardValue}`)
        console.error(redis_err)
        res.status(500).json({ status: 'failed'})
      } else {
        console.log(`Added card ${newCardValue}`)
        res.status(200).json({ submitted: redis_res })
      }
    })
  }
}
