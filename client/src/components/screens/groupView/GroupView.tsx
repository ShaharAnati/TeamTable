import React from 'react';
import {Button} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const GroupView: React.FC = (): JSX.Element => {
    return (
        <Button variant="outlined"
                size="medium"
                color="inherit"
                endIcon={<ContentCopyIcon/>}
                onClick={() => navigator.clipboard.writeText(window.location.href)}>
            {window.location.href}
        </Button>
    );
}

export default GroupView;
