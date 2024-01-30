import express from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import multer from "multer";
import fs from "fs/promises"; // i-system, promises-versio jotta päästään async awaitia käyttämään

const app : express.Application = express();
const prisma : PrismaClient = new PrismaClient();


const uploadKasittelija : express.RequestHandler = multer({ 
    dest : path.resolve(__dirname, "tmp"),
    //limits : {
      //  fileSize : (1024 * 500)
    //},
    fileFilter : (req, file, callback) => {

        if (["json"].includes(file.mimetype.split("/")[1])) {

            callback(null, true);

        } else {

            callback(new Error());

        }        

    }
}).single("tiedosto");


const portti : number = Number(process.env.PORT) || 3102;

app.set("view engine", "ejs");

app.use(express.static(path.resolve(__dirname, "public"))); // public-kansio, jonka alla css-muotoilua

app.post("/upload", async (req : express.Request, res : express.Response ) => {

    uploadKasittelija(req, res, async (err : any) => {

        if (err instanceof multer.MulterError) {
            res.render("upload", { "virhe" : "Tiedosto on tiedostokooltaan liian suuri (> 500kt).", "teksti" : req.body.pp });
        } else if (err) {
            res.render("upload", { "virhe" : "Väärä tiedostomuoto. Käytä ainoastaan jpg-kuvia.", "teksti" : req.body.pp });        
        } else {

            if (req.file) {

                let Pvm : string = `${req.body.pp}`; 
        
                await fs.copyFile(path.resolve(__dirname, "tmp", String(req.file.filename)), path.resolve(__dirname, "public", "tiedostot"))
        
                await prisma.suoritus.create({
                    data : {
                        id : req.body.id,
                        askeleet : req.body.askeleet,
                        pp : req.body.pp,
                        kk : req.body.kk,
                        vvvv : req.body.vvvv,
                    }
                });
        
            }
        
            res.redirect("/");

        }

    });



});

app.get("/", async (req : express.Request, res : express.Response ) => {

    res.render("index", {virhe : "", teksti : ""});

});


app.get("/upload", async (req : express.Request, res : express.Response ) => {

    res.render("upload", {suoritukset : await prisma.suoritus.findMany()});

});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen : http://localhost:${portti}`);

});