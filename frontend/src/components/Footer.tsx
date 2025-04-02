import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First Column - Logo and Brand Name */}
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              {/* Replace with your actual logo */}
              <Image
                src="/logo.png"
                alt="Vakeel.ai Logo"
                width={50}
                height={50}
              />
              <h2 className="ml-2 text-xl font-bold">Vakeel.ai</h2>
            </div>
            <p className="mt-2 text-gray-400">
              AI-powered legal assistance for your contract needs
            </p>
          </div>

          {/* Second Column - Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contract-analyzer"
                  className="text-gray-400 hover:text-white transition"
                >
                  Compliance Intelligence
                </Link>
              </li>
              <li>
                <Link
                  href="/contract-generation"
                  className="text-gray-400 hover:text-white transition"
                >
                  Contract Generation
                </Link>
              </li>
              <li>
                <Link
                  href="/riskdetection"
                  className="text-gray-400 hover:text-white transition"
                >
                  Negotiate Contracts
                </Link>
              </li>
            </ul>
          </div>

          {/* Third Column - Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Vakeel.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
