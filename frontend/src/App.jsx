import { useState, useRef, useEffect } from 'react'
// import house from './assets/house.jpg'
// import "./myScript.js";
import squirtle from './assets/v2p.png'
// import login from './assets/user.svg'
const NAVBAR_ITEMS = [{
  name: "avatar",
  icon: AvatarIcon
}];
export default function App(){
  return(
    <div className = "min-h-screen flex flex-col">
      <Header navItems = {NAVBAR_ITEMS}/>
      <Content />
      <Squirtle/>
    </div>
  )
}

function Squirtle() {
  // 1. Create a reference directly to the wrapper div
  const wrapperRef = useRef(null);
  useEffect(() => {
    // 2. Define the mouse movement logic
    const handleMouseMove = (e) => {
      // Don't do anything if the element isn't rendered yet
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const wrapperX = rect["x"];
      const wrapperY = rect["y"];
      const imgHeight = rect["height"];
      const imgWidth = rect["width"];
    
      const centerX =  wrapperX + (imgWidth/2);
      const centerY =  wrapperY + (imgHeight/2);

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const wrapperRelativeX = mouseX - centerX;
      const wrapperRelativeY = mouseY - centerY;

      let radianAngle = Math.atan2(wrapperRelativeY, wrapperRelativeX);
      if (radianAngle < 0)
          radianAngle += Math.PI*2;
      let degAngle = (radianAngle * 180) / Math.PI;
      degAngle += 45; 
      wrapperRef.current.style.setProperty("--rotation-angle", `${degAngle}deg`);

    };

    // 4. Add the event listener when the component mounts
    window.addEventListener("mousemove", handleMouseMove);

    // 5. Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="derp">
      {/* Attach the ref to the wrapper */}
      <div className="wrapper" ref={wrapperRef}>
          <img src={squirtle} alt="cute squirtle tracking the cursor" className="squirtle"/>
      </div> 
    </div>
  );
}

function Header({navItems}){
  return(
    <div className = "header">
    <NavbarItems navItems = {navItems}/>
    </div>
  )
}

function NavbarItems({navItems}){
  const items = navItems.map(item =>
    <a key={item.name} href="" className = "p-2 h-full flex items-center bounce">
    {/* <item.icon/> Login */}
    </a>
  )
  return(
      <>
        {items}
      </>
  )
}
function Content(){
  const [image, setImage] = useState(null);
  const [text, setText] = useState("Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur, blanditiis delectus. Facilis saepe voluptate mollitia, minima repellat repellendus nam recusandae doloribus neque perspiciatis, dolorem voluptas.");
  const [loading, setLoading] = useState(false)

  async function uploadImage(e)
  {
    const file = e.target.files[0]
    setImage(URL.createObjectURL(file));
    const formData = new FormData()
    formData.append("image", file)
    setLoading(true);
    let text = await getText(formData); 
    console.log(text)
    setText(text);
    setLoading(false);
  }

  async function getText(formData)
  {
    let response = await fetch("http://localhost:8000/api/", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    console.log("Received data: ", data);
    return data.message;
  }

  return(
    // <div className="flex flex-col sm:flex-row items-center jusitfy-center flex-1">
    <div className="defaultMobile">
      <Image image = {image} uploadImage={uploadImage}/>
      <ResultText image = {image} text = {text} loading = {loading}/>
    </div>
  )
}

function Image({image, uploadImage}){

  if(!image){
  return(
    <>
    <label  htmlFor="imgUpload" className="primaryButton">
    Upload file 
    </label>
    <input onChange = {uploadImage} type="file" id="imgUpload" className = "hidden"/>
    </>
  )}

  return(
    <div className = "m-2 container">
      <img src = {image} className = "" alt="Uploaded image"></img>
    </div>
  )
}


function ResultText({ image, text, loading }) {
  if (!image) return null;

  if (loading) {
    return (
      <p className="px-4 mx-2 textLimit">
        Loading...
      </p>
    );
  }

  return (
    <p className="p-4 m-2 textLimit card rounded">
      <span className = "font-bold text-xl mb-8">Parsed Text:</span>
      <br />
      {text}
    </p>
  );
}

// Content is empty on initial load


{/* <svg
	xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="avatar" viewBox="0 0 640 640">
    <path d="M463 448.2C440.9 409.8 399.4 384 352 384L288 384C240.6 384 199.1 409.8 177 448.2C212.2 487.4 263.2 512 320 512C376.8 512 427.8 487.3 463 448.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 336C359.8 336 392 303.8 392 264C392 224.2 359.8 192 320 192C280.2 192 248 224.2 248 264C248 303.8 280.2 336 320 336z"/>
  </symbol>
</svg> */}

function AvatarIcon() {
  return (
<svg className = "avatar"
	xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
	<path d="M463 448.2C440.9 409.8 399.4 384 352 384L288 384C240.6 384 199.1 409.8 177 448.2C212.2 487.4 263.2 512 320 512C376.8 512 427.8 487.3 463 448.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 336C359.8 336 392 303.8 392 264C392 224.2 359.8 192 320 192C280.2 192 248 224.2 248 264C248 303.8 280.2 336 320 336z"/>
</svg>
  );
}