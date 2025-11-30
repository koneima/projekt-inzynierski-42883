package com.example.projektinzynierski42883.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Risk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Identyfikator ryzyka, np. R-001
    private String code;

    // Podstawowe informacje
    private String name;            // nazwa ryzyka
    private String description;     // opis
    private String asset;           // zasób / system / proces
    private String category;        // kategoria ryzyka (techniczne, organizacyjne itd.)
    private String owner;           // właściciel ryzyka

    // Analiza przyczyn
    private String threat;          // zagrożenie
    private String vulnerability;   // podatność / słabość

    // Ocena ryzyka
    private Integer likelihood;     // prawdopodobieństwo 1–5
    private Integer impact;         // wpływ 1–5
    private Integer riskLevel;      // poziom ryzyka (np. likelihood * impact)

    // Plan traktowania ryzyka
    private String treatmentOption; // ACCEPT / REDUCE / TRANSFER / AVOID

    // Status
    private String status;          // OPEN / IN_PROGRESS / CLOSED / ACCEPTED

    // Daty
    private LocalDate reviewDate;   // data ostatniego przeglądu
    private LocalDate dueDate;      // termin wdrożenia działań
}
