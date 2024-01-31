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
    fileFilter: (req, file, callback) => {
        const allowedExtensions = ["json"];
        const fileExtension = path.extname(file.originalname).toLowerCase().substring(1); // Get the file extension
    
        if (allowedExtensions.includes(fileExtension)) {
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
    uploadKasittelija(req, res, async (err: any) => {
        if (err instanceof multer.MulterError) {
            res.render("upload", { virhe: "Tiedosto on tiedostokooltaan liian suuri (> 500kt).", teksti: req.body.pp, jsonData: {} });
        } else if (err) {
            res.render("upload", { virhe: "Väärä tiedostomuoto. Käytä ainoastaan JSON-tiedostoja.", teksti: req.body.pp, jsonData: {} });
        } else {
            if (req.file) {
                try {
                    const filePath = path.resolve(__dirname, "tmp", String(req.file.filename));
                    const jsonData = await fs.readFile(filePath, "utf-8");

                    res.render("upload", { virhe: "", teksti: "", jsonData: JSON.parse(jsonData) });
                } catch (error) {
                    console.error(error);
                    res.render("upload", { virhe: "Virhe tiedoston lukemisessa.", teksti: req.body.pp, jsonData: {} });
                    return;
                }
            } else {
                res.render("upload", { virhe: "Tiedosto puuttuu.", teksti: req.body.pp, jsonData: {} });
            }
        }
    });
});

app.get("/upload", async (req: express.Request, res: express.Response) => {
    try {
        const kuvat = await prisma.suoritus.findMany();
        res.render("upload", { virhe: "", teksti: "", kuvat: kuvat, jsonData: {} });
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