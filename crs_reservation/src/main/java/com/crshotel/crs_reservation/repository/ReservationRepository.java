package com.crshotel.crs_reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crshotel.crs_reservation.model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
