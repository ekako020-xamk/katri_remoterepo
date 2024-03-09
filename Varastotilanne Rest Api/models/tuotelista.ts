import {readFile, writeFile} from 'fs/promises';
import path from 'path';

export interface Tuote {
    id : number,
    koko : number,
    vari : string,
    varastotilanne: number
}

class Tuotelista {

    private tuotteet : Tuote[] = [];
    private tiedosto : string[] = [__dirname, "tuotteet.json"];

    constructor() {

        readFile(path.resolve(...this.tiedosto), "utf8")
            .then((data : string) => {
                this.tuotteet = JSON.parse(data);
            })
            .catch((e : any) => {
                throw new Error(e);
            });
    }

    public haeYksi = (id : number) : Tuote | undefined => {

        try {
            return this.tuotteet.find((tuote : Tuote) => tuote.id === id);
        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public haeKokoVari = (koko : number, vari : string) : Tuote | undefined => {

        try {
            return this.tuotteet.find((tuote : Tuote) => tuote.koko === koko && tuote.vari === vari);
        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public haeKaikki = () : Tuote[] => {

        try {
            return this.tuotteet;
        } catch (e : any) {
            throw new Error(e);
        }         
    }

    public lisaa = async (uusiTuote : Tuote) : Promise<void> => {

        try {
            this.tuotteet = [
                ...this.tuotteet,
                {
                    id : this.tuotteet.sort((a : Tuote,b : Tuote) => a.id - b.id)[this.tuotteet.length - 1].id + 1,
                    koko : uusiTuote.koko,
                    vari : uusiTuote.vari,
                    varastotilanne : uusiTuote.varastotilanne
                }       
                        
            ];
            await this.tallenna();
            

        } catch (e : any) {
            throw new Error(e);
        }      
        
       
    }

    public muokkaa = async (muokattuTuote : Tuote, id : number) : Promise<void> => {//"poistetaan" muokattava tuote, ja lisätään takaisin uusilla tiedoilla

            try {            
            this.tuotteet = this.tuotteet.filter((tuote : Tuote) => tuote.id !== id);

            this.tuotteet = [
                ...this.tuotteet,
                {
                    id : id,
                    koko : muokattuTuote.koko,
                    vari : muokattuTuote.vari,
                    varastotilanne : muokattuTuote.varastotilanne
                }    
            ].sort((a : Tuote, b : Tuote) => a.id - b.id);

            await this.tallenna();

        } catch (e : any) {
            throw new Error(e);
        }         

        }

    private tallenna = async () : Promise<void> => {

        try {
            await writeFile(path.resolve(...this.tiedosto), JSON.stringify(this.tuotteet, null, 2), "utf8"); //jälkimmäinen merkistön tunnus. Numero 2 kertoo että käytetyään kahta välilyöntiä muotoilussa
        } catch (e : any) {
            throw new Error();
        }
    }

    public poista = async (id : number) : Promise<void> => {

        try {
            
            this.tuotteet = this.tuotteet.filter((tuote : Tuote) => tuote.id !== id);

            await this.tallenna();
           

        } catch (e : any) {
            throw new Error(e);
        }         

    }

}

export default Tuotelista;