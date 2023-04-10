import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { showToast } from "../utils/notification";

function Navbar(props) {
  const navigate = useNavigate();
  const name = props.name;

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("userName");
    showToast("You have been logged out Successfully", "success");
    navigate("/");
  };
  
  return (
    <AppBar style={{ borderRadius: "5px" }} position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">My Blog</Typography>
        <div className="text-right">
          <Typography variant="subtitle1">Welcome {name}</Typography>
          <Button color="inherit" onClick={logout} style={{ padding: "0px" }}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
