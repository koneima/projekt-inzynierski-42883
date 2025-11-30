package com.example.projektinzynierski42883.controller;

import com.example.projektinzynierski42883.model.Control;
import com.example.projektinzynierski42883.repository.ControlRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/controls")
@CrossOrigin(origins = "http://localhost:5173")
public class ControlController {

    private final ControlRepository controlRepository;

    public ControlController(ControlRepository controlRepository) {
        this.controlRepository = controlRepository;
    }

    @GetMapping
    public List<Control> getAll() {
        return controlRepository.findAll();
    }

    @GetMapping("/{id}")
    public Control getOne(@PathVariable Long id) {
        return controlRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Control create(@RequestBody Control control) {
        // domyślne wartości
        if (control.getImplementationStatus() == null || control.getImplementationStatus().isBlank()) {
            control.setImplementationStatus("PLANNED");
        }
        if (control.getEffectiveness() == null || control.getEffectiveness().isBlank()) {
            control.setEffectiveness("EFFECTIVE");
        }
        return controlRepository.save(control);
    }

    @PutMapping("/{id}")
    public Control update(@PathVariable Long id, @RequestBody Control updated) {
        Control control = controlRepository.findById(id).orElseThrow();

        control.setAnnexId(updated.getAnnexId());
        control.setName(updated.getName());
        control.setDescription(updated.getDescription());
        control.setObjective(updated.getObjective());
        control.setControlType(updated.getControlType());
        control.setCategory(updated.getCategory());
        control.setOwner(updated.getOwner());
        control.setImplementationStatus(updated.getImplementationStatus());
        control.setFrequency(updated.getFrequency());
        control.setEvidenceLocation(updated.getEvidenceLocation());
        control.setRelatedRisks(updated.getRelatedRisks());
        control.setEffectiveness(updated.getEffectiveness());
        control.setLastTestDate(updated.getLastTestDate());
        control.setNextReviewDate(updated.getNextReviewDate());
        control.setNotes(updated.getNotes());

        return controlRepository.save(control);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        controlRepository.deleteById(id);
    }
}
