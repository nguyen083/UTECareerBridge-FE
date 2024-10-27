// import React from 'react';
// import { Bell, Settings, Search, Plus, Menu, Moon } from 'lucide-react';
// import './Header.scss';

// const DashboardHeader = () => {
//   return (
//     <div className="dashboard-header">
//       <div className="dashboard-header-wrapper">
//         {/* Left section with logo and menu */}
//         <div className="dashboard-header-left">
//           <div className="logo-section">
//             <button className="menu-button">
//               <Menu className="icon" />
//             </button>
//             <div className="logo-section-icon">
//               <span>J</span>
//             </div>
//             <div className="logo-section-text">
//               <h1>Jobick</h1>
//               <p>Job Admin Dashboard</p>
//             </div>
//           </div>
//         </div>

//         {/* Center section with search */}
//         <div className="dashboard-header-search">
//           <div className="dashboard-header-search-wrapper">
//             <input
//               type="text"
//               placeholder="Search here"
//             />
//             <Search className="search-icon" />
//           </div>
//         </div>

//         {/* Right section with actions */}
//         <div className="dashboard-header-right">
//           {/* Add New Button */}
//           <button className="add-button">
//             <Plus className="icon" />
//           </button>

//           {/* Action buttons */}
//           <div className="action-buttons">
//             {/* Dark mode toggle */}
//             <button className="action-button">
//               <Moon className="icon" />
//             </button>

//             {/* Cart */}
//             <button className="action-button">
//               <svg 
//                 className="icon" 
//                 viewBox="0 0 24 24" 
//                 fill="none" 
//                 stroke="currentColor" 
//                 strokeWidth="2"
//               >
//                 <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
//                 <path d="M3 6h18" />
//                 <path d="M16 10a4 4 0 01-8 0" />
//               </svg>
//               <span className="badge badge-red">26</span>
//             </button>

//             {/* Notifications */}
//             <button className="action-button">
//               <Bell className="icon" />
//               <span className="badge badge-red">4</span>
//             </button>

//             {/* Settings */}
//             <button className="action-button">
//               <Settings className="icon" />
//               <span className="badge badge-blue">15</span>
//             </button>
//           </div>

//           {/* User profile */}
//           <div className="user-profile">
//             <img
//               src="/api/placeholder/32/32"
//               alt="User profile"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHeader;