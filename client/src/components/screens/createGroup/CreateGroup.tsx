import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './CreateGroup.css'

interface CreateGroupProps {
    onSubmit?: () => void;
    groupName: string;
    onGroupNameChange: (event) => void;
}

const CreateGroup: React.FC<CreateGroupProps> = (props): JSX.Element => {

    const { onSubmit, groupName, onGroupNameChange } = props;

    const [fieldError, setFieldError] = useState(false);
    
    const handleSubmit = () => {
        if (!groupName) {
            setFieldError(true);
        } else {
            onSubmit();
        }
    }
    
    return (
        <div className={'create-group-container'}>
            <div className={'form-container'}>
                <TextField
                    label='Group Name'
                    name="groupName"
                    placeholder={['Lunch with the office', 'Family dinner', 'Double date brunch'][Math.floor(Math.random()*3)]}
                    variant="standard"
                    value={groupName}
                    onChange={(e) => {
                        setFieldError(false); 
                        return onGroupNameChange(e);
                    }}
                    error={fieldError}
                    fullWidth 
                    required
                />
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{backgroundColor: '#3ED3D6'}}
                >
                    Create Group
                </Button>
            </div>
        </div>
    );
}

export default CreateGroup;
