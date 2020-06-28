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
const delAsync = promisify(client.del).bind(client)


export default async (req, res) => {
  process.env.REDIS_AUTH_REQ !== 'false' && await authAsync(process.env.REDIS_AUTH)
  
  if(req.method === 'GET') {
    const randomkey = await randomkeyAsync()
    const value = await getAsync(randomkey)
    const remainingCards = await dbsizeAsync()
    
    res.status(200).json({ 
      card: { text: value, id: randomkey },
      remainingCards
    })

  } else if(req.method === 'POST') {
    const newCardValue = JSON.parse(req.body).newCard

    client.set(uuidv4(), newCardValue, (redis_err, redis_res) => {
      if(redis_err) {
        console.error(`Error submitting value ${newCardValue}`)
        console.error(redis_err)
        res.status(500).json({ status: 'failed'})
      } else {
        console.log(`Added card ${newCardValue}`)
        res.status(202).json({ submitted: redis_res })
      }
    })

  } else if(req.method === 'DELETE') {
    const id = JSON.parse(req.body).id
    await delAsync(id)
    const remainingCards = await dbsizeAsync()

    res.status(200).json({ remainingCards })
    console.log(`Deleted card id ${id}`)
  }
}
