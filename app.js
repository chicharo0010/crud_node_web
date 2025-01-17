const express = require("express")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
var app=express()
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'n0m3l0',
    database:'5IV8'
})
con.connect();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.static('public'))

app.post('/agregarUsuario',(req,res)=>{
        let nombre=req.body.nombre

        con.query('INSERT INTO usuario (nombre) VALUES (?)', [nombre], (err, respuesta, fields) => {
            if (err) {
                console.log("Error al conectar", err);
                return res.status(500).send("Error al conectar");
            }
           
            return res.send(`<h1>Nombre:</h1> ${nombre}`);
        });
   
})

app.get('/obtenerusuario', (req,res)=>{
con.query('select * from usuario', (err, respuesta, fields)=>{
    if(err)return console.log('ERROR: ', err);
    var userHTML=``;
    var i=0;
    respuesta.forEach(user=>{
        i++;
        userHTML+=`<tr><td>${i}</td><td>${user.nombre}</tr>`;
        });
        return res.send(`<table>
            <tr>
                <th>id</th>
                <th>nombre:</th>
            </tr>
            ${userHTML}
            </table>
            `);
    
            });
});

app.post('/borrarUsuario', (req, res) => {
  const id = req.body.id; // El ID del usuario a eliminar viene en el cuerpo de la solicitud
  
  con.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, resultado, fields) => {

      if (err) {
          console.error('Error al borrar el usuario:', err);
          return res.status(500).send("Error al borrar el usuario");
      }
      if (resultado.affectedRows === 0) {
          return res.status(404).send("Usuario no encontrado");
      }
      return res.send(`Usuario con ID ${id} borrado correctamente`);
  });
});

app.post('/actualizarUsuario', (req, res) => {
    const id = req.body.id2;
    const nombre2 = req.body.nombre2;
    
    con.query('UPDATE usuario SET nombre = ? WHERE id_usuario = ?', [nombre2, id], (err, resultado) => {
        
  
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            return res.status(500).send("Error al actualizar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} actualizar correctamente`);
    });
  });


app.listen(3000,()=>{
    console.log('Servidor escuchando en el puerto 3000')
})