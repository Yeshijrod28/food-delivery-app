import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id, name, price, description, image, isAsset}) => {

    const {cartItems, addToCart, removeFromCart, url} = useContext(StoreContext);
    
    return (
        <div className='food-item'>
            <div className="food-item-image-container">
                <img 
                    className='food-item-image' 
                    src={isAsset ? image : url + "/images/" + image} 
                    alt={name} 
                    onError={(e) => {
                        e.target.src = assets.header_img; // Fallback image
                    }}
                />
                {!cartItems || !cartItems[id]
                    ? <img className="add" onClick={() => addToCart(id)} src={assets.add_icon_white} alt='Add to cart' />
                    : <div className='food-item-counter'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add more" />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">
                    Nu{price}.00
                </p>
            </div>
        </div>
    )
}

export default FoodItem

