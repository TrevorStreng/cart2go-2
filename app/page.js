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
  const [editingItem, setEditingItem] = useState({
    categoryIndex: null,
    itemIndex: null,
  });
  const [editValue, setEditValue] = useState("");
  const modalRef = useRef(null);
  const editInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewItem({ ...newItem, [id]: value });
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
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

  const handleEditSubmit = (categoryIndex, itemIndex) => {
    const updatedItems = [...items];
    updatedItems[categoryIndex].items[itemIndex].name = editValue;
    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
    setEditingItem({ categoryIndex: null, itemIndex: null });
    setEditValue("");
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("items");
  };

  const toggleEditItem = (item, categoryIndex, itemIndex) => {
    console.log(categoryIndex);
    if (
      editingItem.categoryIndex === categoryIndex &&
      editingItem.itemIndex === itemIndex
    ) {
      console.log("herre");
      setEditingItem({
        categoryIndex: null,
        itemIndex: null,
      });
      setEditValue("");
    } else {
      console.log("no");
      setEditingItem({ categoryIndex, itemIndex });
      setEditValue(item.name);
    }
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

  // useEffect(() => {
  //   const handleClickOutsideEditing = (event) => {
  //     if (
  //       editInputRef.current &&
  //       !editInputRef.current.parentElement.parentElement.contains(event.target)
  //     ) {
  //       // setEditingItem({ categoryIndex: null, itemIndex: null });
  //       // setEditValue("");
  //     }
  //   };

  //   if (editValue) {
  //     document.addEventListener("mousedown", handleClickOutsideEditing);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutsideEditing);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutsideEditing);
  //   };
  // }, [editingItem]);

  useEffect(() => {
    if (editingItem.categoryIndex !== null && editingItem.itemIndex !== null) {
      editInputRef.current.focus();
    }
  }, [editingItem]);

  return (
    <main className="w-screen h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="p-4 text-3xl font-bold">Cart2Go</h1>
        <div className="w-full">
          {items && items.length > 0 ? (
            items.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className={`border-2 border-gray-200 ${
                  categoryIndex === 0 ? "border-b-0" : ""
                }`}
              >
                <h3 className="text-lg font-semibold bg-gray-100">
                  {category.category}
                </h3>
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`flex w-full justify-between items-center px-4 ${
                      itemIndex === 0 ? "border-t-2" : ""
                    } ${
                      itemIndex === category.items.length - 1
                        ? ""
                        : "border-b-2"
                    } h-16 py-2`}
                  >
                    <div className="flex items-center text-lg">
                      <span
                        className={`rounded-full w-4 h-4 border-gray-300 border-2 ${
                          item.checked ? "bg-green-600" : ""
                        }`}
                        onClick={() => checkItem(category, item)}
                      ></span>
                      {editingItem.categoryIndex === categoryIndex &&
                      editingItem.itemIndex === itemIndex ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={handleEditChange}
                          onBlur={() =>
                            handleEditSubmit(categoryIndex, itemIndex)
                          }
                          ref={editInputRef}
                          className="ml-2 border border-gray-300 rounded px-2"
                        />
                      ) : (
                        <p
                          className={`ml-2 ${
                            item.checked ? "line-through text-slate-400" : ""
                          }`}
                        >
                          {item.name}
                        </p>
                      )}
                    </div>
                    <img
                      src="/pencil-edit-button-svgrepo-com.svg"
                      className="w-5 cursor-pointer"
                      onClick={() => {
                        toggleEditItem(item, categoryIndex, itemIndex);
                      }}
                    ></img>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div>
              <p>Your cart is empty!</p>
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
      <div className="absolute top-0 right-0 p-2">
        <button onClick={clearCart}>clear</button>
      </div>
    </main>
  );
}
