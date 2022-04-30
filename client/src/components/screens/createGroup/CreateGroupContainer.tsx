import React from 'react';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import CreateGroup from './CreateGroup';

export interface CreateGroupProps {
    
}

const CreateGroupContainer: React.FC = (): JSX.Element => {
    
    const onSubmitGroupCreationForm = (): void => {
        console.log('submitted')
    }

    return <CreateGroup onSubmit={onSubmitGroupCreationForm}/>
}

export default CreateGroupContainer;
