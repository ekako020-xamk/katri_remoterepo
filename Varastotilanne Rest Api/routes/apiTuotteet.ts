import express from 'express';
import Tuotelista, { Tuote } from '../models/tuotelista';

const tuotelista : Tuotelista = new Tuotelista();

const apiTuotteetRouter : express.Router = express.Router();

apiTuotteetRouter.use(express.json());


apiTuotteetRouter.get("/", (req : express.Request, res : express.Response) => {

    res.json(tuotelista.haeKaikki());

});

apiTuotteetRouter.post("/", async (req : express.Request, res : express.Response) => { //tehdään reittikäsittelijästä asynkroninen ("async"), ja käytetään await-kutsuja. Ajatuksena varautua siihen, jos suuren tietomäärän käsittelyssä menee paljon aikaa (?)

    let uusiTuote : Tuote = {
                        id : 0,
                        koko : req.body.koko,
                        vari : req.body.vari,
                        varastotilanne : req.body.varastotilanne
                    }    

    if (req.body.koko && req.body.vari && req.body.varastotilanne) {
        await tuotelista.lisaa(uusiTuote);
        res.json({"viesti": `Tuotteen lisäys onnistui`});
        } else {
            res.json({virhe : `Tuotteen lisäys epäonnistui`});
        }
});

apiTuotteetRouter.put("/:id", async (req : express.Request, res : express.Response) => {

    let muokattuTuote : Tuote = {
                        id : Number(req.params.id), //params tulee osoiteriviltä, body tulee postmanin json-tiedoista. (query, jos osoiterivillä kysymysmerkin jälkeen)
                        koko : req.body.koko,
                        vari : req.body.vari,
                        varastotilanne : req.body.varastotilanne
    }      

    if (tuotelista.haeYksi(Number(req.params.id))) {

        await tuotelista.muokkaa(muokattuTuote, Number(req.params.id));
        res.json({"viesti": `Tuotteen muokkaus onnistui`});

        } else {
            res.json({virhe : `Tuotteen muokkaus epäonnistui`});
        }
});

apiTuotteetRouter.delete("/:id", async (req : express.Request, res : express.Response) => {      

    if (tuotelista.haeYksi(Number(req.params.id)))  {
        await tuotelista.poista(Number(req.params.id));
       
        res.json({"viesti": `Tuotteen poisto onnistui`});
        } else {
            res.json({virhe : `Tuotteen poisto epäonnistui`});
        }
});

apiTuotteetRouter.get("/varastotilanne/:id", async (req: express.Request, res: express.Response) => {

        
        const id = Number(req.params.id);
        const tuote = tuotelista.haeYksi(id);

        if (tuote) {
            res.json({ tuote });
        } else {
            res.json({virhe : `Tuotteen haku epäonnistui`});
        }
  });

  apiTuotteetRouter.get("/varastotilanne", async (req : express.Request, res : express.Response) => {  // ?koko=35&vari=oranssi

    const tuote = tuotelista.haeKokoVari(Number(req.query.koko), String(req.query.vari));

    if (tuotelista.haeKokoVari(Number(req.query.koko), String(req.query.vari))) {

           // tuote = tuote.filter((tuote : Tuote)) => tuote.koko === req.query.koko || tuote.vari === req.query.vari

            res.json({tuote});

        } else {
            const varastossa = "ei tietoa"
            res.json({ varastossa});
        }
});

export default apiTuotteetRouter;
