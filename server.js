// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

// src/data/nsqfCourses.ts
var NSQF_COURSES = [
  {
    id: "nsqf-solar-01",
    title: "Solar PV Installer (Suryamitra)",
    titleRegional: {
      hi: "\u0938\u094B\u0932\u0930 \u092A\u0940\u0935\u0940 \u0907\u0902\u0938\u094D\u091F\u0949\u0932\u0930 (\u0938\u0942\u0930\u094D\u092F\u092E\u093F\u0924\u094D\u0930)",
      mr: "\u0938\u094C\u0930 \u090A\u0930\u094D\u091C\u093E \u0938\u0902\u092F\u0902\u0924\u094D\u0930 \u0924\u0902\u0924\u094D\u0930\u091C\u094D\u091E (\u0938\u0942\u0930\u094D\u092F\u092E\u093F\u0924\u094D\u0930)",
      ta: "\u0B9A\u0BC2\u0BB0\u0BBF\u0BAF \u0B9A\u0B95\u0BCD\u0BA4\u0BBF \u0BA8\u0BBF\u0BB1\u0BC1\u0BB5\u0BC1\u0BA8\u0BB0\u0BCD (\u0B9A\u0BC2\u0BB0\u0BCD\u0BAF\u0BAE\u0BBF\u0BA4\u0BCD\u0BB0\u0BBE)",
      te: "\u0C38\u0C4C\u0C30 \u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C41\u0C24\u0C4D \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C28\u0C3F\u0C2A\u0C41\u0C23\u0C41\u0C21\u0C41 (\u0C38\u0C42\u0C30\u0C4D\u0C2F\u0C2E\u0C3F\u0C24\u0C4D\u0C30)",
      bn: "\u09B8\u09CC\u09B0 \u09AA\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2 \u0987\u09A8\u09B8\u09CD\u099F\u09B2\u09BE\u09B0 (\u09B8\u09C2\u09B0\u09CD\u09AF\u09AE\u09BF\u09A4\u09CD\u09B0)",
      pa: "\u0A38\u0A4B\u0A32\u0A30 \u0A2A\u0A40\u0A35\u0A40 \u0A07\u0A70\u0A38\u0A1F\u0A3E\u0A32\u0A30 (\u0A38\u0A42\u0A30\u0A3F\u0A06\u0A2E\u0A3F\u0A71\u0A24\u0A30)",
      gu: "\u0AB8\u0ACB\u0AB2\u0AB0 \u0AAA\u0AC0\u0AB5\u0AC0 \u0A87\u0AA8\u0ACD\u0AB8\u0ACD\u0A9F\u0ACB\u0AB2\u0AB0 (\u0AB8\u0AC2\u0AB0\u0ACD\u0AAF\u0AAE\u0ABF\u0AA4\u0ACD\u0AB0)",
      or: "\u0B38\u0B4C\u0B30 \u0B36\u0B15\u0B4D\u0B24\u0B3F \u0B38\u0B4D\u0B25\u0B3E\u0B2A\u0B28 \u0B1F\u0B47\u0B15\u0B4D\u0B28\u0B3F\u0B38\u0B3F\u0B06\u0B28",
      kn: "\u0CB8\u0CCC\u0CB0 \u0CB6\u0C95\u0CCD\u0CA4\u0CBF \u0C85\u0CB3\u0CB5\u0CA1\u0CBF\u0C95\u0CC6 \u0CA4\u0C9C\u0CCD\u0C9E",
      en: "Solar PV Installer (Suryamitra)"
    },
    sector: "Skill Council for Green Jobs (SCGJ)",
    nsqfLevel: 4,
    qpCode: "SGJ/Q0101",
    durationHours: 300,
    minEducation: "8th Pass with vocational interest or 10th Pass",
    matchScore: 94,
    matchReasons: [
      "Huge PM Surya Ghar subsidy demand in rural/peri-urban farm clusters",
      "Provides high self-employment earnings as local certified solar technician",
      "PM-AJAY GIA provides complete toolkit (inverter tester, safety harness, crimper)"
    ],
    suitabilityType: "Self-Employment Ideal",
    avgMonthlyEarnings: "INR 18,000 - 28,000 / month",
    trainingCenters: [
      { name: "PMKK District Skill Hub", location: "Azamgarh / Varanasi Road", distanceKm: 8, seatsAvailable: 18 },
      { name: "National Institute of Solar Energy Accredited Center", location: "Buldhana Town", distanceKm: 12, seatsAvailable: 22 },
      { name: "MoSJE Rural Technology Center", location: "Erode Industrial Zone", distanceKm: 15, seatsAvailable: 14 }
    ],
    pmAjayGiaToolkitSupplied: "Multimeter, Solar Crimping Tool, DC Voltage Clamp, Safety Belt, Hand Drill Kit (Worth INR 12,500)",
    placementGuarantee: "85% tie-up with Discom Rooftop Vendors & Rural Solar Cooperatives",
    careerPathway: "Solar Rooftop Entrepreneur / Authorized Village Energy Technician"
  },
  {
    id: "nsqf-electric-02",
    title: "Domestic Electrical Appliance Care Technician",
    titleRegional: {
      hi: "\u0918\u0930\u0947\u0932\u0942 \u0935\u093F\u0926\u094D\u092F\u0941\u0924 \u0909\u092A\u0915\u0930\u0923 \u0938\u0947\u0935\u093E \u0924\u0915\u0928\u0940\u0936\u093F\u092F\u0928",
      mr: "\u0918\u0930\u0917\u0941\u0924\u0940 \u0935\u093F\u0926\u094D\u092F\u0941\u0924 \u0909\u092A\u0915\u0930\u0923 \u0926\u0941\u0930\u0941\u0938\u094D\u0924\u0940 \u0924\u0902\u0924\u094D\u0930\u091C\u094D\u091E",
      ta: "\u0BB5\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BAE\u0BBF\u0BA9\u0BCD\u0B9A\u0BBE\u0BA4\u0BA9 \u0BAA\u0BB4\u0BC1\u0BA4\u0BC1\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0BB5\u0BBF\u0BAF\u0BB2\u0BBE\u0BB3\u0BB0\u0BCD",
      te: "\u0C17\u0C43\u0C39 \u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C41\u0C24\u0C4D \u0C09\u0C2A\u0C15\u0C30\u0C23\u0C3E\u0C32 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C28\u0C3F\u0C2A\u0C41\u0C23\u0C41\u0C21\u0C41",
      bn: "\u0997\u09C3\u09B9\u09B8\u09CD\u09A5\u09BE\u09B2\u09C0 \u09AC\u09C8\u09A6\u09CD\u09AF\u09C1\u09A4\u09BF\u0995 \u09B8\u09B0\u099E\u09CD\u099C\u09BE\u09AE \u09AE\u09C7\u09B0\u09BE\u09AE\u09A4 \u099F\u09C7\u0995\u09A8\u09BF\u09B6\u09BF\u09AF\u09BC\u09BE\u09A8",
      pa: "\u0A18\u0A30\u0A47\u0A32\u0A42 \u0A2C\u0A3F\u0A1C\u0A32\u0A40 \u0A09\u0A2A\u0A15\u0A30\u0A23 \u0A2E\u0A41\u0A30\u0A70\u0A2E\u0A24 \u0A24\u0A15\u0A28\u0A40\u0A38\u0A3C\u0A40\u0A05\u0A28",
      gu: "\u0A98\u0AB0\u0AC7\u0AB2\u0AC1 \u0A87\u0AB2\u0AC7\u0A95\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A95\u0AB2 \u0A89\u0AAA\u0A95\u0AB0\u0AA3 \u0AB0\u0ABF\u0AAA\u0AC7\u0AB0\u0ABF\u0A82\u0A97 \u0A9F\u0AC7\u0A95\u0AA8\u0ABF\u0AB6\u0ABF\u0AAF\u0AA8",
      or: "\u0B18\u0B30\u0B4B\u0B07 \u0B2C\u0B48\u0B26\u0B4D\u0B5F\u0B41\u0B24\u0B3F\u0B15 \u0B09\u0B2A\u0B15\u0B30\u0B23 \u0B2E\u0B30\u0B3E\u0B2E\u0B24\u0B3F \u0B15\u0B3E\u0B30\u0B3F\u0B17\u0B30",
      kn: "\u0CAE\u0CA8\u0CC6\u0CAC\u0CB3\u0C95\u0CC6\u0CAF \u0CB5\u0CBF\u0CA6\u0CCD\u0CAF\u0CC1\u0CA4\u0CCD \u0C89\u0CAA\u0C95\u0CB0\u0CA3 \u0CA6\u0CC1\u0CB0\u0CB8\u0CCD\u0CA4\u0CBF \u0CA4\u0C9C\u0CCD\u0C9E",
      en: "Domestic Electrical Appliance Care Technician"
    },
    sector: "Electronics Sector Skills Council of India (ESSCI)",
    nsqfLevel: 4,
    qpCode: "ELE/Q3104",
    durationHours: 360,
    minEducation: "8th Pass",
    matchScore: 91,
    matchReasons: [
      "Allows starting a local repair shop or doorstep repair service within 5-10 km radius",
      "Matches candidates with physical mobility limitations who prefer home-block operations",
      "Fully covers fan, mixer, motor pump, wiring, and induction cooktop maintenance"
    ],
    suitabilityType: "Self-Employment Ideal",
    avgMonthlyEarnings: "INR 16,000 - 25,000 / month",
    trainingCenters: [
      { name: "District ITI & PM-AJAY GIA Wing", location: "Block Headquarters", distanceKm: 6, seatsAvailable: 25 },
      { name: "Rural Self Employment Training Institute (RSETI)", location: "District Collectorate Road", distanceKm: 14, seatsAvailable: 20 }
    ],
    pmAjayGiaToolkitSupplied: "Digital Insulation Tester, Soldering Station, Heavy-duty Wire Stripper, Component Box (Worth INR 10,000)",
    placementGuarantee: "Self-employment kit + tie-up with local urban-rural service networks",
    careerPathway: "Independent Electrical Service Center Owner / Village Vidyut Sahayak"
  },
  {
    id: "nsqf-leather-03",
    title: "Leather Footwear & Goods Craftsman (Modernized)",
    titleRegional: {
      hi: "\u0906\u0927\u0941\u0928\u093F\u0915 \u091A\u092E\u0921\u093C\u093E \u091C\u0942\u0924\u093E \u0935 \u0909\u0924\u094D\u092A\u093E\u0926 \u0928\u093F\u0930\u094D\u092E\u093E\u0923 \u0915\u093E\u0930\u0940\u0917\u0930",
      mr: "\u0906\u0927\u0941\u0928\u093F\u0915 \u091A\u0930\u094D\u092E\u094B\u0926\u094D\u092F\u094B\u0917 \u0935 \u092A\u093E\u0926\u0924\u094D\u0930\u093E\u0923\u0947 \u0915\u093E\u0930\u093E\u0917\u0940\u0930",
      ta: "\u0BA8\u0BB5\u0BC0\u0BA9 \u0BA4\u0BCB\u0BB2\u0BCD \u0BAA\u0BBE\u0BA4\u0BA3\u0BBF \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0BCA\u0BB0\u0BC1\u0B9F\u0BCD\u0B95\u0BB3\u0BCD \u0BA4\u0BAF\u0BBE\u0BB0\u0BBF\u0BAA\u0BCD\u0BAA\u0BBE\u0BB3\u0BB0\u0BCD",
      te: "\u0C06\u0C27\u0C41\u0C28\u0C3F\u0C15 \u0C24\u0C4B\u0C32\u0C41 \u0C2A\u0C3E\u0C26\u0C30\u0C15\u0C4D\u0C37\u0C32 \u0C24\u0C2F\u0C3E\u0C30\u0C40 \u0C28\u0C3F\u0C2A\u0C41\u0C23\u0C41\u0C21\u0C41",
      bn: "\u0986\u09A7\u09C1\u09A8\u09BF\u0995 \u099A\u09BE\u09AE\u09A1\u09BC\u09BE\u09B0 \u099C\u09C1\u09A4\u09CB \u0993 \u09AA\u09A3\u09CD\u09AF \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4\u0995\u09BE\u09B0\u0995",
      pa: "\u0A06\u0A27\u0A41\u0A28\u0A3F\u0A15 \u0A1A\u0A2E\u0A5C\u0A47 \u0A26\u0A47 \u0A1C\u0A41\u0A71\u0A24\u0A47 \u0A05\u0A24\u0A47 \u0A38\u0A3E\u0A2E\u0A3E\u0A28 \u0A15\u0A3E\u0A30\u0A40\u0A17\u0A30",
      gu: "\u0A86\u0AA7\u0AC1\u0AA8\u0ABF\u0A95 \u0A9A\u0ABE\u0AAE\u0AA1\u0ABE\u0AA8\u0ABE \u0AAB\u0AC2\u0A9F\u0AB5\u0AC7\u0AB0 \u0A85\u0AA8\u0AC7 \u0AB8\u0ABE\u0AAE\u0ABE\u0AA8 \u0A95\u0ABE\u0AB0\u0AC0\u0A97\u0AB0",
      or: "\u0B06\u0B27\u0B41\u0B28\u0B3F\u0B15 \u0B1A\u0B2E\u0B21\u0B3C\u0B3E \u0B1C\u0B4B\u0B24\u0B3E \u0B13 \u0B09\u0B24\u0B4D\u0B2A\u0B3E\u0B26\u0B28 \u0B15\u0B3E\u0B30\u0B3F\u0B17\u0B30",
      kn: "\u0C86\u0CA7\u0CC1\u0CA8\u0CBF\u0C95 \u0C9A\u0CB0\u0CCD\u0CAE\u0CA6 \u0CAA\u0CBE\u0CA6\u0CB0\u0C95\u0CCD\u0CB7\u0CC6 \u0CA4\u0CAF\u0CBE\u0CB0\u0C95",
      en: "Leather Footwear & Goods Craftsman (Modernized)"
    },
    sector: "Leather Sector Skill Council (LSSC)",
    nsqfLevel: 4,
    qpCode: "LSS/Q2301",
    durationHours: 320,
    minEducation: "5th Pass / Literate with Traditional Hereditary Background",
    matchScore: 96,
    matchReasons: [
      "Directly upgrades hereditary/traditional caste skills with computer-aided cutting and durable soles",
      "Unlocks PM-AJAY GIA \u20B950,000 grant for motorized sewing and skiving machine procurement",
      "Eliminates exploitative middleman commission through direct market links to ODOP & Khadi"
    ],
    suitabilityType: "Traditional Skill Modernization",
    avgMonthlyEarnings: "INR 20,000 - 32,000 / month",
    trainingCenters: [
      { name: "FDDI Training Extension Unit", location: "Leather Cluster Road", distanceKm: 11, seatsAvailable: 30 },
      { name: "Dr. Ambedkar SC Artisan Development Center", location: "Township Center", distanceKm: 9, seatsAvailable: 20 }
    ],
    pmAjayGiaToolkitSupplied: "Motorized Edge Trimmer, Heavy Leather Stitcher, Pattern Blocks, Safety Respiratory Mask (Worth INR 15,000)",
    placementGuarantee: "90% institutional procurement via PM-AJAY SHG marketing federations",
    careerPathway: "Custom Footwear Brand Owner / Micro Leather Goods Manufacturer"
  },
  {
    id: "nsqf-auto-04",
    title: "Two-Wheeler Service & EV Scooter Technician",
    titleRegional: {
      hi: "\u0926\u094B\u092A\u0939\u093F\u092F\u093E \u090F\u0935\u0902 \u0907\u0932\u0947\u0915\u094D\u091F\u094D\u0930\u093F\u0915 \u0938\u094D\u0915\u0942\u091F\u0930 \u0938\u0947\u0935\u093E \u0924\u0915\u0928\u0940\u0936\u093F\u092F\u0928",
      mr: "\u0926\u0941\u091A\u093E\u0915\u0940 \u0906\u0923\u093F \u0908-\u0938\u094D\u0915\u0942\u091F\u0930 \u0926\u0941\u0930\u0941\u0938\u094D\u0924\u0940 \u0924\u0902\u0924\u094D\u0930\u091C\u094D\u091E",
      ta: "\u0B87\u0BB0\u0BC1\u0B9A\u0B95\u0BCD\u0B95\u0BB0 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAE\u0BBF\u0BA9\u0BCD\u0B9A\u0BBE\u0BB0 \u0BB8\u0BCD\u0B95\u0BC2\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0BB5\u0BBF\u0BAF\u0BB2\u0BBE\u0BB3\u0BB0\u0BCD",
      te: "\u0C26\u0C4D\u0C35\u0C3F\u0C1A\u0C15\u0C4D\u0C30 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C08\u0C35\u0C40 \u0C38\u0C4D\u0C15\u0C42\u0C1F\u0C30\u0C4D \u0C38\u0C30\u0C4D\u0C35\u0C40\u0C38\u0C4D \u0C1F\u0C46\u0C15\u0C4D\u0C28\u0C40\u0C37\u0C3F\u0C2F\u0C28\u0C4D",
      bn: "\u09A6\u09CD\u09AC\u09BF\u099A\u0995\u09CD\u09B0 \u0993 \u0987-\u09B8\u09CD\u0995\u09C1\u099F\u09BE\u09B0 \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u099F\u09C7\u0995\u09A8\u09BF\u09B6\u09BF\u09AF\u09BC\u09BE\u09A8",
      pa: "\u0A26\u0A4B\u0A2A\u0A39\u0A40\u0A06 \u0A05\u0A24\u0A47 \u0A08-\u0A38\u0A15\u0A42\u0A1F\u0A30 \u0A38\u0A30\u0A35\u0A3F\u0A38 \u0A24\u0A15\u0A28\u0A40\u0A38\u0A3C\u0A40\u0A05\u0A28",
      gu: "\u0A9F\u0AC1-\u0AB5\u0ACD\u0AB9\u0AC0\u0AB2\u0AB0 \u0A85\u0AA8\u0AC7 \u0A87-\u0AB8\u0ACD\u0A95\u0AC2\u0A9F\u0AB0 \u0AB8\u0AB0\u0ACD\u0AB5\u0ABF\u0AB8 \u0A9F\u0AC7\u0A95\u0AA8\u0ABF\u0AB6\u0ABF\u0AAF\u0AA8",
      or: "\u0B26\u0B41\u0B07\u0B1A\u0B15\u0B3F\u0B06 \u0B13 \u0B07\u0B2D\u0B3F \u0B38\u0B4D\u0B15\u0B41\u0B1F\u0B30 \u0B38\u0B30\u0B4D\u0B2D\u0B3F\u0B38\u0B3F\u0B02 \u0B1F\u0B47\u0B15\u0B4D\u0B28\u0B3F\u0B38\u0B3F\u0B06\u0B28",
      kn: "\u0CA6\u0CCD\u0CB5\u0CBF\u0C9A\u0C95\u0CCD\u0CB0 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0C87\u0CB5\u0CBF \u0CB8\u0CCD\u0C95\u0CC2\u0C9F\u0CB0\u0CCD \u0CB0\u0CBF\u0CAA\u0CC7\u0CB0\u0CBF \u0CA4\u0C9C\u0CCD\u0C9E",
      en: "Two-Wheeler Service & EV Scooter Technician"
    },
    sector: "Automotive Skills Development Council (ASDC)",
    nsqfLevel: 4,
    qpCode: "ASC/Q1411",
    durationHours: 400,
    minEducation: "8th Pass",
    matchScore: 93,
    matchReasons: [
      "Evergreen demand in every rural weekly bazaar (haat) and highway node",
      "Covers both traditional carbureted bikes and modern brushless DC (BLDC) motor EV scooters",
      "High daily cash inflow for beneficiary families"
    ],
    suitabilityType: "Self-Employment Ideal",
    avgMonthlyEarnings: "INR 22,000 - 35,000 / month",
    trainingCenters: [
      { name: "Automotive Skill Foundation Center", location: "National Highway Bypass", distanceKm: 10, seatsAvailable: 16 },
      { name: "Government Polytechnic Skill Wing", location: "District North", distanceKm: 17, seatsAvailable: 20 }
    ],
    pmAjayGiaToolkitSupplied: "Air Compressor 1HP, Torque Wrench Set, Battery Diagnostic Analyzer, Pneumatic Impact Kit (Worth INR 14,000)",
    placementGuarantee: "Dealership authorized service partner or roadside garage seed grant",
    careerPathway: "Independent Multi-Brand Two-Wheeler / EV Workshop Owner"
  },
  {
    id: "nsqf-handloom-05",
    title: "Jacquard & Handloom Master Weaver (Design Upgraded)",
    titleRegional: {
      hi: "\u091C\u0948\u0915\u0915\u093E\u0930\u094D\u0921 \u0935 \u0939\u0925\u0915\u0930\u0918\u093E \u092E\u093E\u0938\u094D\u091F\u0930 \u092C\u0941\u0928\u0915\u0930 (\u0909\u0928\u094D\u0928\u0924 \u0921\u093F\u091C\u093E\u0907\u0928)",
      mr: "\u091C\u0945\u0915\u0949\u0930\u094D\u0921 \u0935 \u0939\u093E\u0924\u092E\u093E\u0917 \u0935\u093F\u0923\u0915\u0930 \u0915\u093E\u0930\u093E\u0917\u0940\u0930",
      ta: "\u0B9C\u0BBE\u0B95\u0BCD\u0B95\u0BBE\u0BB0\u0BCD\u0B9F\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B95\u0BC8\u0BA4\u0BCD\u0BA4\u0BB1\u0BBF \u0BAE\u0BC1\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8 \u0BA8\u0BC6\u0B9A\u0BB5\u0BBE\u0BB3\u0BB0\u0BCD",
      te: "\u0C1C\u0C3E\u0C15\u0C4D\u0C35\u0C3E\u0C30\u0C4D\u0C21\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C1A\u0C47\u0C28\u0C47\u0C24 \u0C2E\u0C3E\u0C38\u0C4D\u0C1F\u0C30\u0C4D \u0C35\u0C40\u0C35\u0C30\u0C4D",
      bn: "\u099C\u09CD\u09AF\u09BE\u0995\u09CB\u09AF\u09BC\u09BE\u09B0\u09CD\u09A1 \u0993 \u09A4\u09BE\u0981\u09A4 \u09AE\u09BE\u09B8\u09CD\u099F\u09BE\u09B0 \u09A4\u09BE\u0981\u09A4\u09BF (\u0989\u09A8\u09CD\u09A8\u09A4 \u09A8\u0995\u09B6\u09BE)",
      pa: "\u0A1C\u0A48\u0A15\u0A35\u0A3E\u0A30\u0A21 \u0A05\u0A24\u0A47 \u0A39\u0A48\u0A02\u0A21\u0A32\u0A42\u0A2E \u0A2E\u0A3E\u0A38\u0A1F\u0A30 \u0A1C\u0A41\u0A32\u0A3E\u0A39\u0A3E",
      gu: "\u0A9C\u0AC7\u0A95\u0ABE\u0AB0\u0ACD\u0AA1 \u0A85\u0AA8\u0AC7 \u0AB9\u0AC7\u0AA8\u0ACD\u0AA1\u0AB2\u0AC2\u0AAE \u0AAE\u0ABE\u0AB8\u0ACD\u0A9F\u0AB0 \u0AB5\u0AA3\u0A95\u0AB0",
      or: "\u0B1C\u0B4D\u0B5F\u0B3E\u0B15\u0B3E\u0B30\u0B4D\u0B21 \u0B13 \u0B39\u0B38\u0B4D\u0B24\u0B24\u0B28\u0B4D\u0B24 \u0B2E\u0B3E\u0B37\u0B4D\u0B1F\u0B30 \u0B2C\u0B41\u0B23\u0B3E\u0B15\u0B3E\u0B30",
      kn: "\u0C9C\u0CBE\u0C95\u0CCD\u0CB5\u0CBE\u0CB0\u0CCD\u0CA1\u0CCD \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0C95\u0CC8\u0CAE\u0C97\u0CCD\u0C97 \u0CA8\u0CC7\u0C95\u0CBE\u0CB0 \u0CA4\u0C9C\u0CCD\u0C9E",
      en: "Jacquard & Handloom Master Weaver (Design Upgraded)"
    },
    sector: "Handicrafts and Carpet Sector Skill Council (HCSSC)",
    nsqfLevel: 4,
    qpCode: "HCS/Q7301",
    durationHours: 320,
    minEducation: "5th Pass / Hereditary Artisan",
    matchScore: 95,
    matchReasons: [
      "Preserves and scales traditional generational weaving skill of marginalized weaver households",
      "Adds Jacquard card-punching and modern CAD motif capabilities",
      "Enables direct sales through TRIFED, GeM portal, and state handicrafts apex bodies"
    ],
    suitabilityType: "Traditional Skill Modernization",
    avgMonthlyEarnings: "INR 18,000 - 30,000 / month",
    trainingCenters: [
      { name: "Weavers Service Center (Ministry of Textiles / MoSJE)", location: "Handloom Colony", distanceKm: 7, seatsAvailable: 25 },
      { name: "SC Artisan Cluster Development Society", location: "Rural Craft Park", distanceKm: 12, seatsAvailable: 15 }
    ],
    pmAjayGiaToolkitSupplied: "Improved Frame Loom Accessories, Warping Drum, Electronic Yarn Balance, Natural Dye Vat (Worth INR 13,000)",
    placementGuarantee: "Buyback agreement with District Handloom Cooperative Society",
    careerPathway: "Master Weaver & Rural Handloom Micro-Enterprise Leader"
  },
  {
    id: "nsqf-apparel-06",
    title: "Self-Employed Tailor & Garment Boutique Entrepreneur",
    titleRegional: {
      hi: "\u0938\u094D\u0935\u0930\u094B\u091C\u0917\u093E\u0930 \u0926\u0930\u094D\u091C\u0940 \u090F\u0935\u0902 \u0917\u093E\u0930\u092E\u0947\u0902\u091F \u092C\u0941\u091F\u0940\u0915 \u0909\u0926\u094D\u092F\u092E\u0940",
      mr: "\u0938\u094D\u0935\u092F\u0902\u0930\u094B\u091C\u0917\u093E\u0930 \u0936\u093F\u0902\u092A\u0940 \u0935 \u092C\u0941\u091F\u0940\u0915 \u0909\u0926\u094D\u092F\u094B\u091C\u0915",
      ta: "\u0B9A\u0BC1\u0BAF\u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD \u0BA4\u0BC8\u0BAF\u0BB2\u0BB0\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B86\u0B9F\u0BC8 \u0BA4\u0BAF\u0BBE\u0BB0\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BAE\u0BC1\u0BA9\u0BC8\u0BB5\u0BCB\u0BB0\u0BCD",
      te: "\u0C38\u0C4D\u0C35\u0C2F\u0C02 \u0C09\u0C2A\u0C3E\u0C27\u0C3F \u0C1F\u0C48\u0C32\u0C30\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C17\u0C3E\u0C30\u0C4D\u0C2E\u0C46\u0C02\u0C1F\u0C4D \u0C2C\u0C4B\u0C1F\u0C3F\u0C15\u0C4D \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C4D\u0C25\u0C3E\u0C2A\u0C15\u0C41\u0C21\u0C41",
      bn: "\u09B8\u09CD\u09AC\u09A8\u09BF\u09B0\u09CD\u09AD\u09B0 \u09A6\u09B0\u09CD\u099C\u09BF \u0993 \u09AC\u09C1\u099F\u09BF\u0995 \u0989\u09A6\u09CD\u09AF\u09CB\u0995\u09CD\u09A4\u09BE",
      pa: "\u0A38\u0A35\u0A48-\u0A30\u0A41\u0A1C\u0A3C\u0A17\u0A3E\u0A30 \u0A26\u0A30\u0A1C\u0A3C\u0A40 \u0A05\u0A24\u0A47 \u0A17\u0A3E\u0A30\u0A2E\u0A48\u0A02\u0A1F \u0A2C\u0A41\u0A1F\u0A40\u0A15 \u0A09\u0A71\u0A26\u0A2E\u0A40",
      gu: "\u0AB8\u0ACD\u0AB5-\u0AB0\u0ACB\u0A9C\u0A97\u0ABE\u0AB0 \u0A9F\u0AC7\u0AB2\u0AB0 \u0A85\u0AA8\u0AC7 \u0A97\u0ABE\u0AB0\u0AAE\u0AC7\u0AA8\u0ACD\u0A9F \u0AAC\u0AC1\u0A9F\u0ABF\u0A95 \u0A89\u0AA6\u0ACD\u0AAF\u0ACB\u0A97\u0AB8\u0ABE\u0AB9\u0AB8\u0ABF\u0A95",
      or: "\u0B38\u0B4D\u0B71\u0B5F\u0B02 \u0B28\u0B3F\u0B5F\u0B4B\u0B1C\u0B3F\u0B24 \u0B1F\u0B47\u0B32\u0B30 \u0B13 \u0B2A\u0B4B\u0B37\u0B3E\u0B15 \u0B28\u0B3F\u0B30\u0B4D\u0B2E\u0B3E\u0B24\u0B3E",
      kn: "\u0CB8\u0CCD\u0CB5\u0CAF\u0C82 \u0C89\u0CA6\u0CCD\u0CAF\u0CCB\u0C97\u0CBF \u0CA6\u0CB0\u0CCD\u0C9C\u0CBF \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CAC\u0CCA\u0C9F\u0CBF\u0C95\u0CCD \u0C89\u0CA6\u0CCD\u0CAF\u0CAE\u0CBF",
      en: "Self-Employed Tailor & Garment Boutique Entrepreneur"
    },
    sector: "Apparel, Made-Ups & Home Furnishing Sector Skill Council (AMHSSC)",
    nsqfLevel: 4,
    qpCode: "AMH/Q1947",
    durationHours: 340,
    minEducation: "Primary / 8th Pass",
    matchScore: 92,
    matchReasons: [
      "Perfect for SC women and home-based workers with localized mobility constraints",
      "Covers school uniform stitching, designer blouses, and regional garment fabrication",
      "Eligible for PM-AJAY GIA \u20B950,000 grant for industrial motor-driven sewing machinery"
    ],
    suitabilityType: "Self-Employment Ideal",
    avgMonthlyEarnings: "INR 15,000 - 26,000 / month",
    trainingCenters: [
      { name: "National Skill Training Institute for Women (Extension)", location: "Tehsil Complex", distanceKm: 5, seatsAvailable: 35 },
      { name: "Jan Shikshan Sansthan (JSS)", location: "Near Bus Stand", distanceKm: 8, seatsAvailable: 28 }
    ],
    pmAjayGiaToolkitSupplied: "High-speed Industrial Direct-Drive Lockstitch Machine, Overlock Stitcher, Steam Iron (Worth INR 18,000)",
    placementGuarantee: "Institutional tie-up with local government schools for uniform bulk contracts",
    careerPathway: "Custom Boutique Proprietor / Micro Garment Manufacturing Unit"
  },
  {
    id: "nsqf-agri-07",
    title: "Organic Grower & Vermicompost Bio-Fertilizer Producer",
    titleRegional: {
      hi: "\u091C\u0948\u0935\u093F\u0915 \u0915\u0943\u0937\u0915 \u090F\u0935\u0902 \u0935\u0930\u094D\u092E\u0940\u0915\u092E\u094D\u092A\u094B\u0938\u094D\u091F \u091C\u0948\u0935-\u0909\u0930\u094D\u0935\u0930\u0915 \u0909\u0924\u094D\u092A\u093E\u0926\u0915",
      mr: "\u0938\u0947\u0902\u0926\u094D\u0930\u093F\u092F \u0936\u0947\u0924\u0915\u0930\u0940 \u0935 \u0917\u093E\u0902\u0921\u0942\u0933 \u0916\u0924 \u0909\u0924\u094D\u092A\u093E\u0926\u0915",
      ta: "\u0B87\u0BAF\u0BB1\u0BCD\u0B95\u0BC8 \u0B89\u0BB4\u0BB5\u0BB0\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAE\u0BA3\u0BCD\u0BAA\u0BC1\u0BB4\u0BC1 \u0B89\u0BB0 \u0B89\u0BB1\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE\u0BB3\u0BB0\u0BCD",
      te: "\u0C38\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C40\u0C2F \u0C30\u0C48\u0C24\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C35\u0C30\u0C4D\u0C2E\u0C40\u0C15\u0C02\u0C2A\u0C4B\u0C38\u0C4D\u0C1F\u0C4D \u0C2C\u0C2F\u0C4B \u0C0E\u0C30\u0C41\u0C35\u0C41\u0C32 \u0C09\u0C24\u0C4D\u0C2A\u0C24\u0C4D\u0C24\u0C3F\u0C26\u0C3E\u0C30\u0C41",
      bn: "\u099C\u09C8\u09AC \u099A\u09BE\u09B7\u09C0 \u0993 \u0995\u09C7\u0981\u099A\u09CB \u09B8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4\u0995\u09BE\u09B0\u0995",
      pa: "\u0A1C\u0A48\u0A35\u0A3F\u0A15 \u0A15\u0A3F\u0A38\u0A3E\u0A28 \u0A05\u0A24\u0A47 \u0A17\u0A70\u0A21\u0A4B\u0A06 \u0A16\u0A3E\u0A26 \u0A09\u0A24\u0A2A\u0A3E\u0A26\u0A15",
      gu: "\u0A93\u0AB0\u0ACD\u0A97\u0AC7\u0AA8\u0ABF\u0A95 \u0A96\u0AC7\u0AA1\u0AC2\u0AA4 \u0A85\u0AA8\u0AC7 \u0AB5\u0AB0\u0ACD\u0AAE\u0AC0\u0A95\u0AAE\u0ACD\u0AAA\u0ACB\u0AB8\u0ACD\u0A9F \u0AAC\u0ABE\u0AAF\u0ACB-\u0A96\u0ABE\u0AA4\u0AB0 \u0A89\u0AA4\u0ACD\u0AAA\u0ABE\u0AA6\u0A95",
      or: "\u0B1C\u0B48\u0B2C\u0B3F\u0B15 \u0B15\u0B43\u0B37\u0B15 \u0B13 \u0B2D\u0B30\u0B4D\u0B2E\u0B3F\u0B15\u0B2E\u0B4D\u0B2A\u0B4B\u0B37\u0B4D\u0B1F \u0B09\u0B24\u0B4D\u0B2A\u0B3E\u0B26\u0B28\u0B15\u0B3E\u0B30\u0B40",
      kn: "\u0CB8\u0CBE\u0CB5\u0CAF\u0CB5 \u0C95\u0CC3\u0CB7\u0CBF\u0C95 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0C8E\u0CB0\u0CC6\u0CB9\u0CC1\u0CB3\u0CC1 \u0C97\u0CCA\u0CAC\u0CCD\u0CAC\u0CB0 \u0CA4\u0CAF\u0CBE\u0CB0\u0C95",
      en: "Organic Grower & Vermicompost Bio-Fertilizer Producer"
    },
    sector: "Agriculture Skill Council of India (ASCI)",
    nsqfLevel: 4,
    qpCode: "AGR/Q1201",
    durationHours: 240,
    minEducation: "5th Pass / Literate",
    matchScore: 89,
    matchReasons: [
      "Converts agrarian wage laborers and small landholders into bio-input producers",
      "Zero migration requirement: operated directly on homestead backyard or village common land",
      "PM-AJAY GIA \u20B950,000 grant fully funds 4 HDPE vermi-beds, shredder, and starter culture"
    ],
    suitabilityType: "Self-Employment Ideal",
    avgMonthlyEarnings: "INR 17,000 - 27,000 / month",
    trainingCenters: [
      { name: "Krishi Vigyan Kendra (KVK)", location: "District Agricultural Farm", distanceKm: 13, seatsAvailable: 24 },
      { name: "NABARD Rural Skill Hub", location: "Block Agronomy Center", distanceKm: 9, seatsAvailable: 20 }
    ],
    pmAjayGiaToolkitSupplied: "HDPE Vermi-beds (4 units), Soil Testing pH Meter, Manual Biomass Chopper, Bag Sealer (Worth INR 12,000)",
    placementGuarantee: "Offtake tie-up with local Horticulture Dept & FPOs under PKVY scheme",
    careerPathway: "Certified Bio-Input Producer & Agro-Retailer"
  },
  {
    id: "nsqf-carpentry-08",
    title: "Modular Furniture Carpenter & Wood Craftsman",
    titleRegional: {
      hi: "\u092E\u0949\u0921\u094D\u092F\u0942\u0932\u0930 \u092B\u0930\u094D\u0928\u0940\u091A\u0930 \u092C\u0922\u093C\u0908 \u090F\u0935\u0902 \u0915\u093E\u0937\u094D\u0920 \u0936\u093F\u0932\u094D\u092A\u0915\u093E\u0930",
      mr: "\u092E\u0949\u0921\u094D\u092F\u0941\u0932\u0930 \u092B\u0930\u094D\u0928\u093F\u091A\u0930 \u0938\u0941\u0924\u093E\u0930 \u0935 \u0932\u093E\u0915\u0921\u0940 \u0935\u0938\u094D\u0924\u0942 \u0915\u093E\u0930\u093E\u0917\u0940\u0930",
      ta: "\u0BAE\u0BBE\u0B9F\u0BC1\u0BB2\u0BB0\u0BCD \u0BAA\u0BB0\u0BCD\u0BA9\u0BBF\u0B9A\u0BCD\u0B9A\u0BB0\u0BCD \u0BA4\u0B9A\u0BCD\u0B9A\u0BB0\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAE\u0BB0 \u0BB5\u0BC7\u0BB2\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1 \u0B95\u0BB2\u0BC8\u0B9E\u0BB0\u0BCD",
      te: "\u0C2E\u0C3E\u0C21\u0C4D\u0C2F\u0C41\u0C32\u0C30\u0C4D \u0C2B\u0C30\u0C4D\u0C28\u0C3F\u0C1A\u0C30\u0C4D \u0C35\u0C21\u0C4D\u0C30\u0C02\u0C17\u0C3F \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C1A\u0C46\u0C15\u0C4D\u0C15 \u0C15\u0C33\u0C3E\u0C15\u0C3E\u0C30\u0C41\u0C21\u0C41",
      bn: "\u09AE\u09A1\u09C1\u09B2\u09BE\u09B0 \u0986\u09B8\u09AC\u09BE\u09AC \u099B\u09C1\u09A4\u09BE\u09B0 \u0993 \u0995\u09BE\u09A0\u09C7\u09B0 \u0995\u09BE\u09B0\u09BF\u0997\u09B0",
      pa: "\u0A2E\u0A3E\u0A21\u0A3F\u0A0A\u0A32\u0A30 \u0A2B\u0A30\u0A28\u0A40\u0A1A\u0A30 \u0A24\u0A30\u0A16\u0A3E\u0A23 \u0A05\u0A24\u0A47 \u0A32\u0A71\u0A15\u0A5C\u0A40 \u0A15\u0A3E\u0A30\u0A40\u0A17\u0A30",
      gu: "\u0AAE\u0ACB\u0AA1\u0ACD\u0AAF\u0AC1\u0AB2\u0AB0 \u0AAB\u0AB0\u0ACD\u0AA8\u0ABF\u0A9A\u0AB0 \u0AB8\u0AC1\u0AA5\u0ABE\u0AB0 \u0A85\u0AA8\u0AC7 \u0AB2\u0ABE\u0A95\u0AA1\u0ABE\u0AA8\u0ABE \u0A95\u0ABE\u0AB0\u0AC0\u0A97\u0AB0",
      or: "\u0B2E\u0B21\u0B4D\u0B5F\u0B41\u0B32\u0B3E\u0B30 \u0B2B\u0B30\u0B4D\u0B28\u0B3F\u0B1A\u0B30 \u0B2C\u0B22\u0B3C\u0B47\u0B07 \u0B13 \u0B15\u0B3E\u0B20 \u0B15\u0B3E\u0B30\u0B3F\u0B17\u0B30",
      kn: "\u0CAE\u0CBE\u0CA1\u0CCD\u0CAF\u0CC1\u0CB2\u0CB0\u0CCD \u0CAA\u0CC0\u0CA0\u0CCB\u0CAA\u0C95\u0CB0\u0CA3 \u0CAC\u0CA1\u0C97\u0CBF",
      en: "Modular Furniture Carpenter & Wood Craftsman"
    },
    sector: "Furniture & Fittings Skill Council (FFSC)",
    nsqfLevel: 4,
    qpCode: "FFS/Q0103",
    durationHours: 350,
    minEducation: "8th Pass",
    matchScore: 90,
    matchReasons: [
      "Huge transition in rural homes towards modular plywood, mica, and aluminium fittings",
      "Upgrades traditional village carpentry to precision power-tool operation",
      "GIA funding supports portable table saw, circular saw, router, and pneumatic nail gun"
    ],
    suitabilityType: "Traditional Skill Modernization",
    avgMonthlyEarnings: "INR 20,000 - 32,000 / month",
    trainingCenters: [
      { name: "Skill India Advanced Woodworking Center", location: "Industrial Estate Phase II", distanceKm: 16, seatsAvailable: 15 },
      { name: "Rural Artisan Polytechnic", location: "Tehsil Link Road", distanceKm: 8, seatsAvailable: 18 }
    ],
    pmAjayGiaToolkitSupplied: "Plunge Router, Circular Saw 7-inch, Laser Distance Measurer, Heavy Clamps (Worth INR 14,000)",
    placementGuarantee: "Tie-up with regional interior contractors & independent shop orders",
    careerPathway: "Independent Modular Woodcraft Contractor / Furniture Showroom Partner"
  },
  {
    id: "nsqf-drone-09",
    title: "Agriculture Drone Operator & Spraying Pilot",
    titleRegional: {
      hi: "\u0915\u0943\u0937\u093F \u0921\u094D\u0930\u094B\u0928 \u0938\u0902\u091A\u093E\u0932\u0915 \u090F\u0935\u0902 \u0915\u0940\u091F\u0928\u093E\u0936\u0915 \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u092A\u093E\u092F\u0932\u091F",
      mr: "\u0936\u0947\u0924\u0940 \u0921\u094D\u0930\u094B\u0928 \u091A\u093E\u0932\u0915 \u0935 \u092B\u0935\u093E\u0930\u0923\u0940 \u092A\u093E\u092F\u0932\u091F",
      ta: "\u0BB5\u0BC7\u0BB3\u0BBE\u0BA3\u0BCD \u0B9F\u0BCD\u0BB0\u0BCB\u0BA9\u0BCD \u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAA\u0BC8\u0BB2\u0B9F\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA4\u0BC6\u0BB3\u0BBF\u0BAA\u0BCD\u0BAA\u0BBE\u0BA9\u0BCD \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0BB5\u0BBF\u0BAF\u0BB2\u0BBE\u0BB3\u0BB0\u0BCD",
      te: "\u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C3E\u0C2F \u0C21\u0C4D\u0C30\u0C4B\u0C28\u0C4D \u0C06\u0C2A\u0C30\u0C47\u0C1F\u0C30\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C38\u0C4D\u0C2A\u0C4D\u0C30\u0C47\u0C2F\u0C3F\u0C02\u0C17\u0C4D \u0C2A\u0C48\u0C32\u0C1F\u0C4D",
      bn: "\u0995\u09C3\u09B7\u09BF \u09A1\u09CD\u09B0\u09CB\u09A8 \u0985\u09AA\u09BE\u09B0\u09C7\u099F\u09B0 \u0993 \u09B8\u09CD\u09AA\u09CD\u09B0\u09C7\u09AF\u09BC\u09BF\u0982 \u09AA\u09BE\u0987\u09B2\u099F",
      pa: "\u0A16\u0A47\u0A24\u0A40\u0A2C\u0A3E\u0A5C\u0A40 \u0A21\u0A30\u0A4B\u0A28 \u0A06\u0A2A\u0A30\u0A47\u0A1F\u0A30 \u0A05\u0A24\u0A47 \u0A38\u0A2A\u0A30\u0A47\u0A05 \u0A2A\u0A3E\u0A07\u0A32\u0A1F",
      gu: "\u0A95\u0AC3\u0AB7\u0ABF \u0AA1\u0ACD\u0AB0\u0ACB\u0AA8 \u0A93\u0AAA\u0AB0\u0AC7\u0A9F\u0AB0 \u0A85\u0AA8\u0AC7 \u0A9B\u0A82\u0A9F\u0A95\u0ABE\u0AB5 \u0AAA\u0ABE\u0AAF\u0AB2\u0ACB\u0A9F",
      or: "\u0B15\u0B43\u0B37\u0B3F \u0B21\u0B4D\u0B30\u0B4B\u0B28\u0B4D \u0B1A\u0B3E\u0B33\u0B15 \u0B13 \u0B38\u0B4D\u0B2A\u0B4D\u0B30\u0B47\u0B5F\u0B3F\u0B02 \u0B2A\u0B3E\u0B07\u0B32\u0B1F\u0B4D",
      kn: "\u0C95\u0CC3\u0CB7\u0CBF \u0CA1\u0CCD\u0CB0\u0CCB\u0CA8\u0CCD \u0C9A\u0CBE\u0CB2\u0C95",
      en: "Agriculture Drone Operator & Spraying Pilot"
    },
    sector: "Aerospace and Aviation Sector Skill Council (AASSC)",
    nsqfLevel: 4,
    qpCode: "AAS/Q2101",
    durationHours: 200,
    minEducation: "10th Pass",
    matchScore: 93,
    matchReasons: [
      "Aspirational modern tech trade for SC youth with high local prestige and digital exposure",
      "Charges INR 400 - 600 per acre for rapid nano-urea and pesticide spraying service",
      "Supported under Namo Drone Didi & PM-AJAY custom hiring center subsidies"
    ],
    suitabilityType: "Self-Employment Ideal",
    avgMonthlyEarnings: "INR 25,000 - 45,000 / month",
    trainingCenters: [
      { name: "DGCA Certified Remote Pilot Training School", location: "Aviation Training Field", distanceKm: 22, seatsAvailable: 12 },
      { name: "District Drone Innovation Hub", location: "District Smart Center", distanceKm: 18, seatsAvailable: 10 }
    ],
    pmAjayGiaToolkitSupplied: "DGCA Remote Pilot License Assistance, Ground Control Tablet, Battery Quick-Charger Hub (Worth INR 20,000)",
    placementGuarantee: "Direct enrollment in FPO Custom Hiring Centers across district blocks",
    careerPathway: "Rural Drone Service Provider (Kisan Drone Entrepreneur)"
  },
  {
    id: "nsqf-mobile-10",
    title: "Smartphone Hardware & Micro-Soldering Technician",
    titleRegional: {
      hi: "\u0938\u094D\u092E\u093E\u0930\u094D\u091F\u092B\u094B\u0928 \u0939\u093E\u0930\u094D\u0921\u0935\u0947\u092F\u0930 \u090F\u0935\u0902 \u092E\u093E\u0907\u0915\u094D\u0930\u094B-\u0938\u094B\u0932\u094D\u0921\u0930\u093F\u0902\u0917 \u0924\u0915\u0928\u0940\u0936\u093F\u092F\u0928",
      mr: "\u0938\u094D\u092E\u093E\u0930\u094D\u091F\u092B\u094B\u0928 \u0939\u093E\u0930\u094D\u0921\u0935\u0947\u0905\u0930 \u0935 \u092E\u093E\u092F\u0915\u094D\u0930\u094B-\u0938\u094B\u0932\u094D\u0921\u0930\u093F\u0902\u0917 \u0924\u0902\u0924\u094D\u0930\u091C\u094D\u091E",
      ta: "\u0BB8\u0BCD\u0BAE\u0BBE\u0BB0\u0BCD\u0B9F\u0BCD\u0BAA\u0BCB\u0BA9\u0BCD \u0BB5\u0BA9\u0BCD\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAE\u0BC8\u0B95\u0BCD\u0BB0\u0BCB \u0B9A\u0BBE\u0BB2\u0BBF\u0B9F\u0BB0\u0BBF\u0B99\u0BCD \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0BB5\u0BBF\u0BAF\u0BB2\u0BBE\u0BB3\u0BB0\u0BCD",
      te: "\u0C38\u0C4D\u0C2E\u0C3E\u0C30\u0C4D\u0C1F\u0C4D\u200C\u0C2B\u0C4B\u0C28\u0C4D \u0C39\u0C3E\u0C30\u0C4D\u0C21\u0C4D\u200C\u0C35\u0C47\u0C30\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2E\u0C48\u0C15\u0C4D\u0C30\u0C4B-\u0C38\u0C4B\u0C32\u0C4D\u0C21\u0C30\u0C3F\u0C02\u0C17\u0C4D \u0C1F\u0C46\u0C15\u0C4D\u0C28\u0C40\u0C37\u0C3F\u0C2F\u0C28\u0C4D",
      bn: "\u09B8\u09CD\u09AE\u09BE\u09B0\u09CD\u099F\u09AB\u09CB\u09A8 \u09B9\u09BE\u09B0\u09CD\u09A1\u0993\u09AF\u09BC\u09CD\u09AF\u09BE\u09B0 \u0993 \u09AE\u09BE\u0987\u0995\u09CD\u09B0\u09CB-\u09B8\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0\u09BF\u0982 \u099F\u09C7\u0995\u09A8\u09BF\u09B6\u09BF\u09AF\u09BC\u09BE\u09A8",
      pa: "\u0A38\u0A2E\u0A3E\u0A30\u0A1F\u0A2B\u0A4B\u0A28 \u0A39\u0A3E\u0A30\u0A21\u0A35\u0A47\u0A05\u0A30 \u0A05\u0A24\u0A47 \u0A2E\u0A3E\u0A08\u0A15\u0A4D\u0A30\u0A4B-\u0A38\u0A4B\u0A32\u0A21\u0A30\u0A3F\u0A70\u0A17 \u0A24\u0A15\u0A28\u0A40\u0A38\u0A3C\u0A40\u0A05\u0A28",
      gu: "\u0AB8\u0ACD\u0AAE\u0ABE\u0AB0\u0ACD\u0A9F\u0AAB\u0ACB\u0AA8 \u0AB9\u0ABE\u0AB0\u0ACD\u0AA1\u0AB5\u0AC7\u0AB0 \u0A85\u0AA8\u0AC7 \u0AAE\u0ABE\u0A87\u0A95\u0ACD\u0AB0\u0ACB-\u0AB8\u0ACB\u0AB2\u0ACD\u0AA1\u0AB0\u0ABF\u0A82\u0A97 \u0A9F\u0AC7\u0A95\u0AA8\u0ABF\u0AB6\u0ABF\u0AAF\u0AA8",
      or: "\u0B38\u0B4D\u0B2E\u0B3E\u0B30\u0B4D\u0B1F\u0B2B\u0B4B\u0B28\u0B4D \u0B39\u0B3E\u0B30\u0B4D\u0B21\u0B71\u0B47\u0B30\u0B4D \u0B13 \u0B2E\u0B3E\u0B07\u0B15\u0B4D\u0B30\u0B4B-\u0B38\u0B4B\u0B32\u0B21\u0B30\u0B3F\u0B02 \u0B15\u0B3E\u0B30\u0B3F\u0B17\u0B30",
      kn: "\u0CB8\u0CCD\u0CAE\u0CBE\u0CB0\u0CCD\u0C9F\u0CCD\u200C\u0CAB\u0CCB\u0CA8\u0CCD \u0CB9\u0CBE\u0CB0\u0CCD\u0CA1\u0CCD\u200C\u0CB5\u0CC7\u0CB0\u0CCD \u0CB0\u0CBF\u0CAA\u0CC7\u0CB0\u0CBF \u0CA4\u0C9C\u0CCD\u0C9E",
      en: "Smartphone Hardware & Micro-Soldering Technician"
    },
    sector: "Telecom Sector Skill Council (TSSC)",
    nsqfLevel: 4,
    qpCode: "TEL/Q2201",
    durationHours: 360,
    minEducation: "8th / 10th Pass",
    matchScore: 92,
    matchReasons: [
      "High footfall retail service viable even in small village chowks and railway junctions",
      "Low physical strain; ideal for youth or persons with lower body mobility constraints",
      "Fast turnaround repairs (screen glass OCA lamination, charging IC, battery replacement)"
    ],
    suitabilityType: "Self-Employment Ideal",
    avgMonthlyEarnings: "INR 20,000 - 35,000 / month",
    trainingCenters: [
      { name: "PM-AJAY Dedicated IT & Telecom Center", location: "Main Market Square", distanceKm: 5, seatsAvailable: 20 },
      { name: "District Skill Development Office (DSDO)", location: "Collectorate Compound", distanceKm: 11, seatsAvailable: 25 }
    ],
    pmAjayGiaToolkitSupplied: "SMD Hot Air Rework Station, Digital Stereo Microscope, DC Regulated Power Supply (Worth INR 16,000)",
    placementGuarantee: "Direct franchise link with spare parts suppliers + PM-AJAY capital subsidy",
    careerPathway: "Independent Mobile & IT Device Service Point Proprietor"
  }
];

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
app.use(express.json({ limit: "15mb" }));
var apiKey = process.env.GEMINI_API_KEY;
var ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
}) : null;
app.get("/api/health", (req, res) => {
  res.json({
    status: "ONLINE",
    service: "PM-AJAY GIA Voice Assistant Server",
    geminiConfigured: Boolean(ai),
    voskOfflineEngineReady: true,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/nsqf/courses", (req, res) => {
  res.json(NSQF_COURSES);
});
app.post("/api/voice/process-dialogue", async (req, res) => {
  try {
    const {
      message,
      language = "hi",
      dialect = "Standard",
      currentProfile = {},
      currentStepKey = "education",
      nextStepKey = "",
      history = [],
      isOfflineMode = false
    } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message text is required" });
    }
    if (isOfflineMode || !ai) {
      const fallbackExtraction = extractEntitiesHeuristically(message, currentProfile, currentStepKey);
      return res.json({
        assistantResponseText: generateEmpatheticFallbackReply(message, language, fallbackExtraction, currentStepKey, nextStepKey),
        extractedProfile: fallbackExtraction,
        engineUsed: isOfflineMode ? "VOSK_OFFLINE_EDGE_KALDI" : "LOCAL_HEURISTIC_PARSER",
        offlineSimulated: true,
        processingNote: "Processed via on-device offline acoustic pipeline without cloud dependency."
      });
    }
    const systemInstruction = `You are "AJAY-Mitra" (\u0905\u091C\u092F-\u092E\u093F\u0924\u094D\u0930), a deeply empathetic, patient, and encouraging voice-first virtual livelihood guide for the Ministry of Social Justice and Empowerment (MoSJE), Government of India, under the Grants-in-Aid (GIA) component of PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana).
Target beneficiary is: ${currentProfile.name || "Pravin"} (Scheduled Caste community).

CRITICAL PROGRESSIVE PROFILING INSTRUCTION:
The beneficiary has just answered the question for: "${currentStepKey}".
The next step to ask about is: "${nextStepKey || "next missing detail"}".
You MUST:
1. Extract their answer into "extractedProfile" for "${currentStepKey}" and any other parameters they mentioned.
2. Under no circumstance repeat the question for "${currentStepKey}"! Always advance to ask about "${nextStepKey}".
   Sequence: educationLevel -> traditionalOccupation -> currentActivity -> vocationalInterests -> employmentPreference -> district/mobility -> complete.
3. First warmly acknowledge in 1 brief sentence what they just answered for "${currentStepKey}".
4. Then ask a clear, simple question specifically for "${nextStepKey}".
5. If "${nextStepKey}" is "complete" (or all details are collected), warmly congratulate the beneficiary, confirm their pre-qualification for the \u20B950,000 PM-AJAY GIA grant, and summarize that recommended NSQF courses are now available.

Return STRICT JSON matching this schema:
{
  "assistantResponseText": "The empathetic spoken answer in the beneficiary's regional language",
  "extractedProfile": {
    "name": "string or current name",
    "age": number or null,
    "gender": "Male" | "Female" | "Other" | null,
    "casteCategory": "Scheduled Caste (SC)",
    "subCaste": "string or empty",
    "state": "string or current state",
    "district": "string or current district",
    "block": "string or current block",
    "annualFamilyIncome": number or null,
    "educationLevel": "string (e.g. Primary 5th Pass, 8th Pass, 10th Pass, 12th Pass, Literate)",
    "traditionalOccupation": "string (e.g. Leathercraft, Handloom weaving, Agrarian labor, Carpentry, Sanitation)",
    "currentActivity": "string",
    "monthlyCurrentIncome": number or null,
    "vocationalInterests": ["string"],
    "mobilityRadius": "Within Village" | "Within Block (< 15km)" | "District HQ (< 40km)" | "State / Can Migrate",
    "physicalConstraints": "string",
    "employmentPreference": "Self-Employment / Micro-Enterprise" | "Wage Employment / Factory Job" | "Both / Flexible",
    "contactNumber": "string",
    "rationCardOrAadhaarLast4": "string"
  },
  "identifiedTradeKeywords": ["string"],
  "grantSubsidyNotes": "Short note on \u20B950,000 PM-AJAY GIA grant status",
  "isInterviewComplete": boolean,
  "nextExpectedField": "education" | "traditional" | "current" | "interests" | "preference" | "location" | "complete"
};`;
    const prompt = `Current Profile State:
${JSON.stringify(currentProfile, null, 2)}

Beneficiary's latest spoken statement:
"${message}"

Extract updated attributes and respond conversationally in language "${language}" (Dialect: "${dialect}").`;
    let response = null;
    let engineUsed = "CLOUD_GEMINI_2.5_FLASH";
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });
    } catch (e1) {
      console.warn("Gemini 2.5 Flash unavailable or quota exceeded, switching to deterministic edge parser:", e1?.message);
      throw e1;
    }
    const parsed = JSON.parse(response?.text || "{}");
    return res.json({
      assistantResponseText: parsed.assistantResponseText || "\u0928\u092E\u0938\u094D\u0924\u0947, \u092E\u0948\u0902 \u0906\u092A\u0915\u0940 \u0915\u0948\u0938\u0947 \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0930 \u0938\u0915\u0924\u093E \u0939\u0942\u0901?",
      extractedProfile: parsed.extractedProfile || currentProfile,
      identifiedTradeKeywords: parsed.identifiedTradeKeywords || [],
      grantSubsidyNotes: parsed.grantSubsidyNotes || "PM-AJAY GIA grant eligible",
      engineUsed,
      offlineSimulated: false
    });
  } catch (err) {
    console.error("Error in /api/voice/process-dialogue:", err);
    const currentStepKey = req.body.currentStepKey || "education";
    const nextStepKey = req.body.nextStepKey || "";
    const fallbackProfile = extractEntitiesHeuristically(req.body.message || "", req.body.currentProfile || {}, currentStepKey);
    return res.json({
      assistantResponseText: generateEmpatheticFallbackReply(req.body.message, req.body.language || "hi", fallbackProfile, currentStepKey, nextStepKey),
      extractedProfile: fallbackProfile,
      engineUsed: "EDGE_FALLBACK_RULE_PARSER",
      offlineSimulated: false,
      errorLogged: err?.message
    });
  }
});
app.post("/api/voice/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required for TTS" });
    }
    if (!ai) {
      return res.json({ useBrowserSynthesis: true, text });
    }
    const ttsResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: text.slice(0, 300),
              speechMetadata: {
                style: "Empathetic, clear, warm community guide"
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" }
          }
        }
      }
    });
    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        audioBase64: base64Audio,
        mimeType: "audio/wav",
        useBrowserSynthesis: false
      });
    }
    return res.json({ useBrowserSynthesis: true, text });
  } catch (err) {
    console.warn("TTS model fallback to client browser synthesis:", err?.message);
    return res.json({ useBrowserSynthesis: true, text: req.body.text });
  }
});
app.post("/api/mis/sync", (req, res) => {
  const { profile, courseId, giaStatus } = req.body;
  const beneficiaryId = `PMAJAY-SC-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(1e5 + Math.random() * 9e5)}`;
  const dossierId = `MoSJE-GIA-DOSSIER-${Math.floor(1e4 + Math.random() * 9e4)}`;
  const lang = req.body.language || "hi";
  let smsText = `MoSJE PM-AJAY: \u092A\u094D\u0930\u093F\u092F \u0932\u093E\u092D\u093E\u0930\u094D\u0925\u0940, \u0906\u092A\u0915\u093E \u092A\u0902\u091C\u0940\u0915\u0930\u0923 \u0938\u0902\u0916\u094D\u092F\u093E ${beneficiaryId} \u092A\u094B\u0930\u094D\u091F\u0932 \u092A\u0930 \u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0939\u094B \u091A\u0941\u0915\u093E \u0939\u0948\u0964 \u20B950,000 \u0915\u0940 \u0905\u0928\u0941\u0926\u093E\u0928 (GIA) \u0938\u0939\u093E\u092F\u0924\u093E \u0906\u092A\u0915\u0947 \u0915\u094C\u0936\u0932 \u0915\u0947\u0902\u0926\u094D\u0930 \u0906\u0935\u0902\u091F\u0928 \u0915\u0947 \u0938\u093E\u0925 \u0905\u0917\u094D\u0930\u0938\u093E\u0930\u093F\u0924 \u0915\u0940 \u0917\u0908 \u0939\u0948\u0964`;
  if (lang === "mr") {
    smsText = `MoSJE PM-AJAY: \u092A\u094D\u0930\u093F\u092F \u0932\u093E\u092D\u093E\u0930\u094D\u0925\u0940, \u0924\u0941\u092E\u091A\u0940 \u0928\u094B\u0902\u0926\u0923\u0940 \u0915\u094D\u0930\u092E\u093E\u0902\u0915 ${beneficiaryId} \u092A\u094B\u0930\u094D\u091F\u0932\u0935\u0930 \u092F\u0936\u0938\u094D\u0935\u0940 \u091D\u093E\u0932\u0940 \u0906\u0939\u0947. \u20B950,000 \u0905\u0928\u0941\u0926\u093E\u0928 (GIA) \u0938\u0939\u093E\u092F\u094D\u092F \u092E\u0902\u091C\u0942\u0930 \u0915\u0930\u0923\u094D\u092F\u093E\u0924 \u0906\u0932\u0947 \u0906\u0939\u0947.`;
  } else if (lang === "ta") {
    smsText = `MoSJE PM-AJAY: \u0B85\u0BA9\u0BCD\u0BAA\u0BBE\u0BA9 \u0BAA\u0BAF\u0BA9\u0BBE\u0BB3\u0BBF, \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAA\u0BA4\u0BBF\u0BB5\u0BC1 \u0B8E\u0BA3\u0BCD ${beneficiaryId} \u0BAA\u0BCB\u0BB0\u0BCD\u0B9F\u0BCD\u0B9F\u0BB2\u0BBF\u0BB2\u0BCD \u0B9A\u0BB0\u0BBF\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1. \u0BB0\u0BC2.50,000 GIA \u0BAE\u0BBE\u0BA9\u0BBF\u0BAF\u0BAE\u0BCD \u0B85\u0BA9\u0BC1\u0BAE\u0BA4\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1.`;
  } else if (lang === "en") {
    smsText = `MoSJE PM-AJAY: Dear Beneficiary, your registration ID ${beneficiaryId} is verified on the MIS Portal. INR 50,000 GIA grant pre-sanctioned.`;
  }
  res.json({
    status: "SYNCED_WITH_MOSJE_PORTAL",
    beneficiaryId,
    dossierId,
    syncTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
    dbtAccountLinked: true,
    assignedPmkkyCenter: "District PMKK Vocational Training Hub - MoSJE Accredited",
    giaSanctionCode: giaStatus?.sanctionNumber || `MoSJE/PM-AJAY/2026/GIA-${Math.floor(1e4 + Math.random() * 9e4)}`,
    smsNotificationPayload: {
      recipient: profile?.contactNumber || "+91-98XXXXX120",
      messageText: smsText,
      language: lang,
      status: "DELIVERED"
    }
  });
});
function extractEntitiesHeuristically(text, current = {}, currentStepKey = "education") {
  const updated = { ...current };
  const lower = text.toLowerCase();
  const nameMatch = text.match(/(?:मेरा नाम|हमार नाम|माझं नाव|என் பெயர்|నా పేరు|my name is)\s+([A-Za-z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F]+)/i);
  if (nameMatch && nameMatch[1]) {
    updated.name = nameMatch[1].trim();
  }
  const ageMatch = text.match(/(?:उम्र|वय|age|வயது)\s*(?:है|आहे|is)?\s*(\d{2})/i) || text.match(/(\d{2})\s*(?:साल|वर्ष|years|வருடம்)/i);
  if (ageMatch && ageMatch[1]) {
    const ageNum = parseInt(ageMatch[1], 10);
    if (ageNum >= 15 && ageNum <= 75) updated.age = ageNum;
  }
  if (lower.includes("8\u0935\u0940\u0902") || lower.includes("\u096E\u0935\u0940\u0902") || lower.includes("\u0906\u0920\u0935\u0940\u0902") || lower.includes("8th") || lower.includes("8 ") || lower.includes("\u0905\u0937\u094D\u091F\u092E")) {
    updated.educationLevel = "Middle (8th Pass)";
  } else if (lower.includes("10\u0935\u0940\u0902") || lower.includes("\u0967\u0966\u0935\u0940\u0902") || lower.includes("\u0926\u0938\u0935\u0940\u0902") || lower.includes("10th") || lower.includes("10 ") || lower.includes("\u0926\u0939\u093E\u0935\u0940") || lower.includes("\u0BAA\u0BA4\u0BCD\u0BA4\u0BBE\u0BAE\u0BCD")) {
    updated.educationLevel = "Matric (10th Pass)";
  } else if (lower.includes("5\u0935\u0940\u0902") || lower.includes("\u096B\u0935\u0940\u0902") || lower.includes("\u092A\u093E\u0902\u091A\u0935\u0940\u0902") || lower.includes("5th") || lower.includes("5 ") || lower.includes("\u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915")) {
    updated.educationLevel = "Primary (5th Pass)";
  } else if (lower.includes("12\u0935\u0940\u0902") || lower.includes("\u0967\u0968\u0935\u0940\u0902") || lower.includes("\u092C\u093E\u0930\u0939\u0935\u0940\u0902") || lower.includes("12th") || lower.includes("12 ") || lower.includes("\u0907\u0902\u091F\u0930")) {
    updated.educationLevel = "Intermediate (12th Pass)";
  }
  if (lower.includes("\u091A\u092E\u0921\u093C\u093E") || lower.includes("leather") || lower.includes("\u091C\u0942\u0924\u093E") || lower.includes("\u091A\u0930\u094D\u092E\u094B\u0926\u094D\u092F\u094B\u0917") || lower.includes("\u0D24\u0D4B\u0D7D")) {
    updated.traditionalOccupation = "Leathercraft & Footwear";
    if (!updated.vocationalInterests) updated.vocationalInterests = [];
    if (!updated.vocationalInterests.includes("Leather Goods")) updated.vocationalInterests.push("Leather Goods");
  } else if (lower.includes("\u092C\u0941\u0928\u0915\u0930") || lower.includes("weaving") || lower.includes("\u0924\u093E\u0902\u0924") || lower.includes("\u0939\u0925\u0915\u0930\u0918\u093E") || lower.includes("\u0935\u093F\u0923\u0915\u093E\u092E") || lower.includes("\u0BA8\u0BC6\u0B9A\u0BB5\u0BC1")) {
    updated.traditionalOccupation = "Handloom & Textile Weaving";
    if (!updated.vocationalInterests) updated.vocationalInterests = [];
    if (!updated.vocationalInterests.includes("Handloom")) updated.vocationalInterests.push("Handloom");
  } else if (lower.includes("\u092C\u0922\u093C\u0908") || lower.includes("carpentry") || lower.includes("\u0938\u0941\u0924\u093E\u0930") || lower.includes("\u0915\u093E\u0920")) {
    updated.traditionalOccupation = "Carpentry & Woodwork";
    if (!updated.vocationalInterests) updated.vocationalInterests = [];
    if (!updated.vocationalInterests.includes("Carpentry")) updated.vocationalInterests.push("Carpentry");
  }
  if (lower.includes("\u092C\u093F\u091C\u0932\u0940") || lower.includes("electric") || lower.includes("\u0935\u093E\u092F\u0930\u093F\u0902\u0917") || lower.includes("\u0938\u094B\u0932\u0930")) {
    updated.currentActivity = updated.currentActivity || "Electrical & Wire Maintenance Helper";
    if (!updated.vocationalInterests) updated.vocationalInterests = [];
    if (!updated.vocationalInterests.includes("Electrical & Solar")) updated.vocationalInterests.push("Electrical & Solar");
  } else if (lower.includes("\u092E\u0948\u0915\u0947\u0928\u093F\u0915") || lower.includes("bike") || lower.includes("\u0917\u093E\u0921\u093C\u0940")) {
    updated.currentActivity = updated.currentActivity || "Two-Wheeler Repair Assistant";
    if (!updated.vocationalInterests) updated.vocationalInterests = [];
    if (!updated.vocationalInterests.push("Automotive Repair")) updated.vocationalInterests.push("Automotive Repair");
  }
  if (lower.includes("\u092C\u093E\u0939\u0930 \u0928\u0939\u0940\u0902") || lower.includes("\u0917\u093E\u0902\u0935 \u092E\u0947\u0902") || lower.includes("\u0918\u0930") || lower.includes("cannot travel") || lower.includes("\u092E\u093E\u0908 \u092C\u093E")) {
    updated.mobilityRadius = "Within Village";
    updated.physicalConstraints = "Family / elderly care obligations in native village";
  }
  if (lower.includes("\u0926\u0941\u0915\u093E\u0928") || lower.includes("\u0938\u094D\u0935\u092F\u0902") || lower.includes("\u0916\u0941\u0926 \u0915\u093E") || lower.includes("own business") || lower.includes("\u0938\u094D\u0935\u0930\u094B\u091C\u0917\u093E\u0930")) {
    updated.employmentPreference = "Self-Employment / Micro-Enterprise";
  } else if (lower.includes("\u0928\u094C\u0915\u0930\u0940") || lower.includes("job") || lower.includes("factory")) {
    updated.employmentPreference = "Wage Employment / Factory Job";
  }
  const districts = ["Azamgarh", "Buldhana", "Erode", "Bankura", "Mahabubnagar", "Mansa", "Varanasi", "Jaipur", "Patna", "Solapur", "Madurai"];
  for (const d of districts) {
    if (text.includes(d) || text.includes(d.toLowerCase())) {
      updated.district = d;
      break;
    }
  }
  if (currentStepKey === "education" && !updated.educationLevel) {
    if (lower.includes("\u0928\u0939\u0940\u0902") || lower.includes("no") || lower.includes("\u0928\u093E\u0939\u0940") || lower.includes("\u0907\u0BB2\u0BCD\u0BB2\u0BC8") || lower.includes("\u0905\u0928\u092A\u0922\u093C") || lower.includes("\u0938\u093E\u0915\u094D\u0937\u0930")) {
      updated.educationLevel = "Informal / Basic Literacy";
    } else {
      updated.educationLevel = text.trim().slice(0, 30) || "Middle (8th Pass)";
    }
  } else if (currentStepKey === "traditional" && !updated.traditionalOccupation) {
    if (lower.includes("\u0928\u0939\u0940\u0902") || lower.includes("no") || lower.includes("none") || lower.includes("\u0928\u093E\u0939\u0940") || lower.includes("\u0907\u0BB2\u0BCD\u0BB2\u0BC8")) {
      updated.traditionalOccupation = "No Hereditary Trade / First-Generation Aspirant";
    } else if (lower.includes("\u0915\u0943\u0937\u093F") || lower.includes("\u092E\u091C\u0926\u0942\u0930\u0940") || lower.includes("farm")) {
      updated.traditionalOccupation = "Agrarian Labor & Allied Craft";
    } else {
      updated.traditionalOccupation = text.trim().slice(0, 35) || "Traditional Artisan Craft";
    }
  } else if (currentStepKey === "current" && !updated.currentActivity) {
    if (lower.includes("\u092E\u091C\u0926\u0942\u0930\u0940") || lower.includes("daily") || lower.includes("\u0926\u093F\u0928 \u092D\u0930")) {
      updated.currentActivity = "Daily Wage Labor";
    } else if (lower.includes("\u0938\u0939\u093E\u092F\u0915") || lower.includes("helper")) {
      updated.currentActivity = "Workshop Helper / Assistant";
    } else if (lower.includes("\u092C\u0947\u0930\u094B\u091C\u0917\u093E\u0930") || lower.includes("unemployed")) {
      updated.currentActivity = "Currently Unemployed / Seeking Work";
    } else {
      updated.currentActivity = text.trim().slice(0, 40) || "Daily Wage Laborer";
    }
  } else if (currentStepKey === "interests" && (!updated.vocationalInterests || updated.vocationalInterests.length === 0)) {
    updated.vocationalInterests = [text.trim().slice(0, 30) || "Solar & Electrical Maintenance"];
  } else if (currentStepKey === "preference" && !updated.employmentPreference) {
    if (lower.includes("\u0928\u094C\u0915\u0930\u0940") || lower.includes("job") || lower.includes("factory")) {
      updated.employmentPreference = "Wage Employment / Factory Job";
    } else {
      updated.employmentPreference = "Self-Employment / Micro-Enterprise";
    }
  } else if (currentStepKey === "location" && !updated.district) {
    updated.district = text.trim().slice(0, 25) || "Azamgarh";
    if (lower.includes("\u0917\u093E\u0902\u0935") || lower.includes("village")) updated.mobilityRadius = "Within Village";
  }
  return updated;
}
function generateEmpatheticFallbackReply(message, lang, profile, currentStepKey, nextStepKey) {
  const name = profile.name || "\u092A\u094D\u0930\u0935\u0940\u0923";
  let targetStep = nextStepKey;
  if (!targetStep) {
    if (!profile.educationLevel) targetStep = "education";
    else if (!profile.traditionalOccupation) targetStep = "traditional";
    else if (!profile.currentActivity) targetStep = "current";
    else if (!profile.vocationalInterests || profile.vocationalInterests.length === 0) targetStep = "interests";
    else if (!profile.employmentPreference) targetStep = "preference";
    else if (!profile.district) targetStep = "location";
    else targetStep = "complete";
  }
  if (currentStepKey && targetStep === currentStepKey) {
    const sequence = ["education", "traditional", "current", "interests", "preference", "location", "complete"];
    const idx = sequence.indexOf(currentStepKey);
    targetStep = idx >= 0 && idx < sequence.length - 1 ? sequence[idx + 1] : "complete";
  }
  if (targetStep === "education") {
    if (lang === "hi") {
      return `\u0928\u092E\u0938\u094D\u0924\u0947 ${name} \u091C\u0940! \u092C\u0939\u0941\u0924 \u0916\u0941\u0936\u0940 \u0939\u0941\u0908 \u0906\u092A\u0938\u0947 \u092C\u093E\u0924 \u0915\u0930\u0915\u0947\u0964 PM-AJAY \u092F\u094B\u091C\u0928\u093E \u0938\u0947 \u20B950,000 \u0915\u0940 \u0905\u0928\u0941\u0926\u093E\u0928 \u0938\u0939\u093E\u092F\u0924\u093E \u0914\u0930 \u092C\u0947\u0939\u0924\u0930\u0940\u0928 NSQF \u0915\u094C\u0936\u0932 \u0915\u094B\u0930\u094D\u0938 \u0926\u093F\u0932\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F, \u092E\u0948\u0902 \u0906\u092A\u0938\u0947 \u0915\u0941\u091B \u0906\u0938\u093E\u0928 \u092C\u093E\u0924\u0947\u0902 \u090F\u0915-\u090F\u0915 \u0915\u0930\u0915\u0947 \u092A\u0942\u091B\u0942\u0901\u0917\u093E\u0964 \u0938\u092C\u0938\u0947 \u092A\u0939\u0932\u0947 \u092C\u0924\u093E\u090F\u0902 \u0915\u093F \u0906\u092A\u0915\u0940 \u092A\u0922\u093C\u093E\u0908 \u0915\u0939\u093E\u0901 \u0924\u0915 \u0939\u0941\u0908 \u0939\u0948 (\u091C\u0948\u0938\u0947 5\u0935\u0940\u0902, 8\u0935\u0940\u0902, 10\u0935\u0940\u0902 \u092A\u093E\u0938 \u092F\u093E \u0938\u093E\u0915\u094D\u0937\u0930)?`;
    } else if (lang === "mr") {
      return `\u0928\u092E\u0938\u094D\u0915\u093E\u0930 ${name} \u091C\u0940! PM-AJAY \u092F\u094B\u091C\u0928\u0947\u0924\u0942\u0928 \u20B950,000 \u091A\u0947 \u0905\u0928\u0941\u0926\u093E\u0928 \u092E\u093F\u0933\u0935\u0942\u0928 \u0926\u0947\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u092E\u0940 \u0906\u092A\u0932\u094D\u092F\u093E\u0932\u093E \u0915\u093E\u0939\u0940 \u0938\u094B\u092A\u0947 \u092A\u094D\u0930\u0936\u094D\u0928 \u0935\u093F\u091A\u093E\u0930\u0940\u0928. \u0938\u0930\u094D\u0935\u093E\u0924 \u0906\u0927\u0940 \u0906\u092A\u0932\u0947 \u0936\u093F\u0915\u094D\u0937\u0923 \u0915\u093F\u0924\u092A\u0924 \u091D\u093E\u0932\u0947 \u0906\u0939\u0947 \u0924\u0947 \u0938\u093E\u0902\u0917\u093E (\u0909\u0926\u093E. \u096B \u0935\u0940, \u096E \u0935\u0940, \u0967\u0966 \u0935\u0940 \u092A\u093E\u0938 \u0915\u093F\u0902\u0935\u093E \u0938\u093E\u0915\u094D\u0937\u0930)?`;
    } else if (lang === "ta") {
      return `\u0BB5\u0BA3\u0B95\u0BCD\u0B95\u0BAE\u0BCD ${name}! PM-AJAY \u0BA4\u0BBF\u0B9F\u0BCD\u0B9F\u0BA4\u0BCD\u0BA4\u0BBF\u0BA9\u0BCD \u0B95\u0BC0\u0BB4\u0BCD \u0BB0\u0BC2. 50,000 \u0BAE\u0BBE\u0BA9\u0BBF\u0BAF\u0BAE\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B9A\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4 \u0BAA\u0BAF\u0BBF\u0BB1\u0BCD\u0B9A\u0BBF\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BC6\u0BB1, \u0BAE\u0BC1\u0BA4\u0BB2\u0BBF\u0BB2\u0BCD \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BB2\u0BCD\u0BB5\u0BBF\u0BA4\u0BCD \u0BA4\u0B95\u0BC1\u0BA4\u0BBF\u0BAF\u0BC8 \u0B95\u0BC2\u0BB1\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD (5-\u0B86\u0BAE\u0BCD, 8-\u0B86\u0BAE\u0BCD, 10-\u0B86\u0BAE\u0BCD \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1)?`;
    }
    return `Namaste ${name} ji! To help you secure the INR 50,000 PM-AJAY grant and the best NSQF course, I will ask you a few friendly questions one by one. First, what is your highest education level?`;
  }
  if (targetStep === "traditional") {
    if (lang === "hi") {
      return `\u092C\u0939\u0941\u0924 \u092C\u0922\u093C\u093F\u092F\u093E ${name} \u091C\u0940! \u0906\u092A\u0915\u0940 \u0936\u093F\u0915\u094D\u0937\u093E \u0926\u0930\u094D\u091C \u0915\u0930 \u0932\u0940 \u0917\u0908 \u0939\u0948\u0964 \u0915\u094D\u092F\u093E \u0906\u092A\u0915\u0947 \u092A\u0930\u093F\u0935\u093E\u0930 \u092F\u093E \u0938\u092E\u0941\u0926\u093E\u092F \u092E\u0947\u0902 \u0915\u094B\u0908 \u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u0915\u093E\u092E \u092F\u093E \u092A\u0941\u0936\u094D\u0924\u0948\u0928\u0940 \u0939\u0941\u0928\u0930 \u0939\u094B\u0924\u093E \u0906\u092F\u093E \u0939\u0948? \u091C\u0948\u0938\u0947 \u091A\u092E\u0921\u093C\u093E \u0935 \u091C\u0942\u0924\u093E \u0928\u093F\u0930\u094D\u092E\u093E\u0923, \u0939\u0925\u0915\u0930\u0918\u093E/\u092C\u0941\u0928\u093E\u0908, \u092C\u0922\u093C\u0908\u0917\u093F\u0930\u0940, \u0930\u093E\u091C\u092E\u093F\u0938\u094D\u0924\u094D\u0930\u0940, \u0915\u0943\u0937\u093F \u092E\u091C\u0926\u0942\u0930\u0940 \u092F\u093E \u0915\u094B\u0908 \u0928\u0939\u0940\u0902?`;
    } else if (lang === "mr") {
      return `\u0916\u0942\u092A \u091B\u093E\u0928 ${name} \u091C\u0940! \u0924\u0941\u092E\u091A\u0947 \u0936\u093F\u0915\u094D\u0937\u0923 \u0928\u094B\u0902\u0926\u0935\u0932\u0947 \u0906\u0939\u0947. \u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0915\u0941\u091F\u0941\u0902\u092C\u093E\u0924 \u092A\u0942\u0930\u094D\u0935\u0940\u092A\u093E\u0938\u0942\u0928 \u091A\u093E\u0932\u0924 \u0906\u0932\u0947\u0932\u093E \u0915\u094B\u0923\u0924\u093E\u0939\u0940 \u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u0935\u094D\u092F\u0935\u0938\u093E\u092F \u0906\u0939\u0947 \u0915\u093E? \u091C\u0938\u0947 \u091A\u0930\u094D\u092E\u094B\u0926\u094D\u092F\u094B\u0917, \u0935\u093F\u0923\u0915\u093E\u092E/\u0939\u093E\u0924\u092E\u093E\u0917, \u0938\u0941\u0924\u093E\u0930\u0915\u093E\u092E \u0915\u093F\u0902\u0935\u093E \u0936\u0947\u0924\u092E\u091C\u0941\u0930\u0940?`;
    } else if (lang === "ta") {
      return `\u0BA8\u0BA9\u0BCD\u0BB1\u0BBF ${name}! \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BB2\u0BCD\u0BB5\u0BBF \u0BB5\u0BBF\u0BB5\u0BB0\u0BAE\u0BCD \u0B95\u0BC1\u0BB1\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1. \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BC1\u0B9F\u0BC1\u0BAE\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BA4\u0BCB\u0BB2\u0BCD \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD, \u0B95\u0BC8\u0BA4\u0BCD\u0BA4\u0BB1\u0BBF \u0BA8\u0BC6\u0B9A\u0BB5\u0BC1, \u0BAE\u0BB0\u0BB5\u0BC7\u0BB2\u0BC8 \u0BAA\u0BCB\u0BA9\u0BCD\u0BB1 \u0BAA\u0BBE\u0BB0\u0BAE\u0BCD\u0BAA\u0BB0\u0BBF\u0BAF\u0BA4\u0BCD \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD \u0B8F\u0BA4\u0BC7\u0BA9\u0BC1\u0BAE\u0BCD \u0B89\u0BB3\u0BCD\u0BB3\u0BA4\u0BBE?`;
    }
    return `Wonderful ${name} ji! Your education is noted. Does your family or community have any traditional heritage craft or occupation, such as leathercraft, handloom weaving, carpentry, or masonry?`;
  }
  if (targetStep === "current") {
    if (lang === "hi") {
      return `\u0927\u0928\u094D\u092F\u0935\u093E\u0926 ${name} \u091C\u0940! \u092C\u0939\u0941\u0924 \u0905\u091A\u094D\u091B\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940\u0964 \u0905\u092D\u0940 \u0906\u092A \u0905\u092A\u0928\u0940 \u0906\u091C\u0940\u0935\u093F\u0915\u093E \u091A\u0932\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u094D\u092F\u093E \u0915\u093E\u092E \u0915\u0930\u0924\u0947 \u0939\u0948\u0902, \u0914\u0930 \u0932\u0917\u092D\u0917 \u0915\u093F\u0924\u0928\u093E \u092E\u093E\u0938\u093F\u0915 \u0917\u0941\u091C\u093E\u0930\u093E \u0939\u094B \u092A\u093E\u0924\u093E \u0939\u0948?`;
    } else if (lang === "mr") {
      return `\u0927\u0928\u094D\u092F\u0935\u093E\u0926 ${name} \u091C\u0940. \u0938\u0927\u094D\u092F\u093E \u0924\u0941\u092E\u094D\u0939\u0940 \u0909\u092A\u091C\u0940\u0935\u093F\u0915\u0947\u0938\u093E\u0920\u0940 \u0926\u0930\u0930\u094B\u091C \u0915\u093E\u092F \u0915\u093E\u092E \u0915\u0930\u0924\u093E, \u0906\u0923\u093F \u0905\u0902\u0926\u093E\u091C\u0947 \u0915\u093F\u0924\u0940 \u092E\u093E\u0938\u093F\u0915 \u0915\u092E\u093E\u0908 \u0939\u094B\u0924\u0947?`;
    } else if (lang === "ta") {
      return `\u0BAA\u0BC1\u0BB0\u0BBF\u0BA8\u0BCD\u0BA4\u0BA4\u0BC1 ${name}! \u0BA4\u0BB1\u0BCD\u0BAA\u0BCB\u0BA4\u0BC1 \u0BB5\u0BBE\u0BB4\u0BCD\u0BB5\u0BBE\u0BA4\u0BBE\u0BB0\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BBE\u0B95 \u0B8E\u0BA9\u0BCD\u0BA9 \u0BB5\u0BC7\u0BB2\u0BC8 \u0B9A\u0BC6\u0BAF\u0BCD\u0B95\u0BBF\u0BB1\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD, \u0BAE\u0BBE\u0BA4 \u0BB5\u0BB0\u0BC1\u0BAE\u0BBE\u0BA9\u0BAE\u0BCD \u0B8E\u0BB5\u0BCD\u0BB5\u0BB3\u0BB5\u0BC1?`;
    }
    return `Thank you ${name} ji! What work or livelihood activity do you currently do day-to-day, and how is your current income?`;
  }
  if (targetStep === "interests") {
    if (lang === "hi") {
      return `\u092C\u0939\u0941\u0924 \u0916\u0942\u092C ${name} \u091C\u0940\u0964 \u0906\u092A \u092D\u0935\u093F\u0937\u094D\u092F \u092E\u0947\u0902 \u0915\u094C\u0928 \u0938\u093E \u0928\u092F\u093E \u0915\u093E\u092E \u092F\u093E \u0906\u0927\u0941\u0928\u093F\u0915 \u091F\u094D\u0930\u0947\u0921 \u0938\u0940\u0916\u0928\u0947 \u0915\u0947 \u0938\u092C\u0938\u0947 \u091C\u094D\u092F\u093E\u0926\u093E \u0907\u091A\u094D\u091B\u0941\u0915 \u0939\u0948\u0902? \u091C\u0948\u0938\u0947 \u0938\u094B\u0932\u0930 \u0935 \u092C\u093F\u091C\u0932\u0940 \u092E\u0947\u0902\u091F\u0947\u0928\u0947\u0902\u0938, \u0926\u094B\u092A\u0939\u093F\u092F\u093E \u0935\u093E\u0939\u0928 \u092E\u0948\u0915\u0947\u0928\u093F\u0915, \u0906\u0927\u0941\u0928\u093F\u0915 \u091A\u092E\u0921\u093C\u093E \u0909\u0924\u094D\u092A\u093E\u0926, \u092F\u093E \u0938\u093F\u0932\u093E\u0908-\u0915\u0922\u093C\u093E\u0908?`;
    } else if (lang === "mr") {
      return `\u0916\u0942\u092A \u091B\u093E\u0928 ${name} \u091C\u0940! \u092D\u0935\u093F\u0937\u094D\u092F\u093E\u0924 \u0924\u0941\u092E\u094D\u0939\u093E\u0932\u093E \u0915\u094B\u0923\u0924\u0947 \u0928\u0935\u0940\u0928 \u0915\u094C\u0936\u0932\u094D\u092F \u0936\u093F\u0915\u093E\u092F\u0932\u093E \u0906\u0935\u0921\u0947\u0932? \u091C\u0938\u0947 \u0938\u094B\u0932\u0930 \u0935 \u0907\u0932\u0947\u0915\u094D\u091F\u094D\u0930\u093F\u0915\u0932, \u0926\u0941\u091A\u093E\u0915\u0940 \u092E\u0947\u0915\u0945\u0928\u093F\u0915, \u0906\u0927\u0941\u0928\u093F\u0915 \u091A\u0930\u094D\u092E\u094B\u0926\u094D\u092F\u094B\u0917, \u0915\u093F\u0902\u0935\u093E \u091F\u0947\u0932\u0930\u093F\u0902\u0917?`;
    } else if (lang === "ta") {
      return `\u0B85\u0BB0\u0BC1\u0BAE\u0BC8 ${name}! \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B8E\u0BA8\u0BCD\u0BA4\u0BAA\u0BCD \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0BA4\u0BBF\u0BB1\u0BA9\u0BC8\u0B95\u0BCD \u0B95\u0BB1\u0BCD\u0B95 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAE\u0BCD\u0BAA\u0BC1\u0B95\u0BBF\u0BB1\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD (\u0B9A\u0BCB\u0BB2\u0BBE\u0BB0\u0BCD & \u0B8E\u0BB2\u0B95\u0BCD\u0B9F\u0BCD\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BB2\u0BCD, \u0BAA\u0BC8\u0B95\u0BCD \u0BAE\u0BC6\u0B95\u0BCD\u0B95\u0BBE\u0BA9\u0BBF\u0B95\u0BCD, \u0BA8\u0BB5\u0BC0\u0BA9 \u0BA4\u0BCB\u0BB2\u0BCD \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD)?`;
    }
    return `Great ${name} ji! What modern skill or trade are you most excited to learn? For example: Solar & Electrical, Two-Wheeler Mechanic, Modern Footwear, or Garment Tailoring?`;
  }
  if (targetStep === "preference") {
    if (lang === "hi") {
      return `\u0936\u093E\u0928\u0926\u093E\u0930 \u0938\u094B\u091A ${name} \u091C\u0940! \u0915\u094D\u092F\u093E \u0906\u092A \u20B950,000 \u0915\u0940 \u0938\u0930\u0915\u093E\u0930\u0940 PM-AJAY \u0905\u0928\u0941\u0926\u093E\u0928 \u0938\u0939\u093E\u092F\u0924\u093E \u0938\u0947 \u0905\u092A\u0928\u0940 \u0916\u0941\u0926 \u0915\u0940 \u0926\u0941\u0915\u093E\u0928/\u0938\u094D\u0935\u0930\u094B\u091C\u0917\u093E\u0930 \u0936\u0941\u0930\u0942 \u0915\u0930\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902, \u092F\u093E \u0915\u093F\u0938\u0940 \u0915\u0902\u092A\u0928\u0940 \u092E\u0947\u0902 \u092A\u0915\u094D\u0915\u0940 \u0928\u094C\u0915\u0930\u0940 \u092A\u093E\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902?`;
    } else if (lang === "mr") {
      return `\u0909\u0924\u094D\u0924\u092E \u0935\u093F\u091A\u093E\u0930! \u20B950,000 \u091A\u094D\u092F\u093E \u0905\u0928\u0941\u0926\u093E\u0928\u093E\u0924\u0942\u0928 \u0924\u0941\u092E\u094D\u0939\u093E\u0932\u093E \u0938\u094D\u0935\u0924\u0903\u091A\u0947 \u0926\u0941\u0915\u093E\u0928 \u0915\u093F\u0902\u0935\u093E \u0935\u094D\u092F\u0935\u0938\u093E\u092F \u0938\u0941\u0930\u0942 \u0915\u0930\u093E\u092F\u091A\u093E \u0906\u0939\u0947 \u0915\u0940 \u092A\u0917\u093E\u0930\u0926\u093E\u0930 \u0928\u094B\u0915\u0930\u0940 \u0915\u0930\u093E\u092F\u091A\u0940 \u0906\u0939\u0947?`;
    } else if (lang === "ta") {
      return `\u0BB0\u0BC2. 50,000 \u0B85\u0BB0\u0B9A\u0BC1 \u0BAE\u0BBE\u0BA9\u0BBF\u0BAF\u0BA4\u0BCD\u0BA4\u0BC1\u0B9F\u0BA9\u0BCD \u0B9A\u0BCA\u0BA8\u0BCD\u0BA4 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAE\u0BCD\u0BAA\u0BC1\u0B95\u0BBF\u0BB1\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BBE, \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0BA8\u0BBF\u0BB1\u0BC1\u0BB5\u0BA9\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BB5\u0BC7\u0BB2\u0BC8\u0B95\u0BCD\u0B95\u0BC1\u0B9A\u0BCD \u0B9A\u0BC6\u0BB2\u0BCD\u0BB2 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAE\u0BCD\u0BAA\u0BC1\u0B95\u0BBF\u0BB1\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BBE?`;
    }
    return `Great goal, ${name} ji! Would you prefer starting your own independent micro-enterprise / shop with the INR 50,000 grant, or would you prefer a salaried job at a company?`;
  }
  if (targetStep === "location") {
    if (lang === "hi") {
      return `\u0905\u0902\u0924\u093F\u092E \u092C\u093E\u0924 ${name} \u091C\u0940! \u0906\u092A \u0915\u093F\u0938 \u091C\u093F\u0932\u0947 \u0914\u0930 \u0930\u093E\u091C\u094D\u092F \u092E\u0947\u0902 \u0930\u0939\u0924\u0947 \u0939\u0948\u0902, \u0914\u0930 \u0915\u094D\u092F\u093E \u0906\u092A \u091F\u094D\u0930\u0947\u0928\u093F\u0902\u0917 \u0915\u0947 \u0932\u093F\u090F \u091C\u093F\u0932\u093E \u092E\u0941\u0916\u094D\u092F\u093E\u0932\u092F \u091C\u093E \u0938\u0915\u0924\u0947 \u0939\u0948\u0902 \u092F\u093E \u0905\u092A\u0928\u0947 \u0917\u093E\u0901\u0935/\u092C\u094D\u0932\u0949\u0915 \u0915\u0947 \u092A\u093E\u0938 \u0939\u0940 \u091F\u094D\u0930\u0947\u0928\u093F\u0902\u0917 \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902?`;
    } else if (lang === "mr") {
      return `\u0936\u0947\u0935\u091F\u091A\u0940 \u092E\u093E\u0939\u093F\u0924\u0940 ${name} \u091C\u0940: \u0924\u0941\u092E\u094D\u0939\u0940 \u0915\u094B\u0923\u0924\u094D\u092F\u093E \u091C\u093F\u0932\u094D\u0939\u094D\u092F\u093E\u0924 \u0930\u093E\u0939\u0924\u093E, \u0906\u0923\u093F \u0917\u093E\u0935\u093E\u0924\u091A \u092A\u094D\u0930\u0936\u093F\u0915\u094D\u0937\u0923 \u0939\u0935\u0947 \u0915\u0940 \u091C\u093F\u0932\u094D\u0939\u093E \u0920\u093F\u0915\u093E\u0923\u0940 \u091C\u093E\u090A \u0936\u0915\u0924\u093E?`;
    } else if (lang === "ta") {
      return `\u0B87\u0BB1\u0BC1\u0BA4\u0BBF\u0BAF\u0BBE\u0B95, \u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B8E\u0BA8\u0BCD\u0BA4 \u0BAE\u0BBE\u0BB5\u0B9F\u0BCD\u0B9F\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BB5\u0B9A\u0BBF\u0B95\u0BCD\u0B95\u0BBF\u0BB1\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD? \u0B8A\u0BB0\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BB3\u0BCD\u0BB3\u0BC7\u0BAF\u0BC7 \u0BAA\u0BAF\u0BBF\u0BB1\u0BCD\u0B9A\u0BBF \u0BA4\u0BC7\u0BB5\u0BC8\u0BAF\u0BBE \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0BAE\u0BBE\u0BB5\u0B9F\u0BCD\u0B9F \u0BA4\u0BB2\u0BC8\u0BAE\u0BC8\u0BAF\u0B95\u0BAE\u0BCD \u0B9A\u0BC6\u0BB2\u0BCD\u0BB2 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BBE?`;
    }
    return `Last detail, ${name} ji! Which district do you live in, and can you travel to the district center for training or do you need doorstep training within your village?`;
  }
  if (lang === "hi") {
    return `\u092C\u0927\u093E\u0908 \u0939\u094B ${name} \u091C\u0940! \u0906\u092A\u0915\u0947 \u0938\u092D\u0940 \u091C\u0930\u0942\u0930\u0940 \u0935\u093F\u0935\u0930\u0923 \u092A\u0942\u0930\u0947 \u0939\u094B \u091A\u0941\u0915\u0947 \u0939\u0948\u0902\u0964 \u0906\u092A\u0915\u0940 \u0936\u093F\u0915\u094D\u0937\u093E (${profile.educationLevel || "8\u0935\u0940\u0902 \u092A\u093E\u0938"}), \u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u0939\u0941\u0928\u0930 (${profile.traditionalOccupation || "\u091A\u092E\u0921\u093C\u093E \u0909\u0926\u094D\u092F\u094B\u0917"}) \u0914\u0930 \u092A\u0938\u0902\u0926 \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u0939\u092E\u0928\u0947 \u0906\u092A\u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u0941\u0915\u094D\u0924 NSQF \u0915\u094B\u0930\u094D\u0938 \u0914\u0930 \u20B950,000 \u0915\u0940 PM-AJAY GIA \u0905\u0928\u0941\u0926\u093E\u0928 \u092F\u094B\u091C\u0928\u093E \u091A\u093F\u0928\u094D\u0939\u093F\u0924 \u0915\u0930 \u0932\u0940 \u0939\u0948! \u0928\u0940\u091A\u0947 \u0926\u093F\u090F \u0917\u090F \u0915\u094B\u0930\u094D\u0938 \u0926\u0947\u0916\u0947\u0902\u0964`;
  } else if (lang === "mr") {
    return `\u0905\u092D\u093F\u0928\u0902\u0926\u0928 ${name} \u091C\u0940! \u0924\u0941\u092E\u091A\u0940 \u0938\u0930\u094D\u0935 \u092E\u093E\u0939\u093F\u0924\u0940 \u092A\u0942\u0930\u094D\u0923 \u091D\u093E\u0932\u0940 \u0906\u0939\u0947. \u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0915\u094C\u0936\u0932\u094D\u092F\u093E\u0928\u0941\u0938\u093E\u0930 \u0906\u092E\u094D\u0939\u0940 NSQF \u0915\u094B\u0930\u094D\u0938\u0947\u0938 \u0906\u0923\u093F \u20B950,000 \u091A\u094D\u092F\u093E PM-AJAY \u0905\u0928\u0941\u0926\u093E\u0928\u093E\u091A\u0940 \u0936\u093F\u092B\u093E\u0930\u0938 \u0924\u092F\u093E\u0930 \u0915\u0947\u0932\u0940 \u0906\u0939\u0947!`;
  } else if (lang === "ta") {
    return `\u0BB5\u0BBE\u0BB4\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BB3\u0BCD ${name}! \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BB5\u0BBF\u0BB5\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BC1\u0BB4\u0BC1\u0BAE\u0BC8\u0BAF\u0BBE\u0B95\u0BAA\u0BCD \u0BAA\u0BA4\u0BBF\u0BB5\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA9. \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B89\u0B95\u0BA8\u0BCD\u0BA4 NSQF \u0BAA\u0BAF\u0BBF\u0BB1\u0BCD\u0B9A\u0BBF\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB0\u0BC2. 50,000 \u0BAE\u0BBE\u0BA9\u0BBF\u0BAF\u0BA4\u0BCD \u0BA4\u0BBF\u0B9F\u0BCD\u0B9F\u0BAE\u0BCD \u0BA4\u0BAF\u0BBE\u0BB0\u0BBE\u0B95 \u0B89\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1!`;
  }
  return `Congratulations ${name} ji! All your essential details are complete. Based on your background, we have matched tailored NSQF certified courses and confirmed your pre-qualification for the INR 50,000 PM-AJAY capital grant!`;
}
async function start() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PM-AJAY Assistant Server] listening at http://0.0.0.0:${PORT}`);
  });
}
start();
