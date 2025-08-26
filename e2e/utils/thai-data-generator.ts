/**
 * Thai Data Generator Utility for Auto Insurance E2E Tests
 * 
 * Generates realistic Thai test data:
 * - Thai names and addresses
 * - Thai ID numbers and phone numbers
 * - Vehicle data with Thai license plates
 * - Insurance policy data
 * - Claims data with Thai context
 */

export interface CustomerData {
  firstName: string;
  lastName: string;
  thaiId: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female';
  address: AddressData;
}

export interface AddressData {
  line1: string;
  line2?: string;
  district: string;
  province: string;
  postalCode: string;
}

export interface VehicleData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  chassisNumber: string;
  engineNumber: string;
  color: string;
  province: string;
  vehicleType: 'sedan' | 'suv' | 'pickup' | 'motorcycle';
}

export interface PolicyData {
  policyType: 'comprehensive' | 'third-party' | 'third-party-plus';
  coverageType: 'Type1' | 'Type2+' | 'Type3+';
  liabilityAmount: number;
  comprehensiveCoverage: boolean;
  collisionCoverage: boolean;
  theftCoverage: boolean;
  floodCoverage: boolean;
  personalAccidentCoverage: boolean;
  medicalExpenseCoverage: boolean;
  comprehensiveDeductible?: number;
  collisionDeductible?: number;
  premiumAmount: number;
}

export interface ClaimData {
  accidentDate: string;
  accidentTime: string;
  accidentLocation: string;
  accidentDescription: string;
  accidentType: 'collision' | 'theft' | 'flood' | 'fire' | 'vandalism';
  policeReportNumber?: string;
  weatherCondition: 'clear' | 'rain' | 'fog' | 'storm';
  trafficCondition: 'light' | 'moderate' | 'heavy';
  damageDescription: string;
  vehicleCanDrive: boolean;
  towingRequired: boolean;
  estimatedDamageAmount?: number;
  thirdPartyInvolved: boolean;
  thirdPartyName?: string;
  thirdPartyPhone?: string;
  thirdPartyLicensePlate?: string;
  thirdPartyInsurance?: string;
  repairRequired: boolean;
  preferredRepairShop?: string;
}

export class ThaiDataGenerator {
  // Thai first names
  private readonly thaiFirstNamesMale = [
    'สมชาย', 'วิชัย', 'สุรชัย', 'ประวิทย์', 'จำเนียร', 'อนุชา', 'พิชัย', 'สมศักดิ์',
    'วีระ', 'กิตติ', 'ชาคริต', 'ธีรพล', 'อดิศักดิ์', 'ปฏิพัทธ์', 'นพดล', 'สมพงษ์'
  ];

  private readonly thaiFirstNamesFemale = [
    'สมหญิง', 'วันเพ็ญ', 'ศิริ', 'สุดา', 'ปิยะ', 'นิภา', 'รัตนา', 'มาลี',
    'กัญญา', 'อรุณี', 'พรพิมล', 'สุวรรณา', 'จิราพร', 'นภัสสร', 'วิภา', 'อรุณ'
  ];

  // Thai last names
  private readonly thaiLastNames = [
    'ใจดี', 'สุขสม', 'ทองคำ', 'เจริญ', 'มั่งมี', 'รุ่งเรือง', 'วัฒนา', 'กิจเจริญ',
    'บุญมา', 'ศรีสุข', 'แสงทอง', 'วิจิตร', 'สว่างสกุล', 'ปัญญา', 'มงคล', 'สมบูรณ์'
  ];

  // Thai provinces
  private readonly thaiProvinces = [
    'กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'ชลบุรี', 'เชียงใหม่',
    'ขอนแก่น', 'นครราชสีมา', 'อุบลราชธานี', 'สงขลา', 'พิษณุโลก', 'สุราษฎร์ธานี'
  ];

  // Districts by province (simplified)
  private readonly districtsByProvince: { [key: string]: string[] } = {
    'กรุงเทพมหานคร': ['วัฒนา', 'คลองเตย', 'สาธร', 'บางรัก', 'ปทุมวัน', 'ราชเทวี'],
    'นนทบุรี': ['เมืองนนทบุรี', 'บางกรวย', 'ไผ่', 'บางบัวทอง', 'บางใหญ่', 'ปากเกร็ด'],
    'ชลบุรี': ['เมืองชลบุรี', 'บางละมุง', 'ศรีราชา', 'พานทอง', 'บ่อวิน', 'พนัสนิคม']
  };

  // Vehicle makes and models
  private readonly vehicleData = {
    'Toyota': ['Camry', 'Corolla', 'Vios', 'Yaris', 'Hilux', 'Fortuner', 'Innova'],
    'Honda': ['Civic', 'Accord', 'City', 'CR-V', 'HR-V', 'Jazz', 'BR-V'],
    'Nissan': ['Almera', 'Teana', 'X-Trail', 'Navara', 'March', 'Note'],
    'Mazda': ['Mazda2', 'Mazda3', 'CX-5', 'CX-3', 'BT-50'],
    'Mitsubishi': ['Attrage', 'Lancer', 'Outlander', 'Pajero', 'Triton']
  };

  // Vehicle colors in Thai
  private readonly vehicleColors = [
    'ขาว', 'ดำ', 'เงิน', 'แดง', 'น้ำเงิน', 'เทา', 'น้ำตาล', 'เขียว'
  ];

  // Accident types in Thai
  private readonly accidentTypes = [
    'ชนท้าย', 'ชนข้าง', 'ชนหน้า', 'รถยนต์คว่ำ', 'ชนสิ่งกีดขวาง', 'อุบัติเหตุเดี่ยว'
  ];

  // Thai street names and areas
  private readonly thaiStreetNames = [
    'ถนนสุขุมวิท', 'ถนนรัชดาภิเษก', 'ถนนพหลโยธิน', 'ถนนเพชรบุรี', 'ถนนราชพฤกษ์',
    'ถนนบางนา-ตราด', 'ถนนวิภาวดีรังสิต', 'ถนนนราธิวาสราชนครินทร์', 'ถนนกรุงเทพกรีฑา'
  ];

  /**
   * Generate random Thai customer data
   */
  generateCustomer(): CustomerData {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstNames = gender === 'male' ? this.thaiFirstNamesMale : this.thaiFirstNamesFemale;
    
    const firstName = this.randomChoice(firstNames);
    const lastName = this.randomChoice(this.thaiLastNames);
    const province = this.randomChoice(this.thaiProvinces);
    const districts = this.districtsByProvince[province] || ['เมือง'];
    const district = this.randomChoice(districts);

    return {
      firstName,
      lastName,
      thaiId: this.generateThaiId(),
      email: this.generateEmail(firstName, lastName),
      phone: this.generateThaiPhoneNumber(),
      birthDate: this.generateBirthDate(),
      gender,
      address: {
        line1: `${this.randomInt(1, 999)} ${this.randomChoice(this.thaiStreetNames)}`,
        line2: Math.random() > 0.7 ? `แขวง${district}` : undefined,
        district,
        province,
        postalCode: this.generatePostalCode(province)
      }
    };
  }

  /**
   * Generate random Thai vehicle data
   */
  generateVehicle(): VehicleData {
    const makes = Object.keys(this.vehicleData);
    const make = this.randomChoice(makes);
    const models = this.vehicleData[make as keyof typeof this.vehicleData];
    const model = this.randomChoice(models);
    
    return {
      make,
      model,
      year: this.randomInt(2015, 2024),
      licensePlate: this.generateThaiLicensePlate(),
      chassisNumber: this.generateChassisNumber(),
      engineNumber: this.generateEngineNumber(),
      color: this.randomChoice(this.vehicleColors),
      province: this.randomChoice(this.thaiProvinces),
      vehicleType: this.randomChoice(['sedan', 'suv', 'pickup', 'motorcycle'])
    };
  }

  /**
   * Generate insurance policy data
   */
  generatePolicy(): PolicyData {
    const coverageTypes = ['Type1', 'Type2+', 'Type3+'] as const;
    const coverageType = this.randomChoice(coverageTypes);
    
    // Different liability amounts based on coverage type
    const liabilityAmounts = {
      'Type1': [300000, 500000, 1000000],
      'Type2+': [500000, 1000000, 2000000],
      'Type3+': [1000000, 2000000, 5000000]
    };
    
    const liabilityAmount = this.randomChoice(liabilityAmounts[coverageType]);
    const isComprehensive = coverageType === 'Type1';
    
    return {
      policyType: isComprehensive ? 'comprehensive' : 'third-party-plus',
      coverageType,
      liabilityAmount,
      comprehensiveCoverage: isComprehensive,
      collisionCoverage: Math.random() > 0.3,
      theftCoverage: Math.random() > 0.4,
      floodCoverage: Math.random() > 0.5,
      personalAccidentCoverage: Math.random() > 0.2,
      medicalExpenseCoverage: Math.random() > 0.3,
      comprehensiveDeductible: isComprehensive ? this.randomChoice([5000, 10000, 15000]) : undefined,
      collisionDeductible: this.randomChoice([5000, 10000, 15000]),
      premiumAmount: this.calculatePremium(liabilityAmount, isComprehensive)
    };
  }

  /**
   * Generate insurance claim data
   */
  generateClaim(): ClaimData {
    const accidentDate = this.generatePastDate(30); // Within last 30 days
    const thirdPartyInvolved = Math.random() > 0.4;
    
    return {
      accidentDate: accidentDate.toISOString().split('T')[0],
      accidentTime: this.generateRandomTime(),
      accidentLocation: this.generateAccidentLocation(),
      accidentDescription: this.generateAccidentDescription(),
      accidentType: this.randomChoice(['collision', 'theft', 'flood', 'fire', 'vandalism']),
      policeReportNumber: Math.random() > 0.3 ? this.generatePoliceReportNumber() : undefined,
      weatherCondition: this.randomChoice(['clear', 'rain', 'fog', 'storm']),
      trafficCondition: this.randomChoice(['light', 'moderate', 'heavy']),
      damageDescription: this.generateDamageDescription(),
      vehicleCanDrive: Math.random() > 0.3,
      towingRequired: Math.random() > 0.6,
      estimatedDamageAmount: this.randomInt(10000, 200000),
      thirdPartyInvolved,
      thirdPartyName: thirdPartyInvolved ? this.generateThaiName() : undefined,
      thirdPartyPhone: thirdPartyInvolved ? this.generateThaiPhoneNumber() : undefined,
      thirdPartyLicensePlate: thirdPartyInvolved ? this.generateThaiLicensePlate() : undefined,
      thirdPartyInsurance: thirdPartyInvolved ? this.randomChoice(['AIA', 'Muang Thai', 'Bangkok Insurance']) : undefined,
      repairRequired: Math.random() > 0.2,
      preferredRepairShop: this.randomChoice(['Toyota Service Center', 'Honda Service Center', 'Authorized Repair Shop'])
    };
  }

  /**
   * Generate valid Thai ID number (13 digits with checksum)
   */
  private generateThaiId(): string {
    const digits: number[] = [];
    
    // Generate first 12 digits
    for (let i = 0; i < 12; i++) {
      digits.push(this.randomInt(0, 9));
    }
    
    // Calculate checksum (13th digit)
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * (13 - i);
    }
    
    const checksum = (11 - (sum % 11)) % 10;
    digits.push(checksum);
    
    return digits.join('');
  }

  /**
   * Generate Thai phone number
   */
  private generateThaiPhoneNumber(): string {
    const prefixes = ['08', '09', '06', '07'];
    const prefix = this.randomChoice(prefixes);
    const remaining = this.randomInt(10000000, 99999999);
    
    return `${prefix}${remaining}`;
  }

  /**
   * Generate Thai license plate
   */
  private generateThaiLicensePlate(): string {
    // Format: XX-1234 or 1XX-1234
    const formats = [
      () => `${this.randomThaiLetter()}${this.randomThaiLetter()}-${this.randomInt(1000, 9999)}`,
      () => `1${this.randomThaiLetter()}${this.randomThaiLetter()}-${this.randomInt(1000, 9999)}`,
      () => `${this.randomThaiLetter()}ก-${this.randomInt(1000, 9999)}`
    ];
    
    return this.randomChoice(formats)();
  }

  /**
   * Generate chassis number
   */
  private generateChassisNumber(): string {
    const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
    const numbers = '0123456789';
    
    let chassis = '';
    // VIN format: 17 characters
    for (let i = 0; i < 17; i++) {
      if (Math.random() > 0.7) {
        chassis += letters[Math.floor(Math.random() * letters.length)];
      } else {
        chassis += numbers[Math.floor(Math.random() * numbers.length)];
      }
    }
    
    return chassis;
  }

  /**
   * Generate engine number
   */
  private generateEngineNumber(): string {
    const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
    const numbers = '0123456789';
    
    let engine = '';
    for (let i = 0; i < 8; i++) {
      if (i < 3) {
        engine += letters[Math.floor(Math.random() * letters.length)];
      } else {
        engine += numbers[Math.floor(Math.random() * numbers.length)];
      }
    }
    
    return engine;
  }

  /**
   * Generate email from Thai name
   */
  private generateEmail(firstName: string, lastName: string): string {
    const romanizedFirst = this.romanizeThaiName(firstName);
    const romanizedLast = this.romanizeThaiName(lastName);
    const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
    const domain = this.randomChoice(domains);
    const number = this.randomInt(1, 999);
    
    return `${romanizedFirst}.${romanizedLast}${number}@${domain}`.toLowerCase();
  }

  /**
   * Simple Thai to Roman conversion (for email generation)
   */
  private romanizeThaiName(thaiName: string): string {
    const romanizations: { [key: string]: string } = {
      'สมชาย': 'somchai',
      'วิชัย': 'wichai',
      'สุรชัย': 'surachai',
      'สมหญิง': 'somying',
      'วันเพ็ญ': 'wanpen',
      'ศิริ': 'siri',
      'ใจดี': 'jaidee',
      'สุขสม': 'suksom',
      'ทองคำ': 'thongkam'
    };
    
    return romanizations[thaiName] || 'thai';
  }

  /**
   * Generate birth date (age 18-70)
   */
  private generateBirthDate(): string {
    const today = new Date();
    const minAge = 18;
    const maxAge = 70;
    
    const age = this.randomInt(minAge, maxAge);
    const birthYear = today.getFullYear() - age;
    const birthMonth = this.randomInt(1, 12);
    const birthDay = this.randomInt(1, 28);
    
    return `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
  }

  /**
   * Generate postal code by province
   */
  private generatePostalCode(province: string): string {
    const postalCodes: { [key: string]: string[] } = {
      'กรุงเทพมหานคร': ['10110', '10120', '10130', '10140', '10150'],
      'นนทบุรี': ['11000', '11120', '11130', '11140', '11150'],
      'ชลบุรี': ['20000', '20110', '20120', '20130', '20140']
    };
    
    const codes = postalCodes[province] || ['10000'];
    return this.randomChoice(codes);
  }

  /**
   * Generate accident location
   */
  private generateAccidentLocation(): string {
    const locations = [
      'ถนนสุขุมวิท กม. 15 เขตคลองเตย กรุงเทพมหานคร',
      'ถนนรัชดาภิเษก แยกห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร',
      'ทางหลวงหมายเลข 1 อ.เมือง จ.ปทุมธานี',
      'ถนนบางนา-ตราด กม. 8 เขตประเวศ กรุงเทพมหานคร'
    ];
    
    return this.randomChoice(locations);
  }

  /**
   * Generate accident description
   */
  private generateAccidentDescription(): string {
    const descriptions = [
      'รถยนต์ชนท้ายขณะรอไฟแดงที่สี่แยก เกิดความเสียหายที่กันชนหลังและไฟท้าย',
      'รถยนต์เสียหลักขณะเลี้ยวโค้ง ชนเสาไฟฟ้าข้างทาง ด้านหน้ารถเสียหายมาก',
      'รถยนต์ถูกขโมยจากที่จอดรถห้างสรรพสินค้า พบว่าสูญหายพร้อมกุญแจสำรอง',
      'รถยนต์จมน้ำขณะขับผ่านถนนท่วม เครื่องยนต์เสียหายและระบบไฟฟ้าขัดข้อง'
    ];
    
    return this.randomChoice(descriptions);
  }

  /**
   * Generate damage description
   */
  private generateDamageDescription(): string {
    const damages = [
      'กันชนหน้าเสียหาย กระจกหน้าแตก ไฟหน้าด้านซ้ายแตก',
      'ประตูด้านขวาเป่อย ไฟเลี้ยวเสียหาย กระจกข้างแตก',
      'กันชนหลังหักโค้ง ฝาท้ายรถขรุขระ ไฟท้ายด้านขวาแตก',
      'ฝากระโปรงหน้าเป่อย เครื่องยนต์เสียหาย หม้อน้ำรั่ว'
    ];
    
    return this.randomChoice(damages);
  }

  /**
   * Generate police report number
   */
  private generatePoliceReportNumber(): string {
    const year = new Date().getFullYear() + 543; // Buddhist era
    const number = this.randomInt(100000, 999999);
    return `${year}/${number}`;
  }

  /**
   * Generate random time
   */
  private generateRandomTime(): string {
    const hours = this.randomInt(0, 23).toString().padStart(2, '0');
    const minutes = this.randomInt(0, 59).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Generate past date within specified days
   */
  private generatePastDate(maxDaysAgo: number): Date {
    const today = new Date();
    const daysAgo = this.randomInt(1, maxDaysAgo);
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - daysAgo);
    return pastDate;
  }

  /**
   * Generate Thai name (first + last)
   */
  private generateThaiName(): string {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstNames = gender === 'male' ? this.thaiFirstNamesMale : this.thaiFirstNamesFemale;
    const firstName = this.randomChoice(firstNames);
    const lastName = this.randomChoice(this.thaiLastNames);
    return `${firstName} ${lastName}`;
  }

  /**
   * Calculate premium based on coverage
   */
  private calculatePremium(liabilityAmount: number, isComprehensive: boolean): number {
    let basePremium = liabilityAmount * 0.005;
    
    if (isComprehensive) {
      basePremium *= 3;
    }
    
    // Add some randomness
    const variation = basePremium * 0.2;
    basePremium += (Math.random() - 0.5) * variation;
    
    return Math.round(basePremium / 100) * 100; // Round to nearest 100
  }

  /**
   * Get random Thai letter for license plate
   */
  private randomThaiLetter(): string {
    const letters = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฎ', 'ฏ', 'ฐ', 'ท', 'ธ', 'น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม', 'ย', 'ร', 'ล', 'ว', 'ศ', 'ษ', 'ส', 'ห', 'ฬ', 'อ'];
    return this.randomChoice(letters);
  }

  /**
   * Utility: Random choice from array
   */
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Utility: Random integer between min and max (inclusive)
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}