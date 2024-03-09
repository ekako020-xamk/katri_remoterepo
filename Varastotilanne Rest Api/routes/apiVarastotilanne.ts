import express from 'express';
import Tuotelista, { Tuote } from '../models/tuotelista';

const tuotelista : Tuotelista = new Tuotelista();


const apiVarastotilanneRouter : express.Router = express.Router();

apiVarastotilanneRouter.use(express.json());


apiVarastotilanneRouter.get("/varastotilanne/:id", async (req: express.Request, res: express.Response) => {

    
        const id = Number(req.params.id);

        const tuote = tuotelista.haeYksi(id);
        if (tuote) {
            res.json({ tuote });
        } else {
            res.json({virhe : `Tuotteen poisto epäonnistui`});
        }
  
});


apiVarastotilanneRouter.get("/varastotilanne", async (req : express.Request, res : express.Response) => {  // ?koko=35&vari=oranssi

    let tuote : Tuote = {
                        id : Number(req.params.id), //params tulee osoiteriviltä, body tulee postmanin json-tiedoista. (query, jos osoiterivillä kysymysmerkin jälkeen)
                        koko : req.body.koko,
                        vari : req.body.vari,
                        varastotilanne : req.body.varastotilanne
    }      

    if (tuotelista.haeKokoVari(Number(req.query.koko), String(req.query.vari))) {

           // tuote = tuote.filter((tuote : Tuote)) => tuote.koko === req.query.koko || tuote.vari === req.query.vari

            res.json({tuote});

        } else {
            const varastossa = "ei tietoa"
            res.json({ varastossa});
        }
});

export default apiVarastotilanneRouter;
