import { Switch } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ExposeSwitch({
  row: { entityId, exposed, ...rest },
  onUpdate,
}: {
  row: any;
  onUpdate: () => void;
}) {
  const [checked, setChecked] = useState(exposed);

  useEffect(() => {
    setChecked(exposed);
  }, [exposed]);

  return (
    <Switch
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked);
        axios
          .put(`/api/entities/${entityId}`, {
            ...rest,
            exposed: e.target.checked,
          })
          .then(
            () => onUpdate(),
            () => setChecked(checked)
          );
      }}
    />
  );
}
