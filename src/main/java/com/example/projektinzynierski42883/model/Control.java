package com.example.projektinzynierski42883.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Control {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Identyfikator z załącznika A ISO 27001, np. "A.5.7"
    private String annexId;

    // Podstawowe informacje
    private String name;           // nazwa kontroli
    private String description;    // opis kontroli
    private String objective;      // cel kontroli

    // Klasyfikacja
    private String controlType;    // Techniczna / Organizacyjna / Fizyczna
    private String category;       // Prewencyjna / Detekcyjna / Korygująca

    // Odpowiedzialność i implementacja
    private String owner;          // właściciel / rola odpowiedzialna
    private String implementationStatus;
    private String frequency;      // np. Ciągła / Miesięczna / Roczna / Po zmianie

    // Dowody i powiązania
    private String evidenceLocation; // gdzie przechowywane są dowody (katalog, system)
    private String relatedRisks;     // lista powiązanych ryzyk (np. "R-001, R-003")

    // Ocena skuteczności
    private String effectiveness; // EFFECTIVE / PARTIALLY_EFFECTIVE / INEFFECTIVE

    // Daty
    private LocalDate lastTestDate;   // ostatnie testowanie kontroli
    private LocalDate nextReviewDate; // planowana data kolejnego przeglądu


    private String notes;
}
