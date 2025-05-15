package com.crshotel.crs_reservation.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.crshotel.crs_reservation.dto.ReservationDTO;
import com.crshotel.crs_reservation.model.Hotel;
import com.crshotel.crs_reservation.model.Reservation;
import com.crshotel.crs_reservation.repository.HotelRepository;
import com.crshotel.crs_reservation.repository.ReservationRepository;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final HotelRepository hotelRepository; // Add HotelRepository to fetch Hotel details

    public ReservationService(ReservationRepository reservationRepository, HotelRepository hotelRepository) {
        this.reservationRepository = reservationRepository;
        this.hotelRepository = hotelRepository; // Initialize HotelRepository
    }

    // Convert Reservation to ReservationDTO
    private ReservationDTO toDTO(Reservation reservation) {
        return new ReservationDTO(
                reservation.getId(),
                reservation.getGuestName(),
                reservation.getHotel().getId(),
                reservation.getHotel().getName(),
                reservation.getHotel().getLocation(),
                reservation.getCheckInDate(),
                reservation.getCheckOutDate());
    }

    // Fetch all reservations and convert to DTOs
    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Create new reservation and return as DTO
    public ReservationDTO createReservation(Reservation reservation) {
        // Fetch hotel by id from the database
        Hotel hotel = hotelRepository.findById(reservation.getHotel().getId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        // Set the fetched hotel in the reservation
        reservation.setHotel(hotel);

        // Save reservation and return the ReservationDTO
        Reservation savedReservation = reservationRepository.save(reservation);
        return toDTO(savedReservation);
    }
}
