
// const leftX = [54, 63];
// const leftY = [18, 29];

// const rightX = [6.5, 20];
// const rightY = [16.5, 31.5];
// Origin -> the center of the png.
document.addEventListener("DOMContentLoaded", () => {
    
    // const wrapper = document.querySelector(".wrapper");
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;

    document.addEventListener("mousemove", (e) =>{
        let x = e.clientX / WIDTH;
        let y = e.clientY / HEIGHT;
    
        let coordLeftX = 63 - (x * 9);
        let coordLeftY = (y * 11) + 18;
        // let coordLeftY = y * 40;

        let coordRightX = 20 - (x * 13.5);
        let coordRightY = (y * 15) + 16.5;
        // let coordRightY = y * 40;

        console.log(`left Y: ${coordRightY} right Y: ${coordLeftY}`);
        moveLeftX(coordLeftX);
        moveLeftY(coordLeftY);

        moveRightX(coordRightX);
        moveRightY(coordRightY);
    })
})


function moveLeftX(coord)
{
    let wrapper = document.querySelector(".wrapper");
    wrapper.style.setProperty(
        "--left-eye-x",
        `${coord}%`
    );
}

function moveLeftY(coord)
{
    let wrapper = document.querySelector(".wrapper");
    wrapper.style.setProperty(
        "--left-eye-y",
        `${coord}%`
    );
}

function moveRightX(coord)
{
    let wrapper = document.querySelector(".wrapper");
    wrapper.style.setProperty(
        "--right-eye-x",
        `${coord}%`
    );
}

function moveRightY(coord)
{
    let wrapper = document.querySelector(".wrapper");
    wrapper.style.setProperty(
        "--right-eye-y",
        `${coord}%`
    );
}

console.log("hi")