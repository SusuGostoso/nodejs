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

app.get("/frequencia/:dia_codigo",  (req, res) => {
  (async () => {
      
    try {
      const document = db.collection("frequencia").doc((req.params.dia_codigo.toString()));
      let item = await document.get();
      let response = item.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();
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

/*
// Create a reference to the cities collection
const citiesRef = db.collection('cities');

// Create a query against the collection
const allCapitalsRes = await citiesRef.where('capital', '==', true).get();
*/

app.get("/susu/:aluno_mat/:codigo_turma/:aluno_nome",  (req, res) => {
  (async () => {
      
    try {
      const query = db.collection("alunos");
      const snapshot = await query.where('turma', '==', req.params.codigo_turma.toString()).where('nome', '==', req.params.aluno_nome.toString()).get();

      if(snapshot.empty)
      {
        return res.status(404).send("Nenhum aluno encontrado: "+req.params.aluno_nome.toString());
      }

      if(snapshot.size > 1)
      {
        return res.status(404).send("Dois alunos ou mais: "+req.params.aluno_nome.toString());
      }
    

      await snapshot.docs[0].ref.set({
        mat: req.params.aluno_mat.toString()
      }, { merge: true });
      
      return res.status(200).send("OK: "+req.params.aluno_nome.toString());
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();
});

app.get("/alunos/:turma",  (req, res) => {
  
  (async () => {
    
    try {
      const query = db.collection("alunos");
      let response = [];
      let turma = req.params.turma.toString();
      const snapshot = await query.where('turma', '==', turma).where('confirmado', '==', 0).get();

      if (snapshot.empty) {
        return res.status(404).send({
          404: "Nenhum aluno encontrado"
        });
      }
      
      snapshot.forEach(doc => {
        const dat = doc.data();

        
        const selectedItem = {
          id: doc.id,
          matricula: dat["mat"],
          nome: dat["nome"],
          chegou: dat["chegou"],
          confirmado: dat["confirmado"]
        };
        response.push(selectedItem);
      });

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
