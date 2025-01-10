import {
  Admin,
  Resource
} from "react-admin";
import { dataProvider } from "./dataProvider";
import { DocumentList, DocumentCreate, DocumentEdit } from "./documents";
import { UserList, UserCreate, UserEdit } from "./users";
import DocumentIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import CombinedAdminLayout from "./CombinedAdminLayout";

export const AdminApp = () => (
    <Admin dataProvider={dataProvider} layout={CombinedAdminLayout}>
    <Resource
        name="documents"
        list={DocumentList}
        edit={DocumentEdit}
        create={DocumentCreate}
        icon={DocumentIcon}
    />
    <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        icon={UserIcon}
    />
</Admin>
);
