import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

//acciones sobre el state de tipo Guitar
export type CartActions =
 {type: 'add-to-cart', payload: {item: Guitar}} |
 {type: 'remove-from-cart', payload: {id: Guitar['id']}} |
 {type: 'dedrease-quantity', payload: {id: Guitar['id']}} |
 {type: 'increase-quantity', payload: {id: Guitar['id']}} |
 {type: 'clear-cart'} 

 //Definiendo dos states
 export type CartState ={
    data: Guitar[],
    cart: CartItem[]
 }

const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : [] //si no hay nada manda arreglo vacío
    }

 //Asignandole valores iniciales a los states definidos
 export const initialState : CartState = {
    data: db,//recibe el arreglo de guitarras
    cart:initialCart() //este viene del localstarge que guarda persistencia del carrito
 }

 const MIN_ITEMS = 1
 const MAX_ITEMS = 5

 //cachar las acciones y realizar algo con el state Guitar y CartItem
 export const cartReducer = (
        state: CartState = initialState, 
        action:CartActions
                            )=>{
    switch (action.type) {
        case 'add-to-cart':{
            //retorna el objeto es decir el item
            const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id)
            let updatedCart: CartItem[] = []
            if(itemExists) { // si es diferente a undefined
                updatedCart = state.cart.map( item =>{
                    if (item.id === action.payload.item.id) {//si ya existe
                        if (item.quantity < MAX_ITEMS) {//si cantidad menor a 5
                            return {...item, quantity: item.quantity + 1}
                        }else{
                            return item
                        }
                    }else{
                        return item
                    }
                })
            } else {
                const newItem : CartItem = {...action.payload.item, quantity : 1}
                updatedCart = [...state.cart, newItem]
            }
            return{
                ...state,
                cart: updatedCart
            };
        }

        case 'remove-from-cart':{
            const cart = state.cart.filter( item => item.id !== action.payload.id )

            return{
                ...state,
                cart
            };
        }

        case 'dedrease-quantity':{
            const cart = state.cart.map( item => {
            if(item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        return{
                    ...state,
                    cart
                };
        }

        case 'increase-quantity':{
            const cart = state.cart.map( item => {
                if(item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                    return {
                        ...item,
                        quantity: item.quantity + 1
                    }
                }
                return item
            })
            return{
                ...state,
                cart
            };
        }

        case 'clear-cart':{
            return{
                ...state,
                cart: []
            };
        }
            
        default:
            return state;
    }

 }
 