package com.crshotel.crs_reservation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crshotel.crs_reservation.dto.ReservationDTO;
import com.crshotel.crs_reservation.model.Reservation;
import com.crshotel.crs_reservation.service.ReservationService;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // Fetch all reservations and return as a list of ReservationDTO
    @GetMapping
    public List<ReservationDTO> getAllReservations() {
        return reservationService.getAllReservations();
    }

    // Create a new reservation and return it as a ReservationDTO
    @PostMapping
    public ReservationDTO createReservation(@RequestBody Reservation reservation) {
        return reservationService.createReservation(reservation);
    }
}
