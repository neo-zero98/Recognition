const { Router } = require("express");
const router = Router();

const admin = require("firebase-admin");
const db = admin.firestore();

const authMiddleware = require('../middlewares/authMiddleware');

//guardar usuario
router.post('/api/usuario', authMiddleware, async(req, res) => {
    try {
        const id = req.body.uid; 
        await db.collection("usuarios").doc(id).set({
            id:req.body.uid,
            nombre: req.body.nombre,
            correo: req.body.correo,
            personas:[],
            personasDetectadas:[]
        });
        return res.status(200).json({ message: "Se guardaron datos correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }    
});

//consultar usuarios
router.get('/api/usuarios', authMiddleware, async(req, res)=>{
    try {
        let query = (await db.collection("usuarios").get()).docs;
        const usuarios = query.map((doc) => {
            const usuario = {
                correo: doc.data().correo,
                id: doc.data().id,
                nombre: doc.data().nombre
            }
            return usuario;
        });
        return res.status(200).json({
            code: 200,
            menssage: "operacion satisfactoria",
            data: usuarios
        });
    } catch (error) {
        return res.status(500).json({ 
            code: 500,
            message: "Error",
            data:{}
        });
    }
});

//consulta si un usuario existe
router.post('/api/usuario_existente', authMiddleware, async(req, res)=>{
    try {
        const uid = req.body.uid;
        console.log(uid);
        let usuarioExistente = (await db.collection("usuarios").doc(uid).get()).data();
        let btnUser = false;
        console.log(usuarioExistente);
        if(usuarioExistente !== null && usuarioExistente !=='' && usuarioExistente !== undefined){
            btnUser = true;
        }
        return res.status(200).json({
            code: 200,
            menssage: "operacion satisfactoria",
            data: btnUser
        });
    } catch (error) {
        return res.status(500).json({ 
            code: 500,
            message: "Error",
            data:{}
        });
    }
});
module.exports = router;