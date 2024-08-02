"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDoc, query, onSnapshot, setDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import {database} from "./firebase";


export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({name:"", price:"", quantity:""});
  const [total, setTotal] = useState(0);


  // Adding an item to the database
  const addItem = async (id = newItem.name.trim(), count = newItem.quantity) => {
    //const docRef = doc(database, "pantry", id);
    const docRef = doc(collection(database, "pantry"), id);
    const docSnap = await getDoc(docRef);
    // if the document is already in the database
    if (docSnap.exists()) {
      await updateDoc(docRef, {quantity: docSnap.data().quantity + count});
    } else {
      if (id != "" && newItem.price != "" && count != "" && count > 0) {
        await setDoc(doc(collection(database, "pantry"), id), {
          name: id,
          price: Math.round(Number(newItem.price.trim())*100)/100,
          quantity: count
        });
      }
    }
    setNewItem({name:"", price:"", quantity:""});
  };

  // Reading from a database
  const readItem = async () => {
    const q = query(collection(database, "pantry"));
    let itemsArr = []
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("Adding item name: " + doc.data().name.trim());
        itemsArr.push({name: doc.data().name.trim(), price: doc.data().price, quantity: doc.data().quantity});
      });
      setItems(itemsArr); 
      // Updating the total price
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce((sum, price) => sum + price, 0);
        console.log("Total price is: " + totalPrice);
        setTotal(totalPrice);
      }
      calculateTotal();
      //return () => unsubscribe();
    });
  }
  
  useEffect(() => {
    readItem();
  }, []);

  
  
  // Removing an item
  const deleteItem = async (id) => {
    //const docRef = doc(database, "pantry", id);
    const docRef = doc(collection(database, "pantry"), id);
    const docSnap = await getDoc(docRef);
    // if the document only has quantity one remaining
    if (docSnap.data().quantity == 1) {
      await deleteDoc(doc(database, "pantry", id));
    } else {
      await updateDoc(docRef, {quantity: docSnap.data().quantity - 1});
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div>
          <form className="grid grid-cols-6 items-center text-black">
            <input className="col-span-3 m-3 p-2 border" type="text" placeholder="Enter a Pantry Item" value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name:e.target.value})}/>
            <input className="col-span-1 m-3 p-2 border" type="text" placeholder="Price" value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}/>
            <input className="col-span-1 m-3 p-2 border" type="number" placeholder="Quantity" value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}/>
            <button className="col-span-1 m-3 p-2 border bg-lime-700 hover:bg-lime-500 text-white" onClick={() => addItem(newItem.name.trim())}> Add Item </button>
          </form>
          <ul>
            <div className="text-xl my-3 grid grid-cols-12 items-end bg-lime-700 text-white text-center">
              <div className="col-span-5">Item Name</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-3">Quantity</div>
              <div className="col-span-2">Item Price</div>
            </div>
            {items.map((item, id) => (
              <li key={id} className="text-xl my-3 items-center border-solid border-lime-700 grid grid-cols-12 text-center">
                  <div className="col-span-5">{item.name}</div>
                  <div className="col-span-2">${item.price}</div>
                  <button className="col-span-1 bg-lime-700 hover:bg-lime-500 p-2 rounded-full mx-3" onClick={() => addItem(item.name.trim(), 1)}> + </button>
                  <div className="col-span-1">{item.quantity}</div>
                  <button className="col-span-1 bg-lime-700 hover:bg-lime-500 p-2 rounded-full mx-3" onClick={() => deleteItem(item.name.trim())}> - </button>
                  <div className="col-span-2">${(item.price * item.quantity)}</div>
              </li>
            ))}
          </ul>
          {items.length < 1 ? ("") : (
            <div className="text-xl my-3 flex justify-between w-full items-end border-solid border-lime-700">
              <div>Total</div>
              <div>${total}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
