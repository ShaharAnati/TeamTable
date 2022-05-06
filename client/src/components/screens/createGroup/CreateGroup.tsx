import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React from 'react';
import { Link } from 'react-router-dom';

import './createGroup.css'

interface CreateGroupProps {
    onSubmit?: () => void;
    groupName: string;
    onGroupNameChange: (event) => void;
}
const CreateGroup: React.FC<CreateGroupProps> = (props): JSX.Element => {
    
    const { onSubmit, groupName, onGroupNameChange } = props;

    
    return (
        <div className={'create-group-container'}>
            <div className={'form-container'}>
                <TextField
                    label='Group Name'
                    name="groupName"
                    placeholder={['Lunch with the office', 'Family dinner', 'Double date brunch'][Math.floor(Math.random()*3)]}
                    variant="standard"
                    value={groupName}
                    onChange={onGroupNameChange}
                    error={false}
                    fullWidth 
                />
                <Button 
                    onClick={() => onSubmit()}
                    variant="contained"
                    sx={{backgroundColor: '#3ED3D6'}}
                    component={Link}
                    to="/group-page"
                >
                    Create Group
                </Button>
            </div>
        </div>
    );
}

export default CreateGroup;
