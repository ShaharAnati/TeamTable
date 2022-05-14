import axios from 'axios';
import React, {useState} from 'react';
import {useAuth} from 'src/auth/AuthProvider';
import CreateGroup from './CreateGroup';
import {useNavigate} from "react-router-dom";

const CreateGroupContainer: React.FC = (): JSX.Element => {
    
    const [groupName, setGroupName] = useState<string>('');
    const { loggedInUser: {email: creator} } = useAuth()
    const navigate = useNavigate();

    const onSubmitGroupCreationForm = async (): Promise<void> => {
        const newGroup = await axios.post('http://localhost:3000/groups', {name: groupName, creator}) // TODO: remove localhost
        navigate('/group-page/' + newGroup.data.id)
    }

    return <CreateGroup 
                onSubmit={onSubmitGroupCreationForm}
                groupName={groupName} 
                onGroupNameChange={event => setGroupName(event.target.value)}
            />
}

export default CreateGroupContainer;
