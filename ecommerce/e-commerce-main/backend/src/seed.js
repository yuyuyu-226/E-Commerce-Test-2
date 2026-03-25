import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const sampleProducts = [
  {
    name: "CNC Milling Machine",
    description: "High-precision CNC milling machine for complex metal fabrication. 5-axis control with digital display.",
    price: 15999.99,
    category: "Machines",
    stock: 5,
    image_url: "/images/cnc_milling_machine.jpg",
    status: "active"
  },
  {
    name: "Industrial Air Compressor",
    description: "Heavy-duty industrial air compressor with 50-gallon tank. Perfect for pneumatic tools and equipment.",
    price: 1899.99,
    category: "Machines",
    stock: 15,
    image_url: "/images/industrial_air_compressor.jpg",
    status: "active"
  },
  {
    name: "Industrial Drill Press",
    description: "Floor-standing drill press with variable speed control. Ideal for precision drilling operations.",
    price: 1299.99,
    category: "Machines",
    stock: 20,
    image_url: "/images/industrial_drill_press.jpg",
    status: "active"
  },
  {
    name: "Industrial Conveyor Belt",
    description: "Modular conveyor belt system with adjustable speed. Suitable for assembly lines and packaging.",
    price: 3499.99,
    category: "Machines",
    stock: 8,
    image_url: "/images/industrial_conveyor_belt.jpg",
    status: "active"
  },
  {
    name: "Hydraulic Press Machine",
    description: "50-ton hydraulic press with digital pressure gauge. Ideal for metal forming and pressing operations.",
    price: 5999.99,
    category: "Machines",
    stock: 6,
    image_url: "/images/hydraulic_press_machine.png",
    status: "active"
  },
  {
    name: "Industrial Fan",
    description: "High-velocity industrial floor fan with 24-inch blades. Provides powerful cooling for workshops.",
    price: 189.99,
    category: "Machines",
    stock: 45,
    image_url: "/images/industrial_fan.jpg",
    status: "active"
  },
  {
    name: "Electric Angle Grinder",
    description: "4.5-inch electric angle grinder with adjustable guard. Perfect for cutting and grinding metal.",
    price: 79.99,
    category: "Machines",
    stock: 60,
    image_url: "/images/electric_angle_grinder.jpg",
    status: "active"
  },
  {
    name: "Industrial Safety Helmet",
    description: "OSHA-compliant industrial safety helmet with ratchet suspension. Available in multiple colors.",
    price: 34.99,
    category: "Safety Equipment",
    stock: 150,
    image_url: "/images/safety_helmet.jpg",
    status: "active"
  },
  {
    name: "Industrial Work Boots",
    description: "Steel-toe safety boots with slip-resistant soles. Waterproof and electrical hazard rated.",
    price: 129.99,
    category: "Safety Equipment",
    stock: 80,
    image_url: "/images/industrial_work_boots.jpg",
    status: "active"
  },
  {
    name: "Welding Gloves",
    description: "Premium leather welding gloves with heat-resistant lining. Extended cuff for forearm protection.",
    price: 29.99,
    category: "Safety Equipment",
    stock: 200,
    image_url: "/images/welding_gloves.jpg",
    status: "active"
  },
  {
    name: "Protective Goggles",
    description: "ANSI-rated safety goggles with anti-fog coating. UV protection for industrial environments.",
    price: 19.99,
    category: "Safety Equipment",
    stock: 300,
    image_url: "/images/protective_goggles.jpg",
    status: "active"
  },
  {
    name: "Aluminum Sheet",
    description: "6061-T6 aluminum sheet, 4x8 feet, 0.125 inch thick. Perfect for fabrication and prototyping.",
    price: 149.99,
    category: "Raw Materials",
    stock: 50,
    image_url: "/images/aluminum_sheet.jpg",
    status: "active"
  },
  {
    name: "Steel Rod",
    description: "1018 cold-rolled steel rod, 1-inch diameter, 6 feet length. Ideal for machining projects.",
    price: 44.99,
    category: "Raw Materials",
    stock: 100,
    image_url: "/images/steel_rod.jpg",
    status: "active"
  },
  {
    name: "PVC Pipe Bundle",
    description: "Schedule 40 PVC pipes, 2-inch diameter, 10 feet length. Suitable for plumbing and conduit.",
    price: 24.99,
    category: "Raw Materials",
    stock: 200,
    image_url: "/images/pvc_pipe.jpg",
    status: "active"
  },
  {
    name: "Rubber O-Ring Set",
    description: "Assorted NBR rubber O-rings in various sizes. 500 pieces per kit for industrial sealing.",
    price: 39.99,
    category: "Raw Materials",
    stock: 150,
    image_url: "/images/rubber_o-ring_set.jpg",
    status: "active"
  },
  {
    name: "Industrial Lubricant Oil",
    description: "Multi-purpose industrial lubricant oil, 5-gallon container. Reduces friction and wear.",
    price: 89.99,
    category: "Raw Materials",
    stock: 75,
    image_url: "/images/industrial_lubricant_oil.jpg",
    status: "active"
  },
  {
    name: "Packaging Tape Roll",
    description: "Heavy-duty packaging tape, 2-inch width, 110 yards per roll. Clear finish for shipping.",
    price: 12.99,
    category: "Raw Materials",
    stock: 500,
    image_url: "/images/packaging_tape_roll.jpg",
    status: "active"
  },
  {
    name: "Cutting Disc Set",
    description: "Thin-cutoff grinding discs for metal cutting, 4.5-inch diameter. 25 discs per pack.",
    price: 34.99,
    category: "Raw Materials",
    stock: 180,
    image_url: "/images/cutting_disc.jpg",
    status: "active"
  },
  {
    name: "Electric Screwdriver Set",
    description: "Cordless electric screwdriver with 48-piece bit set. Rechargeable with adjustable torque.",
    price: 59.99,
    category: "Raw Materials",
    stock: 90,
    image_url: "/images/electric_screwdriver_set.jpg",
    status: "active"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} products successfully`);

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
