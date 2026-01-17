package crm_system.service;

import crm_system.entity.Manager;
import java.util.List;

public interface ManagerService {

    Manager saveManager(Manager manager);

    List<Manager> getAllManagers();

    Manager getManagerById(int id);
}
