
export interface Department {
    uid: string;
    name: string;
}

export interface Roles {
    root?: boolean;
    admin?: boolean;
    subscriber?: boolean;
}

export interface User {
    uid: string;
    email: string;
    name: string;
    roles: Roles;
    departments: Department[];
}
