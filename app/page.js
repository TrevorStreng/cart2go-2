"use client";
import { useState, useRef, useEffect } from "react";

// TODO: if an item already exists throw error or increment
// TODO: after an item is checked wait 2 second and then move it to a completed list. Possibly to the right side and one that can be navigated to
// TODO: add add bar at top for new items or serach bar to see what items are there

export default function Home() {
  const [items, setItems] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    checked: false,
  });
  const modalRef = useRef(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewItem({ ...newItem, [id]: value });
  };

  const addItem = (newItem) => {
    const updatedItems = items ? [...items] : [];
    const categoryIndex = updatedItems.findIndex(
      (item) => item.category === newItem.category
    );

    if (categoryIndex > -1) {
      updatedItems[categoryIndex].items.push({
        name: newItem.name,
        checked: newItem.checked,
        // amount: newItem.amount,
      });
    } else {
      updatedItems.push({
        category: newItem.category,
        items: [
          {
            name: newItem.name,
            checked: newItem.checked,
            // amount: newItem.amount,
          },
        ],
      });
    }

    setNewItem({
      name: "",
      category: "",
      checked: false,
    });
    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
    setShowModal(false);
  };

  const checkItem = (category, uncheckedItem) => {
    console.log("here");
    const updatedItems = items ? [...items] : [];

    const categoryIndex = items.findIndex(
      (item) => category.category === item.category
    );
    const itemIndex = items[categoryIndex].items.findIndex(
      (item) => item.name === uncheckedItem.name
    );

    updatedItems[categoryIndex].items[itemIndex].checked =
      !updatedItems[categoryIndex].items[itemIndex].checked;

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(newItem);
  };

  useEffect(() => {
    const storedItems = localStorage.getItem("items");
    storedItems ? setItems([...JSON.parse(storedItems)]) : setItems([]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <main className="w-screen h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="pt-4 text-3xl font-bold">Cart2Go</h1>
        <h2 className="p-4">Items</h2>
        <div className="w-2/3">
          {items && items.length > 0 ? (
            items.map((category, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-2xl mb-4"
              >
                <h3 className="text-lg font-semibold bg-gray-100 rounded-t-2xl">
                  {category.category}
                </h3>
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`flex items-center px-4 ${
                      itemIndex === 0 ? "border-t-2" : ""
                    } ${
                      itemIndex === category.items.length - 1
                        ? ""
                        : "border-b-2"
                    } h-16 py-2`}
                  >
                    <span
                      className={`rounded-full w-4 h-4 border-gray-300 border-2 ${
                        item.checked ? "bg-green-600" : ""
                      }`}
                      onClick={() => checkItem(category, item)}
                    ></span>
                    <p className="ml-2">{item.name}</p>
                    {/* <p>{item.amount}</p> */}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div>
              <p>add items</p>
            </div>
          )}
        </div>
        {/* make this an svg for better */}
        <div
          className="absolute bottom-2 right-4 rounded-full bg-green-400 h-12 w-12 flex justify-center items-center text-4xl text-gray-200"
          onClick={() => setShowModal(true)}
        >
          +
        </div>
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="absolute inset-0 flex justify-center items-center">
          <form
            ref={modalRef}
            className="flex flex-col justify-evenly h-64 w-2/3 bg-white p-4 rounded-lg shadow-lg"
            onSubmit={handleSubmit}
          >
            <div>
              <p>item</p>
              <input
                type="text"
                className="border-2 border-gray-200 rounded"
                placeholder="item name"
                id="name"
                value={newItem.name}
                onChange={handleInputChange}
              ></input>
            </div>
            <div>
              <p>category</p>
              <input
                type="text"
                className="border-2 border-gray-200 rounded"
                placeholder="category"
                id="category"
                value={newItem.category}
                onChange={handleInputChange}
              ></input>
            </div>
            {/* <div>
              <p>quantity</p>
              <input
                type="number"
                className="border-2 border-gray-200 amount"
                placeholder="amount"
                id="amount"
                value={newItem.amount}
                onChange={handleInputChange}
              ></input>
            </div> */}
            <div className="flex justify-center">
              <button className="border-2 rounded">submit</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
