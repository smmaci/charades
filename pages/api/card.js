// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import redis from 'redis'
import { promisify } from 'util'
import { v4 as uuidv4 } from 'uuid';

const client = redis.createClient();
client.on("error", function(error) {
  console.error(error);
});

const randomkeyAsync = promisify(client.randomkey).bind(client)
const getAsync = promisify(client.get).bind(client)


export default async (req, res) => {
  //TODO: Handle GET/POST
  if(req.method === 'GET') {
    const randomkey = await randomkeyAsync()
    const value = await getAsync(randomkey)
    client.del(randomkey, (redis_err, redis_res) => {
      if (redis_err) {
        console.error(`Error deleting card with id ${randomkey}, value ${value}`)
      } else {
        console.log(`Deleted card id ${randomkey} with value ${value}:: ${redis_res}`)
      }
    })
    
    res.status(200).json({ card: { text: value } })
  } else if(req.method === 'POST') {
    // console.log(typeof req.body)
    const newCardValue = JSON.parse(req.body).newCard
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
