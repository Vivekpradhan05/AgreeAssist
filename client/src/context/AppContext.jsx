import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";


// This is used to set default screen when screen is refresh . This is seller Page
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const AppContext = createContext();

export const AppContextProvider = ({children}) =>{

    // This is used to show currency doller sign  and we can set that in env file also we can change in ruppes.
    const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery ] = useState({});


  // Fetch seller status .This is used to check user Authentication
  const fetchSeller = async ()=>{
    try{
           const {data } = await axios.get('/api/seller/is-auth');
           if(data.success){
            setIsSeller(true)
           } else{
            setIsSeller(false)
           }
    } catch (error){
          setIsSeller(false)
    }
  }

  //Fetch User Auth status , User Data and cart Items
  const fetchUser = async ()=>{
    try{
          const { data }  = await axios.get('/api/user/is-auth');
          if(data.success){
             setUser(data.user);
             setCartItems(data.user.cartItems)
          }
    } catch (error){
          setUser(null)
    }
  }

  //This is we are fetching a product in assets.js folder
  const fetchProducts = async ()=>{
    try{
         const { data } = await axios.get('/api/product/list')
         if(data.success){
          setProducts(data.products)
         } else{
          toast.error(data.message)
         }
    } catch (error){
          toast.error(error.message)
    }
  }



  
  //Add Product to cart
  const addToCart = (itemId)=>{
    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){
        cartData[itemId] += 1;
    }else{
        cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart")
  }

// Update cart item quantity
   const updateCartItem = (itemId,quantity)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
   }


   //Remove product from cart
   const removeFromCart = (itemId)=>{
    let cartData = structuredClone(cartItems);
    if(cartData[itemId]){
        cartData[itemId] -= 1;
        if(cartData[itemId] === 0){
            delete cartData[itemId];
        }
    }
    toast.success("Removed from cart");
    setCartItems(cartData);
   }


   // Get cart item count
   const getCartCount = ()=> {
      let totalCount = 0 ;
      for( const item in cartItems){
        totalCount += cartItems[item];
      }
      return totalCount;
   }

   //Get cart Total amount
   const getCartAmount = ()=>{
      let totalAmount = 0;
      for( const items in cartItems){
        let itemInfo = products.find((product)=> product._id === items);
        if(cartItems[items] > 0){
          totalAmount += itemInfo.offerPrice * cartItems[items]
        }
      }
      return Math.floor(totalAmount * 100)/ 100;
   }


// This is for export fetchproduct function.
  useEffect(()=>{
      fetchUser()
       fetchProducts()
       fetchSeller()
  },[])


  // Update Database Cart Items
  // Whenever cart item is updated the automatic execute this function
  useEffect(()=>{
       const updateCart = async ()=>{
         try{
              const { data } = await axios.post('/api/cart/update', { cartItems });
             
              if(!data.success){
                toast.error(data.message);
              }

         } catch (error) {
                toast.error(error.message);
         }
       };

       if(user){
        updateCart();
       }
  },[cartItems]);



    const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItems
    }
    return <AppContext.Provider value={value} >
        {children}
    </AppContext.Provider>
}


export const useAppContext = ()=>{
    return useContext(AppContext)
}