import { BooleanField, Create, Datagrid, EmailField, List, PasswordInput, TextField } from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid>
            <EmailField source="email" />
            <BooleanField source="is_active" />
            <BooleanField source="is_superuser" />
            <TextField source="id" />
        </Datagrid>
    </List>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="email" />
            <BooleanInput source="is_active" />
            <BooleanInput source="is_superuser" />
            <TextInput source="id" disabled />
        </SimpleForm>
    </Edit>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="email" />
            <PasswordInput source="password" />
            <BooleanInput source="is_active" />
            <BooleanInput source="is_superuser" />
        </SimpleForm>
    </Create>
);