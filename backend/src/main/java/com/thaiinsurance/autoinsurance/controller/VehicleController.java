package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.model.Vehicle;
import com.thaiinsurance.autoinsurance.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Vehicle Management
 * Handles vehicle registration, DLT integration, and ownership management
 */
@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Vehicle Management", description = "Thai vehicle registration and DLT integration APIs")
public class VehicleController {
    
    @Autowired
    private VehicleService vehicleService;
    
    @PostMapping("/register")
    @Operation(summary = "Register new vehicle", 
               description = "Register a new vehicle with Thai license plate validation")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Vehicle>> registerVehicle(@Valid @RequestBody Vehicle vehicle) {
        try {
            Vehicle registeredVehicle = vehicleService.registerVehicle(vehicle);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Vehicle registered successfully", registeredVehicle));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Vehicle registration failed", e.getMessage()));
        }
    }
    
    @GetMapping
    @Operation(summary = "Get all vehicles", 
               description = "Retrieve all vehicles with pagination")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<Vehicle>>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Vehicle> vehicles = vehicleService.getAllVehicles(pageable);
        return ResponseEntity.ok(ApiResponse.success("Vehicles retrieved successfully", vehicles));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search vehicles", 
               description = "Search vehicles by license plate, chassis number, or owner name")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<Vehicle>>> searchVehicles(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Vehicle> vehicles = vehicleService.searchVehicles(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("Vehicle search completed", vehicles));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle by ID", 
               description = "Retrieve vehicle details by ID")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Vehicle>> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .map(vehicle -> ResponseEntity.ok(ApiResponse.success("Vehicle found", vehicle)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/license-plate/{licensePlate}")
    @Operation(summary = "Get vehicle by license plate", 
               description = "Retrieve vehicle by Thai license plate")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Vehicle>> getVehicleByLicensePlate(@PathVariable String licensePlate) {
        return vehicleService.getVehicleByLicensePlate(licensePlate)
                .map(vehicle -> ResponseEntity.ok(ApiResponse.success("Vehicle found", vehicle)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/chassis/{chassisNumber}")
    @Operation(summary = "Get vehicle by chassis number", 
               description = "Retrieve vehicle by chassis number")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Vehicle>> getVehicleByChassisNumber(@PathVariable String chassisNumber) {
        return vehicleService.getVehicleByChassisNumber(chassisNumber)
                .map(vehicle -> ResponseEntity.ok(ApiResponse.success("Vehicle found", vehicle)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Get vehicles by owner", 
               description = "Retrieve all vehicles owned by a customer")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Vehicle>>> getVehiclesByOwner(@PathVariable Long ownerId) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByOwner(ownerId);
        return ResponseEntity.ok(ApiResponse.success("Owner vehicles retrieved", vehicles));
    }
    
    @GetMapping("/make-model")
    @Operation(summary = "Get vehicles by make and model", 
               description = "Retrieve vehicles by manufacturer and model")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Vehicle>>> getVehiclesByMakeAndModel(
            @RequestParam String make, 
            @RequestParam String model) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByMakeAndModel(make, model);
        return ResponseEntity.ok(ApiResponse.success("Vehicles by make and model retrieved", vehicles));
    }
    
    @GetMapping("/year-range")
    @Operation(summary = "Get vehicles by year range", 
               description = "Retrieve vehicles by manufacturing year range")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Vehicle>>> getVehiclesByYearRange(
            @RequestParam Integer startYear, 
            @RequestParam Integer endYear) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByYearRange(startYear, endYear);
        return ResponseEntity.ok(ApiResponse.success("Vehicles by year range retrieved", vehicles));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update vehicle information", 
               description = "Update vehicle details (excluding license plate)")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Vehicle>> updateVehicle(
            @PathVariable Long id, 
            @Valid @RequestBody Vehicle vehicleDetails) {
        try {
            Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicleDetails);
            return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully", updatedVehicle));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Vehicle update failed", e.getMessage()));
        }
    }
    
    @PutMapping("/{vehicleId}/transfer-ownership/{newOwnerId}")
    @Operation(summary = "Transfer vehicle ownership", 
               description = "Transfer vehicle ownership to new customer")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Vehicle>> transferOwnership(
            @PathVariable Long vehicleId, 
            @PathVariable Long newOwnerId) {
        try {
            Vehicle transferredVehicle = vehicleService.transferOwnership(vehicleId, newOwnerId);
            return ResponseEntity.ok(ApiResponse.success("Ownership transferred successfully", transferredVehicle));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Ownership transfer failed", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate vehicle", 
               description = "Deactivate vehicle with reason")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Vehicle>> deactivateVehicle(
            @PathVariable Long id, 
            @RequestBody VehicleDeactivationRequest request) {
        try {
            Vehicle deactivatedVehicle = vehicleService.deactivateVehicle(id, request.getReason());
            return ResponseEntity.ok(ApiResponse.success("Vehicle deactivated successfully", deactivatedVehicle));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Vehicle deactivation failed", e.getMessage()));
        }
    }
    
    @PostMapping("/verify-dlt/{licensePlate}")
    @Operation(summary = "Verify with DLT", 
               description = "Verify vehicle information with Department of Land Transport")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<VehicleService.VehicleVerificationResult>> verifyWithDlt(
            @PathVariable String licensePlate) {
        try {
            VehicleService.VehicleVerificationResult result = vehicleService.verifyWithDlt(licensePlate);
            return ResponseEntity.ok(ApiResponse.success("DLT verification completed", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DLT verification failed", e.getMessage()));
        }
    }
    
    @GetMapping("/statistics")
    @Operation(summary = "Get vehicle statistics", 
               description = "Get vehicle count statistics by status and type")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<VehicleService.VehicleStatistics>> getStatistics() {
        VehicleService.VehicleStatistics stats = vehicleService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success("Vehicle statistics retrieved", stats));
    }
    
    @GetMapping("/by-type/{vehicleType}")
    @Operation(summary = "Get vehicles by type", 
               description = "Retrieve vehicles by type (PERSONAL_CAR, MOTORCYCLE, etc.)")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Vehicle>>> getVehiclesByType(@PathVariable Vehicle.VehicleType vehicleType) {
        // This would need to be implemented in the service
        return ResponseEntity.ok(ApiResponse.success("Vehicles by type retrieved", List.of()));
    }
    
    @GetMapping("/by-status/{status}")
    @Operation(summary = "Get vehicles by status", 
               description = "Retrieve vehicles by status (ACTIVE, INACTIVE)")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Vehicle>>> getVehiclesByStatus(@PathVariable Vehicle.VehicleStatus status) {
        // This would need to be implemented in the service
        return ResponseEntity.ok(ApiResponse.success("Vehicles by status retrieved", List.of()));
    }
    
    @GetMapping("/makes")
    @Operation(summary = "Get vehicle makes", 
               description = "Get list of all vehicle manufacturers")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<String>>> getVehicleMakes() {
        // In real implementation, this would come from a database or external service
        List<String> makes = List.of(
            "Toyota", "Honda", "Isuzu", "Mitsubishi", "Nissan", "Mazda", 
            "Suzuki", "Yamaha", "Kawasaki", "BMW", "Mercedes-Benz", "Audi",
            "Volkswagen", "Ford", "Chevrolet", "Hyundai", "Kia", "Subaru"
        );
        
        return ResponseEntity.ok(ApiResponse.success("Vehicle makes retrieved", makes));
    }
    
    @GetMapping("/makes/{make}/models")
    @Operation(summary = "Get vehicle models by make", 
               description = "Get list of models for a specific manufacturer")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<String>>> getVehicleModelsByMake(@PathVariable String make) {
        // In real implementation, this would come from a database or external service
        List<String> models = switch (make.toLowerCase()) {
            case "toyota" -> List.of("Camry", "Corolla", "Vios", "Yaris", "Hilux", "Fortuner", "Prius");
            case "honda" -> List.of("Civic", "Accord", "City", "HR-V", "CR-V", "Jazz", "BR-V");
            case "isuzu" -> List.of("D-Max", "MU-X", "V-Cross");
            case "mitsubishi" -> List.of("Triton", "Pajero Sport", "Outlander", "Attrage");
            default -> List.of("Unknown Model");
        };
        
        return ResponseEntity.ok(ApiResponse.success("Vehicle models retrieved", models));
    }
    
    @GetMapping("/provinces")
    @Operation(summary = "Get Thai provinces", 
               description = "Get list of Thai provinces for vehicle registration")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<String>>> getThaiProvinces() {
        List<String> provinces = List.of(
            "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น",
            "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย",
            "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา",
            "นครศรีธรรมราช", "นครสวรรค์", "นนทบุরี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์",
            "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พังงา",
            "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "พะเยา", "ภูเก็ต",
            "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยะลา", "ยโสธร", "ร้อยเอ็ด", "ระนอง",
            "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร",
            "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี",
            "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย",
            "หนองบัวลำภู", "อ่างทอง", "อุดรธานี", "อุทัยธานี", "อุตรดิตถ์", "อุบลราชธานี", "อำนาจเจริญ"
        );
        
        return ResponseEntity.ok(ApiResponse.success("Thai provinces retrieved", provinces));
    }
    
    // Inner classes for request DTOs
    
    public static class VehicleDeactivationRequest {
        private String reason;
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}