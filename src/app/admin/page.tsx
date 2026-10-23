'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  getOrders,
  getContainers,
  getProducts,
  getSettings,
  updateOrderStatus,
  markContainerShipped,
  markContainerDelivered,
  updateProduct,
  updateSettings,
  generatePackingListCSV,
} from '@/lib/data';
import { Order, Container, Product, StoreSettings } from '@/types';
import ContainerProgressBar from '@/components/ContainerProgressBar';
import {
  Ship,
  Package,
  Layers,
  Settings,
  Download,
  CheckCircle2,
  AlertCircle,
  Edit,
  Save,
  Plus,
  Search,
  Filter,
  Truck,
  ExternalLink,
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'containers' | 'products' | 'settings'>('containers');
  const [orders, setOrders] = useState<Order[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Orders Tab Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Containers Tab Ship Modal
  const [shipModalContainer, setShipModalContainer] = useState<Container | null>(null);
  const [shipTrackingNote, setShipTrackingNote] = useState('');
  const [shipDate, setShipDate] = useState('2026-11-01');

  // Product Edit
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const refreshData = async () => {
    setLoading(true);
    const [o, c, p, s] = await Promise.all([
      getOrders(),
      getContainers(),
      getProducts(),
      getSettings(),
    ]);
    setOrders(o);
    setContainers(c);
    setProducts(p);
    setSettings(s);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const triggerNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Orders Actions
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    triggerNotice(`Updated order ${orderId} status to ${status}`);
    refreshData();
  };

  // Containers Actions
  const handleOpenShipModal = (container: Container) => {
    setShipModalContainer(container);
    setShipTrackingNote(
      container.tracking_note ||
        'Vessel: Maersk Ganges, Nhava Sheva (INNSA) ➔ Rotterdam (NLRTM). Bill of Lading: MSK-IN-9821'
    );
  };

  const handleConfirmShipContainer = async () => {
    if (!shipModalContainer) return;
    await markContainerShipped(shipModalContainer.id, shipTrackingNote, shipDate);
    triggerNotice(`Marked ${shipModalContainer.label} as shipped! All orders inside updated to 'shipped'.`);
    setShipModalContainer(null);
    refreshData();
  };

  const handleMarkDeliveredContainer = async (containerId: string) => {
    await markContainerDelivered(containerId);
    triggerNotice(`Marked container and all associated orders as 'delivered'!`);
    refreshData();
  };

  const handleExportCSV = async (containerId: string, label: string) => {
    const csvContent = await generatePackingListCSV(containerId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Packing_List_${label.replace(/[^a-zA-Z0-9_-]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotice(`Exported packing list CSV for ${label}`);
  };

  // Product Actions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, {
      price_eur: Number(editingProduct.price_eur),
      stock: Number(editingProduct.stock),
      units_per_container_slot: Number(editingProduct.units_per_container_slot),
      active: editingProduct.active,
    });
    triggerNotice(`Saved product ${editingProduct.name}`);
    setEditingProduct(null);
    refreshData();
  };

  // Settings Actions
  const handleUpdateSettingField = async (field: keyof StoreSettings, val: unknown) => {
    if (!settings) return;
    const updated = await updateSettings({ [field]: val });
    setSettings(updated);
    triggerNotice(`Updated store settings`);
  };

  const handleToggleCountry = async (countryCode: string) => {
    if (!settings) return;
    const updatedCountries = settings.allowed_countries.map((c) =>
      c.code === countryCode ? { ...c, is_allowed: !c.is_allowed } : c
    );
    const updated = await updateSettings({ allowed_countries: updatedCountries });
    setSettings(updated);
    triggerNotice(`Updated country permission`);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const num = o.order_number.toLowerCase();
      const mail = o.email.toLowerCase();
      const customer = `${o.shipping_address.first_name} ${o.shipping_address.last_name}`.toLowerCase();
      return num.includes(q) || mail.includes(q) || customer.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Admin Top Banner */}
      <div className="bg-[#173f34] text-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#e5a439] uppercase tracking-wider">
              Vintage Collections Admin Portal
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#123129] text-gray-200 border border-[#23594b]">
              Maker-Exporter Management
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-1">
            Sea Container Pooling & Operations Desk
          </h1>
          <p className="text-xs text-gray-300 mt-0.5">
            Manage European order pooling, mark containers shipped, update catalog stock, and download packing lists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            className="px-3 py-1.5 bg-[#1f4f42] hover:bg-[#286353] rounded text-xs font-semibold text-[#e5a439] transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2 overflow-x-auto">
        {[
          { key: 'containers', label: 'Sea Containers & Packing Lists', icon: Ship, badge: containers.length },
          { key: 'orders', label: 'European Orders', icon: Package, badge: orders.length },
          { key: 'products', label: 'Shade Catalog & Stock', icon: Layers, badge: products.length },
          { key: 'settings', label: 'Shipping & Country Rates', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 font-heading font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-[#c68a24] text-[#173f34] dark:text-[#e5a439]'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: CONTAINERS & PACKING LISTS */}
      {activeTab === 'containers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              European Sea Freight Containers
            </h2>
            <p className="text-xs text-gray-500">
              Orders automatically join the open container. Marking shipped updates all orders inside.
            </p>
          </div>

          <div className="space-y-6">
            {containers.map((container) => {
              const ordersInside = orders.filter((o) => o.container_id === container.id);
              const totalItemsInside = ordersInside.reduce(
                (sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0),
                0
              );

              return (
                <div
                  key={container.id}
                  className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-lg text-gray-900 dark:text-white">
                          {container.label}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            container.status === 'open'
                              ? 'bg-amber-100 text-amber-800'
                              : container.status === 'full'
                              ? 'bg-blue-100 text-blue-800'
                              : container.status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {container.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Capacity: {container.capacity_units} units • Used: {container.used_units} units ({ordersInside.length} orders, {totalItemsInside} lamp shades)
                      </p>
                    </div>

                    {/* Container Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Export CSV Packing List */}
                      <button
                        onClick={() => handleExportCSV(container.id, container.label)}
                        className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#c68a24]" />
                        <span>Export Packing List (CSV)</span>
                      </button>

                      {/* Mark Shipped (updates all orders!) */}
                      {container.status !== 'shipped' && container.status !== 'delivered' && (
                        <button
                          onClick={() => handleOpenShipModal(container)}
                          className="px-3 py-1.5 rounded bg-[#173f34] hover:bg-[#1f4f42] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <Ship className="w-3.5 h-3.5 text-[#e5a439]" />
                          <span>Mark Shipped</span>
                        </button>
                      )}

                      {/* Mark Delivered */}
                      {container.status === 'shipped' && (
                        <button
                          onClick={() => handleMarkDeliveredContainer(container.id)}
                          className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Delivered</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <ContainerProgressBar container={container} showDetails={false} />

                  {/* Tracking Note */}
                  {container.tracking_note && (
                    <div className="p-3 bg-[#f7faf8] dark:bg-[#121c17] rounded text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                      <strong>Tracking / Vessel Logistics:</strong> {container.tracking_note}
                    </div>
                  )}

                  {/* Orders Inside Table */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                      Orders Consolidated in {container.label} ({ordersInside.length}):
                    </span>
                    {ordersInside.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No orders in this container yet.</p>
                    ) : (
                      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto text-xs">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-800 text-left">
                          <thead className="bg-gray-50 dark:bg-[#121c17] text-gray-500 font-semibold">
                            <tr>
                              <th className="px-3 py-2">Order #</th>
                              <th className="px-3 py-2">Customer</th>
                              <th className="px-3 py-2">Country</th>
                              <th className="px-3 py-2">Slot Units</th>
                              <th className="px-3 py-2">Amount</th>
                              <th className="px-3 py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {ordersInside.map((ord) => (
                              <tr key={ord.id} className="hover:bg-gray-50 dark:hover:bg-[#14231c]">
                                <td className="px-3 py-2 font-mono font-bold text-[#173f34] dark:text-[#e5a439]">
                                  {ord.order_number}
                                </td>
                                <td className="px-3 py-2">
                                  {ord.shipping_address.first_name} {ord.shipping_address.last_name}
                                </td>
                                <td className="px-3 py-2">{ord.shipping_address.country}</td>
                                <td className="px-3 py-2 font-semibold">{ord.total_container_units}</td>
                                <td className="px-3 py-2">€{ord.total.toFixed(2)}</td>
                                <td className="px-3 py-2">
                                  <span className="capitalize px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800">
                                    {ord.status.replace('_', ' ')}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS LIST */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              Customer Orders & Manifest
            </h2>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order #, customer, email..."
                  className="px-3 py-1.5 pl-8 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] text-xs outline-none"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] text-xs outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="in_container">In Container</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-[#121c17] text-gray-500 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Order #</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer & Destination</th>
                    <th className="px-4 py-3">Container</th>
                    <th className="px-4 py-3">Items & Slots</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredOrders.map((ord) => {
                    const cont = containers.find((c) => c.id === ord.container_id);
                    return (
                      <tr key={ord.id} className="hover:bg-gray-50 dark:hover:bg-[#14231c]">
                        <td className="px-4 py-3 font-mono font-bold text-[#173f34] dark:text-[#e5a439]">
                          {ord.order_number}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(ord.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {ord.shipping_address.first_name} {ord.shipping_address.last_name}
                          </p>
                          <p className="text-[11px] text-gray-500">{ord.email}</p>
                          <p className="text-[11px] text-gray-400">{ord.shipping_address.city}, {ord.shipping_address.country}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-[#173f34] dark:text-[#e5a439]">
                            {cont?.label || 'Unassigned'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {ord.items.reduce((s, i) => s + i.qty, 0)} shades
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {ord.total_container_units} container slot units
                          </p>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                          €{ord.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.status === 'in_container'
                                ? 'bg-amber-100 text-amber-800'
                                : ord.status === 'shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {ord.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                            className="px-2 py-1 border rounded text-[11px] bg-white dark:bg-[#121c17] outline-none"
                          >
                            <option value="pending_payment">pending_payment</option>
                            <option value="paid">paid</option>
                            <option value="in_container">in_container</option>
                            <option value="shipped">shipped</option>
                            <option value="delivered">delivered</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS & STOCK */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                Handwoven Shade Catalog
              </h2>
              <p className="text-xs text-gray-500">
                8 placeholder products reusing the 3 real photos. Modify stock, container slot units, or pricing.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-[#121c17] text-gray-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Shade Name</th>
                  <th className="px-4 py-3">Shape & Approx Size</th>
                  <th className="px-4 py-3">Price (EUR)</th>
                  <th className="px-4 py-3">Container Slots</th>
                  <th className="px-4 py-3">Stock Ready</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-[#14231c]">
                    <td className="px-4 py-2">
                      <div className="relative w-10 h-10 rounded overflow-hidden border border-gray-200 bg-gray-50">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white max-w-xs">
                      {p.name}
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {p.shape} • {p.size_approx}
                    </td>
                    <td className="px-4 py-2 font-bold text-[#173f34] dark:text-[#e5a439]">
                      €{p.price_eur.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{p.units_per_container_slot} unit slot</td>
                    <td className="px-4 py-2">{p.stock} units</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                        {p.active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => setEditingProduct({ ...p })}
                        className="px-2.5 py-1 rounded border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1 ml-auto"
                      >
                        <Edit className="w-3 h-3 text-[#c68a24]" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && settings && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-5">
            <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white">
              Container Defaults & Store Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Default Container Capacity (Units)
                </label>
                <input
                  type="number"
                  value={settings.default_container_capacity}
                  onChange={(e) => handleUpdateSettingField('default_container_capacity', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded dark:bg-[#121c17] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Estimated Ship Window Notice
                </label>
                <input
                  type="text"
                  value={settings.estimated_ship_date_fallback}
                  onChange={(e) => handleUpdateSettingField('estimated_ship_date_fallback', e.target.value)}
                  className="w-full px-3 py-2 border rounded dark:bg-[#121c17] outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="font-bold text-xs text-gray-700 dark:text-gray-300 block mb-1">
                Handmade Statement / Disclaimer (Mandatory Handloom Rule)
              </label>
              <textarea
                value={settings.handmade_disclaimer}
                onChange={(e) => handleUpdateSettingField('handmade_disclaimer', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border rounded dark:bg-[#121c17] outline-none"
              />
            </div>
          </div>

          {/* European Shipping Fee Table */}
          <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white">
              European Country Sea Freight Rates
            </h2>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto text-xs">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-800 text-left">
                <thead className="bg-gray-50 dark:bg-[#121c17] text-gray-500 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Code</th>
                    <th className="px-4 py-2.5">European Country</th>
                    <th className="px-4 py-2.5">Sea Freight Fee (EUR)</th>
                    <th className="px-4 py-2.5">Estimated Maritime Transit</th>
                    <th className="px-4 py-2.5 text-right">Allowed Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {settings.allowed_countries.map((c) => (
                    <tr key={c.code} className="hover:bg-gray-50 dark:hover:bg-[#14231c]">
                      <td className="px-4 py-2 font-mono font-bold">{c.code}</td>
                      <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">{c.name}</td>
                      <td className="px-4 py-2 font-bold text-[#173f34] dark:text-[#e5a439]">€{c.fee_eur.toFixed(2)}</td>
                      <td className="px-4 py-2 text-gray-500">{c.estimated_transit_days}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => handleToggleCountry(c.code)}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            c.is_allowed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {c.is_allowed ? 'Allowed' : 'Disabled'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SHIP CONTAINER MODAL */}
      {shipModalContainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#16221d] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-[#c68a24]" />
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                Mark Container as Shipped: {shipModalContainer.label}
              </h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Important Rule:</strong> Marking this container as shipped will automatically advance all consolidated customer orders inside it to <code>shipped</code> status and dispatch shipping notification emails.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Ocean Vessel & Tracking Note *
                </label>
                <textarea
                  rows={3}
                  value={shipTrackingNote}
                  onChange={(e) => setShipTrackingNote(e.target.value)}
                  placeholder="e.g. Vessel: CMA CGM Ganga. Departs Port Nhava Sheva (INNSA) -> Rotterdam (NLRTM). Bill of Lading: CMA-8921"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Departure Date *
                </label>
                <input
                  type="date"
                  value={shipDate}
                  onChange={(e) => setShipDate(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShipModalContainer(null)}
                className="px-4 py-2 rounded border text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmShipContainer}
                className="px-4 py-2 bg-[#173f34] hover:bg-[#1f4f42] text-white rounded text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Ship className="w-3.5 h-3.5 text-[#e5a439]" />
                <span>Confirm Ocean Departure & Update Orders</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#16221d] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white">
              Edit Shade: {editingProduct.name}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Price (EUR)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingProduct.price_eur}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price_eur: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border rounded dark:bg-[#121c17]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Stock in India</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border rounded dark:bg-[#121c17]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Units per Container Slot (Volume Space)</label>
                <input
                  type="number"
                  value={editingProduct.units_per_container_slot}
                  onChange={(e) => setEditingProduct({ ...editingProduct, units_per_container_slot: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border rounded dark:bg-[#121c17]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={editingProduct.active}
                  onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                  id="activeCheck"
                  className="accent-[#173f34]"
                />
                <label htmlFor="activeCheck" className="font-semibold cursor-pointer">
                  Active in European Storefront
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#173f34] text-white rounded font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
