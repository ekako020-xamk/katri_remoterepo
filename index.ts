import express from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import multer from "multer";
import fs from "fs/promises"; // i-system, promises-versio jotta päästään async awaitia käyttämään

const app : express.Application = express();
const prisma : PrismaClient = new PrismaClient();


const uploadKasittelija : express.RequestHandler = multer({ 
    storage: multer.memoryStorage(), // Use memory storage instead of saving to disk
    //limits : {
      //  fileSize : (1024 * 500)
    //},
    fileFilter: (req, file, callback) => {

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

app.post("/upload", async (req: express.Request, res: express.Response) => {

    let tiedostonimi: string = req.file?.originalname || "";

    uploadKasittelija(req, res, async (err: any) => {
        if (err instanceof multer.MulterError) {
            res.render("lisaa", { "virhe" : "Tiedosto on tiedostokooltaan liian suuri (> 500kt).", "teksti" : req.body.teksti });
        } else if (err) {
            res.render("lisaa", { "virhe" : "Väärä tiedostomuoto. Käytä ainoastaan json-muotoisia tiedostoja.", "teksti" : req.body.teksti });        
       
        } else {

            if (req.file) {
                try {
                    const jsonData = req.file.buffer.toString("utf-8");
                    res.render("upload", { virhe: "", teksti: "", jsonData: JSON.parse(jsonData), tiedostonimi });
                } catch (error) {
                    console.error(error);
                    res.render("upload", { virhe: "Virhe tiedoston lukemisessa.", jsonData: {}, tiedostonimi });
                    return;
                }
            } else {
                res.render("upload", { virhe: "Tiedosto puuttuu.", jsonData: {}, tiedostonimi });
            }
        }
    });
});

app.get("/upload", async (req: express.Request, res: express.Response) => {
   
    try {        
        const suoritukset = await prisma.suoritus.findMany();
        res.render("upload", { virhe: "", teksti: "", suoritukset: suoritukset, jsonData: {} });
    } catch (error) {
        // Handle error appropriately
        console.error(error);
        res.render("upload", { virhe: "Internal Server Error", teksti: "", kuvat: [], jsonData: {} });
    }
});


app.get("/", (req, res) => {
    res.render("index"); // Adjust the view name as per your application structure
});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen : http://localhost:${portti}`);

});