// eslint-disable-next-line
// import apiWeather from './services/weatherApi';
import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
// const env = require('dotenv').config();

//meta tag lib pra acesar a API weather
// import MetaTags from 'react-meta-tags';

const myApiKey = 'cba5643ae04b2d08e4ff6b1cbc921946'

function App() {

  const [isLoading, setIsLoading] = useState(false)

  const [weather, setWeather] = useState();
  const [forecast, setForecast] = useState();
  const [airQuality, setAirQuality] = useState();

  const [city, setCity] = useState('');
  const [cep, setCep] = useState("");
  const [hourRangeValue, setHourRangeValue] = useState(null);

  const [hourForecast, setHourForecast] = useState();
  const [dayForecast, setDayForecast] = useState();

  useEffect(() => {
    console.log('UseEffect loads')

  }, [weather, forecast, hourForecast, hourRangeValue, , dayForecast, airQuality])
  
  async function handleLoadWeather(e) {
    e.preventDefault();
    setIsLoading(true)
    // Carregando a cidade informada, apenas para pegar a lat e long
    let cityRequested = city.toLocaleLowerCase();
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityRequested},BR&limit=5&appid=${myApiKey}`);
    
    // // retirando a lat e long da cidade para fazer a previsão
    const latCity = response.data[0].lat;
    const longCity = response.data[0].lon;
    // requisição da previsão do tempo para a cidade informada
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latCity}&lon=${longCity}&units=metric&appid=${myApiKey}`)
    
    setWeather(weatherResponse.data);
    setIsLoading(false)

    loadQualityOfAir(); // chamando a função de chamada a API para qualidade do ar
    
  }

  async function handleLoadForecast(e) {
    e.preventDefault();

    let cityRequested = city.toLocaleLowerCase();
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityRequested},BR&limit=5&lang=pt_br&appid=${myApiKey}`);
    // retirando a lat e long da cidade para fazer a previsão
    const latCity = response.data[0].lat;
    const longCity = response.data[0].lon;
    // Chamando a API de previsão para os próximos 5 dias, os dados se atualizam estão dividos de 3 em 3 horas
    const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latCity}&lon=${longCity}&units=metric&lang=pt_br&appid=${myApiKey}`)
    console.log(forecastResponse.data.list);
    // const dias = forecastResponse.data.list.slice(0, 5)
    // console.log(dias)
    setForecast(forecastResponse.data);
  }

  async function loadQualityOfAir() {
    // a desenvolver
    https://openweathermap.org/api/air-pollution
    //api request=  http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}
    console.log()
    let cityRequested = city.toLocaleLowerCase();
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityRequested},BR&limit=5&lang=pt_br&appid=${myApiKey}`);
    // retirando a lat e long da cidade para fazer a previsão
    const latCity = response.data[0].lat;
    const longCity = response.data[0].lon;
    // Chamando a API de previsão para os próximos 5 dias, os dados se atualizam estão dividos de 3 em 3 horas
    const airQualityResponse = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latCity}&lon=${longCity}&appid=${myApiKey}`)
    console.log('Qualidade do ar: ')
    console.log(airQualityResponse.data);
    console.log('Qualidade do valor avaliação: ')
    console.log(airQualityResponse.data.list[0].main.aqi); // retorna de 1 a 5, onde: 1 = good, 2 = fair, 3 = moderate, 4 = poor, 5 = very poor.

    let qualityOfAirReturned = ''

    if(airQualityResponse.data.list[0].main.aqi === 1) { // AIR QUALITY GOOD
      qualityOfAirReturned = 'Ótima';
      console.log('Qualidade do ar é: ');
    } else if(airQualityResponse.data.list[0].main.aqi === 2) {  // AIR QUALITY FAIR
      qualityOfAirReturned = 'Boa';
      console.log('Qualidade do ar é: ');
    } else if(airQualityResponse.data.list[0].main.aqi === 3) { // AIR QUALITY MODERATE
      qualityOfAirReturned = 'Mediana';
      console.log('Qualidade do ar é: ');
    } else if(airQualityResponse.data.list[0].main.aqi === 4) { // AIR QUALITY POOR
      qualityOfAirReturned = 'Ruim';
      console.log('Qualidade do ar é: ');
    } else if(airQualityResponse.data.list[0].main.aqi === 5) { // VERY POOR
      qualityOfAirReturned = 'Péssima';
      console.log('Qualidade do ar é: ');
    } else {
      // salvar no estado como "Não disponível"
      qualityOfAirReturned = 'Indisponível'
      console.log('Qualidade do ar é: ');
    }
    // console.log(qualityOfAirReturned);
    setAirQuality(qualityOfAirReturned); 
  }

  function getDateSplited(dateAsString) {
    // Teste de separação da data e hora
    const dateTotal = dateAsString.split(' ');
    // console.log(dateTotal)
    const dateSplited = dateTotal[0].split('-')
    // console.log(dateSplited)
    let year = dateSplited[0]; // working
    let month = dateSplited[1]; // working
    let day  = dateSplited[2]; // working
    // console.log(`${year} -- ${month} -- ${day}`);
    let hourSplited = dateTotal[1].split(':');
    let hours = hourSplited[0]; // working
    let minutes = hourSplited[1]; // working
    let seconds = hourSplited[2]; // working
    
    // tenho que convert. p/ tipo int pra podermos somar as datas númericas = +1 -> amanhã -> +2 -> daqui a2 dias e etc.
    // Pra pegar sempre o [0] e que sei que é o primeiro dia e conforme avanço nas datas coloco +1, +2 até +4
    //deixar string e converter só quando for usar nos dias seguintes
    
    const finalSplitedDate ={
      year: year,
      month: month,
      day: day,
      hour: hours,
      minutes: minutes,
      seconds: seconds
    };
    // console.log('data dividida e separada por data: ')
    // console.log(finalSplitedDate)
    return finalSplitedDate
  }

  function lastDayOfMonth(dateObject, dayBasedOnTheFirst) {
    console.log('Day based on the first one + x number')
    console.log(dayBasedOnTheFirst); // recebe o dia com a somatória de quantos dias é depois do inicial, se estourar o máximo em um mês retorna pra 1
    const dateFromTheDay = dateObject;
      // tratando problemas quando a data for 31 ou 30, pra voltar pra 1
      // meses com 31 dias
      if(dateFromTheDay.month === '01' || dateFromTheDay.month === '03' || dateFromTheDay.month === '05'|| 
      dateFromTheDay.month === '07' || dateFromTheDay.month === '08' || dateFromTheDay.month === '10' || 
      dateFromTheDay.month === '12' ) {
        
        if(dayBasedOnTheFirst >= 32) { // vendo se o próximo número da data é 31, se for vai pra 1
          return true
        } else {
          return false
          // dayUpdated = parseInt(dateFromTheDay.day) + 1; // se não coloco 1
        }

      } else if (dateFromTheDay.month === '04' || dateFromTheDay.month === '06' || 
      dateFromTheDay.month === '09' || dateFromTheDay.month === '11') {
        if(dayBasedOnTheFirst >= 31) {
          return true
        } else {
          return false
        }
      } else { // caso de fevereiro
        if(dayBasedOnTheFirst >= 28 || dayBasedOnTheFirst >= 29) {
          return true
        } else {
          return false
        }
      }
  }


  async function handleForecastDay(e, inputValue) {
    console.log('################# dia 01 #################')

    e.preventDefault();
    
    // Colocando o dayOne por fora pra eu usar o objeto que retorna como base para os outros dias.
    // ??? TODO --- VERIFICAR SE O PRIMEIRO DIA DA API É DE HOJE OU AMANHÃ 
    const d = new Date();
    const today = d.getDate(); // pra ver se o primeiro dia da API ainda é hoje, se for tenho que pular pro dia de amanhã
    console.log('today/dia 01: ')
    console.log(today);

    // ????? PEGAR A DATA JÁ SEPARADA DO DIA E FAZER DELA O PRIMEIRO DIA A SE R A BASE PARA O USUÁRIO?? - POR HORA VOU DEIXAR DESSA FORMA..

    const dateFromDayOne = getDateSplited(forecast.list[0].dt_txt); // returns a object

    if(inputValue === 'day-one') {
      // retornar para a string original para comparar com o dado vindo da API == dt_txt
      // -> Resposta da API = "2022-10-23 18:00:00" - vai dar errado pq o formato int não retorna 00 e sim 0 
      const fullDateToCompare = `${dateFromDayOne.year}-${dateFromDayOne.month}-${dateFromDayOne.day} ${dateFromDayOne.hour}:${dateFromDayOne.minutes}:${dateFromDayOne.seconds}`
      console.log(fullDateToCompare === forecast.list[0].dt_txt); // working

      // Retornando todos os dados do dia 01, verificando a primeira metade da data dentro do array de previsão
      const dataFromDayOne = forecast.list.filter((day) => day.dt_txt.split(' ')[0] === fullDateToCompare.split(' ')[0]);
      console.log(`retornando todos os dados do 1° dia ${fullDateToCompare}`); 
      console.log(dataFromDayOne);
      console.log('forecast list: ')
      console.log(forecast.list)
      setDayForecast(dataFromDayOne); // armazenando a data escolhida no estado
      

    console.log('################# dia 01 #################')


    } else if(inputValue === 'day-two') {
      //testando mesma função do dia 01 agora para o 2° dia
      console.log('################# dia 02 #################')
      // pegar a data do 1° dia disponível na API
      // converter para int o dia do object e adicionar +1 no dia para pegar do dia seguinte
      const dateFromTheDay = dateFromDayOne;
      console.log('DateFromTheDay dia 02')
      console.log(dateFromTheDay)
      // tratando problemas quando a data for 31 ou 30, pra voltar pra 1
      let dayUpdated = 0;
      let monthUpdate = 0; // para saber se atualizo o mes ou não, já que se o dia mudar pra 1 o mês muda também
      
      console.log(lastDayOfMonth(dateFromTheDay, (parseInt(dateFromTheDay.day) + 1)) );
      if(lastDayOfMonth(dateFromTheDay, (parseInt(dateFromTheDay.day) + 1)) === true){
        console.log('TRUE O 32')
        dayUpdated = 1; // atualizando para o primeiro dia do mês
        if(dateFromTheDay.month !== '12') { // se não for dezembro, só acrescenta 1
          monthUpdate = parseInt(dateFromTheDay.month) + 1;
          if(monthUpdate > 0 && monthUpdate < 10) { // vendo se é mês de caracter unico pra adicionar o 0
            dateFromTheDay.month = '0'+monthUpdate;
          } else {
            dateFromTheDay.month = monthUpdate+'';
          }
        } else { // se for dezembro vai pro mês 01
          dateFromTheDay.month = '01';
        }
      } else {
        console.log('O primeiro dia disponível não é o último')
        dayUpdated = parseInt(dateFromTheDay.day) + 1; // atualizando o dia
      }
      
      
      console.log(dayUpdated + ''); // convertendo pra string com o {+''}

      // converter de volta para string e reamarzenar no objeto
      
      if(dayUpdated > 0 && dayUpdated < 10) {//vendo se o número é menor que 10 pra acrescentar o 0
        dateFromTheDay.day = '0' + dayUpdated ;
      } else {
        dateFromTheDay.day = dayUpdated + '';
      }
      console.log('Date from the day')
      console.log(dateFromTheDay)
      

      // retornar todos os dados que batem com esse 2° dia
      const fullDateToCompare = `${dateFromTheDay.year}-${dateFromTheDay.month}-${dateFromTheDay.day} ${dateFromTheDay.hour}:${dateFromTheDay.minutes}:${dateFromTheDay.seconds}`
      const dataFromDayTwo = forecast.list.filter((day) => day.dt_txt.split(' ')[0] === fullDateToCompare.split(' ')[0]);
      console.log(`retornando todos os dados do 2° dia ${fullDateToCompare}`); 
      console.log(dataFromDayTwo);
      // working
      setDayForecast(dataFromDayTwo); // armazenando a data escolhida no estado

      console.log('################# dia 02 #################')

    } else if(inputValue === 'day-three') {
      console.log('################# dia 03 #################')
      // pegar a data do 1° dia disponível na API
      // converter para int o dia do object e adicionar +1 no dia para pegar do dia seguinte
      const dateFromTheDay = dateFromDayOne;
      // tratando problemas quando a data for 31 ou 30, pra voltar pra 1
      let dayUpdated = 0;
      let monthUpdate = 0; // para saber se atualizo o mes ou não, já que se o dia mudar pra 1 o mês muda também
      
      // fazer por conta mesmo já que se eu nunca passar pelo 2° dia o estado não vai existir
      // console.log('Resultado do estado do dia 02');
      // console.log(forecastDayTwo);
      console.log('Data inicial = ');
      console.log(dateFromTheDay);

      if(lastDayOfMonth(dateFromTheDay, (parseInt(dateFromTheDay.day) + 2)) === true){
        console.log('O próximo dia disponível é o ultimo dia do mês')
        dayUpdated = 1; // atualizando para o primeiro dia do mês +2 por ser o 3° dia, o Else que ta umas 10 linhas abaixos não vai rodar pq é ultimo dia do mês
        if(dateFromTheDay.month !== '12') { // se não for dezembro, só acrescenta 1
          monthUpdate = parseInt(dateFromTheDay.month) + 1;
          if(monthUpdate > 0 && monthUpdate < 10) { // vendo se é mês de caracter unico pra adicionar o 0
            dateFromTheDay.month = '0'+monthUpdate;
          }
          dateFromTheDay.month = monthUpdate+'';
        } else { // se for dezembro vai pro mês 01
          console.log(' O próximo dia disponível Não é o ultimo dia do mês')
          dateFromTheDay.month = '01';
        }
      } else {
        dayUpdated = parseInt(dateFromTheDay.day) + 2; // atualizando o dia
        console.log('day 3 dayUpdated - ')
        console.log(dayUpdated)
      }
      
      
      // console.log(dayUpdated + ''); // convertendo pra string com o {+''}

      // converter de volta para string e reamarzenar no objeto
      // converter de volta para string e reamarzenar no objeto
      
      if(dayUpdated > 0 && dayUpdated < 10) {//vendo se o número é menor que 10 pra acrescentar o 0
        dateFromTheDay.day = '0' + dayUpdated ;
      } else {
        dateFromTheDay.day = dayUpdated + '';
      }
      console.log('Date from the day')
      console.log(dateFromTheDay)

      // retornar todos os dados que batem com esse 2° dia
      const fullDateToCompare = `${dateFromTheDay.year}-${dateFromTheDay.month}-${dateFromTheDay.day} ${dateFromTheDay.hour}:${dateFromTheDay.minutes}:${dateFromTheDay.seconds}`
      const dataFromDayThree = forecast.list.filter((day) => day.dt_txt.split(' ')[0] === fullDateToCompare.split(' ')[0]);
      console.log(`retornando todos os dados do 3° dia ${fullDateToCompare}`); 
      console.log(dataFromDayThree);

      setDayForecast(dataFromDayThree); // armazenando a data escolhida no estado

      console.log('################# dia 03 #################')

    } else if(inputValue === 'day-four') { // +3
      console.log('################# dia 04 #################')
      // pegar a data do 1° dia disponível na API
      // converter para int o dia do object e adicionar +1 no dia para pegar do dia seguinte
      const dateFromTheDay = dateFromDayOne;
      // tratando problemas quando a data for 31 ou 30, pra voltar pra 1
      let dayUpdated = 0;
      let monthUpdate = 0; // para saber se atualizo o mes ou não, já que se o dia mudar pra 1 o mês muda também
      
      
      if(lastDayOfMonth(dateFromTheDay, (parseInt(dateFromTheDay.day) + 3)) === true){
        dayUpdated = 1 + 1; // atualizando para o primeiro dia do mês
        if(dateFromTheDay.month !== '12') { // se não for dezembro, só acrescenta 1
          monthUpdate = parseInt(dateFromTheDay.month) + 1;
          if(monthUpdate > 0 && monthUpdate < 10) { // vendo se é mês de caracter unico pra adicionar o 0
            dateFromTheDay.month = '0'+monthUpdate;
          }
          dateFromTheDay.month = monthUpdate+'';
        } else { // se for dezembro vai pro mês 01
          dateFromTheDay.month = '01';
        }
      } else {
        dayUpdated = parseInt(dateFromTheDay.day) + 3; // atualizando o dia
      }
      
      
      // console.log(dayUpdated + ''); // convertendo pra string com o {+''}

      // converter de volta para string e reamarzenar no objeto
      // converter de volta para string e reamarzenar no objeto
      
      if(dayUpdated > 0 && dayUpdated < 10) {//vendo se o número é menor que 10 pra acrescentar o 0
        dateFromTheDay.day = '0' + dayUpdated ;
      } else {
        dateFromTheDay.day = dayUpdated + '';
      }
      console.log('Date from the day')
      console.log(dateFromTheDay)

      // retornar todos os dados que batem com esse 2° dia
      const fullDateToCompare = `${dateFromTheDay.year}-${dateFromTheDay.month}-${dateFromTheDay.day} ${dateFromTheDay.hour}:${dateFromTheDay.minutes}:${dateFromTheDay.seconds}`
      const dataFromDayFour = forecast.list.filter((day) => day.dt_txt.split(' ')[0] === fullDateToCompare.split(' ')[0]);
      console.log(`retornando todos os dados do 4° dia ${fullDateToCompare}`); 
      console.log(dataFromDayFour);

      setDayForecast(dataFromDayFour); // armazenando a data escolhida no estado

      console.log('################# dia 04 #################')

    } else if(inputValue === 'day-five') { // +4
      console.log('################# dia 05 #################')
      // pegar a data do 1° dia disponível na API
      // converter para int o dia do object e adicionar +1 no dia para pegar do dia seguinte
      const dateFromTheDay = dateFromDayOne;
      // tratando problemas quando a data for 31 ou 30, pra voltar pra 1
      let dayUpdated = 0;
      let monthUpdate = 0; // para saber se atualizo o mes ou não, já que se o dia mudar pra 1 o mês muda também
      
      
      if(lastDayOfMonth(dateFromTheDay, (parseInt(dateFromTheDay.day) + 4)) === true){
        dayUpdated = 1 + 2; // atualizando para o primeiro dia do mês
        if(dateFromTheDay.month !== '12') { // se não for dezembro, só acrescenta 1
          monthUpdate = parseInt(dateFromTheDay.month) + 1;
          if(monthUpdate > 0 && monthUpdate < 10) { // vendo se é mês de caracter unico pra adicionar o 0
            dateFromTheDay.month = '0'+monthUpdate;
          }
          dateFromTheDay.month = monthUpdate+'';
        } else { // se for dezembro vai pro mês 01
          dateFromTheDay.month = '01';
        }
      } else {
        dayUpdated = parseInt(dateFromTheDay.day) + 4; // atualizando o dia
      }
      
      
      // console.log(dayUpdated + ''); // convertendo pra string com o {+''}

      // converter de volta para string e reamarzenar no objeto
      // converter de volta para string e reamarzenar no objeto
      
      if(dayUpdated > 0 && dayUpdated < 10) {//vendo se o número é menor que 10 pra acrescentar o 0
        dateFromTheDay.day = '0' + dayUpdated ;
      } else {
        dateFromTheDay.day = dayUpdated + '';
      }
      console.log('Date from the day')
      console.log(dateFromTheDay)

      // retornar todos os dados que batem com esse 2° dia
      const fullDateToCompare = `${dateFromTheDay.year}-${dateFromTheDay.month}-${dateFromTheDay.day} ${dateFromTheDay.hour}:${dateFromTheDay.minutes}:${dateFromTheDay.seconds}`
      const dataFromDayFive = forecast.list.filter((day) => day.dt_txt.split(' ')[0] === fullDateToCompare.split(' ')[0]);
      console.log(`retornando todos os dados do 5° dia ${fullDateToCompare}`); 
      console.log(dataFromDayFive);

      setDayForecast(dataFromDayFive); // armazenando a data escolhida no estado

      console.log('################# dia 05 #################')

    } 
  }

  async function handleForecastHour(e, inputValue) {
    e.preventDefault()
    
    

    // os valores estão ficando desatualizados entre si, verificar este ponto.
    console.log('Input Value = '); // o input do range button, vem certo 
    console.log(inputValue);

    //Definir a hora inicial do range para a primeira hora disponível do 1° dia
    console.log('Day forecast - get 1st available hour for the day = ' + dayForecast[0].dt_txt)
    const dayAndHourToShow = getDateSplited(dayForecast[0].dt_txt)
    console.log(dayAndHourToShow.hour); // working

    // TODO TODO TODO Pegar a previsão especificamente da hora informada no "range"; TODO TODO TODO TODO TODO TODO
    console.log('Hora selecionada = ');
    console.log(hourForecast); // o valor do state quando mudo ele pega o valor anterior e não o atual, diferente do inputValue

    // pegar os dados(horas) do dia atualmente selecionado
      //  Pegar a previsão especificamente da hora informada no "range"; Fazer usando o input por hora já que este ainda funciona
      if(inputValue.length === 1) { // se tiver apenas um número preciso colocar o 0 na frente da hora pra fazer a comparação
        dayAndHourToShow.hour = '0' + inputValue; // works
      } else {

        dayAndHourToShow.hour = inputValue; // works
      }

    // pegar a hora do dia especificado antes no state

    // comparar com a hora selecionada no input
      // juntando os dados de hora selecionada com o restante para comparar com a previsão a ser exibida = OK, it's working
      const fullDateToCompare = `${dayAndHourToShow.year}-${dayAndHourToShow.month}-${dayAndHourToShow.day} ${dayAndHourToShow.hour}:${dayAndHourToShow.minutes}:${dayAndHourToShow.seconds}`
      
    // retornar o array de informações do dia e hora selecionados no input range
      // Lógica = filtro para cada dia, o campo hora do dt_txt seja igual o hora informado via rangeinput, separando hora pelo espaço
    const forecastForTheHourSelected = dayForecast.filter((day) => day.dt_txt.split(' ')[1] === fullDateToCompare.split(' ')[1])
    
    console.log('state -> hour forecast');
    setHourForecast(forecastForTheHourSelected);
    console.log(forecastForTheHourSelected)
    setHourRangeValue(parseInt(inputValue));
  }





  return (
    <div id="App">
      <main className="Content">
        <h1 className="title">Weather Web App</h1>
        <form action=''>
          <h3 className="subtitle">Insira sua cidade ou CEP</h3>

          <div className="input-block">
            <label htmlFor=''>CIDADE: </label>
            <input 
            type="text"
            name="city"
            id="city"
            required
            placeholder='Salvador'
            value={city}
            onChange={e => setCity(e.target.value)} />
          </div>

          <div className='input-block hide'>
            <label htmlFor=''>CEP: </label>
            <input 
            type="number"
            name="cep"
            id="cep"
            placeholder='12345123'
            value={cep || ''}
            onChange={e => setCep(e.target.value)} />
          </div>

          <div className='containerBtn'>
            <button className="form-button" onClick={(e) => handleLoadWeather(e)}>
              Consultar clima atual
            </button>
            <button className="form-button" onClick={(e) => handleLoadForecast(e)}>Previsão do tempo</button> {/*<!-tirar o submit do forms ativando a função de chamada a API e colocar através do botão--> */}
          </div>
        </form>

        <section className={weather ? `result` : 'hide'}>

            <span> Clima Atual</span>
          <div className="result-title">
            <img src={weather ? `https://countryflagsapi.com/png/${weather.sys.country}` : ''} alt="Bandeira do Brasil" />
            <span>{weather ? weather.name : ''}</span>
          </div>

          <div className="result-date">
            <span>{weather ? parseInt(weather.main.temp) : ''} °C</span>
            <img src={weather ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` : ''} alt="" />
          </div>

          <div className="result-data">
            <span>Umidade: <b>{weather ? weather.main.humidity : ''}%</b></span>
            <span>Vento: <b>{weather ? weather.wind.speed : ''}Km/h</b></span>
            <span>Qualidade do ar: <b>{airQuality ? airQuality : 'indisponível'}</b></span>
          </div>

        </section>

        <section className={forecast ? `result-prevision` : 'hide'}>

            <span> Previsão para os próximos dias</span>
          <div className="result-title">
            <img src={forecast ? `https://countryflagsapi.com/png/${forecast.city.country}` : ''} alt="Bandeira do Brasil" />
            <span>{forecast ? forecast.city.name : ''}</span>
          </div>

          <form action="" className="forecast"> 
            <div className="forecast-days">
              {/* Day One = Tomorrow */}
              <input type="radio" name="day" id="day-one" value={'day-one'} onInput={(event) => {handleForecastDay(event, event.target.value)}}/>
              <input type="radio" name="day" id="day-two" value={'day-two'} onInput={(event) => {handleForecastDay(event, event.target.value)}}/>
              <input type="radio" name="day" id="day-three" value={'day-three'} onInput={(event) => {handleForecastDay(event, event.target.value)}}/>
              <input type="radio" name="day" id="day-four" value={'day-four'} onInput={(event) => {handleForecastDay(event, event.target.value)}}/>
              <input type="radio" name="day" id="day-five" value={'day-five'} onInput={(event) => {handleForecastDay(event, event.target.value)}}/>
              {/* Texto que irá para cada uma das opções */}
              <label htmlFor="day-one" className="option day-one"><span>Dia 01</span></label>
              <label htmlFor="day-two" className="option day-two"><span>Dia 02</span></label>
              <label htmlFor="day-three" className="option day-three"><span>Dia 03</span></label>
              <label htmlFor="day-four" className="option day-four"><span>Dia 04</span></label>
              <label htmlFor="day-five" className="option day-five"><span>Dia 05</span></label>
            </div>
          </form>
          
          <form action="" className={dayForecast ? 'forecast-hours' : 'hide'}>
            <input 
            type="range" 
            name="hour-selected" 
            id="hour-selected" 
            min={dayForecast ? getDateSplited(dayForecast[0].dt_txt).hour : '00' /** Vendo se já temos um dia selecionado para buscar as horas */}
            max="21" 
            step="3" 
            defaultValue={dayForecast ? getDateSplited(dayForecast[0].dt_txt).hour : '00'} 
            onChange={(e) => {setHourRangeValue(e.target.value)}}
            onInput={(e) => {handleForecastHour(e, e.target.value)}} 
            // onLoad={(e) => {handleForecastHour(e, e.target.value)}}
            /> { /* Tem que definir de 3 em 3 com inicio em 0 e maximo em 24*/}
            <span>Horário: {hourRangeValue ? `${hourRangeValue}:00` : '00:00'} </span> 
            {/* * Inicialmente só mostra 0 por conta do estado anterior, a ajustar */}
            
          </form>

          <div className={hourForecast ? "forecast-results" : 'hide'}>
            <div className="forecast-results-weather">
              <span className="forecast-results-weather-description">Temp. média do dia: <b>{hourForecast ? `${parseInt(hourForecast[0].main.temp)}°C` : ''}</b></span>
              <img src={hourForecast ? `https://openweathermap.org/img/wn/${hourForecast[0].weather[0].icon}@2x.png` : ''} alt="" />
              <span>Previsão de: <b>{hourForecast ? `${hourForecast[0].weather[0].description}` : ''}</b></span>
              <span>Chance de chuva: <b>{hourForecast ? `${(hourForecast[0].pop * 100)}%` : ''}</b></span>
            </div>

            <div className="forecast-results-temperature">
              <h4>Mais informações:</h4>
              <span>Temp. máxima: <b>{hourForecast ? `${parseInt(hourForecast[0].main.temp_max)}°C` : ''}</b></span>
              <span>Temp. mínima: <b>{hourForecast ? `${parseInt(hourForecast[0].main.temp_min)}°C` : ''}</b></span>
              <span>Sensação térmica: <b>{hourForecast ? `${parseInt(hourForecast[0].main.feels_like)}°C` : ''}</b></span>
              <span>Ventos: <b>{hourForecast ? `${hourForecast[0].wind.speed}Km/h` : ''}</b></span>
              <span>Presença de nuvens: <b>{hourForecast ? `${hourForecast[0].clouds.all}%` : ''}</b></span>
            </div>


          </div>
        </section>
      </main>
    </div>
  );
}

export default App;