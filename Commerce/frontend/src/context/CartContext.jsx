import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
    items: [],
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
            if (existingItemIndex >= 0) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1
                };
                return { ...state, items: updatedItems };
            }
            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
        }
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        case 'CLEAR_CART':
            return initialState;
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    // Initial state from localStorage if available
    const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? { items: JSON.parse(savedCart) } : initial;
    });

    // Persist to localStorage whenever state changes
    React.useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.items));
    }, [state.items]);

    const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
    const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
    const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart: state.items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
