import { DatabaseSync } from 'node:sqlite';
import sqlBricks from 'sql-bricks'
const database = new DatabaseSync('./db.sqlite');

export function insert({ table, items = [] }) {
    const { text, values } = sqlBricks
        .insertInto(table, items)
        .toParams({ placeholder: '?' });

    const insertStatement = database.prepare(text);
    insertStatement.run(...values)
}

export function select(query) {
    return database.prepare(query).all()
}

function runSeed(items) {
    database.exec(`
        DROP TABLE IF EXISTS students
      `);

    database.exec(`
        CREATE TABLE students(
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT NOT NULL
        ) STRICT
      `);

    insert({
        table: 'students',
        items
    })

    // console.log(select(
    //     sqlBricks
    //         .select('name,phone')
    //         .orderBy('name')
    //         .from('students')
    //         .toString()
    // ))
}

runSeed([
    {
        name: 'erickwendel',
        phone: '112222'
    },
    {
        name: 'ana',
        phone: '323123'
    },
    {
        name: 'developer',
        phone: '3333222'
    },
    {
        name: 'xuxa da silva',
        phone: '000111'
    },
])
