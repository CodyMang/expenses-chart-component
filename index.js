async function getData(){
    return await fetch('https:\/\/codymang.github.io\/expenses-chart-component\/data.json')// This is for github pages, change to /data.json for local
    .then(response => {
        return response.json();
    }).then(data =>{ //convert data into a easier Object
        return data.reduce((prev,curr)=>{
            prev[curr.day] = curr.amount;
            return prev;
        },{})   
    }
    );
}


function processWeeklySpending(week){
    let result = new Object();
    result.totalSpending = 0.0;
    result.largestDayTotal = 'mon';
    let max_val = 0.0;
    for (const [key, value] of Object.entries(week)) {
       if(value > max_val){
            result.largestDayTotal = key;
            max_val = value;
       }
       result.totalSpending += value;
    }
    return result;
}


function updateWeekBarGraph(week_data, meta_week_data){
    const {totalSpending,largestDayTotal} = meta_week_data;
    const largestDayVal = week_data[largestDayTotal];
    document.getElementById(`sumarry-spent`).innerHTML= `$${totalSpending}`;
    for (const [key, value] of Object.entries(week_data)) {
        
        let curr_dom_elem = document.getElementById(`bar-${key}`);
        let height_perecentage = (value / largestDayVal) * 70;
        curr_dom_elem.style.height = `${height_perecentage}%`
        if(key === largestDayTotal){
            curr_dom_elem.style.backgroundColor = "hsl(186, 34%, 60%)";
        }
        curr_dom_elem = document.getElementById(`desc-${key}`);
        curr_dom_elem.innerHTML = `$${value}`;
     }
}


function createBrighterRGB(rgb){
    const brightnessIncrease = 20;
    rgb = rgb.replace(/[^\d,]/g, '').split(',');// extract 3 ints from RGB string
    rgb = rgb.map(elem=>parseInt(elem));
    const [r,g,b] = rgb.map(elem=>Math.min(elem + brightnessIncrease,255));

    return `rgb(${r}, ${g}, ${b})`;
}


function createEventListenersForBars(week){

    for (const key of Object.keys(week)) {
        let elem = document.getElementById(`bar-${key}`);

        const currColor = window
        .getComputedStyle(elem)
        .getPropertyValue('background-color');
        const newColor = createBrighterRGB(currColor);

        document.getElementById(`bar-${key}`).onmouseover = () => {
            document.getElementById(`bar-${key}`).style.backgroundColor = newColor;
            document.getElementById(`desc-${key}`).style.visibility = "visible";
        }

        document.getElementById(`bar-${key}`).onmouseleave = () => {
            document.getElementById(`bar-${key}`).style.backgroundColor = currColor;
            document.getElementById(`desc-${key}`).style.visibility = "hidden";
        }
    }
}

// Main Function
const res = getData().then(
    data =>{
         const meta = processWeeklySpending(data); // meta-data about the spending
         updateWeekBarGraph(data, meta); // Set sizes for the Bars in the graph
         createEventListenersForBars(data);
    }
);
