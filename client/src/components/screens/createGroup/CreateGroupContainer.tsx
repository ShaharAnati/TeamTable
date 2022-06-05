import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from 'src/auth/AuthProvider';
import CreateGroup from './CreateGroup';
import { useNavigate } from "react-router-dom";
import GroupsList from './GroupsList';

const CreateGroupContainer: React.FC = (): JSX.Element => {
    const [groupName, setGroupName] = useState<string>('');
    const { loggedInUser } = useAuth();
    const creator = loggedInUser?.email;
    const navigate = useNavigate();
    const creatorEmail = sessionStorage.getItem('user_email')

    const onSubmitGroupCreationForm = async (): Promise<void> => {
        const sessionStorageUser = sessionStorage.getItem('user_token');
        const body = {name: groupName, creator, members: [{ username: creatorEmail }] };
        const newGroup = await axios.post('/groups', body, {
            headers: {
                'x-access-token': sessionStorageUser,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }); // TODO: remove localhost
        navigate('/group-page/' + newGroup.data.id)
    }

    return (
        <>
          <CreateGroup
            onSubmit={onSubmitGroupCreationForm}
            groupName={groupName}
            onGroupNameChange={(event) => setGroupName(event.target.value)}
          />
          <GroupsList />
        </>
      );
}

export default CreateGroupContainer;
