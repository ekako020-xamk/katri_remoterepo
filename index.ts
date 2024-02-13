import express from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import multer from "multer";
import fs from "fs/promises"; // i-system, promises-versio jotta päästään async awaitia käyttämään

const app : express.Application = express();
const prisma : PrismaClient = new PrismaClient();

const uploadKasittelija : express.RequestHandler = multer({ 
    storage: multer.memoryStorage(), 
    fileFilter : (req, file, callback) => {

        if (["json", "csv"].includes(file.mimetype.split("/")[1])) {

            callback(null, true);

        } else {

            callback(new Error());
        }        
    }
}).single("tiedosto");


const portti : number = Number(process.env.PORT) || 3102;

app.set("view engine", "ejs");

app.use(express.static(path.resolve(__dirname, "public"))); // public-kansio, jonka alla css-muotoilua

app.post("/upload", async (req: express.Request, res: express.Response) => {

    let tiedostonimi: string = req.file?.originalname || "";

    uploadKasittelija(req, res, async (err: any) => {
        if (err) { //instanceof multer.MulterError
            console.log("virhe");

            res.render("upload", { "virhe" : "Väärä tiedostomuoto. Käytä ainoastaan json- tai csv-tiedostoja",jsonData:[]});      
       
        } else {
            console.log("ok");
            if (req.file) {
            
                    const jsonData = req.file.buffer.toString("utf-8");
                    res.render("upload", { virhe: "", teksti: "", jsonData: JSON.parse(jsonData), tiedostonimi });
             
            } else {
                res.render("upload", { virhe: "Tiedosto puuttuu.", jsonData: {}, tiedostonimi });
            }
        }
    });
});

app.get("/upload", async (req: express.Request, res: express.Response) => {
   
         
    res.render("upload",  {suoritukset : await prisma.suoritus.findMany()});
 
});

app.get("/", (req, res) => {
    res.render("index"); 
});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen : http://localhost:${portti}`);

});


// csv, jossa erotin merkki usein puolipiste. Javascriptin perusominaisuuksista löytää split (stringeistä array). Toinen vaihtoehto csv-json mpm apupaketti