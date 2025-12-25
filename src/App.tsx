import { Toaster } from "react-hot-toast";
import AppRoutes from "./app/routes/AppRoutes";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.App}>
      <Toaster />
      <AppRoutes />
    </div>
  );
}
