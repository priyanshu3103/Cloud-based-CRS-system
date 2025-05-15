package com.crshotel.crs_reservation.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReservationDTO {
    private Long id;
    private String guestName;
    private Long hotelId;
    private String hotelName;
    private String hotelLocation;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}
