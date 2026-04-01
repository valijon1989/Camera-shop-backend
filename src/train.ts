// const chalk = require("chalk"); // bu yerda chalk ni import qildik bundan maqsad
// // terminalda rangli yozish uchun ishlatiladi

// /*
// TASK ZD

// Shunday function yozing. Bu function o'ziga, parametr sifatida
// birinchi oddiy number, keyin yagona array va uchinchi bo'lib oddiy number
// qabul qilsin. Berilgan birinchi number parametr, arrayning tarkibida indeks bo'yicha hisoblanib,
// shu aniqlangan indeksni uchinchi number parametr bilan alashtirib, natija sifatida
// yangilangan arrayni qaytarsin.

// MASALAN: changeNumberInArray(1, [1,3,7,2], 2) return [1,2,7,2];

// Yuqoridagi misolda, birinchi raqam bu '1' va arrayning '1'chi indeksi bu 3.
// Bizning function uchinchi berilgan '2' raqamini shu '3' bilan almashtirib,
// yangilangan arrayni qaytarmoqda.
// */

// // function changeNumberInArray(index: number, arr: number[], newValue: number) {
// //   let newArr: number[] = [...arr];
// //   newArr[index] = newValue;
// //   console.log(newArr);
// // }

// // changeNumberInArray(1, [1, 3, 7, 2], 2);

// // {
//   /* TASK ZC

// Selisy (°C) shkalasi bo'yicha raqam qabul qilib, uni
// Ferenhayt (°F) shkalisaga o'zgaritib beradigan function yozing.

// MASALAN: celsiusToFahrenheit(0) return 32;
// MASALAN: celsiusToFahrenheit(10) return 50;

// Yuqoridagi misolda, 0°C, 32°F'ga teng.
// Yoki 10 gradus Selsiy, 50 Farenhaytga teng.

// °C va °F => Tempraturani o'lchashda ishlatiladigan o'lchov birligi. 

// function celsiusToFahrenheit(celsius: number): number {
//   return (celsius * 9) / 5 + 32;
// }

// console.log(celsiusToFahrenheit(0));
// console.log(celsiusToFahrenheit(10));
// console.log(celsiusToFahrenheit(25));


// */
//   /*  TASK ZA

// Shunday function yozing, u array ichidagi objectlarni
// 'age' qiymati bo'yicha sortlab bersin.

// MASALAN: sortByAge([{age:23}, {age:21}, {age:13}]) return [{age:13}, {age:21}, {age:23}]

// Yuqoridagi misolda, kichik raqamlar katta raqamlar tomon
// tartiblangan holatda return bo'lmoqda.


// type Person = {
//   age: number;
// };

// function sorting(people: Person[]): void {
//   const result = people.sort((a, b) => a.age - b.age);
//   console.log(result);
// }

// sorting([{ age: 23 }, { age: 21 }, { age: 13 }]);


// */
//   /*TASK Z

// Shunday function yozing. Bu function sonlardan iborat array
// qabul qilsin. Function'ning vazifasi array tarkibidagi juft
// sonlarni topib ularni yig'disini qaytarsin.

// MASALAN:
// sumEvens([1, 2, 3]); return 2;
// sumEvens([1, 2, 3, 2]); return 4;

// Yuqoridagi misolda, bizning funktsiya
// berilayotgan array tarkibidagi sonlar ichidan faqatgina juft bo'lgan
// sonlarni topib, ularni hisoblab yig'indisini qaytarmoqda.

// function sumEvens(numbers: number[]) {
//   const evenNumbers = numbers
//     .filter((num) => num % 2 === 0)
//     .reduce((totalValue, curValue) => {
//       return totalValue + curValue;
//     });
//   console.log(
//     `The total value of even numbers in the array is => ${chalk.red(
//       evenNumbers
//     )} `
//   );
// }

// sumEvens([1, 2, 3, 2, 8, 6, 2]);
// */
//   /**TASK Y

// Shunday function yozing, uni 2'ta array parametri bo'lsin.
// Bu function ikkala arrayda ham ishtirok etgan bir xil
// qiymatlarni yagona arrayga joylab qaytarsin.

// MASALAN: findIntersection([1,2,3], [3,2,0]) return [2,3]

// Yuqoridagi misolda, argument sifatida berilayotgan array'larda
// o'xshash sonlar mavjud. Function'ning vazifasi esa ana shu
// ikkala array'da ishtirok etgan o'xshash sonlarni yagona arrayga
// joylab return qilmoqda. 

// function findIntersection<T>(arr1: T[], arr2: T[]): T[] {
//   return arr1.filter(
//     (value, index) => arr2.includes(value) && arr1.indexOf(value) === index
//   );
// }

// console.log(findIntersection([1, 2, 3], [3, 2, 0]));*/
//   /** TASK X

// Shunday function yozing, uni object va string parametrlari bo'lsin.
// Bu function, birinchi object parametri tarkibida, kalit sifatida ikkinchi string parametri
// necha marotaba takrorlanganlini sanab qaytarsin.

// Eslatma => Nested object'lar ham sanalsin

// MASALAN: countOccurrences({model: 'Bugatti', steer: {model: 'HANKOOK', size: 30}}, 'model') return 2

// Yuqoridagi misolda, birinchi argument object, ikkinchi argument 'model'.
// Funktsiya, shu ikkinchi argument 'model', birinchi argument object
// tarkibida kalit sifatida 2 marotaba takrorlanganligi uchun 2 soni return qilmoqda

// function countOccurrences(obj: Record<string, any>, key: string): number {
//   let count = 0;

//   for (let k in obj) {
//     if (k === key) {
//       count++;
//     }
//     if (typeof obj[k] === "object" && obj[k] !== null) {
//       count += countOccurrences(obj[k], key);
//     }
//   }

//   return count;
// }

// console.log(
//   countOccurrences(
//     { model: "Bugatti", steer: { model: "HANKOOK", size: 30 } },
//     "model"
//   )
// );*/
//   /* TASK W

// Shunday function yozing, u o'ziga parametr sifatida
// yagona array va number qabul qilsin. Siz tuzgan function
// arrayni numberda berilgan uzunlikda kesib bo'laklarga
// ajratgan holatida qaytarsin.
// MASALAN: chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
// return [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];

// Yuqoridagi namunada berilayotgan array ikkinchi parametr 3'ga
// asoslanib 3 bo'lakga bo'linib qaytmoqda. Qolgani esa o'z holati qolyapti 

// function chunkArray(array: number[], size: number): number[][] {
//   const result: number[][] = [];

//   for (let i = 0; i < array.length; i += size) {
//     result.push(array.slice(i, i + size));
//   }

//   return result;
// }

// console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3));
// */
//   /*TASK V

// Shunday function yozing, uni string parametri bo'lsin.
// Va bu function stringdagi har bir harfni o'zi bilan
// necha marotaba taktorlanganligini ko'rsatuvchi object qaytarsin.
  
// MASALAN: countChars("hello") return {h: 1, e: 1, l: 2, o: 1}

// Yuqoridagi misolda, 'hello' so'zi tarkibida
// qatnashgan harflar necha marotaba takrorlangini bilan
// object sifatida qaytarilmoqda.
// function countChars(str: string): Record<string, number> {
//   const result: Record<string, number> = {};

//   for (const char of str) {
//     if (result[char]) {
//       result[char] += 1;
//     } else {
//       result[char] = 1;
//     }
//   }

//   return result;
// }

// console.log(countChars("hello"));
// */
//   /* TASK U

// Shunday function tuzing, uni number parametri bo'lsin.
// Va bu function berilgan parametrgacha, 0'dan boshlab
// oraliqda nechta toq sonlar borligini aniqlab return qilsi.

// MASALAN: sumOdds(9) return 4; sumOdds(11) return 5;

// Yuqoridagi birinchi misolda, argument sifatida, 9 berilmoqda.
// Va 0'dan boshlab sanaganda 9'gacha 4'ta toq son mavjud. 
// Keyingi namunada ham xuddi shunday xolat takrorlanmoqda. 

// function sumOdds(number: number) {
//   let count = 0;
//   for (let i = 0; i < number; i++) {
//     if (i % 2 !== 0) {
//       count++;
//     }
//   }
//   console.log(`Result: ${chalk.red(count)}`);
// }

// sumOdds(9);
// sumOdds(11);

// */
//   /* TASK T

// Shunday function tuzing, u sonlardan tashkil topgan 2'ta array qabul qilsin.
// Va ikkala arraydagi sonlarni tartiblab bir arrayda qaytarsin.

// MASALAN: mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]); return [0, 3, 4, 4, 6, 30, 31];

// Yuqoridagi misolda, ikkala arrayni birlashtirib, tartib raqam bo'yicha tartiblab qaytarmoqda. 


// function mergeSortedArrays(arr1: number[], arr2: number[]) {
//   const result = arr1.concat(arr2).sort((a, b) => a - b);
//   console.log(`Ordered list: ${chalk.red(result)}`);
// }

// mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]);*/
//   /*TASK S

// Shunday function tuzing, u numberlardan tashkil topgan array qabul qilsin
// va o'sha numberlar orasidagi tushib qolgan sonni topib uni return qilsin.

// MASALAN: missingNumber([3, 0, 1]); return 2

// Yuqoridagi misolda, berilayotgan sonlar tarkibini tartiblasak
// '2' soni tushib qolgan

// function missingNumber(arr: number[]): number {
//   const n: number = arr.length;
//   const expectedSum: number = (n * (n + 1)) / 2;
//   const actualSum: number = arr.reduce((sum, num) => sum + num, 0);
//   return expectedSum - actualSum;
// }

// console.log(missingNumber([3, 0, 1])); 
// */
//   /**TASK R

// Shunday function yozing, u string parametrga ega bo'lsin.
// Agar argument sifatida berilayotgan string, "1 + 2" bo'lsa,
// string ichidagi sonlarin yig'indisni hisoblab, number holatida qaytarsin

// MASALAN: calculate("1 + 3"); return 4;
// 1 + 3 = 4, shu sababli 4 natijani qaytarmoqda.

// function calculate(expression: string) {
//   const numbers = expression.split("+").map((str) => parseFloat(str.trim()));
//   return numbers.reduce((sum, num) => sum + num, 0);
// }

// console.log(calculate("1 + 3"));
//  */
//   /**TASK P:

// Parametr sifatida yagona object qabul qiladigan function yozing.
// Qabul qilingan objectni nested array sifatida convert qilib qaytarsin

// MASALAN: objectToArray( {a: 10, b: 20}) return [['a', 10], ['b', 20]] 

// function objectToArray(obj: Record<string, any>): [string, any][] {
//   return Object.entries(obj);
// }

// console.log(objectToArray({ a: 10, b: 20 }));*/
//   /*TASK O:

// Shunday function yozing va u har xil qiymatlardan iborat array qabul qilsin.
// Va array ichidagi sonlar yig'indisini hisoblab chiqgan javobni qaytarsin

// MASALAN: calculateSumOfNumbers([10, "10", {son: 10}, true, 35]); return 45

// Yuqoridagi misolda array tarkibida faqatgina ikkita yagona son mavjud bular 10 hamda 35
// Qolganlari nested bo'lib yoki type'lari number emas. 

// function calculateSumOfNumbers(arr: any[]): any {
//   console.log(
//     arr
//       .filter(
//         (item): item is number =>
//           typeof item === "number" && Number.isFinite(item)
//       )
//       .reduce((sum, num) => sum + num, 0)
//   );
// }

// calculateSumOfNumbers([10, "10", { son: 10 }, true, 35]);*/
//   /*TASK N:

// Parametr sifatida yagona string qabul qiladigan function tuzing.
// Va bu function string'ni palindrom so'z yoki palindrom so'z emasligini aniqlab (boolean)
// 'true' yokida 'false' qaytarsin.

// MASALAN: palindromCheck("dad") return true; palindromCheck("son") return false;
// Birinchi misolda 'dad' so'zini ikkala tarafdan o'qilganda ham bir xil ma'noni beradi (true)
// Ikkinchi misolda 'son' so'zini ikkala tarafdan o'qilganda bir xil ma'noni bermaydi (false)

// *Palindrom so'z deb o'ngdan chapga ham ~ chapdan o'ngga ham o'qilganda
// bir xil ma'noni beradigan so'zga aytiladi
// function palindromCheck(text: string) {
//   const check = text.split("").reverse().join("");
//   if (check == text) {
//     console.log(true);
//   } else {
//     console.log(false);
//   }
// }

// palindromCheck("ana");

// */
//   /** TASK M:

// Shunday function tuzing, u raqamlardan tashkil topgan array qabul qilsin
// va array ichidagi har bir raqam uchun raqamning o'zi va hamda o'sha raqamni kvadratidan
// tashkil topgan object hosil qilib, hosil bo'lgan objectlarni array ichida qaytarsin

// MASALAN: MASALAN:
//  getSquareNumbers([1, 2, 3]) return [{ number: 1, square: 1 }, { number: 2, square: 4 }, { number: 3, square: 9 }];
//  function getSquareNumbers(arr: number[]) {
//   console.log(arr.map((num) => ({ number: num, square: num * num })));
// }

// getSquareNumbers([1, 2, 3]);
// */
//   /**TASK L:

// So'zlarni ketma - ketligini buzmasdan har bir so'zni
// alohida teskarisiga o'girib beradigan fucntion tuzing.
// Funtion yagona string qabul qilsin

// MASALAN: reverseSentence("we like coding!") return "ew ekil !gnidoc";
// Qaytayotgan natijaga e'tibor bersangiz, so'zlar joyi o'zgarmasdan 
// turgan o'rnida teskarisiga o'girilmoqda
// function reverseSentence(text: string) {
//   const words = text.split(" ");
//   const reversedWords = words.map((word) => {
//     return word.split("").reverse().join("");
//   });
//   console.log(reversedWords.join(" "));
// }
// reverseSentence("we like coding!");
// */
//   /*TASK K:

// Berilayotgan parametr tarkibida nechta unli harf bor
// ekanligini aniqlovchi function tuzing

// MASALAN: countVowels("string"); return 1

// Yuqoridagi misolda 'string' so'zi tarkibida yagona unli harf 'i'
// bo'lganligi uchun '1'ni qaytarmoqda

// function countVowels(str: string) {
//   const matches = str.match(/[aeiou]/gi);
//   console.log(matches ? matches.length : 0);
// }

// countVowels("string");
// */
//   /*TASK J:

// Shunday function tuzing, u string qabul qilsin.
// Va string ichidagi eng uzun so'zni qaytarsin.

// MASALAN: findLongestWord("I came from Uzbekistan!"); return "Uzbekistan!"

// Yuqoridagi text tarkibida 'Uzbekistan'
// eng uzun so'z bo'lganligi uchun 'Uzbekistan'ni qaytarmoqda 
// function findLongestWord(text: string) {
//   const words = text.split(" ");
//   let longestWord = "";
//   for (const word of words) {
//     if (word.length > longestWord.length) {
//       longestWord = word;
//     }
//   }
//   console.log(`Textdagi eng uzun soz: ${chalk.red(longestWord)}`);
// }

// findLongestWord("I came from Uzbekistan!");
// */
//   /*TASK I:

// Shunday function tuzing, u parametrdagi array ichida eng ko'p
// takrorlangan raqamni topib qaytarsin.

// MASALAN: majorityElement([1, 2, 3, 4, 5, 4, 3, 4]); return 4

// Yuqoridag misolda argument sifatida kiritilayotgan array
//  tarkibida 4 soni ko'p takrorlanganligi uchun 4'ni return qilmoqda. 
 
 
//  function majorityElement(arr: number[]): number {
//   const freq: Record<number, number> = arr.reduce((acc, num) => {
//     acc[num] = (acc[num] || 0) + 1;
//     return acc;
//   }, {} as Record<number, number>);
//   const result = +Object.keys(freq).reduce((a, b) =>
//     freq[+a] > freq[+b] ? a : b
//   );
//   console.log(result);

//   return result;
// }

// majorityElement([1, 2, 3, 4, 5, 4, 3, 4]);*/
//   /*H2-TASK: 

// Shunday function tuzing, unga string argument pass bolsin. 
// Function ushbu agrumentdagi digitlarni yangi stringda return qilsin
// MASALAN: getDigits("m14i1t") return qiladi "141" 

// function getDigits(text: string): string {
//   return text
//     .split("")
//     .filter((ele) => ele >= "0" && ele <= "9")
//     .join("");
// }
// console.log(getDigits("m14i1t"));*/
//   /*H-TASK: 

// shunday function tuzing, u integerlardan iborat arrayni argument sifatida qabul qilib, 
// faqat positive qiymatlarni olib string holatda return qilsin
// MASALAN: getPositive([1, -4, 2]) return qiladi "12"

// function getPositive(list: number[]) {
//   const newList = list
//     .filter((ele) => {
//       return ele > 0;
//     })
//     .join("");
//   console.log(`Songgi natija: ${chalk.red(newList)}`);
// }

// getPositive([1, -4, 2, -5, 6]);
// */
//   /*TASK G:

// Yagona parametrga ega function tuzing.
// Va bu function parametr orqalik integer ma'lumot turlariga ega bo'lgan bir arrayni qabul qilsin.
// Ushbu function bizga arrayning tarkibidagi birinchi eng katta qiymatning indeksini qaytarsin.

// MASALAN: getHighestIndex([5, 21, 12, 21 ,8]); return qiladi 1 sonini
// Yuqoridagi misolda, birinchi indeksda 21 joylashgan.
// Va bu 21 soni arrayning tarkibidagi birinchi eng katta son hisobladi va bizga uning indeksi 1 qaytadi. 

// const getHighestIndex = [5, 21, 12, 21, 8];

// const highestIndex = getHighestIndex.reduce(
//   (maxIndex, curValue, curIndex, arr) => {
//     if (curValue > arr[maxIndex]) {
//       return curIndex;
//     } else {
//       return maxIndex;
//     }
//   },
//   0
// );

// console.log(highestIndex);

// //2nd version
// function highestIndex(a) {
//   const result = Math.max(...a);
//   console.log(result);
//   console.log(
//     `Arrayning eng katta valuesi ${result} va uning indexi ${a.indexOf(result)}`
//   );
// }
// highestIndex([5, 21, 12, 21, 8]);


// */
// // }

// /* Project standarts
//   -Logging standarts
//   -Naming standarts:
//     -CamelCase => variable, function, method
//     -Pascal => Classlar
//     -Kebeb => for folders
//     -Snake_ => css
//   -Error handling
// */
// /*INFO
// Architectural pattern:Backendni suyagi/ ER modeling ham shunday
// MVC= Model View Controller
// Dependency Infection => NestJsda ishlaydi, MVP

// Design pattern: Malum bolimlarni masalasini 
// hal qiladigan pattern
// Middleware, Decorator


// API REQUESTS:
//     1) TYPE       => Traditional api | Rest api | GraphQL api
//     2) METHOD     => GET | POST [GET- quirey] [POST - mutation]
//     3) STRUCTURE  => header(URL link) | body(POST/formga kiritilgan infolar)

//     (B)SSR da traditional api va rest api lar ishlatiladi
//     Rest API ozi SPA lar uchun ishlab chiqilgan

// // GET- data basedan malumot olish uchun ishlaydi
// //POST esa malumotni ozi bn olib keladi va database usha malumotni yozadi
// */


// /*
// TASK ZD

// Shunday function yozing. Bu function o'ziga, parametr sifatida
// birinchi oddiy number, keyin yagona array va uchinchi bo'lib oddiy number
// qabul qilsin. Berilgan birinchi number parametr, arrayning tarkibida indeks bo'yicha hisoblanib,
// shu aniqlangan indeksni uchinchi number parametr bilan alashtirib, natija sifatida
// yangilangan arrayni qaytarsin.

// MASALAN: changeNumberInArray(1, [1,3,7,2], 2) return [1,2,7,2];

// Yuqoridagi misolda, birinchi raqam bu '1' va arrayning '1'chi indeksi bu 3.
// Bizning function uchinchi berilgan '2' raqamini shu '3' bilan almashtirib,
// yangilangan arrayni qaytarmoqda.
// */


// // const chNumInArray = (index: number, arr: number[], newNumber: number) => {
// //   if (index < 0 || index >= arr.length) {
// //     throw new Error("Berilgan indeks massiv chegarasidan tashqarida!");
// //   }
// //   arr[index] = newNumber;
// //   return arr;
// // };

// // console.log(chNumInArray(1, [1, 3, 7, 2], 2));

// /*     
// TASK ZE

// Shunday function yozing, uni yagona string parametri mavjud bo'lsin.
// Bu function string tarkibidagi takrorlangan xarflarni olib tashlab qolgan
// qiymatni qaytarsin.

// // MASALAN: removeDuplicate('stringg') return 'string'

// // Yuqoridagi misolda, 'stringg' so'zi tarkibida 'g' harfi takrorlanmoqda
// // funktsiyamiz shu bittadan ortiq takrorlangan harfni olib natijani
// // qaytarmoqda.

// // **/

// // function removeDuplicate(str: string): string { //bu yerda string type ni qaytaradi
// //   let result = ''; //bu yerda result ni string type deb korsatib qoydik

// //   for (let i = 0; i < str.length; i++) { // endi busa string uzunligi
// //     if (!result.includes(str[i])) { //result ichida str[i] yoq bolsa
// //       result += str[i]; //result ga str[i] ni qoshib qoyamiz
// //     }
// //   }

// //   return result;
// // }

// // console.log(removeDuplicate("stringgerr"));

// // // Raqamlarga nisbatan takrorlangan raqamlarni olib tashlash
// // function removeDuplicateNumbers(arr: number[]): number[] { //bu yerda number[] type ni qaytaradi
// //   let result: number[] = []; //bu yerda result ni type ni korsatib qoydik

// //   for (let i = 0; i < arr.length; i++) { //arr.length bu array uzunligi
// //     if (!result.includes(arr[i])) { //result ichida arr[i] yoq bolsa
// //       result.push(arr[i]); //result ga arr[i] ni push qib qoyamiz
// //     }
// //   }

// //   return result;
// // }
// // console.log(removeDuplicateNumbers([1, 2, 2, 3, 4, 4, 5]));


// /*
// TASK ZF


// Shunday function yozing, uni string parametri bo'lsin.
// Ushbu function, har bir so'zni bosh harflarini katta harf qilib qaytarsin.
// Lekin uzunligi 1 yoki 2 harfga teng bo'lgan so'zlarni esa o'z holicha
// qoldirsin.

// MASALAN: capitalizeWords('name should be a string'); return 'Name Should be a String';

// Yuqoridagi misolda, bizning function, uzunligi 2 harfdan katta bo'lgan so'zlarnigina,
// birinchi harfini katta harf bilan qaytarmoqda.
// */


// // function capitalizeWords(str: string): string {
// //   const words = str.split(" ");
// //   const capitalizedWords = words.map((word) => {
// //     if (word.length > 2) {
// //       return word.charAt(0).toUpperCase() + word.slice(1);
// //     } else {
// //       return word;
// //     }
// //   });
// //   return capitalizedWords.join(" ");
// // }

// // console.log(capitalizeWords("Allohim ilmimizga ilm sabrimizga sabr va har bir kunimizga baraka bergin!"));




// /*
// TASK ZG

// String sifatida berilgan string parametrni
// snake case'ga o'tkazib beradigan function yozing.

// MASALAN: convertToSnakeCase('name should be a string')
// return 'name_should_be_a_string'
// */

// // function convertToSnakeCase(str: string): string {
// //   return str.trim().toLowerCase().replace(/\s+/g, "_");
// // }

// // console.log(convertToSnakeCase("ilmimizga ilm sabrimizga sabr va har bir kunimizga baraka bergin!"));

// /*
// TASK ZH

// Shunday function yozing, u berilgan array parametri ichidagi
// raqamlar orasidan, tartib bo'yicha eng kichik raqamdan, eng katta raqamgacha
// tushirib qoldirilgan sonlarni o'zinigina topib bir array sifatida qaytarsin.
  
// MASALAN: findDisappearedNumbers([1, 3, 4, 7]); return [2, 5, 6];

// Yuqoridagi misolda, eng katta raqam bu 7 va eng kichik raqam bu 1.
// Function'ning vazifasi berilgan sonlar ichidan tushirib qoldirilgan
// sonlarnigina topib qaytarmoqda.
// */

// // function findDisappearedNumbers(nums: number[]): number[] {
// //   const n = nums.length;
// //   const result: number[] = [];
// //   for (let i = 0; i < n; i++) {
// //     const index = Math.abs(nums[i]) - 1;
// //     nums[index] = -Math.abs(nums[index]);
// //   }
// //   for (let i = 0; i < n; i++) {
// //     if (nums[i] > 0) {
// //       result.push(i + 1);
// //     }
// //   }
// //   return result;
// // }

// // console.log(findDisappearedNumbers([4, 3, 2, 8, 2, 3, 1]));


// /*
// TASK ZI

// Shundan function yozing, bu function 3 soniydan so'ng
// "Hello World!" so'zini qaytarsin.

// MASALAN: delayHelloWorld("Hello World"); return "Hello World";
// */


// // function delayHelloWorld(message: string): Promise<string> { //bu yerda string type ni qaytaradi
// //   return new Promise((resolve) => { //bu yerda resolve ni qaytaradi
// //     setTimeout(() => { // setTimeoutda 3 sekunddan so'ng "Hello World!" so'zini qaytaradi
// //       resolve(message);
// //     }, 3000);
// //   });
// // }

// // // call
// // delayHelloWorld("Hello World!").then((result) => { //bu yerda result ni qaytaradi
// //   console.log(result); 
// // });


// /*
// TASK ZJ:

// Shunday function yozing, u berilgan array ichidagi
// raqamlarni qiymatini hisoblab qaytarsin.

// MASALAN: reduceNestedArray([1, [1, 2, [4]]]); return 8;

// Yuqoridagi misolda, array nested bo'lgan holdatda ham,
// bizning function ularning yig'indisini hisoblab qaytarmoqda.
// */


// // function reduceNestedArray(arr: any[]): number {
// //   let sum = 0;

 
// //   for (const item of arr) {
// //     if (Array.isArray(item)) {
// //       sum += reduceNestedArray(item); 
// //     } else if (typeof item === 'number') {
// //       sum += item;
// //     }
// //   }

// //   return sum;
// // }

// // console.log(reduceNestedArray([1,[2, -5], [1, 2, 6, [4]]])); 


/* 
pm2 cammands:
pm2 start dist/server.js --name=CAMERA_UZ
pm2 start "npm run start:dev" --name=CAMERA_UZ
pm2 restart CAMERA_UZ
pm2 stop id
pm2 delete id
pm2 list
pm2 logs CAMERA_UZ
pm2 monit CAMERA_UZ
pm2 save
pm2 startup bu nima qiladi: https://pm2.io/docs/en/usage/quick-start/
*/