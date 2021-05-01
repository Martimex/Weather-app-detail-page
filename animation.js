anime({
    targets: `.city-name`,
    duration: 2000,
    translateX: '5%',
}); 

const grid = document.querySelector(`.grid-container`);
let dateBoxes = grid.querySelectorAll(`.date`); 
let visualBoxes = grid.querySelectorAll(`.visual`);
let temperBoxes = grid.querySelectorAll(`.temper`);

showGraph(dateBoxes, visualBoxes, temperBoxes);

function showGraph(date, visual, temper) {

    console.log({date, visual, temper});

    let t = 160;

    anime({
        targets: date,
        opacity: [0,1],
        delay: anime.stagger(160),
    })


    anime({
        targets: visual,
        opacity: [0,1],
        delay: anime.stagger(160),
    })

    anime({
        targets: temper,
        opacity: [0,1],
        delay: anime.stagger(160),
    })


}