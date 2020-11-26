const myTeam = [
    {
        name: 'yeonsang',
        age: 21,
        printInfo: function(){
            console.log(`이름: ${this.name}, 나이: ${this.age}`);
        }
    },
    {
        name: 'jungwoo',
        age: 23,
        printInfo: function(){
            console.log(`이름: ${this.name}, 나이: ${this.age}`)
        }
    }
];

myTeam.forEach(
    mate => {
        mate.printInfo();
    }
);