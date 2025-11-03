import { Product, Category, StockInfo, Specification } from "./types";

const products: Product[] = [
  {
    id: "1",
    name: "Google TV 55 inch 4K QLED",
    description: "A stunning 4K QLED TV with Google TV built-in.",
    price: 499.99,
    images: [
      "/placeholder/ggtv/ggtv-main.jpg",
      "/placeholder/ggtv/ggtv1.jpg",
      "/placeholder/ggtv/ggtv2.jpg",
      "/placeholder/ggtv/ggtv3.jpg",
    ],
    specifications: [
      { key: "Brand", value: "Google" },
      { key: "Screen Size", value: "55 Inches" },
      { key: "Resolution", value: "4K UHD" },
      { key: "Display", value: "QLED" },
    ],
    category: "Electronics",
    salePrice: 449.99,
    rating: 4.7,
    reviewCount: 320,
    isTrending: true,
    isBestSeller: true,
    sku: "SKU12345",
    model: "GTV-55Q",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
    reviews: [
      {
        id: "r1",
        rating: 5,
        title: "A solid workhorse at a good price.",
        author: "PhillipG",
        date: "October 26, 2025",
        comment:
          "My Mom was in need of a new TV for her office... Overall, she will spend most of her time hooked up to a dock, so battery life wasn't a huge concern.",
        isVerified: true,
      },
      {
        id: "r2",
        rating: 5,
        title: "Great quality from a great Company (& Store)!",
        author: "Verified Purchaser",
        date: "October 22, 2025",
        comment:
          "This is one of the finest TVs I have ever had. Dell is a great brand, and is known for its build quality and dependability. I do believe this one will last.",
        isVerified: true,
      },
      {
        id: "r3",
        rating: 4,
        title: "Good, but not perfect",
        author: "JaneD",
        date: "October 20, 2025",
        comment:
          "The screen is beautiful, but the speakers are a bit weak. Had to buy a soundbar. 4 stars.",
        isVerified: true,
      },
    ],
  },
  {
    id: "2",
    name: "LG Air Conditioner 12,000 BTU",
    description: "Dual Inverter quiet air conditioner.",
    price: 399.99,
    images: [
      "/placeholder/lgac/ac.png",
      "/placeholder/lgac/lgac1.jpg",
      "/placeholder/lgac/lgac2.jpg",
    ],
    specifications: [
      { key: "Brand", value: "LG" },
      { key: "Cooling Power", value: "12,000 BTU" },
      { key: "Energy Rating", value: "A++" },
    ],
    category: "Electronics",
    salePrice: 349.99,
    rating: 4.9,
    reviewCount: 510,
    isTrending: true,
    isBestSeller: true,
    sku: "SKU12346",
    model: "LG-AC12",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  {
    id: "3",
    name: "Mechanical Keyboard RGB",
    description: "RGB Mechanical Keyboard with Brown switches.",
    price: 129.99,
    images: [
      "/placeholder/keyboard/keyboard.jpg",
      "/placeholder/keyboard/kb1.jpg",
      "/placeholder/keyboard/kb2.jpg",
      "/placeholder/keyboard/kb3.jpg",
    ],
    specifications: [
      { key: "Brand", value: "KeyChron" },
      { key: "Switch Type", value: "Gateron Brown" },
      { key: "Backlight", value: "RGB" },
    ],
    category: "Electronics",
    rating: 4.6,
    reviewCount: 230,
    isTrending: true,
    sku: "SKU12347",
    model: "KC-K8",
    stock: {
      level: "low-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  {
    id: "6",
    name: "Smart phone 128GB",
    description: "New gen of smartphone.",
    price: 699.99,
    images: [
      "/placeholder/iphone/ip17.jpg",
      "/placeholder/iphone/ip171.jpg",
      "/placeholder/iphone/ip172.jpg",
    ],
    specifications: [
      { key: "Brand", value: "DemoPhone" },
      { key: "Storage", value: "128GB" },
      { key: "Screen", value: "6.1 Inches OLED" },
    ],
    category: "Electronics",
    salePrice: 649.99,
    rating: 4.8,
    reviewCount: 1200,
    isBestSeller: true,
    sku: "SKU12350",
    model: "DP-15",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 8. Speaker (từ file cũ, đã nâng cấp)
  {
    id: "8",
    name: "Bluetooth Speaker",
    description: "Portable bluetooth speaker with rich sound quality.",
    price: 79.99,
    images: ["/placeholder/speaker.webp"],
    specifications: [
      { key: "Brand", value: "JBL" },
      { key: "Battery Life", value: "12 Hours" },
      { key: "Water Resistance", value: "IP67" },
    ],
    category: "Electronics",
    rating: 4.4,
    reviewCount: 980,
    sku: "SKU12352",
    model: "JBL-FLIP5",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },

  {
    id: "9",
    name: "Sony Noise Cancelling Headphones",
    description: "Industry leading noise canceling headphones.",
    price: 349.99,
    images: ["/placeholder/headphone/sony.webp"],
    specifications: [
      { key: "Brand", value: "Sony" },
      { key: "Model", value: "WH-1000XM5" },
      { key: "Feature", value: "Noise Cancelling" },
    ],
    category: "Electronics",
    rating: 4.8,
    reviewCount: 1500,
    isBestSeller: true,
    sku: "SKU12353",
    model: "WH-1000XM5",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 10. (Mới)
  {
    id: "10",
    name: "Dell XPS 15 Laptop",
    description: 'Powerful laptop with 15.6" OLED display.',
    price: 1899.99,
    images: ["/placeholder/dell/dell.jpg"],
    specifications: [
      { key: "Brand", value: "Dell" },
      { key: "CPU", value: "Intel Core i7" },
      { key: "RAM", value: "16GB" },
    ],
    category: "Electronics",
    rating: 4.7,
    reviewCount: 450,
    isTrending: true,
    sku: "SKU12354",
    model: "XPS-15-9530",
    stock: {
      level: "low-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 11. (Mới)
  {
    id: "11",
    name: "Samsung Galaxy S6",
    description: "Sleep, Fitness, and Health Tracker.",
    price: 299.99,
    images: ["/placeholder/ss1.jpg"],
    specifications: [
      { key: "Brand", value: "Samsung" },
      { key: "OS", value: "Wear OS" },
      { key: "Feature", value: "Health Tracker" },
    ],
    category: "Electronics",
    rating: 4.5,
    reviewCount: 750,
    sku: "SKU12355",
    model: "SM-R940",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 12. (Mới)
  {
    id: "12",
    name: "DJI Mini 3 Pro Drone",
    description: "Lightweight and Foldable Camera Drone.",
    price: 759.0,
    images: ["/placeholder/drone.jpg"],
    specifications: [
      { key: "Brand", value: "DJI" },
      { key: "Weight", value: "< 249g" },
      { key: "Video", value: "4K/60fps" },
    ],
    category: "Electronics",
    rating: 4.7,
    reviewCount: 920,
    isTrending: true,
    sku: "SKU12356",
    model: "Mini 3 Pro",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 13. (Mới)
  {
    id: "13",
    name: "PlayStation 5 Console",
    description: "Experience lightning-fast loading and ultra-high speed SSD.",
    price: 499.99,
    images: ["/placeholder/ps5.webp"],
    specifications: [
      { key: "Brand", value: "Sony" },
      { key: "Storage", value: "825GB SSD" },
      { key: "Feature", value: "Haptic Feedback" },
    ],
    category: "Electronics",
    rating: 4.9,
    reviewCount: 15000,
    isBestSeller: true,
    sku: "SKU12357",
    model: "CFI-1200A",
    stock: {
      level: "out-of-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },

  {
    id: "14",
    name: "Dyson V15 Detect Vacuum",
    description: "Cordless vacuum with laser illumination.",
    price: 749.99,
    images: ["/placeholder/vacumm.webp"],
    specifications: [
      { key: "Brand", value: "Dyson" },
      { key: "Type", value: "Cordless Stick" },
      { key: "Feature", value: "Laser Dust Detection" },
    ],
    category: "Cleaning",
    rating: 4.8,
    reviewCount: 2100,
    isBestSeller: true,
    sku: "SKU12362",
    model: "V15 Detect",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 15. (Mới)
  {
    id: "15",
    name: "iRobot Roomba j7+",
    description: "Self-Emptying Robot Vacuum.",
    price: 599.99,
    images: ["/placeholder/robot.jfif"],
    specifications: [
      { key: "Brand", value: "iRobot" },
      { key: "Type", value: "Robot Vacuum" },
      { key: "Feature", value: "Self-Emptying" },
    ],
    category: "Cleaning",
    salePrice: 499.99,
    rating: 4.4,
    reviewCount: 1300,
    isTrending: true,
    sku: "SKU12363",
    model: "j7+",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 16. (Mới)
  {
    id: "16",
    name: "Bissell Little Green Cleaner",
    description: "Portable Carpet and Upholstery Cleaner.",
    price: 123.49,
    images: ["/placeholder/cleaner.jfif"],
    specifications: [
      { key: "Brand", value: "Bissell" },
      { key: "Type", value: "Portable Carpet Cleaner" },
    ],
    category: "Cleaning",
    rating: 4.7,
    reviewCount: 65000,
    isBestSeller: true,
    sku: "SKU12364",
    model: "Little Green",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },
  // 17. (Mới)
  {
    id: "17",
    name: "Levoit Air Purifier",
    description: "HEPA Air Purifier for Home Allergies and Pets.",
    price: 99.99,
    images: ["/placeholder/purifier.jfif"],
    specifications: [
      { key: "Brand", value: "Levoit" },
      { key: "Filter", value: "True HEPA" },
      { key: "Room Size", value: "Up to 219 sq ft" },
    ],
    category: "Cleaning",
    salePrice: 89.99,
    rating: 4.6,
    reviewCount: 34000,
    sku: "SKU12365",
    model: "Core 300",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 18. (Mới)
  {
    id: "18",
    name: "Shark Steam Mop",
    description: "Cleans and Sanitizes with Steam.",
    price: 89.99,
    images: ["/placeholder/mop.png"],
    specifications: [
      { key: "Brand", value: "Shark" },
      { key: "Type", value: "Steam Mop" },
    ],
    category: "Cleaning",
    rating: 4.4,
    reviewCount: 4100,
    sku: "SKU12366",
    model: "S1000",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },
  // 19. (Mới)
  {
    id: "19",
    name: "Shark Handheld Vacuum",
    description: "Lightweight and portable for quick cleanups.",
    price: 129.99,
    images: ["/placeholder/vacuum.jfif"],
    specifications: [
      { key: "Brand", value: "Shark" },
      { key: "Type", value: "Handheld" },
      { key: "Weight", value: "2.8 lbs" },
    ],
    category: "Cleaning",
    rating: 4.5,
    reviewCount: 1100,
    sku: "SKU12367",
    model: "CH951",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 20. (Mới)
  {
    id: "20",
    name: "ECOVACS Window Cleaning Robot",
    description: "Automatic Window Cleaner Robot.",
    price: 249.99,
    images: ["/placeholder/robot1.jfif"],
    specifications: [
      { key: "Brand", value: "ECOVACS" },
      { key: "Type", value: "Window Robot" },
    ],
    category: "Cleaning",
    rating: 4.1,
    reviewCount: 800,
    sku: "SKU12368",
    model: "WINBOT W1",
    stock: {
      level: "low-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 21. (Mới)
  {
    id: "21",
    name: "O-Cedar Spin Mop & Bucket",
    description: "Hands-Free Wringing Spin Mop.",
    price: 34.99,
    images: ["/placeholder/mop1.jfif"],
    specifications: [
      { key: "Brand", value: "O-Cedar" },
      { key: "Type", value: "Spin Mop" },
    ],
    category: "Cleaning",
    rating: 4.6,
    reviewCount: 150000,
    isBestSeller: true,
    sku: "SKU12369",
    model: "EasyWring",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },
  // 22. (Mới)
  {
    id: "22",
    name: "Honeywell Humidifier",
    description: "Filter-Free Cool Mist Humidifier.",
    price: 69.99,
    images: ["/placeholder/humid.jfif"],
    specifications: [
      { key: "Brand", value: "Honeywell" },
      { key: "Type", value: "Cool Mist" },
    ],
    category: "Cleaning",
    rating: 4.3,
    reviewCount: 1900,
    sku: "SKU12370",
    model: "HUL535B",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 23. (Mới)
  {
    id: "23",
    name: "Clorox Disinfecting Wipes (3 Pack)",
    description: "Bleach-Free Cleaning Wipes.",
    price: 11.99,
    images: ["/placeholder/wipes.jfif"],
    specifications: [
      { key: "Brand", value: "Clorox" },
      { key: "Count", value: "75 Wipes x 3" },
    ],
    category: "Cleaning",
    rating: 4.9,
    reviewCount: 80000,
    isBestSeller: true,
    sku: "SKU12371",
    model: "CLX-3PK",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },

  // ===================================
  // CATEGORY 3: Laundry (10 Sản phẩm)
  // ===================================
  // 7. (từ file cũ, đã nâng cấp)
  {
    id: "7",
    name: "LG Washer High-Efficiency",
    description: "Premium washing machine with TurboWash360.",
    price: 799.99,
    images: ["/product/washer.png"],
    specifications: [
      { key: "Brand", value: "LG" },
      { key: "Capacity", value: "5.0 cu ft" },
      { key: "Features", value: "TurboWash360" },
    ],
    category: "Laundry",
    salePrice: 699.99,
    rating: 4.5,
    reviewCount: 430,
    isTrending: true,
    sku: "SKU12351",
    model: "WM4000HWA",
    stock: {
      level: "low-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 24. (Mới)
  {
    id: "24",
    name: "LG Dryer Electric",
    description: "Electric Dryer with Sensor Dry.",
    price: 799.99,
    images: ["/placeholder/dryer.jfif"],
    specifications: [
      { key: "Brand", value: "LG" },
      { key: "Capacity", value: "7.4 cu ft" },
      { key: "Feature", value: "Sensor Dry" },
    ],
    category: "Laundry",
    salePrice: 699.99,
    rating: 4.6,
    reviewCount: 390,
    sku: "SKU12357",
    model: "DLEX4000W",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 25. (Mới)
  {
    id: "25",
    name: "Samsung Smart Washer",
    description: "Bespoke 5.3 cu. ft. Ultra Capacity Front Load Washer.",
    price: 1049.99,
    images: ["/placeholder/sswasher.jfif"],
    specifications: [
      { key: "Brand", value: "Samsung" },
      { key: "Capacity", value: "5.3 cu ft" },
      { key: "Feature", value: "Super Speed Wash" },
    ],
    category: "Laundry",
    rating: 4.5,
    reviewCount: 220,
    isBestSeller: true,
    sku: "SKU12372",
    model: "WF53BB8700",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 26. (Mới)
  {
    id: "26",
    name: "Samsung Smart Dryer",
    description: "Bespoke 7.6 cu. ft. Ultra Capacity Electric Dryer.",
    price: 1049.99,
    images: ["/placeholder/ssdryer.jfif"],
    specifications: [
      { key: "Brand", value: "Samsung" },
      { key: "Capacity", value: "7.6 cu ft" },
      { key: "Feature", value: "AI Optimal Dry" },
    ],
    category: "Laundry",
    rating: 4.5,
    reviewCount: 190,
    sku: "SKU12373",
    model: "DVE53BB8700",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 27. (Mới)
  {
    id: "27",
    name: "Tide Pods (112 Count)",
    description: "Laundry Detergent Pacs, Spring Meadow Scent.",
    price: 27.24,
    images: ["/placeholder/tide.jfif"],
    specifications: [
      { key: "Brand", value: "Tide" },
      { key: "Count", value: "112 Pacs" },
      { key: "Scent", value: "Spring Meadow" },
    ],
    category: "Laundry",
    rating: 4.9,
    reviewCount: 95000,
    isBestSeller: true,
    sku: "SKU12374",
    model: "TIDE-112",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 28. (Mới)
  {
    id: "28",
    name: "CHI Steam Iron",
    description: "Retractable Cord Steam Iron with 1700 Watts.",
    price: 59.99,
    images: ["/placeholder/iron.jfif"],
    specifications: [
      { key: "Brand", value: "CHI" },
      { key: "Watts", value: "1700W" },
      { key: "Feature", value: "Retractable Cord" },
    ],
    category: "Laundry",
    rating: 4.4,
    reviewCount: 3100,
    sku: "SKU12375",
    model: "CHI-13102",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },
  // 29. (Mới)
  {
    id: "29",
    name: "Downy Fabric Softener",
    description: "April Fresh Scent, 164 fl oz.",
    price: 13.99,
    images: ["/placeholder/downy.jfif"],
    specifications: [
      { key: "Brand", value: "Downy" },
      { key: "Size", value: "164 fl oz" },
      { key: "Scent", value: "April Fresh" },
    ],
    category: "Laundry",
    rating: 4.8,
    reviewCount: 55000,
    isBestSeller: true,
    sku: "SKU12376",
    model: "DOWNY-164",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 30. (Mới)
  {
    id: "30",
    name: "SimpleHouseware Laundry Basket",
    description: "Double Laundry Hamper with Lid and Removable Bags.",
    price: 45.99,
    images: ["/placeholder/basket.jfif"],
    specifications: [
      { key: "Brand", value: "SimpleHouseware" },
      { key: "Compartments", value: "2" },
    ],
    category: "Laundry",
    rating: 4.7,
    reviewCount: 19000,
    sku: "SKU12377",
    model: "HAM-001",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },
  // 31. (Mới)
  {
    id: "31",
    name: "Honey-Can-Do Drying Rack",
    description: "Heavy Duty Gullwing Drying Rack.",
    price: 39.99,
    images: ["/placeholder/dryingrack.jfif"],
    specifications: [
      { key: "Brand", value: "Honey-Can-Do" },
      { key: "Material", value: "Steel" },
    ],
    category: "Laundry",
    rating: 4.6,
    reviewCount: 22000,
    sku: "SKU12378",
    model: "DRY-01132",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 32. (Mới)
  {
    id: "32",
    name: "Conair Handheld Steamer",
    description: "Turbo ExtremeSteam Handheld Fabric Steamer.",
    price: 54.99,
    images: ["/placeholder/steamer.jfif"],
    specifications: [
      { key: "Brand", value: "Conair" },
      { key: "Type", value: "Handheld Steamer" },
    ],
    category: "Laundry",
    rating: 4.4,
    reviewCount: 12000,
    isTrending: true,
    sku: "SKU12379",
    model: "GS38R",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },

  {
    id: "33",
    name: "Ergonomic Office Chair",
    description: "High-Back Mesh Chair with Lumbar Support.",
    price: 249.99,
    images: ["/placeholder/chair.jfif"],
    specifications: [
      { key: "Material", value: "Mesh" },
      { key: "Feature", value: "Lumbar Support" },
    ],
    category: "Furniture",
    rating: 4.3,
    reviewCount: 620,
    isTrending: true,
    sku: "SKU12358",
    model: "OC-HB-01",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 34. (Mới)
  {
    id: "34",
    name: "Electric Standing Desk",
    description: "Adjustable Height Stand Up Desk (48x24).",
    price: 199.99,
    images: ["/placeholder/desk.jfif"],
    specifications: [
      { key: "Size", value: "48 x 24 Inches" },
      { key: "Feature", value: "Electric Motor" },
    ],
    category: "Furniture",
    salePrice: 179.99,
    rating: 4.6,
    reviewCount: 1100,
    isBestSeller: true,
    sku: "SKU12359",
    model: "SD-E-48",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 35. (Mới)
  {
    id: "35",
    name: "Modern Fabric Sofa",
    description: "3-Seater Couch for Living Room.",
    price: 499.99,
    images: ["/placeholder/sofa.jfif"],
    specifications: [
      { key: "Size", value: "3-Seater" },
      { key: "Material", value: "Fabric" },
    ],
    category: "Furniture",
    rating: 4.2,
    reviewCount: 310,
    sku: "SKU12380",
    model: "SOFA-MOD-3",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 36. (Mới)
  {
    id: "36",
    name: "Glass Coffee Table",
    description: "Modern Coffee Table with Glass Top.",
    price: 129.99,
    images: ["/placeholder/cftable.jfif"],
    specifications: [
      { key: "Top", value: "Tempered Glass" },
      { key: "Frame", value: "Metal" },
    ],
    category: "Furniture",
    rating: 4.0,
    reviewCount: 150,
    sku: "SKU12381",
    model: "CT-GLS-01",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 37. (Mới)
  {
    id: "37",
    name: "5-Shelf Bookshelf",
    description: "Tall Bookcase, Industrial Style.",
    price: 89.99,
    images: ["/placeholder/bookshelf.jpg"],
    specifications: [
      { key: "Shelves", value: "5" },
      { key: "Material", value: "Wood, Metal" },
    ],
    category: "Furniture",
    rating: 4.5,
    reviewCount: 4500,
    isBestSeller: true,
    sku: "SKU12382",
    model: "BK-IND-5",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 38. (Mới)
  {
    id: "38",
    name: "Modern TV Stand",
    description: "TV Stand for TVs up to 65 Inches.",
    price: 159.99,
    images: ["/placeholder/tvstand.jfif"],
    specifications: [
      { key: "Max TV Size", value: "65 Inches" },
      { key: "Material", value: "Engineered Wood" },
    ],
    category: "Furniture",
    rating: 4.3,
    reviewCount: 950,
    sku: "SKU12383",
    model: "TVS-65-W",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 39. (Mới)
  {
    id: "39",
    name: "Queen Bed Frame",
    description: "Upholstered Platform Bed Frame with Headboard.",
    price: 299.99,
    images: ["/placeholder/bedframe.jfif"],
    specifications: [
      { key: "Size", value: "Queen" },
      { key: "Material", value: "Upholstered Fabric" },
    ],
    category: "Furniture",
    rating: 4.6,
    reviewCount: 1200,
    sku: "SKU12384",
    model: "BED-Q-UPH",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 40. (Mới)
  {
    id: "40",
    name: "Memory Foam Mattress (Queen)",
    description: "10-Inch Green Tea Memory Foam Mattress.",
    price: 349.99,
    images: ["/placeholder/mat.jfif"],
    specifications: [
      { key: "Brand", value: "Zinus" },
      { key: "Size", value: "Queen" },
      { key: "Thickness", value: "10 Inches" },
    ],
    category: "Furniture",
    rating: 4.5,
    reviewCount: 130000,
    isBestSeller: true,
    sku: "SKU12385",
    model: "Z-MAT-10Q",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 41. (Mới)
  {
    id: "41",
    name: "Modern Dining Table Set",
    description: "5 Piece Dining Set with 4 Chairs.",
    price: 399.99,
    images: ["/placeholder/tableset.jfif"],
    specifications: [
      { key: "Pieces", value: "5 (1 Table, 4 Chairs)" },
      { key: "Material", value: "Wood, Metal" },
    ],
    category: "Furniture",
    salePrice: 349.99,
    rating: 4.1,
    reviewCount: 600,
    isTrending: true,
    sku: "SKU12386",
    model: "DIN-SET-5",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 42. (Mới)
  {
    id: "42",
    name: "2-Drawer Nightstand",
    description: "Simple nightstand with 2 drawers.",
    price: 69.99,
    images: ["/placeholder/drawer.jfif"],
    specifications: [
      { key: "Drawers", value: "2" },
      { key: "Color", value: "White" },
    ],
    category: "Furniture",
    rating: 4.0,
    reviewCount: 2100,
    sku: "SKU12387",
    model: "NS-WHT-2",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },

  {
    id: "4",
    name: "Ceramic Coffee Mug",
    description: "Handcrafted ceramic mug with minimalist design.",
    price: 24.99,
    images: ["/placeholder/400x400.svg", "/placeholder/mug-2.jpg"],
    specifications: [
      { key: "Material", value: "Ceramic" },
      { key: "Capacity", value: "12 oz" },
      { key: "Dishwasher Safe", value: "Yes" },
    ],
    category: "Kitchen",
    rating: 4.2,
    reviewCount: 50,
    sku: "SKU12348",
    model: "MUG-C12",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },
  // 5. (từ file cũ, đã nâng cấp)
  {
    id: "5",
    name: "Bosch 300 Series Dishwasher",
    description: "Best dishwasher in the market.",
    price: 849.99, // Sửa giá
    images: ["/placeholder/dishwasher.png", "/placeholder/dishwasher-2.jpg"],
    specifications: [
      { key: "Brand", value: "Bosch" },
      { key: "Noise Level", value: "44 dBA" },
    ],
    category: "Kitchen",
    rating: 4.7,
    reviewCount: 1300,
    isTrending: true,
    sku: "SKU12349",
    model: "SHSM63W55N",
    stock: {
      level: "out-of-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 43. (Mới)
  {
    id: "43",
    name: "Ninja Air Fryer",
    description: "4 Quart Air Fryer that Crisps, Roasts, Reheats.",
    price: 99.99,
    images: ["/placeholder/airfryer.jfif"],
    specifications: [
      { key: "Brand", value: "Ninja" },
      { key: "Capacity", value: "4 Quart" },
    ],
    category: "Kitchen",
    salePrice: 79.99,
    rating: 4.8,
    reviewCount: 12500,
    isBestSeller: true,
    sku: "SKU12356",
    model: "AF101",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 44. (Mới)
  {
    id: "44",
    name: "Keurig K-Elite Coffee Maker",
    description: "Single-Serve K-Cup Pod Coffee Brewer.",
    price: 149.99,
    images: ["/placeholder/cfmaker.jfif"],
    specifications: [
      { key: "Brand", value: "Keurig" },
      { key: "Type", value: "Single-Serve" },
    ],
    category: "Kitchen",
    salePrice: 119.99,
    rating: 4.7,
    reviewCount: 8900,
    isBestSeller: true,
    sku: "SKU12355",
    model: "K-Elite",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },
  // 45. (Mới)
  {
    id: "45",
    name: "Vitamix 5200 Blender",
    description: "Professional-Grade, Self-Cleaning 64 oz Container.",
    price: 449.95,
    images: ["/placeholder/blender.jfif"],
    specifications: [
      { key: "Brand", value: "Vitamix" },
      { key: "Capacity", value: "64 oz" },
    ],
    category: "Kitchen",
    rating: 4.8,
    reviewCount: 5100,
    sku: "SKU12388",
    model: "5200",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 46. (Mới)
  {
    id: "46",
    name: "Cuisinart 4-Slice Toaster",
    description: "Compact Stainless Steel Toaster.",
    price: 49.95,
    images: ["/placeholder/toaster.jfif"],
    specifications: [
      { key: "Brand", value: "Cuisinart" },
      { key: "Slices", value: "4" },
    ],
    category: "Kitchen",
    rating: 4.3,
    reviewCount: 6700,
    sku: "SKU12389",
    model: "CPT-142",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },
  // 47. (Mới)
  {
    id: "47",
    name: "Panasonic Microwave Oven",
    description: "Countertop Microwave with Inverter Technology.",
    price: 179.99,
    images: ["/placeholder/oven.jfif"],
    specifications: [
      { key: "Brand", value: "Panasonic" },
      { key: "Capacity", value: "1.2 cu ft" },
    ],
    category: "Kitchen",
    rating: 4.5,
    reviewCount: 3300,
    sku: "SKU12390",
    model: "NN-SN67KS",
    stock: {
      level: "in-stock",
      storeAddress: "123 Main St, Ho Chi Minh City",
    },
  },
  // 48. (Mới)
  {
    id: "48",
    name: "Samsung French Door Refrigerator",
    description: "28 cu. ft. 3-Door French Door Refrigerator.",
    price: 1899.99,
    images: ["/placeholder/ssfridge.jfif"],
    specifications: [
      { key: "Brand", value: "Samsung" },
      { key: "Capacity", value: "28 cu ft" },
    ],
    category: "Kitchen",
    salePrice: 1699.99,
    rating: 4.4,
    reviewCount: 2100,
    isTrending: true,
    sku: "SKU12391",
    model: "RF28R7351SR",
    stock: {
      level: "in-stock",
      storeAddress: "Warehouse B, Binh Duong",
    },
  },
  // 49. (Mới)
  {
    id: "49",
    name: "Cuisinart Cookware Set",
    description: "12-Piece Stainless Steel Cookware Set.",
    price: 199.99,
    images: ["/placeholder/cookset.jfif"],
    specifications: [
      { key: "Brand", value: "Cuisinart" },
      { key: "Pieces", value: "12" },
    ],
    category: "Kitchen",
    rating: 4.7,
    reviewCount: 9800,
    isBestSeller: true,
    sku: "SKU12392",
    model: "MCP-12N",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },
  // 50. (Mới)
  {
    id: "50",
    name: "Henckels Knife Block Set",
    description: "15-Piece Knife Set with Block.",
    price: 129.95,
    images: ["/placeholder/knife.jfif"],
    specifications: [
      { key: "Brand", value: "Henckels" },
      { key: "Pieces", value: "15" },
    ],
    category: "Kitchen",
    rating: 4.8,
    reviewCount: 14000,
    sku: "SKU12393",
    model: "HEN-15",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },

  {
    id: "51",
    name: "Laptop Stand",
    description: "Ergonomic Aluminum Laptop Stand for Desk.",
    price: 29.99,
    images: ["/placeholder/laptopstand.jfif"],
    specifications: [
      { key: "Material", value: "Aluminum" },
      { key: "Feature", value: "Adjustable" },
    ],
    category: "Accessories",
    rating: 4.8,
    reviewCount: 25000,
    isBestSeller: true,
    sku: "SKU12360",
    model: "LS-ALU-01",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 52. (Mới)
  {
    id: "52",
    name: "USB-C Hub Multiport Adapter",
    description: "7-in-1 USB-C Hub with 4K HDMI, 3 USB 3.0, SD Card Reader.",
    price: 39.99,
    images: ["/placeholder/hub.jfif"],
    specifications: [
      { key: "Ports", value: "7-in-1" },
      { key: "HDMI", value: "4K@30Hz" },
    ],
    category: "Accessories",
    rating: 4.5,
    reviewCount: 7800,
    isTrending: true,
    sku: "SKU12361",
    model: "HUB-71-GR",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 53. (Mới)
  {
    id: "53",
    name: "Logitech MX Master 3S Mouse",
    description: "Wireless Performance Mouse with Ultra-Fast Scrolling.",
    price: 99.99,
    images: ["/placeholder/logimouse.jfif"],
    specifications: [
      { key: "Brand", value: "Logitech" },
      { key: "Connectivity", value: "Bluetooth, USB" },
    ],
    category: "Accessories",
    rating: 4.8,
    reviewCount: 9100,
    isBestSeller: true,
    sku: "SKU12394",
    model: "MX Master 3S",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 54. (Mới)
  {
    id: "54",
    name: "Samsung T7 Portable SSD 1TB",
    description: "External Solid State Drive, USB 3.2 Gen 2.",
    price: 109.99,
    images: ["/placeholder/ssd.jfif"],
    specifications: [
      { key: "Brand", value: "Samsung" },
      { key: "Storage", value: "1TB SSD" },
      { key: "Speed", value: "Up to 1,050 MB/s" },
    ],
    category: "Accessories",
    salePrice: 89.99,
    rating: 4.9,
    reviewCount: 22000,
    isTrending: true,
    sku: "SKU12395",
    model: "T7",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 55. (Mới)
  {
    id: "55",
    name: "iPhone 15 Pro Case (MagSafe)",
    description: "Clear Case with MagSafe.",
    price: 49.0,
    images: ["/placeholder/ipcase.jfif"],
    specifications: [
      { key: "Brand", value: "Apple" },
      { key: "Feature", value: "MagSafe" },
    ],
    category: "Accessories",
    rating: 4.6,
    reviewCount: 3100,
    sku: "SKU12396",
    model: "M-CASE-15P",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 56. (Mới)
  {
    id: "56",
    name: "Spigen Screen Protector (2-Pack)",
    description: "Tempered Glass Screen Protector for iPhone 15 Pro.",
    price: 15.99,
    images: ["/placeholder/screenprotector.jfif"],
    specifications: [
      { key: "Brand", value: "Spigen" },
      { key: "Material", value: "Tempered Glass" },
    ],
    category: "Accessories",
    rating: 4.7,
    reviewCount: 45000,
    isBestSeller: true,
    sku: "SKU12397",
    model: "SPG-15P",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 57. (Mới)
  {
    id: "57",
    name: "Anker HDMI Cable (2-Pack)",
    description: "6.6 ft High-Speed 4K HDMI Cable.",
    price: 16.99,
    images: ["/placeholder/cable.jfif"],
    specifications: [
      { key: "Brand", value: "Anker" },
      { key: "Length", value: "6.6 ft" },
      { key: "Speed", value: "4K@60Hz" },
    ],
    category: "Accessories",
    rating: 4.8,
    reviewCount: 33000,
    sku: "SKU12398",
    model: "ANK-HDMI-2PK",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 58. (Mới)
  {
    id: "58",
    name: "Timbuk2 Messenger Bag",
    description: "Classic Messenger Bag for 15-inch Laptop.",
    price: 89.0,
    images: ["/placeholder/bag.jfif"],
    specifications: [
      { key: "Brand", value: "Timbuk2" },
      { key: "Size", value: "Medium" },
    ],
    category: "Accessories",
    rating: 4.6,
    reviewCount: 2900,
    sku: "SKU12399",
    model: "TMBK-CLASSIC",
    stock: {
      level: "in-stock",
      storeAddress: "789 Art St, Da Nang",
    },
  },
  // 59. (Mới)
  {
    id: "59",
    name: "Anker Power Bank 20,000mAh",
    description: "High-Capacity Power Bank with USB-C.",
    price: 49.99,
    images: ["/placeholder/power.jfif"],
    specifications: [
      { key: "Brand", value: "Anker" },
      { key: "Capacity", value: "20,000mAh" },
    ],
    category: "Accessories",
    rating: 4.7,
    reviewCount: 51000,
    isBestSeller: true,
    sku: "SKU12400",
    model: "ANK-PB-20K",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
  // 60. (Mới)
  {
    id: "60",
    name: "Anker GaN Charger 65W",
    description: "3-Port Compact Fast Charger.",
    price: 39.99,
    images: ["/placeholder/charger.jfif"],
    specifications: [
      { key: "Brand", value: "Anker" },
      { key: "Wattage", value: "65W" },
      { key: "Ports", value: "3 (2 USB-C, 1 USB-A)" },
    ],
    category: "Accessories",
    salePrice: 32.99,
    rating: 4.8,
    reviewCount: 8800,
    isTrending: true,
    sku: "SKU12401",
    model: "ANK-GAN-65",
    stock: {
      level: "in-stock",
      storeAddress: "456 Tech Ave, Hanoi",
    },
  },
];

const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    images: ["/placeholder/electronics-cate.png"],
  },
  {
    id: "2",
    name: "Cleaning",
    slug: "cleaning",
    images: ["/placeholder/cleaning-cate.png"],
  },
  {
    id: "3",
    name: "Laundry",
    slug: "laundry",
    images: ["/placeholder/laundry-cate.png"],
  },
  {
    id: "4", // Sửa: bỏ '.1'
    name: "Furniture",
    slug: "furniture",
    images: ["/placeholder/furniture-cate.png"],
  },
  {
    id: "5",
    name: "Kitchen",
    slug: "kitchen",
    images: ["/placeholder/kitchen-cate.png"],
  },
  {
    id: "6",
    name: "Accessories",
    slug: "accessories",
    images: ["/placeholder/accessories-cate.png"],
  },
];

export function getAllProducts(): Product[] {
  return products;
}

/**
 * Retrieves the first 6 products marked as Trending.
 * @returns {Product[]} An array of the first 6 featured products.
 */
export function getFeaturedProducts(): Product[] {
  // Sửa: Lấy các sản phẩm Trending làm Featured
  const featured = products.filter((product) => product.isTrending === true);
  return featured.slice(0, 6); // Sửa: 6 sản phẩm
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(categoryName: string): Product[] {
  return products.filter((product) => product.category === categoryName);
}

/**
 * Lấy các sản phẩm liên quan.
 * @param {string} currentProductId - ID của sản phẩm đang xem.
 * @param {string} categoryName - Tên danh mục của sản phẩm đó.
 * @returns {Product[]} Một mảng các sản phẩm liên quan.
 */
export function getRelatedProducts(
  currentProductId: string,
  categoryName: string
): Product[] {
  const related = products.filter((product) => {
    return product.category === categoryName && product.id !== currentProductId;
  });
  // Trả về tối đa 6 sản phẩm liên quan
  return related.slice(0, 6);
}

/**
 * Lấy các sản phẩm đang giảm giá (Hot Deals).
 * @returns {Product[]} Một mảng các sản phẩm đang giảm giá.
 */
export function getHotDeals(): Product[] {
  const hotDeals = products.filter((product) => {
    return product.salePrice && product.salePrice < product.price;
  });
  return hotDeals.slice(0, 6);
}

/**
 * Lấy các sản phẩm đang thịnh hành (Trending).
 * @returns {Product[]} Một mảng các sản phẩm thịnh hành.
 */
export function getTrendingProducts(): Product[] {
  const trending = products.filter((product) => {
    return product.isTrending === true;
  });
  return trending.slice(0, 6);
}

/**
 * Lấy các sản phẩm được xếp hạng cao (Top Rated).
 * @returns {Product[]} Một mảng các sản phẩm được xếp hạng cao.
 */
export function getTopRatedProducts(): Product[] {
  const topRated = products.filter((product) => {
    return product.rating && product.rating >= 4.7;
  });
  return topRated.slice(0, 6);
}

/**
 * Lấy các sản phẩm bán chạy nhất (Best Selling).
 * @returns {Product[]} Một mảng các sản phẩm bán chạy nhất.
 */
export function getBestSellingProducts(): Product[] {
  const bestSellers = products.filter((product) => {
    return product.isBestSeller === true;
  });
  return bestSellers.slice(0, 6);
}
