import { ArrayField, ChipField, Create, Datagrid, DateField, List, NumberField, ReferenceInput, SingleFieldList, TextField, UrlField } from 'react-admin';
import { Edit, SimpleForm, TextInput, DateInput, ArrayInput, SimpleFormIterator, SelectInput, AutocompleteInput } from 'react-admin';
import MyUrlField from './MyUrlField';

// const documentFilters = [
//     <TextInput source="q" label="Search" alwaysOn />,
// ];

export const DocumentList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            {/* <MyUrlField source="source_url" /> */}
            <TextField source="year_published" />
            {/* <TextField source="summary" /> */}
            <TextField source="resource_type" />
            <ArrayField source="tags"><SingleFieldList><ChipField source="name" /></SingleFieldList></ArrayField>
            <DateField source="created_at" />
            <DateField source="updated_at" />
        </Datagrid>
    </List>
);

const categoryChoices = [
    { id: 'region', name: 'region' },
    { id: 'topic', name: 'topic' },
    { id: 'technology', name: 'technology' },
    { id: 'framework', name: 'framework' },
    { id: 'country', name: 'country' },
    { id: 'product_lifecycle', name: 'product_lifecycle' },
    { id: 'customer_journey', name: 'customer_journey' },    { id: 'customer_journey', name: 'customer_journey' },
    { id: 'unknown', name: 'unknown' },
];

export const DocumentEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="title" />
            <TextInput source="source_url" />
            <TextInput source="year_published" />
            <TextInput source="summary" multiline rows={5}/>
            <TextInput source="resource_type" />
            <ArrayInput source="tags">
                <SimpleFormIterator>
                    <TextInput source="name" />
                    <AutocompleteInput source="category" choices={categoryChoices} />
                </SimpleFormIterator>
            </ArrayInput>
            {/* <DateInput source="created_at" />
            <DateInput source="updated_at" /> */}
        </SimpleForm>
    </Edit>
);

export const DocumentCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="source_url" />
            <TextInput source="year_published" />
            <TextInput source="summary" multiline rows={5}/>
            <TextInput source="resource_type" />
            <ArrayInput source="tags">
                <SimpleFormIterator>
                    <TextInput source="name" />
                    <AutocompleteInput source="category" choices={categoryChoices} />
                </SimpleFormIterator>
            </ArrayInput>
            {/* <DateInput source="created_at" />
            <DateInput source="updated_at" /> */}
        </SimpleForm>
    </Create>
);