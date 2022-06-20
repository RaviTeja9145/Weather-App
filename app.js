const form=document.querySelector('form');
const input=document.querySelector('input[type="text"]');
const loc=document.querySelector('#location');
const temparature=document.querySelector('#temp');
const desc=document.querySelector('.description');
const cloud=document.querySelector('.cloudy');
const humidity=document.querySelector('.humidity');
const wind=document.querySelector('.wind');
let currentLocation='London';
const weatherApiKey='26ac0093445c96895a35a9d8d7da1952';

function refreshTime()
{
    const date=document.querySelector('#date');
    const currentDate=new Date();
    const time=Intl.DateTimeFormat('en-US',{
        minute:'2-digit',
        hour:'2-digit'
    }).format(currentDate);
    const weekDay=Intl.DateTimeFormat('en-US',{
        weekday:'long'
    }).format(currentDate);
    const day=Intl.DateTimeFormat('en-US',{
        day:'2-digit'
    }).format(currentDate);
    const month=Intl.DateTimeFormat('en-US',{
        month:'short'
    }).format(currentDate);
    const year=Intl.DateTimeFormat('en-US',{
        year:'2-digit'
    }).format(currentDate);
    
    const finalString=`${time} - ${weekDay}, ${day} ${month} ${year}'`;
    date.textContent=finalString;

}

window.addEventListener('load',(e)=>{
    refreshTime();
    getWeather(currentLocation);
})

setInterval(refreshTime,1000);


function updateNextDays(data,i)
{
    let idx=(i-1)*8;
    const spans=document.querySelectorAll(`.next-${i-1} .edit`);
    const nextDate1=new Intl.DateTimeFormat('en-US',{month:'short'});
    const nextDate2=new Intl.DateTimeFormat('en-US',{day:'2-digit'});
    
    spans[0].textContent=nextDate1.format(new Date(data.list[idx].dt_txt))+' '
    spans[1].textContent=nextDate2.format(new Date(data.list[idx].dt_txt))+' '
    spans[2].textContent=parseInt(data.list[idx].main.temp);
    spans[3].textContent=data.list[idx].weather[0].description;
}

function updateBackground(main)
{
    if(main==='Clouds')
    {
        return;
    }
    else if(main=='Rain')
    {
        document.body.style.background('./images/rain');
    }
}

function updateIcon(data)
{
    const icon=document.querySelector('.weather-icon');
    icon.setAttribute('src',`http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`)
}

function updateWeather(data)
{
    loc.textContent=data.city.name;
    temparature.textContent=parseInt(data.list[0].main.temp);
    desc.textContent=data.list[0].weather[0].description;
    cloud.textContent=data.list[0].clouds.all;
    humidity.textContent=data.list[0].main.humidity;
    wind.textContent=parseInt(data.list[0].wind.speed);
    for(let i=2;i<=5;i++)
    {
        updateNextDays(data,i);
    }
    const main=data.list[0].weather.main;
    updateBackground(main);
    updateIcon(data);
    
}

async function getWeather(currentLocation)
{
    try{
        const preData=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${currentLocation}&appid=${weatherApiKey}&units=metric`);
        if(!preData.ok)
        {
            throw new Error('error');
        }
        const data=await preData.json();
//         console.log(data);
        updateWeather(data);
    }
    catch{
        console.log('Something is Wrong!!');
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    currentLocation=input.value.toString();
    input.value='';
    getWeather(currentLocation);
})
