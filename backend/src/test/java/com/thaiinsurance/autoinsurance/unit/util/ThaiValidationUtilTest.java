package com.thaiinsurance.autoinsurance.unit.util;

import com.thaiinsurance.autoinsurance.TestDataHelper;
import com.thaiinsurance.autoinsurance.util.ThaiValidationUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Thai Validation Utility Tests")
class ThaiValidationUtilTest {

    @Nested
    @DisplayName("Thai National ID Validation")
    class ThaiNationalIdValidation {

        @Test
        @DisplayName("Should validate correct Thai National ID with valid checksum")
        void shouldValidateCorrectThaiNationalId() {
            // Test with known valid Thai National IDs
            for (String nationalId : TestDataHelper.VALID_NATIONAL_IDS) {
                assertTrue(ThaiValidationUtil.isValidThaiNationalId(nationalId),
                        "National ID " + nationalId + " should be valid");
            }
        }

        @Test
        @DisplayName("Should reject Thai National ID with invalid checksum")
        void shouldRejectInvalidChecksumThaiNationalId() {
            // Test with known invalid checksums
            for (String nationalId : TestDataHelper.INVALID_NATIONAL_IDS) {
                assertFalse(ThaiValidationUtil.isValidThaiNationalId(nationalId),
                        "National ID " + nationalId + " should be invalid");
            }
        }

        @ParameterizedTest
        @ValueSource(strings = {"", "   ", "123", "12345678901234", "abcd567890123"})
        @DisplayName("Should reject malformed Thai National IDs")
        void shouldRejectMalformedNationalIds(String nationalId) {
            assertFalse(ThaiValidationUtil.isValidThaiNationalId(nationalId));
        }

        @Test
        @DisplayName("Should handle null National ID")
        void shouldHandleNullNationalId() {
            assertFalse(ThaiValidationUtil.isValidThaiNationalId(null));
        }

        @Test
        @DisplayName("Should validate specific test cases with manual checksum verification")
        void shouldValidateSpecificTestCases() {
            // Test case: 1101700207366 (manually verified checksum)
            String validId = "1101700207366";
            assertTrue(ThaiValidationUtil.isValidThaiNationalId(validId));

            // Test case: Same digits but wrong checksum
            String invalidId = "1101700207365";
            assertFalse(ThaiValidationUtil.isValidThaiNationalId(invalidId));
        }
    }

    @Nested
    @DisplayName("Thai Phone Number Validation")
    class ThaiPhoneNumberValidation {

        @Test
        @DisplayName("Should validate correct Thai phone numbers")
        void shouldValidateCorrectThaiPhoneNumbers() {
            for (String phoneNumber : TestDataHelper.VALID_PHONE_NUMBERS) {
                assertTrue(ThaiValidationUtil.isValidThaiPhoneNumber(phoneNumber),
                        "Phone number " + phoneNumber + " should be valid");
            }
        }

        @Test
        @DisplayName("Should reject invalid Thai phone numbers")
        void shouldRejectInvalidThaiPhoneNumbers() {
            for (String phoneNumber : TestDataHelper.INVALID_PHONE_NUMBERS) {
                assertFalse(ThaiValidationUtil.isValidThaiPhoneNumber(phoneNumber),
                        "Phone number " + phoneNumber + " should be invalid");
            }
        }

        @ParameterizedTest
        @ValueSource(strings = {"0812345678", "0898765432", "0651234567", "0756789012"})
        @DisplayName("Should validate mobile numbers with correct prefixes")
        void shouldValidateMobileNumbersWithCorrectPrefixes(String phoneNumber) {
            assertTrue(ThaiValidationUtil.isValidThaiPhoneNumber(phoneNumber));
        }

        @ParameterizedTest
        @ValueSource(strings = {"0112345678", "0212345678", "0312345678", "0512345678"})
        @DisplayName("Should reject phone numbers with invalid prefixes")
        void shouldRejectPhoneNumbersWithInvalidPrefixes(String phoneNumber) {
            assertFalse(ThaiValidationUtil.isValidThaiPhoneNumber(phoneNumber));
        }

        @Test
        @DisplayName("Should handle null phone number")
        void shouldHandleNullPhoneNumber() {
            assertFalse(ThaiValidationUtil.isValidThaiPhoneNumber(null));
        }
    }

    @Nested
    @DisplayName("Thai Postal Code Validation")
    class ThaiPostalCodeValidation {

        @Test
        @DisplayName("Should validate correct Thai postal codes")
        void shouldValidateCorrectThaiPostalCodes() {
            for (String postalCode : TestDataHelper.VALID_POSTAL_CODES) {
                assertTrue(ThaiValidationUtil.isValidThaiPostalCode(postalCode),
                        "Postal code " + postalCode + " should be valid");
            }
        }

        @Test
        @DisplayName("Should reject invalid Thai postal codes")
        void shouldRejectInvalidThaiPostalCodes() {
            for (String postalCode : TestDataHelper.INVALID_POSTAL_CODES) {
                assertFalse(ThaiValidationUtil.isValidThaiPostalCode(postalCode),
                        "Postal code " + postalCode + " should be invalid");
            }
        }

        @ParameterizedTest
        @ValueSource(strings = {"10000", "50000", "99999"})
        @DisplayName("Should validate postal codes within valid range")
        void shouldValidatePostalCodesWithinValidRange(String postalCode) {
            assertTrue(ThaiValidationUtil.isValidThaiPostalCode(postalCode));
        }

        @ParameterizedTest
        @ValueSource(strings = {"00000", "09999"})
        @DisplayName("Should reject postal codes outside valid range")
        void shouldRejectPostalCodesOutsideValidRange(String postalCode) {
            assertFalse(ThaiValidationUtil.isValidThaiPostalCode(postalCode));
        }

        @Test
        @DisplayName("Should handle null postal code")
        void shouldHandleNullPostalCode() {
            assertFalse(ThaiValidationUtil.isValidThaiPostalCode(null));
        }
    }

    @Nested
    @DisplayName("Thai License Plate Validation")
    class ThaiLicensePlateValidation {

        @Test
        @DisplayName("Should validate correct Thai license plates")
        void shouldValidateCorrectThaiLicensePlates() {
            for (String licensePlate : TestDataHelper.VALID_LICENSE_PLATES) {
                assertTrue(ThaiValidationUtil.isValidThaiLicensePlate(licensePlate),
                        "License plate " + licensePlate + " should be valid");
            }
        }

        @ParameterizedTest
        @ValueSource(strings = {"กก 1234", "ABC 123", "1กข 234", "มท 4567"})
        @DisplayName("Should validate various license plate formats")
        void shouldValidateVariousLicensePlateFormats(String licensePlate) {
            assertTrue(ThaiValidationUtil.isValidThaiLicensePlate(licensePlate));
        }

        @ParameterizedTest
        @ValueSource(strings = {"", "AB", "ABCDEFGHIJK", "123$456"})
        @DisplayName("Should reject invalid license plate formats")
        void shouldRejectInvalidLicensePlateFormats(String licensePlate) {
            assertFalse(ThaiValidationUtil.isValidThaiLicensePlate(licensePlate));
        }

        @Test
        @DisplayName("Should handle null license plate")
        void shouldHandleNullLicensePlate() {
            assertFalse(ThaiValidationUtil.isValidThaiLicensePlate(null));
        }

        @Test
        @DisplayName("Should handle license plates with extra whitespace")
        void shouldHandleLicensePlatesWithWhitespace() {
            assertTrue(ThaiValidationUtil.isValidThaiLicensePlate("  กก 1234  "));
            assertTrue(ThaiValidationUtil.isValidThaiLicensePlate("\tABC 123\t"));
        }
    }

    @Nested
    @DisplayName("Formatting Functions")
    class FormattingFunctions {

        @Test
        @DisplayName("Should format Thai phone number correctly")
        void shouldFormatThaiPhoneNumberCorrectly() {
            String phoneNumber = "0812345678";
            String formatted = ThaiValidationUtil.formatThaiPhoneNumber(phoneNumber);
            assertEquals("081-234-5678", formatted);
        }

        @Test
        @DisplayName("Should format Thai National ID correctly")
        void shouldFormatThaiNationalIdCorrectly() {
            String nationalId = "1234567890123";
            String formatted = ThaiValidationUtil.formatThaiNationalId(nationalId);
            assertEquals("1-2345-67890-12-3", formatted);
        }

        @Test
        @DisplayName("Should handle invalid input in formatting functions")
        void shouldHandleInvalidInputInFormattingFunctions() {
            // Phone number formatting
            assertNull(ThaiValidationUtil.formatThaiPhoneNumber(null));
            assertEquals("123", ThaiValidationUtil.formatThaiPhoneNumber("123"));

            // National ID formatting
            assertNull(ThaiValidationUtil.formatThaiNationalId(null));
            assertEquals("123", ThaiValidationUtil.formatThaiNationalId("123"));
        }

        @Test
        @DisplayName("Should clean formatted Thai National ID")
        void shouldCleanFormattedThaiNationalId() {
            String formatted = "1-2345-67890-12-3";
            String cleaned = ThaiValidationUtil.cleanThaiNationalId(formatted);
            assertEquals("1234567890123", cleaned);
        }

        @Test
        @DisplayName("Should clean formatted Thai phone number")
        void shouldCleanFormattedThaiPhoneNumber() {
            String formatted = "081-234-5678";
            String cleaned = ThaiValidationUtil.cleanThaiPhoneNumber(formatted);
            assertEquals("0812345678", cleaned);
        }

        @Test
        @DisplayName("Should handle null in cleaning functions")
        void shouldHandleNullInCleaningFunctions() {
            assertNull(ThaiValidationUtil.cleanThaiNationalId(null));
            assertNull(ThaiValidationUtil.cleanThaiPhoneNumber(null));
        }
    }

    @Nested
    @DisplayName("Thai Bank Account Validation")
    class ThaiBankAccountValidation {

        @Test
        @DisplayName("Should validate correct Thai bank account numbers")
        void shouldValidateCorrectThaiBankAccountNumbers() {
            assertTrue(ThaiValidationUtil.isValidThaiBankAccount("1234567890"));
            assertTrue(ThaiValidationUtil.isValidThaiBankAccount("123456789012345"));
        }

        @Test
        @DisplayName("Should reject invalid Thai bank account numbers")
        void shouldRejectInvalidThaiBankAccountNumbers() {
            assertFalse(ThaiValidationUtil.isValidThaiBankAccount("123456789")); // Too short
            assertFalse(ThaiValidationUtil.isValidThaiBankAccount("1234567890123456")); // Too long
            assertFalse(ThaiValidationUtil.isValidThaiBankAccount(null));
        }

        @Test
        @DisplayName("Should handle formatted bank account numbers")
        void shouldHandleFormattedBankAccountNumbers() {
            assertTrue(ThaiValidationUtil.isValidThaiBankAccount("123-4-56789-0"));
            assertTrue(ThaiValidationUtil.isValidThaiBankAccount("123 456 789012 345"));
        }
    }

    @Nested
    @DisplayName("Province From Postal Code")
    class ProvinceFromPostalCode {

        @Test
        @DisplayName("Should return correct province for Bangkok postal codes")
        void shouldReturnCorrectProvinceForBangkokPostalCodes() {
            assertEquals("Bangkok", ThaiValidationUtil.getProvinceFromPostalCode("10110"));
            assertEquals("Bangkok", ThaiValidationUtil.getProvinceFromPostalCode("10900"));
        }

        @Test
        @DisplayName("Should return correct province for major cities")
        void shouldReturnCorrectProvinceForMajorCities() {
            assertEquals("Chiang Mai", ThaiValidationUtil.getProvinceFromPostalCode("50000"));
            assertEquals("Nakhon Ratchasima", ThaiValidationUtil.getProvinceFromPostalCode("30000"));
            assertEquals("Chonburi", ThaiValidationUtil.getProvinceFromPostalCode("20000"));
        }

        @Test
        @DisplayName("Should return Unknown for unmapped postal codes")
        void shouldReturnUnknownForUnmappedPostalCodes() {
            assertEquals("Unknown", ThaiValidationUtil.getProvinceFromPostalCode("99000"));
        }

        @Test
        @DisplayName("Should return null for invalid postal codes")
        void shouldReturnNullForInvalidPostalCodes() {
            assertNull(ThaiValidationUtil.getProvinceFromPostalCode("123"));
            assertNull(ThaiValidationUtil.getProvinceFromPostalCode(null));
            assertNull(ThaiValidationUtil.getProvinceFromPostalCode("abcde"));
        }
    }
}