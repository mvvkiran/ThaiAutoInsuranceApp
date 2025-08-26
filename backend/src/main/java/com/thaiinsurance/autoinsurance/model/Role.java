package com.thaiinsurance.autoinsurance.model;

public enum Role {
    CUSTOMER("Customer"),
    AGENT("Insurance Agent"),
    ADMIN("System Administrator"),
    UNDERWRITER("Underwriter"),
    CLAIMS_ADJUSTER("Claims Adjuster");
    
    private final String displayName;
    
    Role(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}