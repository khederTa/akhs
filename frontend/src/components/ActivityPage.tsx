// ActivityPage.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import ActivityDraggableModal from "./ActivityDraggableModal";

export default function ActivityPage() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);

  const handleCreate = (formData: any) => {
    navigate("/activity-summary", { state: { ...formData } });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/activity-management"); // Navigate back if modal is closed
  };

  return (
    <ActivityDraggableModal open={open} onClose={handleClose} onCreate={handleCreate} />
  );
}
