package com.example.projektinzynierski42883.controller;

import com.example.projektinzynierski42883.model.Risk;
import com.example.projektinzynierski42883.repository.RiskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/risks")
@CrossOrigin(origins = "http://localhost:5173")
public class RiskController {

    private final RiskRepository riskRepository;

    public RiskController(RiskRepository riskRepository) {
        this.riskRepository = riskRepository;
    }

    @GetMapping
    public List<Risk> getAll() {
        return riskRepository.findAll();
    }

    @GetMapping("/{id}")
    public Risk getOne(@PathVariable Long id) {
        return riskRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Risk create(@RequestBody Risk risk) {
        if (risk.getLikelihood() != null && risk.getImpact() != null) {
            risk.setRiskLevel(risk.getLikelihood() * risk.getImpact());
        }
        if (risk.getStatus() == null || risk.getStatus().isBlank()) {
            risk.setStatus("OPEN");
        }
        return riskRepository.save(risk);
    }

    @PutMapping("/{id}")
    public Risk update(@PathVariable Long id, @RequestBody Risk updated) {
        Risk risk = riskRepository.findById(id).orElseThrow();

        risk.setCode(updated.getCode());
        risk.setName(updated.getName());
        risk.setDescription(updated.getDescription());
        risk.setAsset(updated.getAsset());
        risk.setCategory(updated.getCategory());
        risk.setOwner(updated.getOwner());
        risk.setThreat(updated.getThreat());
        risk.setVulnerability(updated.getVulnerability());
        risk.setLikelihood(updated.getLikelihood());
        risk.setImpact(updated.getImpact());
        risk.setTreatmentOption(updated.getTreatmentOption());
        risk.setStatus(updated.getStatus());
        risk.setReviewDate(updated.getReviewDate());
        risk.setDueDate(updated.getDueDate());

        if (risk.getLikelihood() != null && risk.getImpact() != null) {
            risk.setRiskLevel(risk.getLikelihood() * risk.getImpact());
        }

        return riskRepository.save(risk);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        riskRepository.deleteById(id);
    }
}