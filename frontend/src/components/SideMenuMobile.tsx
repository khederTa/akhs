import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
// import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';

// import MenuButton from './MenuButton';
import MenuContent from "./MenuContent";
import { useAuthStore } from "../store/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({
  open,
  toggleDrawer,
}: SideMenuMobileProps) {
  const username = useAuthStore((state) => state.allUserData?.username);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  return (
    <>
      <ChangePasswordModal
        open={changePasswordModalOpen}
        handleClose={() => setChangePasswordModalOpen(false)}
      />
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          [`& .${drawerClasses.paper}`]: {
            backgroundImage: "none",
            backgroundColor: "background.paper",
          },
        }}
      >
        <Stack
          sx={{
            maxWidth: "70dvw",
            height: "100%",
          }}
        >
          <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
            <Stack
              direction="row"
              sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
            >
              <Avatar
                sizes="small"
                alt={username as string}
                src="/static/images/avatar/7.jpg"
                sx={{ width: 36, height: 36 }}
              />
              <Typography component="p" variant="h6">
                {username}
              </Typography>
            </Stack>
            {/* <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton> */}
          </Stack>
          <Divider />
          <Stack sx={{ flexGrow: 1 }}>
            <MenuContent />
            <Divider />
          </Stack>
          <Stack sx={{ p: 2, gap: 1.5 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setChangePasswordModalOpen(true)}
            >
              {t("change password")}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LogoutRoundedIcon />}
              onClick={async () => {
                await logout();
                navigate("/sign-in");
              }}
            >
              {t("logout")}
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
