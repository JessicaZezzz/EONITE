package com.domain.eonite.dto;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DashboardRes {
    private int statusCode;
    private String error;
    private String message;
    private Long totalProduct;
    private Long totalReview;
    private Long totalRequest;
    private List<Long> orderCancelled;
    private List<Long> orderCompleted;
}
