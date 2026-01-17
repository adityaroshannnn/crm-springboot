package crm_system.config;

import crm_system.entity.Manager;
import crm_system.repository.ManagerRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataLoader {

    private final ManagerRepository managerRepository;

    public DataLoader(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    @PostConstruct
    public void loadData() {
        if (managerRepository.count() == 0) {

            Manager m1 = new Manager();
            m1.setName("Admin One");
            m1.setEmail("admin1@crm.com");

            Manager m2 = new Manager();
            m2.setName("Admin Two");
            m2.setEmail("admin2@crm.com");

            managerRepository.save(m1);
            managerRepository.save(m2);

            System.out.println("Managers inserted by Spring Boot");
        }
    }
}
