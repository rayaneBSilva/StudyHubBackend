// import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// export default function Layout({ children }: unknown) {

//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] = useState(false);

//   function handleLogout() {
//     logout();
//     navigate("/");
//   }

//   return (
//     <div className="layout">

//       <aside className="sidebar">

//         <h2 className="logo">StudyHub</h2>

//         <nav className="menu">

//           <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//           <button onClick={() => navigate("/decks")}>Decks</button>
//           <button onClick={() => navigate("/summaries")}>Resumos</button>
//           <button onClick={() => navigate("/folders")}>Pastas</button>

//           {user?.role === "teacher" && (
//             <button onClick={() => navigate("/users")}>Usuários</button>
//           )}

//         </nav>

//         <div className="sidebar-footer">
//           <button onClick={handleLogout}>Sair</button>
//         </div>

//       </aside>

//       <div className="content">

//         <header className="topbar">

//           <div></div>

//           <div className="profile">

//             <div
//               className="avatar"
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               {user?.name?.charAt(0).toUpperCase()}
//             </div>

//             {menuOpen && (
//               <div className="profile-menu">

//                 <p>{user?.name}</p>
//                 <p>{user?.email}</p>

//                 <hr />

//                 <button onClick={() => navigate("/profile")}>
//                   Configurações
//                 </button>

//                 <button onClick={handleLogout}>
//                   Sair
//                 </button>

//               </div>
//             )}

//           </div>

//         </header>

//         <main className="main">
//           {children}
//         </main>

//       </div>

//     </div>
//   );
// }