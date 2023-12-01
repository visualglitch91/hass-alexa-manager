import { styled, alpha } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, InputBase, Button } from "@mui/material";
import axios from "axios";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  flex: 1,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  padding: theme.spacing(0.5, 2),
}));

export default function AppHeader({
  onSearch,
}: {
  onSearch: (term: string) => void;
}) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          Home Assistant Alexa Skill Manager
        </Typography>
        <Button
          sx={{ marginLeft: "auto" }}
          color="inherit"
          onClick={() => {
            if (confirm("Are you sure?")) {
              axios.post("/api/restart");
            }
          }}
        >
          Restart Home Assistant
        </Button>
      </Toolbar>
      <Toolbar>
        <Search>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => onSearch(e.target.value)}
          />
        </Search>
      </Toolbar>
    </AppBar>
  );
}
