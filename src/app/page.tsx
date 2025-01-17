"use client";

import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import ExportActions from './ExportActions';

interface InvoiceItem {
  id: number;
  description: string;
  qty: number;
  price: number;
}

export default function Home() {
  const [issuedTo, setIssuedTo] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState<InvoiceItem>({
    id: 1,
    description: "",
    qty: 0,
    price: 0,
  });

  const addItem = () => {
    if (newItem.description && newItem.qty && newItem.price) {
      const updatedItems = [...items, { ...newItem, id: items.length + 1 }];
      setItems(updatedItems);
      setNewItem({
        id: updatedItems.length + 1,
        description: "",
        qty: 0,
        price: 0,
      });
    }
  };

  const removeItem = (id: number) => {
    // Remove the item first
    const updatedItems = items.filter((item) => item.id !== id);
    // Reassign IDs to maintain sequence
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      id: index + 1
    }));
    setItems(reorderedItems);
    
    // Update the newItem ID to be the next in sequence
    setNewItem({
      ...newItem,
      id: reorderedItems.length + 1
    });
  };

  const calculateSubtotal = (qty: number, price: number) => {
    return qty * price;
  };

  const calculateGrandTotal = () => {
    return items.reduce((total, item) => total + calculateSubtotal(item.qty, item.price), 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  // Generate empty rows
  const emptyRows = () => {
    const rows = [];
    const emptyCellClass = "border border-gray-300 p-8";
    for (let i = 0; i < 3; i++) {
      rows.push(
        <tr key={`empty-${i}`}>
          <td className={emptyCellClass}></td>
          <td className={emptyCellClass}></td>
          <td className={emptyCellClass}></td>
          <td className={emptyCellClass}></td>
          <td className={emptyCellClass}></td>
          <td className={emptyCellClass}></td>
        </tr>
      );
    }
    return rows;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
        {/* Input Form */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Create Invoice</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Issued To :</label>
              <input
                type="text"
                value={issuedTo}
                onChange={(e) => setIssuedTo(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Enter recipient name"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Details :</label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                <div className="md:col-span-5">
                <input
                    type="text"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    onKeyPress={handleKeyPress}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="md:col-span-2">
                <input
                    type="number"
                    placeholder="Qty"
                    value={newItem.qty || ""}
                    onChange={(e) => setNewItem({ ...newItem, qty: Number(e.target.value) })}
                    onKeyPress={handleKeyPress}
                    min="0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="md:col-span-3">
                <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price || ""}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    onKeyPress={handleKeyPress}
                    min="0"
                    step="0.01"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="md:col-span-2">
                <button
                    onClick={addItem}
                    className="w-full h-full flex items-center justify-center bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Preview */}
        <div id="invoice-content" className="bg-white p-6 md:p-12 rounded-lg shadow-md relative overflow-hidden min-h-[1000px]">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-pink-200 -translate-x-12 md:-translate-x-16 -translate-y-12 md:-translate-y-16 transform rotate-45"></div>
          <div className="absolute bottom-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-teal-600 translate-x-12 md:translate-x-16 translate-y-12 md:translate-y-16 transform rotate-45"></div>

          <div className="relative">
            <h1 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-center">INVOICE COE 2025</h1>

            <div className="relative">
              <div className="grid grid-cols-3 gap-4 mb-12">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Date Issued</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Invoice No.</p>
                  <p className="font-medium">INV-2025-001</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Issued To</p>
                  <p className="font-medium">{issuedTo || "---"}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mb-12">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 bg-gray-100 p-4 text-left">NO</th>
                    <th className="border border-gray-300 bg-gray-100 p-4 text-left">DESCRIPTION</th>
                    <th className="border border-gray-300 bg-gray-100 p-4 text-right">QTY</th>
                    <th className="border border-gray-300 bg-gray-100 p-4 text-right">PRICE</th>
                    <th className="border border-gray-300 bg-gray-100 p-4 text-right">SUBTOTAL</th>
                    <th className="border border-gray-300 bg-gray-100 p-4 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="group relative">
                      <td className="border border-gray-300 p-4">{item.id}</td>
                      <td className="border border-gray-300 p-4">{item.description}</td>
                      <td className="border border-gray-300 p-4 text-right">{item.qty}</td>
                      <td className="border border-gray-300 p-4 text-right">RM{item.price}</td>
                      <td className="border border-gray-300 p-4 text-right">
                        RM{calculateSubtotal(item.qty, item.price)}
                      </td>
                      {/* Delete button as an absolute positioned element */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:block text-red-500 hover:text-red-700 print:hidden"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </tr>
                  ))}
                  {emptyRows()}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="border border-gray-300 p-4 text-right font-medium">
                      GRAND TOTAL
                    </td>
                    <td className="border border-gray-300 p-4 text-right font-medium">
                      RM{calculateGrandTotal()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="text-xl font-bold mb-8 text-left">Thank You</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-4">
              <div>
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                <p>Affin Bank</p>
                <p>206850008687</p>
                <p>Nur Fatin Amalina Binti Zulkifli</p>
              </div>
              
              <div className="text-center md:text-right">
                <div className="inline-block">
                  <div className="mb-2">
                    <Image
                      src="/signature.png"
                      alt="Digital Signature"
                      width={150}
                      height={150}
                      className="object-contain mx-auto"
                    />
                  </div>
                  <div className="border-t border-black pt-2">
                    <p className="font-medium">Nur Fatin Amalina</p>
                    <p className="text-sm text-gray-600 text-center">Treasurer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          

        </div>

        {/* Add Export Actions */}
        <ExportActions 
              issuedTo={issuedTo}
              grandTotal={calculateGrandTotal()}
            />
      </div>

      
    </div>
  );
}