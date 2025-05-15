/* eslint-disable */
import { useState, useEffect, useCallback } from 'react';
import './App.css';
const API_BASE_URL = 'http://localhost:8080/api';

export default function App() {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hotels, setHotels] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  // Form states
  const [newHotel, setNewHotel] = useState({ name: '', location: '' });
  const [newReservation, setNewReservation] = useState({
    guestName: '',
    hotelId: '',
    checkInDate: '',
    checkOutDate: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchHotels();
    fetchReservations();
  }, []);

  // API calls
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/hotels`);
      if (!response.ok) throw new Error('Failed to fetch hotels');
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/reservations`);
      if (!response.ok) throw new Error('Failed to fetch reservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addHotel = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/hotels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(newHotel)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Admin access required');
        }
        throw new Error('Failed to add hotel');
      }
      
      const data = await response.json();
      setHotels([...hotels, data]);
      setNewHotel({ name: '', location: '' });
      showNotification('success', 'Hotel added successfully');
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async () => {
    try {
      setLoading(true);
      const hotelObj = { id: parseInt(newReservation.hotelId) };
      const reservationData = {
        guestName: newReservation.guestName,
        hotel: hotelObj,
        checkInDate: newReservation.checkInDate,
        checkOutDate: newReservation.checkOutDate
      };

      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });
      
      if (!response.ok) throw new Error('Failed to create reservation');
      
      const data = await response.json();
      setReservations([...reservations, data]);
      setNewReservation({
        guestName: '',
        hotelId: '',
        checkInDate: '',
        checkOutDate: ''
      });
      showNotification('success', 'Reservation created successfully');
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleAdminMode = useCallback(() => {
    if (!isAdmin) {
      setAdminToken('admin123'); // Demo purposes only
    } else {
      setAdminToken('');
    }
    setIsAdmin(!isAdmin);
  }, [isAdmin]);

  // Form handlers
  const handleHotelNameChange = useCallback((e) => {
    setNewHotel((prev) => ({ ...prev, name: e.target.value }));
  }, []);

  const handleHotelLocationChange = useCallback((e) => {
    setNewHotel((prev) => ({ ...prev, location: e.target.value }));
  }, []);

  const handleGuestNameChange = useCallback((e) => {
    setNewReservation((prev) => ({ ...prev, guestName: e.target.value }));
  }, []);

  const handleHotelIdChange = useCallback((e) => {
    setNewReservation((prev) => ({ ...prev, hotelId: e.target.value }));
  }, []);

  const handleCheckInDateChange = useCallback((e) => {
    setNewReservation((prev) => ({ ...prev, checkInDate: e.target.value }));
  }, []);

  const handleCheckOutDateChange = useCallback((e) => {
    setNewReservation((prev) => ({ ...prev, checkOutDate: e.target.value }));
  }, []);

  // Reusable Components
  const ActionButton = ({ onClick, children, color = 'bg-pink-600', disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-3 text-white font-semibold rounded-3xl transition-all duration-200 ${color} hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-disabled={disabled}
    >
      {disabled ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );

  const Notification = ({ show, type, message }) => (
    show && (
      <div
        role="alert"
        className={`mb-6 p-4 rounded-2xl flex items-center gap-2 animate-fadeIn ${
          type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
        }`}
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          {type === 'error' ? (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          )}
        </svg>
        {message}
      </div>
    )
  );

  // Component sections
  const Dashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:-translate-y-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Hotels Overview</h3>
          <div className="text-4xl font-bold text-pink-600">{hotels.length}</div>
          <p className="text-gray-600 mt-2">Total hotels in the system</p>
          <button
            onClick={() => setActiveTab('hotels')}
            className="mt-4 text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors"
            aria-label="View all hotels"
          >
            View all hotels →
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:-translate-y-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Reservations Overview</h3>
          <div className="text-4xl font-bold text-teal-600">{reservations.length}</div>
          <p className="text-gray-600 mt-2">Total active reservations</p>
          <button
            onClick={() => setActiveTab('reservations')}
            className="mt-4 text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors"
            aria-label="View all reservations"
          >
            View all reservations →
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:-translate-y-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <ActionButton onClick={() => setActiveTab('newReservation')} color="bg-pink-600">
              New Reservation
            </ActionButton>
            {isAdmin && (
              <ActionButton onClick={() => setActiveTab('newHotel')} color="bg-gray-600">
                Add Hotel
              </ActionButton>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Reservations</h3>
        
        {reservations.length === 0 ? (
          <p className="text-gray-600">No reservations found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest</th>
                  <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hotel</th>
                  <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check In</th>
                  <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check Out</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.slice(0, 5).map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.guestName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reservation.hotelName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(reservation.checkInDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(reservation.checkOutDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const HotelsList = () => (
    <div className="bg-white rounded-2xl shadow-lg">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Hotels Directory</h3>
        {isAdmin && (
          <ActionButton
            onClick={() => setActiveTab('newHotel')}
            color="bg-pink-600"
          >
            Add New Hotel
          </ActionButton>
        )}
      </div>
      
      {hotels.length === 0 ? (
        <div className="p-6 text-center text-gray-600">No hotels available</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {hotels.map(hotel => (
            <div
              key={hotel.id}
              className="rounded-2xl p-4 hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className="w-full h-40 bg-gray-200 rounded-xl mb-4" role="img" aria-label={`Image of ${hotel.name}`}></div>
              <h4 className="font-semibold text-lg text-gray-900">{hotel.name}</h4>
              <p className="text-gray-600 mb-4">{hotel.location}</p>
              <button
                onClick={() => {
                  setNewReservation({...newReservation, hotelId: hotel.id.toString()});
                  setActiveTab('newReservation');
                }}
                className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors"
                aria-label={`Book ${hotel.name}`}
              >
                Book this hotel →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ReservationsList = () => (
    <div className="bg-white rounded-2xl shadow-lg">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">All Reservations</h3>
        <ActionButton
          onClick={() => setActiveTab('newReservation')}
          color="bg-pink-600"
        >
          New Reservation
        </ActionButton>
      </div>
      
      {reservations.length === 0 ? (
        <div className="p-6 text-center text-gray-600">No reservations found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hotel</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check In</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check Out</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reservation.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.guestName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reservation.hotelName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reservation.hotelLocation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(reservation.checkInDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(reservation.checkOutDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const NewHotelForm = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Hotel</h3>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="hotel-name" className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
          <input
            id="hotel-name"
            type="text"
            value={newHotel.name}
            onChange={handleHotelNameChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 transition-all"
            required
            aria-describedby="hotel-name-error"
          />
          {!newHotel.name && (
            <p id="hotel-name-error" className="text-red-600 text-xs mt-1">Hotel name is required</p>
          )}
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            id="location"
            type="text"
            value={newHotel.location}
            onChange={handleHotelLocationChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 transition-all"
            required
            aria-describedby="location-error"
          />
          {!newHotel.location && (
            <p id="location-error" className="text-red-600 text-xs mt-1">Location is required</p>
          )}
        </div>
        
        <div className="flex justify-end gap-4 pt-6">
          <button
            onClick={() => setActiveTab('hotels')}
            className="px-4 py-3 border border-gray-300 rounded-3xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            aria-label="Cancel adding new hotel"
          >
            Cancel
          </button>
          <ActionButton
            onClick={addHotel}
            disabled={!newHotel.name || !newHotel.location || loading}
            color="bg-pink-600"
          >
            Add Hotel
          </ActionButton>
        </div>
      </div>
    </div>
  );

  const NewReservationForm = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">New Reservation</h3>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="guest-name" className="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
          <input
            id="guest-name"
            type="text"
            value={newReservation.guestName}
            onChange={handleGuestNameChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 transition-all"
            required
            aria-describedby="guest-name-error"
          />
          {!newReservation.guestName && (
            <p id="guest-name-error" className="text-red-600 text-xs mt-1">Guest name is required</p>
          )}
        </div>
        
        <div>
          <label htmlFor="hotel-select" className="block text-sm font-medium text-gray-700 mb-2">Select Hotel</label>
          <select
            id="hotel-select"
            value={newReservation.hotelId}
            onChange={handleHotelIdChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 transition-all"
            required
            aria-describedby="hotel-select-error"
          >
            <option value="">-- Select a Hotel --</option>
            {hotels.map(hotel => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name} - {hotel.location}
              </option>
            ))}
          </select>
          {!newReservation.hotelId && (
            <p id="hotel-select-error" className="text-red-600 text-xs mt-1">Please select a hotel</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-2">Check In Date</label>
            <input
              id="check-in"
              type="date"
              value={newReservation.checkInDate}
              onChange={handleCheckInDateChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 transition-all"
              required
              aria-describedby="check-in-error"
            />
            {!newReservation.checkInDate && (
              <p id="check-in-error" className="text-red-600 text-xs mt-1">Check-in date is required</p>
            )}
          </div>
          
          <div>
            <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-2">Check Out Date</label>
            <input
              id="check-out"
              type="date"
              value={newReservation.checkOutDate}
              onChange={handleCheckOutDateChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 transition-all"
              required
              aria-describedby="check-out-error"
            />
            {!newReservation.checkOutDate && (
              <p id="check-out-error" className="text-red-600 text-xs mt-1">Check-out date is required</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-3 border border-gray-300 rounded-3xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            aria-label="Cancel new reservation"
          >
            Cancel
          </button>
          <ActionButton
            onClick={createReservation}
            disabled={!newReservation.guestName || !newReservation.hotelId || !newReservation.checkInDate || !newReservation.checkOutDate || loading}
            color="bg-teal-600"
          >
            Create Reservation
          </ActionButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
                <span role="img" aria-label="House icon">🏠</span>
                Central Reservation System
              </h1>
            </div>
            <div>
              <button
                onClick={toggleAdminMode}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isAdmin ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={isAdmin ? 'Exit admin mode' : 'Enter admin mode'}
              >
                {isAdmin ? 'Exit Admin Mode' : 'Admin Mode'}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        <Notification show={notification.show} type={notification.type} message={notification.message} />
      
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-4" role="tablist">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'hotels', label: 'Hotels' },
              { id: 'reservations', label: 'Reservations' },
              { id: 'newReservation', label: 'New Reservation' },
              ...(isAdmin ? [{ id: 'newHotel', label: 'Add Hotel' }] : [])
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab content */}
        <div role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'hotels' && <HotelsList />}
          {activeTab === 'reservations' && <ReservationsList />}
          {activeTab === 'newHotel' && isAdmin && <NewHotelForm />}
          {activeTab === 'newReservation' && <NewReservationForm />}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} CRS Hotel Reservation System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}