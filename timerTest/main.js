'use strict';
window.onload = () => {
    let x = 10;
    let y = 1;

    const canvas = document.getElementById('canvas');
    const cnt = canvas.getContext('2d');
 
    const timerfunc = () => {
        cnt.fillStyle = "rgb(0,0,0)";
        cnt.fillRect(x*16,y*16,15,15);
        y++;
        // y = y>15? 0 : y;
        if(y>15){
            y=0;
        }

        setTimeout(timerfunc,1000);
    }

    timerfunc();
}
