let pubnubDemo = new PubNub({
    publishKey: 'pub-c-a8993ad4-41c7-4c80-9946-717678ce1c21',
    subscribeKey: 'sub-c-75198444-7c9a-11ea-87e8-c6dd1f7701c5'
});

let {south,north,east,west} = [];
pubnubDemo.addListener({
    message:function(event){
        saveEvent(event);
        window.addEventListener('deviceorientation', handleData, true);
    }
});

saveEvent = (data) => {
    if(data.channel === 'North')
    {
        north.push(data);
        return north
    }
    if(data.channel === 'West')
    {
        west.push(data);
        return west;
    }
    if(data.channel === 'South')
    {
        south.push(data);
        return south
    }
    if(data.channel === 'East')
    {
        east.push(data);
        return east
    }

};
pubnubDemo.subscribe({
    channels: ['South','North','West','East']
});
handleData = () => {
    let output = document.getElementById('get');
    let channelName = document.getElementById('channelName');
    if(east.length !== 0){
    if (getChannel() === 'North') {
        channelName.appendChild(document.createTextNode(north[0].channel));
        north.forEach(item => {
            output.appendChild(document.createTextNode(item.message.message));
            linebreak = document.createElement("br");
            output.appendChild(linebreak);
        })
    }
    }
    else if (getChannel() === 'South') {
        channelName.appendChild(document.createTextNode(south[0].channel));
        if(east.length !== 0) {
            south.forEach(item => {
                output.appendChild(document.createTextNode(item.message.message));
                linebreak = document.createElement("br");
                output.appendChild(linebreak);
            })
        }
    }
    else if (getChannel() === 'West') {
        channelName.appendChild(document.createTextNode(west[0].channel));
        if(east.length !== 0) {
            west.forEach(item => {
                output.appendChild(document.createTextNode(item.message.message));
                linebreak = document.createElement("br");
                output.appendChild(linebreak);
            })
        }
    }
    else if (getChannel() === 'East') {
        channelName.appendChild(document.createTextNode(east[0].channel));
        if(east.length !== 0){
            east.forEach( item => {
                output.appendChild(document.createTextNode(item.message.message));
                linebreak = document.createElement("br");
                output.appendChild(linebreak);
            })
        }
    }
};

getChannel = () => {
    let channel;
    let orientation = document.querySelector('#getLocation').innerHTML;
    let dir = parseInt(orientation);
    if (dir != null) {
        if(45 > dir || dir >315){
            channel = "North"
        }
        if (45<dir && dir <135) {
            channel = "East"
        }
        if (dir >135 && dir < 225) {
            channel = "South"
        }
        if (dir >225 && dir <315) {
            channel = "West"
        }
    }
    else {
        channel = 'demo_tutorial'
    }
    return channel
};
let sendMsg =()=> {
    let input = document.querySelector('.message');
    //console.log(input.value);
    if( input.value !== "") {
        pubnubDemo.publish({ message: { "message" : input.value }, channel: getChannel() }).catch(err => console.log(err.message));
    }
    input.value = "";
};
function orientationDetection() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
    }


function handleOrientation(event)
{
    var heading = event.alpha;
    if (typeof event.webkitCompassHeading !== "undefined") {
        heading = event.webkitCompassHeading;
        console.log(heading)
    }
    console.log(heading);
    document.querySelector("#getLocation").innerHTML = heading.toFixed([0]);

    //heading - 0 - 360,  45>Norr>315, 45<East<135, 135<south<225, 225<west<315
}
}




/*let input = document.querySelector('.message');
input.addEventListener("keyup", e => {
    // Number 13 is the "Enter" key on the keyboard
    if (e.keyCode === 13) {
        // Cancel the default action, if needed
        e.preventDefault();
        // Trigger the button element with a click
        return document.getElementById("msg-button").click();
    }
});*/


