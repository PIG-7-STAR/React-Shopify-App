import React, {useState, useEffect, useContext} from 'react';
import UserContext from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../config/Api';

function Profile() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [shopifyUrl, setShopifyUrl] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [email, setEmail] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const {setImage, setName} = useContext(UserContext);
    const [imagePath, setImagePath] = useState('');

    const tokenId = localStorage.getItem('Token_ID');
    const token = localStorage.getItem("Token");
    const userId = localStorage.getItem("User_ID")
    const navigatePath = useNavigate()

    const onFileChange = event => {
        const file = event.target.files[0];
        setSelectedFile(URL.createObjectURL(file));
        console.log("onFileChange",event.target.files[0])
    };

    console.log("Selected File", selectedFile)

    useEffect(() => {
        setLoading(true);
        axios.get(API.BASE_URL + 'user/id/',  {
            headers: { 
                Authorization: `Token ${token}` 
            }
        }) 
        .then(function (response) {
            console.log("Profile Details", response);
            setUserDetails(response.data);
            setUserName(response.data.username);
            setEmail(response.data.email)
            setInstagramUrl(response.data.Instagram_url)
            setShopifyUrl(response.data.shop_url)
            setImagePath(response.data.url)
            localStorage.setItem("Image", response.data.url);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(() => setLoading(false));
    }, [token, imagePath])

    const createProfile = (e) => {
        const formData = new FormData();
        formData.append('image',selectedFile);
        formData.append("username", userName)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("shopify_url", shopifyUrl)
        formData.append("instagram_url", instagramUrl)
        formData.append('type','normal');
        console.log("FormData" ,formData)
        console.log("selectedFile",selectedFile?.name)
        console.log("name", selectedFile)
        console.log("FORM", formData)
        setLoading(true);
        e.preventDefault();
        axios.put(API.BASE_URL + 'profile/' + userId + '/', formData, {
            headers: { 
                Authorization: `Token ${token}`, 
                'Content-Type': 'multipart/form-data'
            },
        }
        )
        .then(function (response) {
            console.log("Profile", response);
            toast.success("Proy these features on all of the above plansfile Edited Successfully!", { autoClose: 1000 });
            setUserName('');
            setPassword('');
            setShopifyUrl('');
            setInstagramUrl('');
            setEmail('');
            localStorage.setItem("User_Name", response.data.data.username);
            setName(response.data.data.username);
            setImage(response.data.url);
            navigatePath('/profile')
            axios.get(API.BASE_URL + 'user/id/',  {
                headers: { 
                    Authorization: `Token ${token}` 
                }
            })
            .then(function (response) {
                console.log("Profile Details", response);
                setUserDetails(response.data);
                setUserName(response.data.username);
                setEmail(response.data.email)
                setInstagramUrl(response.data.Instagram_url)
                setShopifyUrl(response.data.shop_url)
                setImagePath(response.data.url)
                setImage(response.data.url);
                localStorage.setItem("Image", response.data.url)
            })
            .catch(function (error) {
                console.log(error);
            })

        })
        .catch(function (error) {
            console.log(error);
            if(error.response.data.username) {
                toast.warn("Username may not be blank", { autoClose: 1000 })
            }
            else if(error.response.data.email == "This field may not be blank.") {
                toast.warn("Email may not be blank", { autoClose: 1000 })
            }
            else if(error.response.data.email == "Enter a valid email address.") {
                toast.warn("Enter a valid email address", { autoClose: 1000 })
            }
            else if (error.response.data.password == "This field may not be blank.") {
                toast.warn("Passsword may not be blank", { autoClose: 1000 })
            }

            else if(error.response.data.password) {
                toast.warn("Password must be more than 8 character", { autoClose: 1000 })
            }
            else if(error.response.data.instagram_url) {
                toast.warn("Instagram URL cannot be empty", { autoClose: 1000 })
            }
            else if(error.response.data.shopify_url) {
                toast.warn("Shopify URL cannot be empty", { autoClose: 1000 })
            }
            else {
                toast.warn("Can not Update Profile right now.", { autoClose: 1000 })
            }
        })
        .finally(() => setLoading(false));
    }

    
  return (
    <div className="profile p-4 page">
        {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p>Processing...</p></div>}
        <h2 className='my-5 mx-auto' style={{maxWidth: 800,}}>Profile</h2>
        <form className="profile-form d-flex flex-wrap justify-content-between mt-4">
            <div className="input-container d-flex flex-column mb-4">
                <label>Username</label>
                <input type="text" maxLength='30' value={userName} onChange={(e) => {setUserName(e.target.value)}} />
            </div>
            <div className="input-container d-flex flex-column mb-4">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
            </div>
            <div className="input-container d-flex flex-column mb-4">
                <label>Password</label>
                <input type="password" maxLength='30' value={password} onChange={(e) => {setPassword(e.target.value)}} />
            </div>
            <div className="input-container d-flex flex-column mb-4">
                <label>Image</label>
                <div className='d-flex align-items-center'>
                    <input type="file" onChange={onFileChange} accept="image/*" />
                    <img src={selectedFile ? selectedFile : "https://" +imagePath} alt='profile' className='ms-2' style={{width: 55, height: 55, borderRadius: '50%', objectFit: 'cover'}} />
                </div>
            </div>
            <div className="input-container d-flex flex-column mb-4">
                <label>Instagram URL</label>
                <input type="text" value={instagramUrl} onChange={(e) => {setInstagramUrl(e.target.value)}} />
            </div>
            <div className="input-container d-flex flex-column mb-4">
                <label>Shopify URL</label>
                <input type="text" value={shopifyUrl} onChange={(e) => {setShopifyUrl(e.target.value)}} />
            </div>
        </form>
        <div className="buttons d-flex justify-content-center align-items-center">
            <button className='button button-black' onClick={(e) => {createProfile(e)}}>Update Profile</button>
        </div>
    </div>
  )
}

export default Profile