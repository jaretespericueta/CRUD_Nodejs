const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// Conexión a la base de datos MongoDB
mongoose.connect("mongodb://localhost:27017/Quotes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//creamos la base de datos y definimos un esquema (forma del documento)
const Schema = mongoose.Schema;
const itemSchema = new Schema({
  //Definimos un campo "nombre" de tipo String
  nombre: String,
  //Definimos un campo "frase" de tipo String
  frase: String,
});
//Conectamos con la base de datos y la colección que se ha creado
const Item = mongoose.model("Quotes", itemSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Ruta para la consulta
app.get("/", async (req, res) => {
  try {
    const items = await Item.find().exec();
    //Ya debe existir el index.ejs que nos mostrará los datos en los documentos
    res.render("index.ejs", { items: items });
  } catch (err) {
    console.error(err);
    //Error 500 es de servidor
    res.status(500).send("Error al obtener los elementos");
  }
});

app.post("/agregar", (req, res) => {
  const newItem = new Item({
    nombre: req.body.nombre,
    frase: req.body.frase,
  });

  newItem.save();
  res.redirect("/");
});

app.get("/actualizar/:id", async (req, res) => {
  try {
    const items = await Item.findById(req.params.id).lean();
    res.render("actualizar.ejs", { items: items });
  } catch (err){
    console,error(err);
    res.status(500).send("Error al obtener los elementos");
  }
});

app.post("/actualizar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndUpdate(id, req.body);
    res.redirect("/");
  } catch (err) {
     console.error("Error al actualizar el documento", err);
     res.status(500).send("Error al actualizar el elemento");
  }
});

app.post("/eliminar", async (req, res) => {
  const elementId = req.body.elementId;

  // Verificar si elementId es una cadena válida de ObjectId
  if (!mongoose.Types.ObjectId.isValid(elementId)) {
    return res.status(400).send("El ID proporcionado no es válido.");
  }

  try {
    const resultado = await Item.findByIdAndDelete(elementId);
    if (resultado) {
      console.log("Elemento eliminado");
    } else {
      console.log("No se encontró ningún documento para eliminar.");
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error al eliminar el documento:", err);
    res.status(500).send("Error al eliminar el elemento");
  }
});

app.listen(port, () => {
  console.log(`Aplicación CRUD corriendo en http://localhost:${port}`);
});
//ejecutar la aplicacion: npm run dev