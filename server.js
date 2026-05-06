require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Producto = require('./apimongo');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Conectado a MongoDB");

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
})
.catch(err => console.log("Error de conexión:", err));

// RUTAS

app.get("/api/productos", async (req, res) => {
    const productos = await Producto.find();
    res.json(productos);
});

app.post("/api/productos", async (req, res) => {
    const nuevo = new Producto(req.body);
    await nuevo.save();
    res.json(nuevo);
});

app.put("/api/productos/:id", async (req, res) => {
    const actualizado = await Producto.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(actualizado);
});

app.delete("/api/productos/:id", async (req, res) => {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Eliminado" });
});