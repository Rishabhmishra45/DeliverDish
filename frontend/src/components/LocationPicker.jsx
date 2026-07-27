import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { MdClose, MdMyLocation } from 'react-icons/md'
import { FaLocationDot } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'
import { setCity, setState, setAddress } from '../redux/userSlice'

const LocationPicker = ({ onClose }) => {

  const dispatch = useDispatch()
  const apiKey = import.meta.env.VITE_GEOAPIKEY

  const [searchInput, setSearchInput] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const debounceRef = useRef(null)

  const applyLocation = (city, state, address) => {
    if (city) {
      dispatch(setCity(city))
      localStorage.setItem("city", city)
    }
    if (state) {
      dispatch(setState(state))
      localStorage.setItem("state", state)
    }
    if (address) {
      dispatch(setAddress(address))
      localStorage.setItem("address", address)
    }
  }

  // typing ke 400ms baad hi Geoapify autocomplete call hoti hai
  useEffect(() => {

    if (!searchInput.trim()) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setSearching(true)

        const result = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchInput)}&type=city&apiKey=${apiKey}`
        )

        setSuggestions(result?.data?.features || [])

      } catch (error) {
        console.log(error)
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(debounceRef.current)

  }, [searchInput])

  const handleSelectSuggestion = (feature) => {
    const props = feature.properties

    const city =
      props?.city ||
      props?.town ||
      props?.village ||
      props?.county ||
      props?.state_district ||
      props?.state

    const state = props?.state
    const address = props?.address_line2 || props?.formatted

    applyLocation(city, state, address)
    onClose()
  }

  const handleUseCurrentLocation = () => {

    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser")
      return
    }

    setLocating(true)
    setErrorMsg("")

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {

          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          const result = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
          )

          const locationData = result?.data?.results?.[0]

          const city =
            locationData?.city ||
            locationData?.town ||
            locationData?.village ||
            locationData?.county ||
            locationData?.state_district ||
            locationData?.state

          const state = locationData?.state
          const address = locationData?.address_line2 || locationData?.formatted

          applyLocation(city, state, address)
          onClose()

        } catch (error) {
          console.log(error)
          setErrorMsg("Could not fetch your location details")
        } finally {
          setLocating(false)
        }
      },
      (error) => {
        console.log(error)
        setErrorMsg("Location access denied. Please allow location or search manually.")
        setLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )
  }

  return (
    <div className='fixed inset-0 z-[10000] bg-black/40 flex items-start sm:items-center justify-center p-4' onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className='w-full max-w-md bg-white rounded-2xl shadow-xl mt-20 sm:mt-0 overflow-hidden'
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100'>
          <h2 className='text-base sm:text-lg font-bold text-gray-800'>
            Select Delivery Location
          </h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
            <MdClose size={22} />
          </button>
        </div>

        <div className='p-4 sm:p-5'>

          {/* Search input */}
          <div className='flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-[#ff4d2d] transition-colors duration-200'>
            <IoIosSearch size={18} className='text-gray-400 flex-shrink-0' />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Search for your city...'
              className='flex-1 outline-none bg-transparent text-sm text-gray-700'
              autoFocus
            />
          </div>

          {/* Use current location */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className='w-full flex items-center gap-2.5 mt-3 px-3 py-2.5 rounded-lg bg-orange-50 text-[#ff4d2d] font-medium text-sm hover:bg-orange-100 transition-colors duration-200 disabled:opacity-60'
          >
            <MdMyLocation size={18} className={locating ? 'animate-spin' : ''} />
            {locating ? "Detecting your location..." : "Use current location"}
          </button>

          {errorMsg &&
            <p className='text-xs text-red-500 mt-2'>{errorMsg}</p>
          }

          {/* Suggestions */}
          {searchInput.trim() &&
            <div className='mt-3 max-h-[240px] overflow-y-auto flex flex-col'>
              {searching
                ? <p className='text-gray-400 text-sm text-center py-4'>Searching...</p>
                : suggestions.length === 0
                  ? <p className='text-gray-400 text-sm text-center py-4'>No matching cities found.</p>
                  : suggestions.map((feature, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSuggestion(feature)}
                      className='flex items-start gap-2.5 text-left px-2 py-2.5 rounded-lg hover:bg-orange-50 transition-colors duration-200'
                    >
                      <FaLocationDot size={14} className='text-[#ff4d2d] mt-0.5 flex-shrink-0' />
                      <span className='text-sm text-gray-700'>
                        {feature.properties?.formatted}
                      </span>
                    </button>
                  ))
              }
            </div>
          }

        </div>
      </div>
    </div>
  )
}

export default LocationPicker