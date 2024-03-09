import express from 'express';
import { PrismaClient, kunta } from '@prisma/client';

const app : express.Application = express();

const prisma : PrismaClient = new PrismaClient();

const portti : number = Number(process.env.PORT) || 3101;

app.set("view engine", "ejs");

app.get("/", async (req: express.Request, res: express.Response) => {
    let filter = req.query.filter as string || ""; 

    let sortBy = req.query.sortBy as string || "kunta"; 
    
    let sortOrder = req.query.sortOrder as string || "asc";

    if (sortOrder !== "asc" && sortOrder !== "desc") {
        sortOrder = "asc";
    }

    let kunnat: kunta[] = await prisma.kunta.findMany({
        where: {
            kunta: {
                startsWith: filter,
            },
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
     });

     let nextSortOrder = sortOrder === "asc" ? "desc" : "asc";

    let sumAsukkaatYhteensa = kunnat.reduce((sum, kunta) => sum + kunta.asukkaatYhteensa, 0);
    let AsukkaatYhteensaKeskiarvo = kunnat.length > 0 ? (sumAsukkaatYhteensa / kunnat.length).toFixed(0) : 0;
    let AsukkaatYhteensaKeskiarvo2 = Number(AsukkaatYhteensaKeskiarvo).toLocaleString();
  
    let kuntienMaara = kunnat.length

    let sumAsukkaatNaiset = kunnat.reduce((sum, kunta) => sum + kunta.asukkaatNaiset, 0);
    let AsukkaatNaisetProsentti = ((sumAsukkaatNaiset/sumAsukkaatYhteensa)*100).toFixed(2)

    res.render("index", { kunnat: kunnat, filter: filter, sortBy: sortBy, sortOrder: sortOrder, nextSortOrder: nextSortOrder, AsukkaatYhteensaKeskiarvo2: AsukkaatYhteensaKeskiarvo2, kuntienMaara:kuntienMaara,AsukkaatNaisetProsentti:AsukkaatNaisetProsentti }); 
});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen http://localhost:${portti}`);    

});