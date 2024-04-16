import pgp from 'pg-promise';

const dbUser = 'myuser';
const dbPass = ''
const dbName = 'realdb'

const db = pgp()({
    host: 'localhost',
    port: 5432,
    database: dbName,
    schema: dbName,
    user: dbUser,
    password: dbPass,
    max: 30
});


function saveInteruction() {
    db.none('insert into agent_interactions (agent_id, interaction, "time", reward, result) values ($1, $2, $3, $4, $5);',
        [1, "Opening blog site", new Date(), 0, "I couldn't open the site"])
        .then(() => {
            console.log("insert success")
        })
        .catch(error => {
            console.log("insert fail " + error)
        });
}

export {saveInteruction}