import { useState, useEffect, useRef} from 'react'
import Cookies from 'js-cookie'
// import squirtle from './assets/v2p.png'

export default function App(){
  return(
    <div className = "min-h-screen flex flex-col">
      <Header/>
      <Content />
    </div>
  )
}

function Header(){
  return(
    <div className = "header">
    <NavbarItems/>
    </div>
  )
}

function NavbarItems(){

  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/checkLog", {
      credentials: "include"
    })
    .then(response => response.json())
    .then(answer => {
      setIsLoggedIn(answer.isLoggedIn);
      setIsLoading(false);
    })
  }, [])

  
  if (isLoading)
    {
      return(<p>Loading...</p>);
    }
  const currentNavItems = [
      { name: isLoggedIn ? "Logout" : "Login", link: isLoggedIn ? "http://localhost:8000/logout" : "http://localhost:8000/login" },
      { name: "Payment", link: "/pay" }
    ];

  const items = currentNavItems.map(item =>
    {
      if(item.name == "Login")
        return <a key={item.name} href="#" onClick = {() => setIsOpen(true)}className = "p-2 h-full flex items-center bounce">
          {item.name}
        </a>
      else
        return <a key={item.name} href={item.link} className = "p-2 h-full flex items-center bounce">
      {item.name}
    </a>
    }
  )

  console.log("Status verified!")
    
  return(
      <>
        {items}
        <Modal isOpen = {isOpen} onChange = {isLoggedIn} onClose = {() => setIsOpen(false)}></Modal>
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
    <div className="defaultMobile">
      <Image image = {image} uploadImage={uploadImage}/>
      <ResultText image = {image} text = {text} loading = {loading}/>
    </div>
  )
}

function Image({image, uploadImage}){

  if(!image){
  return(
    <div className = "hero">
    <h1 className = "heading">Seamlessly convert image to text</h1>

    <label  htmlFor="imgUpload" className="primaryButton">
    <span className = "uploadSpan">Upload file</span> 
    </label>
    <input onChange = {uploadImage} type="file" id="imgUpload" className = "hidden"/>
    </div>
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

function Modal({ isOpen, onClose, onChange }) { // Added onClose prop so you can close it
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    
    // If state is open, show the modal
    if (isOpen && dialog) {
      dialog.showModal();
    } 
    // If state is closed, close the modal
    else if (!isOpen && dialog) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="modal">
      <form method="POST" onSubmit = {(e) => loginReq(e, onChange)} >
      <input type="text" placeholder = "Username" name = "username"/>
      <br />
      <input type="password"  placeholder = "Password" name = "password"/>
      <br />
      <button type="submit">Submit</button>
      </form>
      {/* Example of how to close it */}
      <button onClick={onClose} className="mt-4 border p-2">Close</button>
    </dialog>
  );
}

async function loginReq(e, setLogin)
{
  e.preventDefault();
  const csrftoken = Cookies.get('csrftoken');
  const response = await fetch("http://localhost:8000/login/", {
    credentials: "include",
    method: "POST",
    headers:{'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'},
    body: JSON.stringify({username: e.target.username.value, password: e.target.password.value})
  });
  const statusCode = response.status;
  const result = await response.json();
  if (statusCode == 200 )
    setLogin(true)
  else
    setLogin(false)
  console.log(result);
  return;
}