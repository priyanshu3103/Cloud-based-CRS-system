package com.crshotel.crs_reservation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crshotel.crs_reservation.model.Hotel;
import com.crshotel.crs_reservation.service.HotelService;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {
    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }

    // Admin-only access to add hotel
    @PostMapping
    public ResponseEntity<Hotel> addHotel(
            @RequestBody Hotel hotel,
            @RequestHeader("Authorization") String authHeader) {

        // Simple admin token check (for demo purposes)
        String expectedToken = "Bearer admin123"; // Replace with secure token
        if (!expectedToken.equals(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Hotel savedHotel = hotelService.addHotel(hotel);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedHotel);
    }
}
