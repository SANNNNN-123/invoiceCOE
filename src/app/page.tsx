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
  const [paymentMethod, setPaymentMethod] = useState("cash");
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
    const updatedItems = items.filter((item) => item.id !== id);
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      id: index + 1
    }));
    setItems(reorderedItems);
    setNewItem({
      ...newItem,
      id: reorderedItems.length + 1
    });
  };

  const calculateSubtotal = (qty: number, price: number) => qty * price;
  const calculateGrandTotal = () => 
    items.reduce((total, item) => total + calculateSubtotal(item.qty, item.price), 0);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  return (
    <div className="min-h-screen p-4" style={{
      background: `
        radial-gradient(circle, #999999 1px, transparent 1px) 0 0 / 20px 20px,
        #e5e7eb
      `
    }}>
      <div className="max-w-sm mx-auto space-y-6">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-xl">
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
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.qty || ""}
                  onChange={(e) => setNewItem({ ...newItem, qty: Number(e.target.value) })}
                  onKeyPress={handleKeyPress}
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Price (RM)"
                  value={newItem.price || ""}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  onKeyPress={handleKeyPress}
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  onClick={addItem}
                  className="w-full p-2 flex items-center justify-center bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add Item
                </button>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method :</label>
              <div className="space-x-4 flex items-center">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio h-4 w-4 text-teal-600"
                  />
                  <span className="ml-2">Cash</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio h-4 w-4 text-teal-600"
                  />
                  <span className="ml-2">Online</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Preview */}
        <div 
          id="invoice-content" 
          className="bg-white p-6 max-w-sm mx-auto relative"
          style={{
            position: 'relative',
            marginTop: '20px',
            marginBottom: '20px',
            background: '#ffffff',
            minWidth: '250px',
            minHeight: '130px',
            boxShadow: `
              inset 0 0 35px rgba(0,0,0,0.1),
              5px 5px 15px rgba(0,0,0,0.2)
            `,
            borderRadius: '2px'
          }}
        >
          {/* Paper Background Texture */}
          

          {/* Top Tape */}
          <div
            style={{
              position: 'absolute',
              height: '3vmin',
              top: '-8px',
              width: '110%',
              left: '-5%',
              backgroundColor: '#dbd8be',
              borderRight: '1px dotted #b7b49d',
              borderLeft: '1px dotted #b7b49d',
              opacity: 0.6,
              zIndex: 10,
              transform: 'rotate(-0.5deg)'
            }}
          />

          {/* Bottom Tape */}
          <div
            style={{
              position: 'absolute',
              height: '3vmin',
              bottom: '-8px',
              width: '110%',
              left: '-5%',
              backgroundColor: '#dbd8be',
              borderRight: '1px dotted #b7b49d',
              borderLeft: '1px dotted #b7b49d',
              opacity: 0.6,
              zIndex: 10,
              transform: 'rotate(0.5deg)'
            }}
          />

          {/* Paper Fold Effect */}
          <div
            style={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                linear-gradient(
                  rgba(255,255,255,0),
                  50%,
                  rgba(0,0,0,0.1),
                  51%,
                  rgba(255,255,255,0)
                ),
                linear-gradient(
                  to right,
                  rgba(255,255,255,0),
                  50%,
                  rgba(0,0,0,0.1),
                  51%,
                  rgba(255,255,255,0)
                )
              `,
              zIndex: 3,
              pointerEvents: 'none'
            }}
          />

          {/* Rest of the invoice content */}
          <div style={{ 
            position: 'relative', 
            zIndex: 5,
            background: `
              linear-gradient(to right, rgba(0,0,0,0.02) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.02) 100%)
            `
          }}>
            {/* Header */}
            <div className="mb-2">
              <h1 className="text-2xl font-bold mb-4 text-center">INVOICE COE 2025</h1>
              
              <div className="flex justify-between text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Hospital Al-Sultan Abdullah</p>
                  <p>UiTM Puncak Alam</p>
                  <p>Malaysia</p>
                  <p>Issued To : <span className="font-bold">{issuedTo}</span></p>
                </div>
                <div className="text-right space-y-1 text-gray-600">
                  <p>{new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                  })}</p>
                  <p>{new Date().toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}</p>
                  <p>{new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}</p>
                </div>
              </div>
            </div>

            {/* Dotted Line */}
            <div className="border-t-4 border-dotted border-black my-2" />

            {/* Invoice Info */}
            <div className="text-sm text-center my-2">
              <p className="font-medium">ORDER RECEIPT #{String(items.length + 1).padStart(3, '0')}</p>
            </div>

            {/* Dotted Line */}
            <div className="border-t-4 border-dotted border-black my-2" />

            {/* Items Table */}
            <div className="my-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 text-sm font-bold mb-2 text-gray-700">
                <div className="col-span-2">NO.</div>
                <div className="col-span-5 text-center">ITEM</div>
                <div className="col-span-2 text-center">QTY</div>
                <div className="col-span-3 text-right">PRICE</div>
              </div>

              {/* Table Body */}
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 text-sm py-1 text-gray-600 group">
                  <div className="col-span-2 flex items-center">
                    #{item.id}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                  <div className="col-span-5 text-center">{item.description}</div>
                  <div className="col-span-2 text-center">{item.qty}</div>
                  <div className="col-span-3 text-right">RM {item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Dotted Line */}
            <div className="border-t-4 border-dotted border-black my-2" />

            {/* Totals */}
            <div className="text-sm space-y-1 my-4 text-gray-600">
              <div className="grid grid-cols-2">
                <div className="text-right pr-4">SUBTOTAL</div>
                <div className="text-right">RM {calculateGrandTotal().toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-right pr-4">TAX</div>
                <div className="text-right">RM 0.00</div>
              </div>
              <div className="grid grid-cols-2 font-bold text-gray-700">
                <div className="text-right pr-4">TOTAL</div>
                <div className="text-right">RM {calculateGrandTotal().toFixed(2)}</div>
              </div>
            </div>

            {/* Dotted Line */}
            <div className="border-t-4 border-dotted border-black my-2" />

            {/* Payment Info */}
            <div className="text-sm space-y-1 mb-4 text-gray-600">
              <div className="grid grid-cols-2">
                <div>Transaction Id</div>
                <div className="text-right">#24521</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Payment Method</div>
                <div className="text-right">{paymentMethod === 'cash' ? 'Cash' : 'Online Banking'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Bank Account</div>
                <div className="text-right">206850008687</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Status</div>
                <div className="text-right font-medium text-green-600">Approved</div>
              </div>
            </div>

            {/* Dotted Line */}
            <div className="border-t-4 border-dotted border-black my-2" />

            {/* Barcode */}
            <div className="flex justify-center mb-2">
              <svg className="w-full" width="297px" height="60px" x="0px" y="0px" viewBox="0 0 297 60" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <rect x="0" y="0" width="297" height="60" style={{fill:"#ffffff"}}></rect>
                <g transform="translate(10, 10)" style={{fill:"#000000"}}>
                  <rect x="0" y="0" width="2" height="40"></rect>
                  <rect x="3" y="0" width="1" height="40"></rect>
                  <rect x="6" y="0" width="1" height="40"></rect>
                  <rect x="11" y="0" width="1" height="40"></rect>
                  <rect x="14" y="0" width="2" height="40"></rect>
                  <rect x="17" y="0" width="1" height="40"></rect>
                  <rect x="22" y="0" width="1" height="40"></rect>
                  <rect x="27" y="0" width="2" height="40"></rect>
                  <rect x="30" y="0" width="1" height="40"></rect>
                  <rect x="33" y="0" width="1" height="40"></rect>
                  <rect x="36" y="0" width="4" height="40"></rect>
                  <rect x="41" y="0" width="1" height="40"></rect>
                  <rect x="44" y="0" width="1" height="40"></rect>
                  <rect x="47" y="0" width="2" height="40"></rect>
                  <rect x="53" y="0" width="1" height="40"></rect>
                  <rect x="55" y="0" width="1" height="40"></rect>
                  <rect x="58" y="0" width="4" height="40"></rect>
                  <rect x="64" y="0" width="1" height="40"></rect>
                  <rect x="66" y="0" width="1" height="40"></rect>
                  <rect x="69" y="0" width="1" height="40"></rect>
                  <rect x="74" y="0" width="2" height="40"></rect>
                  <rect x="77" y="0" width="1" height="40"></rect>
                  <rect x="80" y="0" width="2" height="40"></rect>
                  <rect x="84" y="0" width="3" height="40"></rect>
                  <rect x="88" y="0" width="1" height="40"></rect>
                  <rect x="93" y="0" width="1" height="40"></rect>
                  <rect x="95" y="0" width="2" height="40"></rect>
                  <rect x="99" y="0" width="1" height="40"></rect>
                  <rect x="103" y="0" width="4" height="40"></rect>
                  <rect x="108" y="0" width="1" height="40"></rect>
                  <rect x="110" y="0" width="4" height="40"></rect>
                  <rect x="115" y="0" width="3" height="40"></rect>
                  <rect x="119" y="0" width="1" height="40"></rect>
                  <rect x="121" y="0" width="1" height="40"></rect>
                  <rect x="123" y="0" width="3" height="40"></rect>
                  <rect x="128" y="0" width="2" height="40"></rect>
                  <rect x="132" y="0" width="2" height="40"></rect>
                  <rect x="135" y="0" width="3" height="40"></rect>
                  <rect x="139" y="0" width="1" height="40"></rect>
                  <rect x="143" y="0" width="1" height="40"></rect>
                  <rect x="145" y="0" width="1" height="40"></rect>
                  <rect x="149" y="0" width="2" height="40"></rect>
                  <rect x="154" y="0" width="1" height="40"></rect>
                  <rect x="156" y="0" width="3" height="40"></rect>
                  <rect x="162" y="0" width="2" height="40"></rect>
                  <rect x="165" y="0" width="1" height="40"></rect>
                  <rect x="167" y="0" width="3" height="40"></rect>
                  <rect x="173" y="0" width="2" height="40"></rect>
                  <rect x="176" y="0" width="1" height="40"></rect>
                  <rect x="178" y="0" width="3" height="40"></rect>
                  <rect x="184" y="0" width="2" height="40"></rect>
                  <rect x="187" y="0" width="1" height="40"></rect>
                  <rect x="189" y="0" width="3" height="40"></rect>
                  <rect x="195" y="0" width="2" height="40"></rect>
                  <rect x="198" y="0" width="1" height="40"></rect>
                  <rect x="200" y="0" width="3" height="40"></rect>
                  <rect x="206" y="0" width="2" height="40"></rect>
                  <rect x="209" y="0" width="1" height="40"></rect>
                  <rect x="212" y="0" width="2" height="40"></rect>
                  <rect x="215" y="0" width="3" height="40"></rect>
                  <rect x="220" y="0" width="1" height="40"></rect>
                  <rect x="223" y="0" width="3" height="40"></rect>
                  <rect x="228" y="0" width="2" height="40"></rect>
                  <rect x="231" y="0" width="2" height="40"></rect>
                  <rect x="235" y="0" width="3" height="40"></rect>
                  <rect x="240" y="0" width="1" height="40"></rect>
                  <rect x="242" y="0" width="2" height="40"></rect>
                  <rect x="246" y="0" width="1" height="40"></rect>
                  <rect x="248" y="0" width="3" height="40"></rect>
                  <rect x="253" y="0" width="2" height="40"></rect>
                  <rect x="259" y="0" width="1" height="40"></rect>
                  <rect x="262" y="0" width="1" height="40"></rect>
                  <rect x="264" y="0" width="2" height="40"></rect>
                  <rect x="269" y="0" width="3" height="40"></rect>
                  <rect x="273" y="0" width="1" height="40"></rect>
                  <rect x="275" y="0" width="2" height="40"></rect>
                </g>
              </svg>
            </div>

            {/* Thank You Message */}
            <div className="text-center text-sm font-medium text-gray-700">
              <p>THANK YOU FOR YOUR BUSINESS!</p>
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