import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// Config connect bdd
const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: 'users',
    port: 5432,
});

async function signUp(req, res) {

    try {
        const addNewUser: string = 'INSERT INTO users (email, hached_password, username) VALUES ($1, $2, $3)';
        const {email, password, username} = await req.body;
        const token = jwt.sign({
            algorithm: 'RS256',
            expiresIn: '1h',
        }, process.env.TOKEN_SECRET);

        bcrypt.hash(password, 10, (err, hash) => {

            pool.query(addNewUser, [email, hash, username], (err, results) => {

                if (err) {
                    return res.status(500).send(err.message);
                } else {
                    results.rows;
                    return res.status(200).send({token: token}).end();
                }
            });
        });
    } catch (err) {
        throw err;
    }
}


export default {
    signUp,
}
