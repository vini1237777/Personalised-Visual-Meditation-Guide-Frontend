import { useEffect, useState } from "react";
import makeRequest from "../../../api/makeRequest";
import url from "../../../api/urls";
import styles from "./VisitorCount.module.css";

export default function VisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    makeRequest<{ visitors: number }>(url.visits, "post")
      .then((res) => setVisitors(res.data.visitors))
      .catch(() => setVisitors(null));
  }, []);

  if (visitors === null) return null;

  return (
    <div className={styles.count}>
      {visitors.toLocaleString("en-IN")} {visitors === 1 ? "visitor" : "visitors"}
    </div>
  );
}
