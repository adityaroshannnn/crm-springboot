package crm_system.controller;

import crm_system.entity.Manager;
import crm_system.service.ManagerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping
    public List<Manager> listManagers() {
        return managerService.getAllManagers();
    }

    @PostMapping
    public ResponseEntity<Manager> saveManager(@RequestBody Manager manager) {
        managerService.saveManager(manager);
        return ResponseEntity.ok(manager);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manager> getManager(@PathVariable("id") int id) {
        return ResponseEntity.ok(managerService.getManagerById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteManager(@PathVariable("id") int id) {
        managerService.deleteManager(id);
        return ResponseEntity.ok().build();
    }
}
