import axios from "axios";
import { useEffect, useState } from "react";
import {
  CssBaseline,
  Stack,
  Switch,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import ExposeSwitch from "./ExposeSwitch.js";
import AppHeader from "./AppHeader.js";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [entities, setEntities] = useState<any[]>([]);
  const gridApiRef = useGridApiRef();

  const update = () => {
    axios.get("/api/entities").then((res) => setEntities(res.data));
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Stack height="100vh">
        <CssBaseline />
        <AppHeader
          onSearch={(term) => {
            gridApiRef.current?.setQuickFilterValues(term.split(" "));
          }}
        />
        <DataGrid
          apiRef={gridApiRef}
          disableRowSelectionOnClick
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          getRowId={(it) => it.entityId}
          processRowUpdate={(updatedRow, originalRow) => {
            const { entityId, ...data } = updatedRow;

            return axios.put(`/api/entities/${entityId}`, data).then(
              () => updatedRow,
              () => originalRow
            );
          }}
          onProcessRowUpdateError={console.error}
          rows={entities}
          columns={[
            {
              field: "exposed",
              headerName: "Exposed",
              width: 150,
              type: "boolean",
              editable: false,
              renderCell: (params) => {
                return <ExposeSwitch row={params.row} onUpdate={update} />;
              },
            },
            {
              field: "name",
              editable: false,
              headerName: "Name",
              flex: 1,
            },
            {
              field: "entityId",
              editable: false,
              headerName: "Entity Id",
              flex: 1,
            },
            {
              field: "alias",
              editable: true,
              headerName: "Alias",
              flex: 1,
            },
            {
              field: "description",
              editable: true,
              headerName: "Description",
              flex: 1,
            },
          ]}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
