package com.domain.eonite.controller;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.domain.eonite.dto.ProductRes;
import com.domain.eonite.dto.VendorRes;
import com.domain.eonite.entity.Category;
import com.domain.eonite.entity.Domicile;
import com.domain.eonite.service.ProductService;
import com.domain.eonite.service.PublicService;
import com.domain.eonite.service.VendorService;

@RestController
@CrossOrigin("*")
@RequestMapping("/public")
public class Public {
    @Autowired
    private PublicService publicService;

    @Autowired
    private VendorService vendorService;

    @Autowired
    private ProductService productService;

    @GetMapping("/categoryAll")
    public List<Category> getAllCategory() {
        return publicService.findAllCategory();
    }

    @GetMapping("/domicileAll")
    public Iterable<Domicile> getAllDomicle() {
        return publicService.findAllDomicile();
    }

    @GetMapping("/category")
    public Optional<Object> getCategoryById(@RequestParam(required = true,name = "id") Integer id) {
        return publicService.findCategoryById(id);
    }

    @GetMapping("/categoryVendor")
    public List<Object> getCategoryVendorById(@RequestParam(required = true,name = "id") Integer id) {
        return publicService.findIdCategoryVendor(id);
    }

    @GetMapping("/domicile")
    public Optional<Domicile> getDomicleById(@RequestParam(required = true,name = "id") Integer id) {
        return publicService.findDomicileById(id);
    }

    @GetMapping("/getallVendor")
    public ResponseEntity<VendorRes> getAllVendor(   @RequestParam(required = false,name = "sortBy") String sortBy, 
                                    @RequestParam(required = false,name = "sortDir") String sortDir, 
                                    @RequestParam(required = false,name = "pagination") Boolean pagination, 
                                    @RequestParam(required = false,name = "pageSize") Integer pageSize, 
                                    @RequestParam(required = false,name = "pageIndex") Integer pageIndex,
                                    @RequestParam(required = false,name = "search") String search, 
                                    @RequestParam(required = false,name = "category") String categoryId,
                                    @RequestParam(required = false,name = "domicile") Integer domicileId,
                                    @RequestParam(required = false,name = "rating") Integer rating){
        return ResponseEntity.ok(vendorService.getAllVendor(sortBy,sortDir,pagination,pageSize,pageIndex,search,categoryId,domicileId,rating));
    }

    @GetMapping("/getallProduct")
    public ResponseEntity<ProductRes> getAllProduct(   @RequestParam(required = false,name = "sortBy") String sortBy, 
                                    @RequestParam(required = false,name = "sortDir") String sortDir, 
                                    @RequestParam(required = false,name = "pagination") Boolean pagination, 
                                    @RequestParam(required = false,name = "pageSize") Integer pageSize, 
                                    @RequestParam(required = false,name = "pageIndex") Integer pageIndex,
                                    @RequestParam(required = false,name = "search") String search, 
                                    @RequestParam(required = false,name = "min") Integer min,
                                    @RequestParam(required = false,name = "max") Integer max,
                                    @RequestParam(required = false,name = "rating") Integer rating,
                                    @RequestParam(required = false,name = "id") Integer ids){
        return ResponseEntity.ok(productService.getAllProduct(sortBy,sortDir,pagination,pageSize,pageIndex,search,min,max,rating,ids));
    }

    @GetMapping("/vendorProfile")
    public ResponseEntity<VendorRes> getProfile(  @RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(vendorService.getProfileVendor(id));
    }
}
