import express from 'express';
import path from 'path';
import apiTuotteetRouter from './routes/apiTuotteet';
import apiVarastotilanneRouter from './routes/apiVarastotilanne';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3103;

app.use(express.static(path.resolve(__dirname, "public"))); //Järjestys tärkeä näillä app.use !!

app.use("/api/tuotteet", apiTuotteetRouter);

app.use("/api/varastotilanne", apiVarastotilanneRouter);

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});