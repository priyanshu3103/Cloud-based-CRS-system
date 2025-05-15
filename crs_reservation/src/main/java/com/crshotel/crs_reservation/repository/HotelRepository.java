package com.crshotel.crs_reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crshotel.crs_reservation.model.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
