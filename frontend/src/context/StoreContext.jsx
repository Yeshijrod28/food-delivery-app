import {createContext,useEffect, useState } from "react"; 
import axios from "axios";
import { food_list as assetFoodList } from "../assets/assets";

// eslint-disable-next-line react-refresh/only-export-components
export const StoreContext = createContext(null);


const StoreContextProvider = (props) => { 
    const [cartItems, setCartItems] = useState({}); 
    const url = "https://food-delivery-app-qzc7.onrender.com";
    const [token, setToken] = useState(""); 
    const [food_list, setFoodList] = useState([]); 

    const addToCart = async (itemId) => { 
        if(!cartItems[itemId]){ 
            setCartItems((prev)=>({...prev,[itemId]:1})) 
        } 
        else{ 
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1})) 
        } 
        if (token) { 
            await axios.post(url + "/api/cart/add", {itemId}, {headers:{token}}) 
        } 
    } 

    const removeFromCart = async (itemId) => { 
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1})) 
        if (token){ 
            await axios.post(url + "/api/cart/remove", {itemId}, {headers:{token}}) 
        } 
    } 

    const getTotalCartAmount = () => { 
        let totalAmount = 0; 
        for(const item in cartItems){ 
            if (cartItems[item] > 0){ 
                let itemInfo = food_list.find((product) => String(product._id) === String(item)); 
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item]; 
                }
            } 
        } 
        return totalAmount; 
    } 

    const fetchFoodList = async () => { 
        try {
            const response = await axios.get(url + "/api/food/list"); 
            console.log("Fetched food list from backend:", response.data);
            
            if (response.data.success) {
                const backendFoods = response.data.data || [];
                
                // Mark backend foods with isAsset: false
                const backendFoodsMarked = backendFoods.map(food => ({
                    ...food,
                    isAsset: false
                }));
                
                // Mark asset foods with isAsset: true
                const assetFoodsMarked = assetFoodList.map(food => ({
                    ...food,
                    isAsset: true
                }));
                
                // Merge both lists: asset foods first, then backend foods
                const mergedList = [...assetFoodsMarked, ...backendFoodsMarked];
                
                console.log("Merged food list:", mergedList);
                setFoodList(mergedList);
            } else {
                // If backend fails, at least show asset foods
                const assetFoodsMarked = assetFoodList.map(food => ({
                    ...food,
                    isAsset: true
                }));
                setFoodList(assetFoodsMarked);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
            // Fallback to asset foods if backend fails
            const assetFoodsMarked = assetFoodList.map(food => ({
                ...food,
                isAsset: true
            }));
            setFoodList(assetFoodsMarked);
        }
    } 

    const loadCartData = async (token) => { 
        try {
            const response = await axios.post(url + "/api/cart/get", {}, {headers:{token}}); 
            if (response.data.success) {
                setCartItems(response.data.data || {}); 
            }
        } catch (error) {
            console.error("Error loading cart:", error);
            setCartItems({})
        }
    } 

    useEffect(() => { 
        async function loadData(){ 
            await fetchFoodList(); 
            if(localStorage.getItem("token")){ 
                setToken(localStorage.getItem("token")); 
                await loadCartData(localStorage.getItem("token")); 
            } 
        } 
        loadData(); 
    }, []) 

    const contextValue = { 
        food_list, 
        cartItems, 
        setCartItems, 
        addToCart,
        removeFromCart, 
        getTotalCartAmount,
        url, 
        token, 
        setToken 
    } 

    return( 
        <StoreContext.Provider value={contextValue}> 
            {props.children} 
        </StoreContext.Provider> 
    ) 
} 

export default StoreContextProvider;
