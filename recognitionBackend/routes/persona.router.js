const { Router } = require("express");
const router = Router();

const admin = require("firebase-admin");
const db = admin.firestore();

const authMiddleware = require('../middlewares/authMiddleware');

router.get("/hello-world", (req, res) => {
    return res.status(200).json({ message: "API Recognition" });
});

//guardar persona
router.post('/api/persona', authMiddleware, async(req, res) => {
    try {
        const id = req.body.uid;
        const persona = req.body.persona;
        var usuariosRef = db.collection("usuarios").doc(id);
        let query = (await db.collection("usuarios").where("id","==",id).get()).docs;
        let lista = query.map(doc => {
            return doc.data().personas;
        });

        if(req.body.actualizar){
            const idActualizar = req.body.actualizar;
            lista[0].map(element => {
                if(element.id === idActualizar){
                     element.celular = persona[0].celular;
                     element.correo = persona[0].correo;
                     element.edad = persona[0].edad;
                     element.foto = persona[0].foto;
                     element.nombre = persona[0].nombre;
                }
                return element;
            });
        }else{
            lista[0].push(...persona);
        }
        usuariosRef.update({
            personas:lista[0]
        });
        return res.status(200).json({ message: "Se guardaron datos correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }    
});

//consultar todas las personas
router.post("/api/personas", authMiddleware, async (req, res) => {
    try {
        const uid = req.body.uid;
        let query = (await db.collection("usuarios").where("id","==",uid).get()).docs;
        const personas = query.map((doc) => {
            return  doc.data().personas;
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

//consultar persona por id
router.post('/api/persona/:id_persona', authMiddleware, async(req,res) => {
    try {
        const uid = req.body.uid;
        const id_persona = req.params.id_persona;
        const query = (await db.collection("usuarios").where("id","==",uid).get()).docs;
        const personas = query.map((doc) => {
            return doc.data().personas;
        });
        let persona = {};
        for(let person of personas[0]){
            persona = {};
            if(person.id === id_persona){
                console.log(persona);
                persona = person;
                break;
            }
        }
        return res.status(200).json({
            code: 200,
            menssage: "operacion satisfactoria",
            data: persona
        });   
    } catch (error) {
        return res.status(500).json({ 
            code: 500,
            message: "Error",
            data:{}
        });
    }
});

//eliminar persona por id
router.post('/api/persona_eliminar', authMiddleware, async(req,res) => {
    try {
        const uid = req.body.uid;
        const id_persona = req.body.id_persona;
        var usuariosRef = db.collection("usuarios").doc(uid);
        const query = (await db.collection("usuarios").where("id","==",uid).get()).docs;
        const personas = query.map((doc) => {
            return doc.data().personas;
        });
        let lstPersonas = [];
        personas[0].forEach(person => {
            if(person.id === id_persona){
                
            }else{
                lstPersonas.push(person);
            }
        });
        usuariosRef.update({
            personas:lstPersonas
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