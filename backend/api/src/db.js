import {createPool} from 'mysql2/promise'
export const pool = createPool({
    host: 'dbgymsystem-69-juanestebanortiz70-6c45.f.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_-1J_Gxpc3uyhXoxUspe',
    port: 24171,
    database: 'GymSystem'
})