import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, {useState} from "react";
import LeaveGroupDialog from "../LeaveGroupDialog/LeaveGroupDialog";

export const GroupMenu = ({onLeaveGroup}): JSX.Element => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleApprove = () => {
        onLeaveGroup();
        setIsDialogOpen(false);
    }

    const handleCancellation = () => {
        setIsDialogOpen(false);
    }

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLeaveGroup = () => {
        setAnchorEl(null);
        setIsDialogOpen(true);
    }

    return(<div>
        <LeaveGroupDialog isOpen={isDialogOpen}
                          onApprove={handleApprove}
                          onCancellation={handleCancellation}></LeaveGroupDialog>
        <IconButton id="demo-positioned-button"
                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleMenuClick}>
            <MoreVertIcon style={{color: "black"}}/>
        </IconButton>
        <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <MenuItem onClick={handleLeaveGroup}>Exit Group</MenuItem>
        </Menu>
    </div>)
}

export default GroupMenu;