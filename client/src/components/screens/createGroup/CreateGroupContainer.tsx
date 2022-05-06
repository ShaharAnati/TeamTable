import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useAuth } from 'src/auth/AuthProvider';
import CreateGroup from './CreateGroup';


const CreateGroupContainer: React.FC = (): JSX.Element => {
    
    const [groupName, setGroupName] = useState<string>('');
    const { loggedInUser: {email: creator} } = useAuth()

    const onSubmitGroupCreationForm = async (): Promise<void> => {
        const newGroup = await axios.post('http://localhost:3000/groups', {name: groupName, creator}) // TODO: remove localhost
    }

    return <CreateGroup 
                onSubmit={onSubmitGroupCreationForm}
                groupName={groupName} 
                onGroupNameChange={event => setGroupName(event.target.value)}
            />
}

export default CreateGroupContainer;
