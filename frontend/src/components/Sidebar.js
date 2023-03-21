import React, { useState } from "react";

function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
  return (
    
  
        <div className="flex h-screen bg-gray-200">
            {/* Sidebar */}
            <div
                className={`${isExpanded ? 'w-64' : 'w-20'
                    } bg-gray-800 text-white transition-all duration-300 ease-in-out overflow-hidden`}
            >
                <button
                    className="w-full p-3 text-center text-white hover:bg-gray-700 focus:outline-none"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
                <nav>
                    <ul>
                        <li>
                            <a
                                className="block py-2 px-4 text-sm font-semibold hover:bg-gray-700"
                                href="#"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                className="block py-2 px-4 text-sm font-semibold hover:bg-gray-700"
                                href="#"
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                className="block py-2 px-4 text-sm font-semibold hover:bg-gray-700"
                                href="#"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
          </div>
      
  );
}

export default Sidebar;