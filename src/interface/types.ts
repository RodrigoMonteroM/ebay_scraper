interface IProduct{
    title: string;
    price: number;
    currency: string;
    link: string
    img: string
}

interface IPriceCurrency{
    price: number;
    currency: string;
}

interface IDBConfig{
    host: string,
    user: string,
    password: string,
    database: string
}

export {
    IProduct,
    IPriceCurrency,
    IDBConfig
}