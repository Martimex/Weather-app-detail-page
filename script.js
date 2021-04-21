const city = 'Kraków';

let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=d10be5670d0e6307831a8eccb6cee0ef`;

let limit = 10;

let isFirstBlockDay; // is the first block representing day?

// trzeba 10 razy fetch'ować dane

function first() {

    const all = document.querySelector('.all');
    const grid = all.querySelector('.grid-container');

    for(let y=0; y<limit; y++) {
        let date = document.createElement('p');
        date.classList.add('date');
        grid.appendChild(date);
    }

    for(let y=0; y<limit; y++) {
        let visual = document.createElement('div');
        visual.classList.add('visual');
        grid.appendChild(visual);
    }

    for(let y=0; y<limit; y++) {

        for (let x=0; x<41; x++) {  // tworzy 41 divów do animacji - pierwsza najbliższa rejestracja pogody to zawsze 21. div, a pozostałe zależą od tego 1.
            let s = document.createElement('div');
            document.querySelector(`.visual:nth-of-type(${y+1})`).appendChild(s);
        }
    }
    

    for(let y=0; y<limit; y++) {
        let temper = document.createElement('span');
        temper.classList.add('temper');
        grid.appendChild(temper);
    }

    for(let y=0; y<limit; y++) {
        let icon = document.createElement('img');
        icon.classList.add('icon');
        grid.appendChild(icon);
    }

}

function last() {

    for(let iter=0; iter<limit; iter++) {

        fetch(url)  
            .then(res => res.json())
            .then((data) => {
                
                let fullDate = data.list[(iter*4)+1].dt_txt;

                // For first operation in the loop
                dayOrNight(fullDate, iter);

                (iter === 0)? separateDays(fullDate) : ''; // ta funkcja wykonana w pętli 10 razy, jest ASYNC !

                const value = dayOrNight(fullDate);

                let temp = Math.floor(data.list[(iter*4)+1].main.temp)+'°C';
                let iconCode = data.list[(iter*4)+1].weather[0].icon;
                let iconurl = `http://openweathermap.org/img/w/${iconCode}.png`;
               // console.log(fullDate);

                let num = Math.floor(data.list[(iter*4)+1].main.temp);
                let baseNum = Math.floor(data.list[(0*4)+1].main.temp); // to bazowa temperatura dla itera-0

                //console.log(temp);
    
                document.querySelector(`.grid-container .date:nth-of-type(${iter+1})`).textContent = fullDate;
    
                let visual = document.querySelector(`.grid-container .visual:nth-of-type(${iter+1})`);
                
                //visual.style.background = `linear-gradient(to bottom, #ebe, #58c)`;

                let temper1 = document.querySelector(`.grid-container .temper:nth-of-type(${iter+1})`);
                temper1.innerText = temp;
                //let x = document.querySelector(`.temp:nth-of-type(${iter+1})`).innerText = 'x';
                
    
               //let icon = document.querySelector(`.grid-container .icon:nth-of-type(${iter+1})`); 
               //console.log(icon);
                //icon.setAttribute('src', iconurl);
                
                setBaseVisual(iter, visual, num, baseNum, value);

                // Append img to upper div

                let newImg = visual.querySelector(`div:nth-last-child(-n+${(num - baseNum) + 21 + 4})`);
                let img = document.createElement('img');
        
                img.setAttribute('src', iconurl);
                newImg.appendChild(img);

            })
    }

    // Display queried city name on the upper span

    let citySpan = document.querySelector('.city-name');
    citySpan.textContent = city;

    //separateDays(fullDate);
}

first();
last();


function setBaseVisual(iter, visual, num, baseNum, value) {

    // iter = która to iteracja
    // visual = bloczek grid, na którym wykonujemy operację
    // num = temperatura dla bloczku, który teraz omawiamy
    // baseNum = temperatura bloczku 1, który zawsze wynosi 21 divów - pozostała ilość bloczków to już różnica temperatur

    if(iter == 0) {
        (isFirstBlockDay)?
            visual.querySelectorAll(`div:nth-last-child(-n+21)`) // all divs, but we actually need 21
            .forEach(elem =>  {elem.style.background = `linear-gradient(135deg, #56cd, #6add)`}) // light
        :
            visual.querySelectorAll(`div:nth-last-child(-n+21)`) // all divs, but we actually need 21
            .forEach(elem =>  {elem.style.background = `linear-gradient(135deg, #75dd, #349d)`}) // dark
    }

    else {
        //visual.querySelectorAll(`div`).forEach(div => {div.style.background = `linear-gradient(to bottom, rgba(255, 255, 255, 0.1))`})
        (isFirstBlockDay)? 

            (!(iter%2))?
            visual.querySelectorAll(`div:nth-last-child(-n+${(num - baseNum) + 21})`)
            .forEach(elem => {elem.style.background = `linear-gradient(135deg, #56cd, #6add)`})
            :
            visual.querySelectorAll(`div:nth-last-child(-n+${(num - baseNum) + 21})`) 
            .forEach(elem => {elem.style.background = `linear-gradient(135deg, #75dd, #349d)`})   

        :
            (iter%2)?
            visual.querySelectorAll(`div:nth-last-child(-n+${(num - baseNum) + 21})`) 
            .forEach(elem => {elem.style.background = `linear-gradient(135deg, #75dd, #349d)`})
            :
            visual.querySelectorAll(`div:nth-last-child(-n+${(num - baseNum) + 21})`)
            .forEach(elem => {elem.style.background = `linear-gradient(135deg, #56cd, #6add)`})   
    }
}

function separateDays(firstDate) {

    const day = firstDate.substring(8,10);
    const hour = parseInt(firstDate.substring(11,13));
    console.log('Day:  ',day, '  Hour:  ',hour);

    if(hour >= 12) {
        console.log('it is');
        document.querySelectorAll(`.grid-container .visual:nth-child(odd)`).forEach(visual => 
            visual.style.cssText = `border-right: 0.32em solid #2222;`);
    }

    else {
        console.log('nope');
        document.querySelectorAll(`.grid-container .visual:nth-child(even)`).forEach(visual =>
            visual.style = `border-right: 0.32em solid #2222;`);
    }

}

function dayOrNight(firstDate, iter) {
    //console.log(firstDate);

    if(iter !== 0) {
        return false;
    }

    const dayValues = [9, 12, 15, 18];
    //const nightValues = [21, 0, 3, 6];

    const Monthday = firstDate.substring(11,13);
    console.log(Monthday);

    if(dayValues.includes(parseInt(Monthday)))  { // czy Monthday to g. 9, 12, 15, a może 18?
        document.querySelectorAll(`.grid-container .date:nth-child(even)`).forEach(el => //tak
        el.style.cssText = `background: #75d5; border-top: .3em solid #75d5; border-left: .3em solid #75d5; `);
        isFirstBlockDay = true;
        return true;
    } 

    else {
        document.querySelectorAll(`.grid-container .date:nth-child(odd)`).forEach(el => //nie
        el.style.cssText = `background: #75d5; border-top: .3em solid #75d5; border-left: .3em solid #75d5;`);
        isFirstBlockDay = false;
        return false;
    } 
        
}