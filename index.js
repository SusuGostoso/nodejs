const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin/firestore');
const express = require('express');
const cors = require('cors');
const port = 3000

const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

app.listen(port, () => {
  console.log("Listening in port "+port)
});

app.get("/read/:collection_name/:item_id",  (req, res) => {
  (async () => {
      
    try {
      const document = db.collection(req.params.collection_name).doc(req.params.item_id);
      let item = await document.get();
      let response = item.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();
});

app.get("/read/:collection_name",  (req, res) => {
  (async () => {
      
    try {
      const query = db.collection(req.params.collection_name);
      let response = [];
      await query.get().then(querySnapshot => {

          let docs = querySnapshot.docs;
          for(let doc of docs)
          {
            const selectedItem = {
              id: doc.id,
              item: doc.data()
            };
            response.push(selectedItem);
          }

      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();
});

app.get("/cadastrar/:matricula/:turma/:nome",  (req, res) => {
  (async () => {
      
    try {
      const timestamp = new Date();

      const god = await db.collection('discentes').doc(req.params.matricula).set({
        nome: req.params.nome,
        matricula: req.params.matricula,
        chegou: 0,
        confirmado: 0,
        turma: req.params.turma,
        telefone: "",
        sexo: 1,
        last_update: Timestamp.fromDate(timestamp),
      });
      
      return res.status(200).send({
        resultado: (god != null) ? true : false
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();
});

app.get("/cturma/:codigo/:turno/:nome",  (req, res) => {
  (async () => {
      
    try {
      const god = await db.collection('turmax').doc(req.params.codigo).set({
        nome: req.params.nome,
        turno: parseInt(req.params.turno),
        codigo: req.params.codigo,
        prof: ""
      });
      
      return res.status(200).send({
        resultado: (god != null) ? true : false
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();
});
