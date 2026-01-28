import React from "react";

function Footer() {
  return (
    <footer className="py-6 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="mt-4 text-gray-400">
          &copy; {new Date().getFullYear()} LaptopsKart, All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
