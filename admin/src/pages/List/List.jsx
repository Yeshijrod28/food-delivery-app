/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { food_list as assetFoodList } from '../../../../frontend/src/assets/assets'

const List = ({ url }) => {
    const [list, setList] = useState([])

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`)
            console.log("Admin - Fetched list:", response.data)

            const dbFoods = response.data.success ? response.data.data : []

            // Merge asset foods + backend foods
            const mergedList = [
                ...dbFoods.map(food => ({ ...food, isAsset: false })),
                ...assetFoodList.map(food => ({ ...food, isAsset: true }))
            ]

            setList(mergedList)
        } catch (error) {
            console.error("Error fetching list:", error)
            toast.error("Error connecting to server")
            // Fallback to asset foods only
            setList(assetFoodList.map(food => ({ ...food, isAsset: true })))
        }
    }

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
            await fetchList()
            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error("Error removing food")
            }
        } catch (error) {
            console.error("Error removing food:", error)
            toast.error("Error removing food")
        }
    }

    useEffect(() => {
        fetchList()
    }, [])

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <p>Image</p>
                    <p>Name</p>
                    <p>Category</p>
                    <p>Price</p>
                    <p>Action</p>
                </div>
                {list.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center' }}>
                        No foods in database. Add some foods to see them here.
                    </p>
                ) : (
                    list.map((item, index) => (
                        <div key={index} className='list-table-format'>
                            <img
                                src={item.isAsset ? item.image : `${url}/images/${item.image}`}
                                alt={item.name}
                                onError={(e) => { e.target.src = 'fallback-image-url-here' }}
                            />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>{item.price ? `Nu${item.price}` : 'Nu0'}</p>
                            {!item.isAsset && (
                                <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default List
