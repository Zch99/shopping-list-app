'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function ShoppingListApp() {
  const [lists, setLists] = useState(() => JSON.parse(localStorage.getItem('shoppingLists') || '[]') || [{ name: 'My Shopping List', items: [] }]);
  const [activeListIndex, setActiveListIndex] = useState(0);
  const [editingListName, setEditingListName] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('Lidl');
  const [image, setImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const imageInputRef = useRef(null);

  const items = lists[activeListIndex]?.items || [];

  useEffect(() => {
    localStorage.setItem('shoppingLists', JSON.stringify(lists));
  }, [lists]);

  const updateListItems = (newItems) => {
    const updatedLists = [...lists];
    updatedLists[activeListIndex].items = newItems;
    setLists(updatedLists);
  };

  const handleAddItem = () => {
    if (!name.trim()) return;
    const parsedPrice = parseFloat(price.replace(',', '.')) || 0;
    const newItem = {
      name,
      price: parsedPrice,
      store,
      image,
      quantity: 1,
      completed: false,
    };
    const updated = [...items];
    if (editIndex !== null) {
      updated[editIndex] = { ...updated[editIndex], ...newItem };
      setEditIndex(null);
    } else {
      updated.push(newItem);
    }
    updateListItems(updated);
    setName('');
    setPrice('');
    setImage(null);
  };

  const handlePasteImage = (e) => {
    const itemsCopied = e.clipboardData.items;
    for (let i = 0; i < itemsCopied.length; i++) {
      if (itemsCopied[i].type.indexOf('image') !== -1) {
        const blob = itemsCopied[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => setImage(event.target.result);
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target.result);
    reader.readAsDataURL(file);
  };

  const toggleComplete = (index) => {
    const updated = [...items];
    updated[index].completed = !updated[index].completed;
    updateListItems(updated);
  };

  const updateQuantity = (index, delta) => {
    const updated = [...items];
    updated[index].quantity = Math.max(1, updated[index].quantity + delta);
    updateListItems(updated);
  };

  const deleteItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    updateListItems(updated);
  };

  const startEdit = (index) => {
    const item = items[index];
    setEditIndex(index);
    setName(item.name);
    setPrice(item.price.toString().replace('.', ','));
    setStore(item.store);
    setImage(item.image);
  };

  const addNewList = () => {
    const newList = { name: `List ${lists.length + 1}`, items: [] };
    setLists([...lists, newList]);
    setActiveListIndex(lists.length);
  };

  const renameList = (newName) => {
    const updated = [...lists];
    updated[activeListIndex].name = newName;
    setLists(updated);
    setEditingListName(false);
  };

  const deleteList = (index) => {
    const updated = lists.filter((_, i) => i !== index);
    setLists(updated);
    setActiveListIndex(0);
  };

  const total = items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {editingListName ? (
            <Input
              autoFocus
              className="text-2xl font-bold w-auto"
              defaultValue={lists[activeListIndex].name}
              onBlur={(e) => renameList(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') renameList(e.target.value);
              }}
            />
          ) : (
            <h1
              className="text-2xl font-bold cursor-pointer"
              onClick={() => setEditingListName(true)}
            >
              🛒 {lists[activeListIndex]?.name || 'Shopping List'}
            </h1>
          )}
          <button
            onClick={addNewList}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-700 text-white hover:bg-blue-800"
          >
            <Plus size={18} />
          </button>
        </div>

        <Select value={activeListIndex.toString()} onValueChange={(val) => setActiveListIndex(Number(val))}>
          <SelectTrigger className="w-48 border rounded-md px-2 py-1 text-sm">
            <SelectValue placeholder="Choose List" />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-md shadow-lg">
            {lists.map((list, i) => (
              <div key={i} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
                <SelectItem value={i.toString()} className="flex-1">{list.name}</SelectItem>
                {lists.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteList(i);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 ml-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4" onPaste={handlePasteImage}>
        <Input placeholder="Item name..." value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Price (e.g., 2,99)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Select value={store} onValueChange={setStore}>
          <SelectTrigger>
            <SelectValue placeholder="Select Store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lidl">Lidl</SelectItem>
            <SelectItem value="Kaufland">Kaufland</SelectItem>
          </SelectContent>
        </Select>
        <div>
          <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} />
          {image && <img src={image} alt="Preview" className="mt-2 max-h-32 rounded-md border object-contain" />}
          <p className="text-xs text-gray-400 mt-1">Paste an image or upload a file</p>
        </div>
        <Button onClick={handleAddItem} className="w-full sm:w-auto">
          {editIndex !== null ? 'Update Item' : 'Add Item'}
        </Button>
      </div>

      <div className="text-right font-semibold text-lg">
        Total: €{total.toFixed(2).replace('.', ',')}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <Card
            key={index}
            className={`relative p-4 h-full cursor-pointer transition-all ${item.completed ? 'bg-gray-100 opacity-50' : ''}`}
            onClick={() => toggleComplete(index)}
          >
            <CardContent>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(index);
                }}
                className="absolute top-2 left-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(index);
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <Pencil size={18} />
              </button>
              <p className="font-semibold text-lg break-words">{item.name}</p>
              <p className="text-sm text-gray-700">Price: €{item.price.toFixed(2).replace('.', ',')}</p>
              <p className="text-sm text-gray-700">Store: {item.store}</p>
              <p className="text-sm text-gray-700">Qty: {item.quantity}</p>
              {item.image && (
                <img
                  src={item.image}
                  alt="Product"
                  className="mt-2 max-h-48 w-full object-contain rounded-lg border"
                />
              )}
              <div className="flex items-center justify-end gap-2 mt-4">
                <Button size="sm" onClick={(e) => { e.stopPropagation(); updateQuantity(index, -1); }}>-</Button>
                <span className="px-2">{item.quantity}</span>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); updateQuantity(index, 1); }}>+</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
