const jwt = require('jsonwebtoken')
const mysqlPool = require('../lib/mysqlPool');

const secretKey = 'hunter3HessIsCoolAlsoGooseGang'

exports.genToken = async function(id){
    //FIXME: Add checks to make sure that there is only one result and that we aren't giving perms for the first match
    let [[user]] = await mysqlPool.query(`...`)//TODO: Figure our how we are doing users...
    const payload = {sub: id};//Add more perms here
    return jwt.sign(payload,secretKey, {expiresIn: '24h'})
}

exports.checkJwt = async function(req,res,next) {
    const authHeader = req.get('Authorization') || ''
    const authHeaderParts = authHeader.split(' ')
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null
    try {
        const payload = jwt.verify(token,secretKey)
        //Extract perms here
        req.user = payload.sub
        next()
    } catch (err){
        console.error(err)
        res.status(401).send({error: "Invalid token"})
    }
}