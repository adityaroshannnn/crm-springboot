package crm_system.controller;

import crm_system.entity.Manager;
import crm_system.service.ManagerService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping("/managers")
    public String listManagers(Model model) {
        model.addAttribute("managers", managerService.getAllManagers());
        return "manager-list";
    }

    @GetMapping("/managers/add")
    public String showAddForm(Model model) {
        model.addAttribute("manager", new Manager());
        return "add-manager";
    }

    @PostMapping("/managers/save")
    public String saveManager(@ModelAttribute("manager") Manager manager) {
        managerService.saveManager(manager);
        return "redirect:/managers";
    }

    @GetMapping("/managers/edit")
    public String showEditForm(@RequestParam("id") int id, Model model) {
        model.addAttribute("manager", managerService.getManagerById(id));
        return "add-manager";
    }

    @GetMapping("/managers/delete")
    public String deleteManager(@RequestParam("id") int id) {
        managerService.deleteManager(id);
        return "redirect:/managers";
    }
}
