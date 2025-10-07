import React, {useContext, useEffect, useState} from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const {url,token}= useContext(StoreContext);
    const [data,setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url+'/api/order/userorders',{},{headers:{token}})
            console.log("📦 Orders response:", response.data);
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(()=>{
        if (token){
            fetchOrders();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[token])

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.length === 0 ? (
                    <p>No orders yet</p>
                ) : (
                    data.map((order,index)=> {
                        return <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items.map((item,index) =>{
                                if(index === order.items.length-1){
                                    return item.name + " x " + item.quantity
                                }
                                else{
                                    return item.name + " x " + item.quantity + ", "
                                }
                            })}</p>
                            <p>Nu{order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    })
                )}
            </div>
        </div>
    )
}

export default MyOrders