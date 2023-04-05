import React, {useState, useEffect, useContext} from 'react';
import UserContext from '../context/UserContext';
import MenuBar from '../navbar/Navbar';
import './pages.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API } from '../../config/Api';

// Images

const CampaignOver = () => {
    const [productName, setProductName] = useState('');
    const [influencerName, setInfluencerName] = useState('');
    const [campaignName, setCampaignName] = useState('');
    const [selectedDate, setSelectedDate] = useState("");
    
    const [prodDiscount, setProdDiscount] = useState('');
    const [influenceOffer, setInfluenceOffer] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [prodList, setProdList] = useState('')
    const [prodDesc, setProdDesc] = useState('')
    const {userToken, influenceList} = useContext(UserContext)

    const token = localStorage.getItem("Token");

    const handleProductChange = (event) => {
        setProductName(event.target.value);
    }

    const handleCampaignNameChange = (event) => {
        setCampaignName(event.target.value);
    }

    const handleInfluencerNameChange = (event) => {
        setInfluencerName(event.target.value);
    }

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    }

    const handleProductDiscount = (event) => {
        setProdDiscount(event.target.value);
    }

    const handleCouponClick = (e) => {
        setSelectedCoupon(e.target.textContent);
    };

    const handleInfluenceOffer = (e) => {
        setInfluenceOffer(e.target.value);
    };

    console.log('selectedCoupon', selectedCoupon)

    console.log("selected-date", selectedDate)

    useEffect(() => {
        if(token && token !== "") {
            axios.get(API.BASE_URL + 'product/list/',{
                headers: {
                    Authorization: `Token ${token}`
                }
                })
                .then(function (response) {
                    console.log("Product List", response);
                    setProdList(response.data.success.products)
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }, [token])

    const createNewCampaign = (e) => {
        e.preventDefault();
        axios.post(API.BASE_URL + 'create/', {
            product: productName,
            influencer_name: influencerName,
            campaign_name: campaignName,
            date: selectedDate,
            coupon: selectedDate,
            offer: influenceOffer,
            product_discount: prodDiscount
        }, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(function (response) {
            console.log("Created New Campaign", response);
            setProductName('')
            setInfluencerName('')
            setCampaignName('')
            setSelectedDate('')
            setProdDiscount('')
            setInfluenceOffer('')
            setSelectedCoupon('')
            toast.success("New Campaign Created!");
        })
        .catch(function (error) {
        console.log(error);
        })
    }

    useEffect(() => {
        console.log("PRODUCT", productName)
        if (productName) {
          axios.get(API.BASE_URL + 'product/url/?product=' + productName,{
              headers: {
                  Authorization: `Token ${token}`
              }
          })
          .then(function (response) {
              console.log("Get Product URL", response);
              setProdDesc(response.data)
          })
          .catch(function (error) {
              console.log(error);
          })
        }
      }, [productName, token]);

      console.log("prodDesc",prodDesc)

  return (
    <div className="campaign-new p-4">
        <MenuBar />
        <div className="campaign-new-container d-flex flex-column justify-content-center align-items-center mt-4">
            <h2 className='mb-3'>Campaign request form</h2>
            <p>Create a campaign list. Please fill the form to create new campaign</p>
            <form action="" className='d-flex flex-wrap justify-content-between mt-5'>
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Campaign name</label>
                    <input type="text"  onChange={handleCampaignNameChange} value={campaignName} />
                </div>
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Influencer need to visit you</label>
                    <div className="input d-flex align-items-center">
                        <span className='d-flex align-items-center justify-content-center me-4'>
                            <input type="radio" id="yes" name="fav_language" value="Yes" />
                            <label for="yes">Yes</label>
                        </span>
                        <span className='d-flex align-items-center justify-content-center'>
                            <input type="radio" id="no" name="fav_language" value="No" />
                            <label for="no">No</label>
                        </span>
                    </div>
                </div>
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Campaign date or range</label>
                    <input type="date" onChange={handleDateChange} value={selectedDate} />
                </div>
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Offer to influencers</label>
                    <div className="input d-flex align-items-center">
                        <span className='d-flex align-items-center justify-content-center me-4'>
                            <input type="radio" id="percentage" name="percentagee" value="percentage" onChange={handleInfluenceOffer} />
                            <label for="percentage">Percentage</label>
                        </span>
                        <span className='d-flex align-items-center justify-content-center'>
                            <input type="radio" id="commission" name="percentagee" value="commission" onChange={handleInfluenceOffer} />
                            <label for="commission">Commission</label>
                        </span>
                    </div>
                </div>
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Product</label>
                    <select  onChange={handleProductChange} value={productName}>
                    <option value="">---Select an option---</option>
                        {prodList?.length > 0 ? (
                            prodList?.map((name, i) => {
                            return(
                                <>
                                    <option value={name.title} key={i}>{name.title}</option>
                                </>
                            )
                        })
                        ) : ""}
                    </select>
                </div>
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Produc URL</label>
                    <textarea name="" id="" cols="30" rows="1" value={prodDesc?.URL} style={{color: '#666'}}></textarea>
                </div>
                <div className="input-container d-flex flex-column mb-4 prod-discount">
                    <label className="mb-3">Product discount</label>
                    <input type="text" onChange={handleProductDiscount} value={prodDiscount} />
                </div>
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Product Description</label>
                    <textarea name="" id="" cols="30" rows="1" value={prodDesc?.description} style={{color: '#666'}}></textarea>
                </div>
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Influencer from the list.</label>
                    <select onChange={handleInfluencerNameChange} value={influencerName}>
                    <option value="">---Select an option---</option>
                    {influenceList?.length > 0 ? (
                        influenceList?.map((name, i) => {
                            return(
                                <>
                                    <option value={name.username} key={i}>{name.username}</option>
                                </>
                            )
                    })
                    ) : ""}
                    </select>
                </div>
                
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Tracking coupon</label>
                    <div className="buttons d-flex justify-content-between discount-buttons p-2 mt-0">
                        <button type='button' className='button button-blue' onClick={handleCouponClick}>100YBL</button>
                        <button type='button' className='button' onClick={handleCouponClick}>150YBL</button>
                        <button type='button' className='button' onClick={handleCouponClick}>300YBL</button>
                    </div>
                </div>
                
                <div className="buttons d-flex justify-content-between">
                    <button className='button button-blue' onClick={createNewCampaign}>Send request button</button>
                    <button className='button'>Save in draft</button>
                    <button className='button'>Request sent</button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default CampaignOver;