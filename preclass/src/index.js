import { createServer } from 'node:http'
import { once } from 'node:events';
import { setTimeout } from 'node:timers/promises';

import sqlBricks from 'sql-bricks'
import { select, insert } from './db.js';

createServer(async (req, res) => {

    if (req.method === 'POST') {
        const data = JSON.parse(await once(req, 'data'))
        insert({
            table: 'students',
            items: [data]
        })

        return res.end(JSON.stringify({
            message: `Student ${data.name} created with success`
        }))
    }

    if (req.method === 'GET') {
        const items = select(
            sqlBricks
                .select('name,phone')
                .orderBy('name')
                .from('students')
                .toString()
        )

        return res.end(JSON.stringify(items))
    }

})
    .listen(3000, () => console.log('running on 3000'))


await setTimeout(500)

const result = await (await fetch('http://localhost:3000', {
    method: 'POST',
    body: JSON.stringify({
        name: 'erickwendel',
        phone: '112222'
    })
})).json()

console.log('POST:', result)

const result2 = await (await fetch('http://localhost:3000')).json()
console.log('GET:', result2)

