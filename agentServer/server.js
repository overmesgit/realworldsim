import express from 'express';
import expressWebSock from 'express-ws';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import dateformat from 'dateformat';
import pug from 'pug';
import {localDB, RESULT_TYPE} from "../localDB.js";
import * as path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
app.use(express.static('static'))
const expressWs = expressWebSock(app);

app.get('/', function (req, res) {
    res.send(pug.renderFile(path.join(__dirname, 'index.pug')));
})

function RunServer() {
    app.listen(3000)
}

const inteructTemplate = pug.compileFile('agentServer/interuct.pug');
app.ws('/', function (ws, req) {
    localDB.subscriber.push((lastInteraction) => {
        const date = dateformat(lastInteraction['time'], "h:MM:ss");
        let color = lastInteraction['result_type'] === RESULT_TYPE.POSITIVE ? '#16a34a' : '#ef4444';
        const money = new Intl.NumberFormat().format(localDB.money)
        ws.send(inteructTemplate({
            data: lastInteraction,
            date,
            color,
            money: money,
            avatar: lastInteraction.getAvatar(),
            uniqueID: lastInteraction.time.getTime().toString() + lastInteraction.userid, 
        }))
    })
})

export default RunServer