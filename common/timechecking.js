// const isSameTime = (d1, d2) => {
//     d1 = new Date(d1);
//     d2 = new Date(d2);
//     return !isNaN(d1) && !isNaN(d2) &&
//         d1.getFullYear() === d2.getFullYear() &&
//         d1.getUTCMonth() === d2.getMonth() &&
//         d1.getDate() === d2.getDate() &&
//         d1.getHours() === d2.getHours() &&
//         d1.getMinutes() === d2.getMinutes();
// };

// const isSameTime = (d1) => {
//     const dateNow = new Date(d1);
//     const year = dateNow.getUTCFullYear(), month = String(dateNow.getUTCMonth() + 1).padStart(2, '0'), dateDay = String(dateNow.getUTCDate()).padStart(2, '0');
//     const hour = String(dateNow.getUTCHours()).padStart(2, '0'), min = String(dateNow.getUTCMinutes()).padStart(2,'0');
//     return new Date(`${year}-${month}-${dateDay}T${hour}:${min}:00.000Z`) ;
// }


// let date = "2025-06-18T11:01:00.000Z";
// const current = new Date()

// console.log(isSameTime(current) == isSameTime(date))

// console.log(isSameTime(date))
// console.log(isSameTime(current))

const isSameTime = (d1) => {
    const dateNow = new Date(d1);
    return new Date(Date.UTC(
        dateNow.getUTCFullYear(),
        dateNow.getUTCMonth(),
        dateNow.getUTCDate(),
        dateNow.getUTCHours(),
        dateNow.getUTCMinutes()
    ));
}

// let date = "2025-06-18T11:02:00.000Z";
// const current = new Date();

// const dateNow = `${date.getUTCFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}T${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
// console.log(dateNow)

// console.log(isSameTime(current) == isSameTime(date));
// console.log(isSameTime(date));
// console.log(isSameTime(current));

const current = new Date();

let date =new Date( "2025-06-18T11:23:00.000Z");
const dateNow = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}T${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
const currentTime = `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, '0')}-${String(current.getUTCDate()).padStart(2, '0')}T${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;

console.log(dateNow);
console.log(currentTime);
console.log(dateNow == currentTime)

console.log(date.toDateString() +date.toUTCString())
console.log(current.toDateString() +current.toISOString())



