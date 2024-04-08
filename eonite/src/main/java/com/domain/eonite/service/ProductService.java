package com.domain.eonite.service;
import java.util.List;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import com.domain.eonite.dto.*;
import com.domain.eonite.entity.*;
import com.domain.eonite.repository.*;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepo ProductRepo;

    @Autowired
    private VendorRepo vendorRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductReviewRepo productReviewRepo;

    @Autowired
    private TransactionDetailRepo TransactionDetailRepo;

    @Autowired
    private PhotoRepo PhotoRepo;

    public ProductRes getAllProduct(String sortBy, String sortDir, Boolean pagination, Integer pageSize, Integer pageIndex, String search, Integer min,Integer max,Integer rating,Integer vendorId){
        ProductRes resp = new ProductRes();
        Pageable paging;
            if(sortBy != null && sortDir != null){
                Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())?Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
                paging = PageRequest.of(pageIndex,pageSize,sort);
            }else paging = PageRequest.of(pageIndex,pageSize);
        Specification<Product> spec0 = ProductSpecs.ProductVendorId(vendorId);
        Specification<Product> spec1 = ProductSpecs.Productsearch(search);
        Specification<Product> spec2 = ProductSpecs.ProductPricemin(min);
        Specification<Product> spec3 = ProductSpecs.ProductPricemax(max);
        Specification<Product> spec4 = ProductSpecs.ratinglessThan(rating);
        Specification<Product> specs = Specification.where(spec1).and(spec2).and(spec3).and(spec4).and(spec0);

        Page<Product> allProduct= ProductRepo.findAll(specs,paging);
        try{
            resp.setLength(allProduct.getTotalElements());
            resp.setProducts(allProduct.getContent());
            resp.setMessage("Success Get All Product");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ProductRes addProduct(ProductRes request){
        ProductRes resp =  new ProductRes();
        vendorRepo.findById(request.getVendorId()).ifPresentOrElse((Vendor)->{
            Product product = new Product();
            product.setName(request.getName());
            product.setPrice(request.getPrice());
            product.setDescription(request.getDescription());
            product.setCapacity(request.getCapacity());
            product.setRating((float) 0);
            product.setVendor(Vendor);
            Product result = ProductRepo.save(product);
            List<Product> products = new ArrayList<Product>();
            products.add(product);
            for(byte[] index : request.getPhoto()){
                Photo photoProduct = new Photo();
                photoProduct.setImage(index);
                photoProduct.setProduct(result);
                PhotoRepo.save(photoProduct);
            }
            try{
                resp.setProducts(products);
                resp.setMessage("Success Add Product");
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        }, ()->{
            resp.setStatusCode(500);
            resp.setError("Vendor Not Found");
        });
        return resp;
    }

    public ProductRes updateProduct(ProductRes request){
        ProductRes resp =  new ProductRes();
        ProductRepo.findById(request.getId()).ifPresentOrElse((product)->{
            product.setName(request.getName());
            product.setPrice(request.getPrice());
            product.setDescription(request.getDescription());
            product.setCapacity(request.getCapacity());
            Product result = ProductRepo.save(product);  
            for(Photo p: PhotoRepo.findByProductId(request.getId())){
                PhotoRepo.delete(p);
            }   
            for(byte[] index : request.getPhoto()){
                Photo photoProduct = new Photo();
                photoProduct.setImage(index);
                photoProduct.setProduct(result);
                PhotoRepo.save(photoProduct);
            }
            try{
                resp.setMessage("Success Update Product");
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        }, ()->{
            resp.setStatusCode(500);
            resp.setError("Vendor Not Found");
        });
        return resp;
    }

    public ProductRes getProduct(Integer id){
        ProductRes resp =  new ProductRes();
        List<Product> products = ProductRepo.findAllById(id);
        Vendor vendor = products.get(0).getVendor();
        try{
            resp.setProducts(products);
            resp.setUsernameVendor(vendor.getUsernameVendor());
            resp.setVendorId(vendor.getId());
            resp.setMessage("Success Get Product with Id "+id);
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ProductRes getProductbyVendor(Integer id){
        ProductRes resp =  new ProductRes();
        List<Product> products = ProductRepo.findAllByVendorId(id);
        try{
            resp.setProducts(products); 
            resp.setMessage("Success Get All Product with Vendor Id "+id);
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ProductRes deleteProduct(ProductRes request){
        ProductRes resp =  new ProductRes();
        cartRepo.deleteAllByProductId(request.getId());
        productReviewRepo.deleteAllByProductId(request.getId());
        TransactionDetailRepo.deleteAllByProductId(request.getId());
        PhotoRepo.deleteAllByProductId(request.getId());
        ProductRepo.deleteAllById(request.getId());
        try{
            resp.setMessage("Success Delete Bank Account for Id " + request.getId());
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ProductReviewRes addProductReview(ProductReviewRes request){
        ProductReviewRes resp =  new ProductReviewRes();
        ProductReview productReview = new ProductReview();
            productReview.setTransactionDetail(TransactionDetailRepo.findById(request.getTransaction_detail_id()).get());
            productReview.setRating(request.getRating());
            productReview.setReview(request.getReview());
            productReview.setUser(userRepo.findById(request.getUser_id()).get());
            productReview.setProduct(ProductRepo.findById(request.getProduct_id()).get());
            productReviewRepo.save(productReview);
                ProductRepo.findById(request.getProduct_id()).ifPresentOrElse((product)->{
                    product.setRating(ProductRepo.updateRatingProduct(product.getId()));
                    vendorRepo.findById(product.getVendor().getId()).ifPresentOrElse((vendor)->{
                        vendor.setRating(ProductRepo.updateRatingVendor(vendor.getId()));
                    },null);
                    ProductRepo.save(product);
                }, null);
            List<ProductReview> productrws = new ArrayList<ProductReview>();
            productrws.add(productReview);
            try{
                resp.setProductReview(productrws);
                resp.setMessage("Success Add Review Product");
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        return resp;
    }

    public ProductReviewRes updateProductReview(ProductReviewRes request){
        ProductReviewRes resp =  new ProductReviewRes();
        productReviewRepo.findById(request.getId()).ifPresentOrElse((productRev)->{
            productRev.setRating(request.getRating());
            productRev.setReview(request.getReview());
            productReviewRepo.save(productRev);
                ProductRepo.findById(request.getProduct_id()).ifPresentOrElse((product)->{
                    product.setRating(ProductRepo.updateRatingProduct(product.getId()));
                    vendorRepo.findById(product.getVendor().getId()).ifPresentOrElse((vendor)->{
                        vendor.setRating(ProductRepo.updateRatingVendor(vendor.getId()));
                    },null);
                    ProductRepo.save(product);
                }, null);
            try{
                resp.setMessage("Success Update Product Review");
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        },()->{
            resp.setStatusCode(500);
            resp.setError("Product Review Not Found");
        });

        return resp;
    }

    public ProductReviewRes getProductReviewbyProduct(Integer id){
        ProductReviewRes resp =  new ProductReviewRes();
        List<ProductReview> products = productReviewRepo.findAllByProductId(id);
        try{
            resp.setProductReview(products);
            resp.setMessage("Success Get All Review Product with Product Id "+id);
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ProductReviewRes getProductReview(){
        ProductReviewRes resp =  new ProductReviewRes();
        List<ProductReview> products = productReviewRepo.findFirst6ByOrderByRatingDesc();
        try{
            resp.setProductReview(products);
            resp.setMessage("Success Get All Review Product");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }
}
