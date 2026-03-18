import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Decks from "../pages/Decks";
import DeckDetails from "../pages/DeckDetails";
import StudyPage from "../pages/Study/StudyPage";
import UsersPage from "../pages/User/UsersPage";
import Folders from "../pages/Folders";
import FolderDetails from "../pages/FolderDetails";
import Summaries from "../pages/Summaries";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/decks" element={<Decks />} />
        <Route path="/decks/:id" element={<DeckDetails />} />
        <Route path="/study/:deckId" element={<StudyPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/folders/:id" element={<FolderDetails />} />
        <Route path="/summaries" element={<Summaries />} />

      </Routes>
    </BrowserRouter>
  );
}