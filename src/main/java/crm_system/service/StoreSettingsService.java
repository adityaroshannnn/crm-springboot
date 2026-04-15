package crm_system.service;

import crm_system.entity.StoreSettings;
import crm_system.repository.StoreSettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class StoreSettingsService {

    private final StoreSettingsRepository repository;

    public StoreSettingsService(StoreSettingsRepository repository) {
        this.repository = repository;
    }

    public StoreSettings getSettings() {
        return repository.findAll().stream().findFirst()
                .orElseGet(() -> repository.save(new StoreSettings("CRM System")));
    }

    public StoreSettings updateStoreName(String name) {
        StoreSettings settings = getSettings();
        settings.setStoreName(name);
        return repository.save(settings);
    }
}
