package com.crshotel.crs_reservation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.crshotel.crs_reservation.model.Hotel;
import com.crshotel.crs_reservation.repository.HotelRepository;

@Service
public class HotelService {
    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel addHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }
}
