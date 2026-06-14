import { useState } from 'react'
// import hero from './assets/hero.png'
const NAVBAR_ITEMS = ["Login"]
export default function App(){
  return(
    <div className = "min-h-screen flex flex-col">
      <Header navItems = {NAVBAR_ITEMS}/>
      <Content />
    </div>
  )
}

function Header({navItems}){
  return(
    <div className = "bg-gray-900 flex justify-center items-center h-16 text-white">
    <NavbarItems navItems = {navItems}/>
    </div>
  )
}

function NavbarItems({navItems}){
  const items = navItems.map(item =>
    <a key={item} href="" className = "p-2 hover:bg-gray-800 h-full flex items-center">
      {item}
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
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false)

  async function uploadImage(e)
  {
    const file = e.target.files[0]
    setImage(URL.createObjectURL(file));
    const formData = new FormData()
    formData.append("image", file)
    setLoading(true);
    let text = await getText(formData); 
    setText(text);
    setLoading(false);
  }

  async function getText(formData)
  {
    let response = await fetch("http://localhost:8000/api/ocr/", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    return data.text;
  }

  return(
    <div className="flex items-center justify-center flex-1">
      <Image image = {image} uploadImage={uploadImage}/>
      <ResultText image = {image} text = {text} loading = {loading}/>
    </div>
  )
}

function Image({image, uploadImage}){

  if(!image){
  return(
    <>
    <label  htmlFor="imgUpload" className="mx-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 hover:scale-110 transition duration-500 ease-in-out">
    Upload file
    </label>
    <input onChange = {uploadImage} type="file" id="imgUpload" className = "hidden"/>
    </>
  )}

  return(
    <div className = "p-4 w-[30vw] h-[30vw]">
      <img src = {image} className = "" alt="Uploaded image"></img>
    </div>
  )
}


function ResultText({image, text, loading}){
  if (!image) return null;
  if (image && !loading)
  {
    return(
      <p className = "px-4 mx-4">Loading...</p>
    )
  }
  return(
  <p className = "px-4 mx-4">
    {text}
  </p>
  )
}

// Content is empty on initial load