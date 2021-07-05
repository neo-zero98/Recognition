const { Router } = require("express");
const router = Router();

const admin = require("firebase-admin");
const db = admin.firestore();

const authMiddleware = require('../middlewares/authMiddleware');

//guardar personas detectadas
router.post('/api/persona_detectada', authMiddleware, async(req,res) => {
    try {
        const uid = req.body.uid;
        const persona = req.body.persona;
        var usuariosRef = db.collection("usuarios").doc(uid);
        let query = (await db.collection("usuarios").where("id","==",uid).get()).docs;
        let lista = query.map(doc => {
            return doc.data().personasDetectadas;
        });
        lista[0].push(...persona);
        usuariosRef.update({
            personasDetectadas:lista[0]
        });
        console.log(lista);

        return res.status(200).json({ message: "Se guardaron datos correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
});

//consultas todas las personas detectadas
router.post('/api/personas_detectadas',authMiddleware,async(req,res)=>{
    try {
        const uid = req.body.uid;
        let query = (await db.collection("usuarios").where("id","==",uid).get()).docs;
        const personas = query.map((doc) => {
            return  doc.data().personasDetectadas;
        });
        return res.status(200).json({
            code: 200,
            menssage: "operacion satisfactoria",
            data: personas[0]
        });
    } catch (error) {
        return res.status(500).json({ 
            code: 500,
            message: "Error",
            data:{}
        });        
    }
});

//eliminar todas las personas detectadas
router.post('/api/eliminar_personas_detectadas', authMiddleware, async(req,res)=> {
    try {
        const uid = req.body.uid;
        var usuariosRef = db.collection("usuarios").doc(uid);
        usuariosRef.update({
            personasDetectadas:[]
        });
        return res.status(200).json({
            code: 200,
            menssage: "operacion satisfactoria"
        });
    } catch (error) {
        return res.status(500).json({ 
            code: 500,
            message: "Error"
        });
    }
});


module.exports = router;