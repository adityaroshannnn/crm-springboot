package crm_system.controller;

import crm_system.entity.StoreSettings;
import crm_system.service.StoreSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/store-settings")
public class StoreSettingsController {

    private final StoreSettingsService storeSettingsService;

    public StoreSettingsController(StoreSettingsService storeSettingsService) {
        this.storeSettingsService = storeSettingsService;
    }

    @GetMapping
    public ResponseEntity<StoreSettings> getSettings() {
        return ResponseEntity.ok(storeSettingsService.getSettings());
    }

    @PutMapping
    public ResponseEntity<StoreSettings> updateSettings(@RequestBody Map<String, String> payload) {
        String storeName = payload.get("storeName");
        if (storeName == null || storeName.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(storeSettingsService.updateStoreName(storeName.trim()));
    }
}
