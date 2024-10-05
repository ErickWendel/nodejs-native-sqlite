import { createServer } from 'node:http'
import { setTimeout } from 'node:timers/promises'
import { select, insert } from "./db.js";
import sqlBricks from 'sql-bricks'
import { once } from 'node:events'
createServer(async (request, response) => {
    if (request.method === 'GET') {

        const query = sqlBricks
            .select('name,phone')
            .orderBy('name')
            .from('students')
            .toString()

        const items = select(query)
        return response.end(JSON.stringify(items))

    }
    if (request.method === 'POST') {
        const item = JSON.parse(await once(request, 'data'))
        insert({ table: 'students', items: [item] })

        response.end(JSON.stringify({
            message: `Student: ${item.name} created with success!`
        }))
    }
})
    .listen(3000, () => console.log('server running at 3000'))

await setTimeout(500)

{
    const result = await (await fetch('http://localhost:3000', {
        method: 'POST',
        body: JSON.stringify({
            name: 'joaozinho',
            phone: '0012312'
        })

    })).json()
    console.log('POST', result)
}
{
    const result = await (await fetch('http://localhost:3000')).json()
    console.log('GET', result)
}
