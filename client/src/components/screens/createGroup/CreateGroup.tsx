import Button from '@mui/material/Button';
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface CreateGroupProps {
    onSubmit?: () => void;
}
const CreateGroup: React.FC<CreateGroupProps> = (props): JSX.Element => {
    
    const { onSubmit } = props;

    return (

            <Button 
                onClick={() => onSubmit()}
                variant="contained"
                sx={{backgroundColor: '#3ED3D6'}}
                component={Link}
                to="/group-page"
            >
                Create Group
            </Button>
    );
}

export default CreateGroup;
