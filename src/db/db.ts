import mysql from "mysql";
import { IProduct } from "../interface/types";

export class Database {
    public connection: mysql.Connection;
    constructor(dbConfig: mysql.ConnectionConfig) {
        this.connection = mysql.createConnection(dbConfig);
    }


    connect() {
        this.connection.connect((err) => {
            if (err) throw err;
        
        })
    }

    upload(product: IProduct) {
        const query = "INSERT INTO products (title, price, currency, link, img) VALUES (?, ?, ?, ?, ?)";
        const { title, price, img, currency, link } = product;
    
        const values = [title, price, currency, link, img];
    
        this.connection.query(query, values, (err, result) => {
            if (err) throw err;
    
        });
    }
    

    close() {
        this.connection.end(function (err) {
            if (err) throw err;
            console.log("Connection closed!");
        });
    }



}