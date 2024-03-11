import React, {useState, useRef} from 'react';
import './App.css';

interface Henkilo {
  id: string,
  nimi: string,
}

interface Summa {
  id: string,
  nimi: number,
}

interface Henkilo2 {
  id2: string,
  nimi2: string,
}

interface Summa2 {
  id2: string,
  nimi2: number,
}

const App : React.FC = () : React.ReactElement => {

const uusiHenkilo : any = useRef<any>();
const uusiSumma : any = useRef<any>();

const [henkilot, setHenkilot] = useState<Henkilo[]>([
                                      ]);
const [summat, setSummat] = useState<Summa[]>([
                                      ]);
                                            
const lisaaHenkilo = (henkiloNimi : string) : void => {
  let uusiHenkilo : Henkilo = {
    nimi: henkiloNimi,
    id: new Date().getMilliseconds() + ''
  } 
   setHenkilot([...henkilot, uusiHenkilo]);
}

const lisaaSumma = (summaNimi : number) : void => {
  let uusiSumma : Summa = {
    nimi : summaNimi,
    id: new Date().getMilliseconds() + ''
  }
  setSummat([...summat,uusiSumma]);
}

const poistaSumma = (summa : Summa) : void => {

setSummat (summat.filter((
  sum
)=> {
  return summa.id !== sum.id
} )) 
}

const poistaHenkilo = (henkilo : Henkilo) : void => {

  setHenkilot (henkilot.filter((
    hen
  )=> {
    return henkilo.id !== hen.id
  } )) 
  }

const laskeSummat = (): number => {
  let finalSumma: number = 0;
  for (let i = 0; i < summat.length; i++) {
    finalSumma = finalSumma + summat[i].nimi
  }
  console.log(finalSumma)
  return finalSumma
}
{// --------------------------------------------------------------------    //
}
const uusiHenkilo2 : any = useRef<any>();
const uusiSumma2 : any = useRef<any>();

const [henkilot2, setHenkilot2] = useState<Henkilo2[]>([
                                      ]);
const [summat2, setSummat2] = useState<Summa2[]>([
                                      ]);
                                            
const lisaaHenkilo2 = (henkiloNimi2 : string) : void => {
  let uusiHenkilo2 : Henkilo2 = {
    nimi2: henkiloNimi2,
    id2: new Date().getMilliseconds() + ''
  } 
   setHenkilot2([...henkilot2, uusiHenkilo2]);
}

const lisaaSumma2 = (summaNimi2 : number) : void => {
  let uusiSumma2 : Summa2 = {
    nimi2 : summaNimi2,
    id2: new Date().getMilliseconds() + ''
  }
  setSummat2([...summat2,uusiSumma2]);
}

const poistaSumma2 = (summa2 : Summa2) : void => {

setSummat2 (summat2.filter((
  sum
)=> {
  return summa2.id2 !== sum.id2
} )) 
}

const poistaHenkilo2 = (henkilo2 : Henkilo2) : void => {

  setHenkilot2 (henkilot2.filter((
    hen
  )=> {
    return henkilo2.id2 !== hen.id2
  } )) 
  }

const laskeSummat2 = (): number => {
  let finalSumma2: number = 0;
  for (let i = 0; i < summat2.length; i++) {
    finalSumma2 = finalSumma2 + summat2[i].nimi2
  }
  console.log(finalSumma2)
  return finalSumma2
}

return (
    <>
      <h2>
        Velat
      </h2>
      <p>Velkasi on yhteensä {laskeSummat()} </p>

      <table>
      <tbody>
      <tr>
        <th>Kenelle</th>
        <th>Summa</th>
      </tr>
      <tr>
        <th><input 
              ref={uusiHenkilo}
              type="text" 
              placeholder="Kirjoita nimi..."
              />
              </th>

        <th><input 
              ref={uusiSumma}
              type="text" 
              placeholder="Kirjoita summa..."
              />
              </th>
          <th>
            
          <button
            className='button1'
            onClick={ (e) => {
            lisaaHenkilo(uusiHenkilo.current.value)
            uusiHenkilo.current.value=null;  
            lisaaSumma(parseInt(uusiSumma.current.value) || 0)
            uusiSumma.current.value=null;
          }}>Lisää velka</button> 
          
          </th>
      </tr>
      
      <tr>
       <td>
          {henkilot.map( (henkilo : Henkilo, idx : number) => {

            return (
              <li key={idx}> { henkilo.nimi }</li>
              
              );

          } )}
      
      </td>
      <td>
      {summat.map( (summa : Summa, idx : number) => {

            return (
              <li key={idx}> {summa.nimi}</li>
              
            );

            } )}
        </td>

        <td>
      {summat.map( (summa : Summa, idx : number) => {

            return (
              <li key={idx}><button
              className='button2'
              onClick={ (e) => { 
                
              poistaSumma(summa)
              poistaHenkilo(henkilot[idx])
              }
           
            }>Poista</button></li>
              
            );

            } )}
            
        </td>
        
        </tr>
          
      </tbody>

      
    </table>
    {// --------------------------------------------------------------------    //
}

    <h2>
        Saatavat
      </h2>
      <p>Saatavasi on yhteensä {laskeSummat2()} </p>
      <table>
      <tbody>
      <tr>
        <th>Kenelle</th>
        <th>Summa</th>
      </tr>

      <tr>
        <th><input 
              ref={uusiHenkilo2}
              type="text" 
              placeholder="Kirjoita nimi..."
              />
              </th>

        <th><input 
              ref={uusiSumma2}
              type="text" 
              placeholder="Kirjoita summa..."
              />
              </th>
          <th>
            
          <button
            className='button1'
            onClick={ (e) => {
            lisaaHenkilo2(uusiHenkilo2.current.value)
            uusiHenkilo2.current.value=null;  
            lisaaSumma2(parseInt(uusiSumma2.current.value) || 0)
            uusiSumma2.current.value=null;
          }}>Lisää saatava</button> 
          
          </th>

      </tr>
      <tr>
      
      <td>
        {henkilot2.map( (henkilo2 : Henkilo2, idx : number) => {

          return (
            <li key={idx}> { henkilo2.nimi2 }</li>   
            );

        } )}
    
    </td>
    <td>
    {summat2.map( (summa2 : Summa2, idx : number) => {

          return (
            <li key={idx}> {summa2.nimi2}</li>
     
          );

          } )}
      </td>

      <td>
    {summat2.map( (summa2 : Summa2, idx : number) => {

          return (
            <li key={idx}><button
            className='button2'
            onClick={ (e) => { 
              
            poistaSumma2(summa2)
            poistaHenkilo2(henkilot2[idx])

            }
            
          }>Poista</button></li>
            
          );

          } )}
          
      </td>
      
      </tr>
      </tbody>
      </table>

      </>
     
  );
  
}

export default App;
