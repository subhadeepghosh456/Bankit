const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111
}

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222
}

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333
}

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
}

const accounts = [account1, account2, account3, account4]

// Elements
const labelWelcome = document.querySelector('.welcome')
const labelDate = document.querySelector('.date')
const labelBalance = document.querySelector('.balance__value')
const labelSumIn = document.querySelector('.summary__value--in')
const labelSumOut = document.querySelector('.summary__value--out')
const labelSumInterest = document.querySelector('.summary__value--interest')
const labelTimer = document.querySelector('.timer')

const containerApp = document.querySelector('.app')
const containerMovements = document.querySelector('.movements')

const btnLogin = document.querySelector('.login__btn')
const btnTransfer = document.querySelector('.form__btn--transfer')
const btnLoan = document.querySelector('.form__btn--loan')
const btnClose = document.querySelector('.form__btn--close')
const btnSort = document.querySelector('.btn--sort')

const inputLoginUsername = document.querySelector('.login__input--user')
const inputLoginPin = document.querySelector('.login__input--pin')
const inputTransferTo = document.querySelector('.form__input--to')
const inputTransferAmount = document.querySelector('.form__input--amount')
const inputLoanAmount = document.querySelector('.form__input--loan-amount')
const inputCloseUsername = document.querySelector('.form__input--user')
const inputClosePin = document.querySelector('.form__input--pin')

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
        </div>
        <div class="movements__value">${mov}€</div>
     </div>
      
      `

    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}

// CALCULATING total balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = `${acc.balance}€`
}

// calculating Display SUMMARY

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)

  labelSumIn.textContent = `${incomes}€`

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)

  labelSumOut.textContent = `${Math.abs(outcomes)}€`

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0)

  labelSumInterest.textContent = `${interest}€`
}

// create user name

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0]
      })
      .join('')

    //console.log(acc)
  })
}

createUsernames(accounts)

// Update UI
const updateUI = function (currentAccount) {
  displayMovements(currentAccount.movements)

  //Display balance

  calcDisplayBalance(currentAccount)

  //Display Summary
  calcDisplaySummary(currentAccount)
}

let currentAccount
// login user
btnLogin.addEventListener('click', function (e) {
  e.preventDefault()

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  )
  console.log(currentAccount)

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN')
    // Display UI and message
    labelWelcome.textContent = `Welcome back,${currentAccount.owner}`
    containerApp.style.opacity = 100
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''
    //Display movements
    updateUI(currentAccount)
  }
})

// transfer amount

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  )

  // console.log(amount,receiverAcc);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // console.log("transfer valid")
    currentAccount.movements.push(-amount)
    receiverAcc.movements.push(amount)

    updateUI(currentAccount)
  }
  inputTransferTo.value = inputTransferAmount.value = ''
})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault()
  const amount = Number(inputLoanAmount.value)

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add Movements
    currentAccount.movements.push(amount)

    //updateUI
    updateUI(currentAccount)
  }
  inputLoanAmount.value = ''
})

// close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault()
  console.log('Delete')

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    )

    console.log(index)
    //Delete Account
    accounts.splice(index, 1)

    // hide UI
    containerApp.style.opacity = 0
    inputLoginUsername.value = inputLoginPin.value = ''
  }
})

let sorted = false

btnSort.addEventListener('click', function (e) {
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted
})

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling']
])

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]

// const usd = movements.map(function(mov){
//   return mov * 1.1;
// });
// console.log(movements);
// console.log(usd)

// const dollatToUsd = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * 1.1)
//   .reduce((acc, mov) => acc + mov, 0)

// console.log(dollatToUsd)

// const account = accounts.find(acc => acc.owner === 'Jessica Davis')
// // console.log(account)
// const anyDeposit = movements.some(mov => mov > 0);
// console.log(anyDeposit)

// movements.sort((a,b)=>{
//   // switch order
//   if(a>b) return 1;
//   // keep order
//   if(a<b) return -1;
// });
// console.log(movements);

// const arr = [1,2,3,4,5,6,7,8,9];
// console.log(new Array(1,2,3,4,5,6,7,8,9));

// const x = new Array(7);

// console.log(x.fill(1));

// const y = Array.from({length:7},()=>1);

// console.log(y);

// const z = Array.from({length:7},(curr,i)=> i+1);
// console.log(z);

// labelBalance.addEventListener('click',function(){
//   const movementUI = Array.from(
//     document.querySelectorAll('.movements__value')
//   );
//   console.log(movementUI.map(el => el.textContent));
// })

const bankDepositSum = accounts
  .map(acc => acc.movements)
  .flat()
  .filter(mov => mov > 0)
  .reduce((acu, curr) => acu + curr, 0)

console.log(bankDepositSum)

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, curr) => (curr >= 1000 ? count + 1 : count), 0)

console.log(numDeposits1000)

const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposit += cur) : (sums.withdrawls += cur)
      return sums
    },
    { deposit: 0, withdrawls: 0 }
  );

  console.log(sums);
