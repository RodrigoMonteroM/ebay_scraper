export function parsePrice(str: string): number {
    const regex = /\d+([.,]\d+)?/g;

    const result = str.match(regex);

    if (!result) return -1;

    const price = result[0];

    return +price.replace(",", ".");


}

export function getCurrency(str: string): string {
    let arr = str.split(" ");
    arr = arr.slice(0, 2)
    let currency = "";


    const regex = /^[0-9.,]$/;
    for (let i = 0; i < str.length; i++) {
        if (!str[i].match(regex)) {
            currency += str[i];
        } else {
            break;
        }
    }



    return currency.trim();
}