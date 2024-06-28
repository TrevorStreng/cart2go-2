'use client'
import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState([
    {name: 'lucky charms',
      category: 'cereal',
      amount: 1
    },
    {name: 'lettuce',
      category: 'produce',
      amount: 1
    },
    {name: 'oranges',
      category: 'produce',
      amount: 3
    },
    {name: 'chicken',
      category: 'meat',
      amount: 1
    },
    {name: 'ramen',
      category: 'snacks',
      amount: 1
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const addItem = () => {
    console.log('working')
    
  }

  // TODO: need to sort by category / if inserted correctly dont ever need to sort
  // possible create a dependency that allows for a drop down list that you can type into to add new items/stores



  return (
    <main className="w-screen h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="p-4">Items</h1>
        <div className="w-2/3">
          {items.map((item, index) => (
            <div key={index} className={`grid grid-cols-2 ${index === 0 ? 'border-t-2' : ''} border-b-2 h-16 py-2`}>
              <p className="col-span-2">{item.name}</p>
              <p className="flex justify-center">{item.category}</p>
              <p className="flex justify-center">{item.amount}</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 right-4 rounded-full bg-green-400 h-12 w-12 flex justify-center items-center text-4xl text-gray-200" onClick={() => setShowModal(true)}>+</div>
      </div>
    
      {/* Add Item Modal */}
      {showModal && <div className="absolute inset-0 flex justify-center items-center">
        <div className="h-64 w-2/3 bg-white p-4 rounded-lg shadow-lg">
          <p>item</p>
          <input type="text" className="border-2 border-gray-200 rounded" placeholder="item name" id="item"></input>
          <p>category</p>
          <input type="text" className="border-2 border-gray-200 rounded" placeholder="category" id="category"></input>
          <p>quantity</p>
          <input type="number" className="border-2 border-gray-200 amount" placeholder="amount" id="amount"></input>
          <button>submit</button>
        </div>
      </div>}
      </main>
  );
}
