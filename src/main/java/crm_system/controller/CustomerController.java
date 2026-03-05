package crm_system.controller;

import crm_system.entity.Customer;
import crm_system.enums.CustomerStatus;
import crm_system.service.CustomerService;
import crm_system.service.ManagerService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;


@Controller
public class CustomerController {

    private final CustomerService customerService;
    private final ManagerService managerService;

    public CustomerController(CustomerService customerService, ManagerService managerService) {
        this.customerService = customerService;
        this.managerService = managerService;
    }
    @ModelAttribute("managers")
    public List<crm_system.entity.Manager> populateManagers() {
        List<crm_system.entity.Manager> list = managerService.getAllManagers();
        System.out.println("MANAGERS FROM DB = " + list.size());
        return list;
    }



    @GetMapping("/customers/add")
    public String showAddCustomerForm(Model model) {

        model.addAttribute("customer", new Customer());
        model.addAttribute("statuses", CustomerStatus.values());

        return "add-customer";
    }
    @GetMapping("/customers/delete")
    public String deleteCustomer(@RequestParam("id") int id) {

        customerService.deleteCustomer(id);
        return "redirect:/customers";
    }
    @GetMapping("/customers/edit")
    public String showUpdateForm(@RequestParam("id") int id, Model model) {

        Customer customer = customerService.getCustomerById(id);

        model.addAttribute("customer", customer);
        model.addAttribute("statuses", CustomerStatus.values());
        model.addAttribute("managers", managerService.getAllManagers());

        return "add-customer";
    }

    @GetMapping("/customers")
    public String listCustomers(Model model) {

        model.addAttribute("customers", customerService.getAllCustomers());
        return "customer-list";
    }



    @PostMapping("/customers/save")
    public String saveCustomer(
            @ModelAttribute("customer") Customer customer,
            @RequestParam("managerId") int managerId) {

        customer.setManager(managerService.getManagerById(managerId));
        customerService.saveCustomer(customer);

        return "redirect:/customers";
    }
   

}

