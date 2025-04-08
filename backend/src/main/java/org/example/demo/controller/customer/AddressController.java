package org.example.demo.controller.customer;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.service.customer.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin("*")
@RestController
@RequestMapping("/address")
public class AddressController {

    @Autowired
    AddressService addressService;

    @GetMapping
    public Page<AddressDTO> getAddresses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AddressDTO> addressDTOPage = addressService.getAllAddresses(pageable);
        return ResponseEntity.ok(addressDTOPage).getBody();
    }


    @GetMapping("/{id}")
    public ResponseEntity<AddressDTO> getAddress(@PathVariable Integer id) {
        AddressDTO addressDTO = addressService.getAddressById(id);
        return ResponseEntity.ok(addressDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AddressDTO> update(@PathVariable Integer id, @RequestBody AddressDTO addressDTO) throws BadRequestException {
        try {
            AddressDTO updatedAddress = addressService.updateAddress(id, addressDTO);
            return ResponseEntity.ok(updatedAddress);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) throws BadRequestException {
        addressService.deleteAddress(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-address")
    public ResponseEntity<?> getMyAddress(){
        return ResponseEntity.ok(addressService.getMyAddressDTO());
    }
}
