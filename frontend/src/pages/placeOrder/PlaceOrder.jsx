import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import {useNavigate} from 'react-router-dom'
import axios from "axios"

const PlaceOrder = () => {
    const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext);

    const [data,setData] =useState({
        firstName:"",
        lastName:"",
        email:"",
        street:"",
        city:"",
        state:"",
        phone:""
    })
    
    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({...data,[name]:value}))
    }

    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.map((item)=>{
            if (cartItems[item._id]>0){
                let itemInfo = item;
                itemInfo ["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        })
        console.log(orderItems)
        let orderData = {
            address:data,
            items:orderItems,
            amount:getTotalCartAmount()+100,
        }
        let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}})
        if (response.data.success){
            const {session_url} = response.data;
            window.location.replace(session_url);
        }
        else{
            alert("Error");
        }
    }
    const navigate = useNavigate();

    useEffect(()=>{
        if (!token){
            navigate('/cart')
        }
        else if (getTotalCartAmount()===0){
            navigate('/cart')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[token])

    return (
    <form onSubmit={placeOrder} className='place-order'>
        <div className="place-order-left">
            <p className="title">Delivery Information</p>
            <div className="multi-fields">
                <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
            </div>
            <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
            <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='street' />
            <div className="multi-fields">
                <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='city' />
                <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='state' />
            </div>
            <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='phone no.' />
        </div>
    
        <div className="place-order-right">
            <div className="cart-total">
                <h2>Cart Totals</h2>
                <div>
                    <div className="cart-total-details">
                        <p>Subtotal</p>
                        <p>Nu.{getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cart-total-details">
                        <p>Delivery fee</p>
                        <p>Nu.{getTotalCartAmount()===0?0:100}</p>
                    </div>
                    <hr />
                    <div className="cart-total-details">
                        <b>total</b>
                        <b>Nu.{getTotalCartAmount()===0?0:getTotalCartAmount()+100}</b>
                    </div>
                </div>
                <button type='submit'>PROCEED TO PAYMENT</button>
            </div>
            <div className="cart-promocode">
                <b>If you have a promo code, Enter it here</b>
                <div className="cart-promo-code-input">
                    <input type="text" placeholder='promo code' />
                    <button>Submit</button>
                </div>
            </div>
        </div>
    </form>
)
}

export default PlaceOrder
