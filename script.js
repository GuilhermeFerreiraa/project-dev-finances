//todo objeto tem propriedades e funcionalidades
const Modal = {
    open (){
        //Abrir Modal
        //Adicionar a classe active ao Modal
    document //document = dom - modelo de html
    .querySelector('.modal-overlay') 
    .classList
    .add('active')
    },
    close (){
        // Fechar Modal
        //Remover a classe active do Modal
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
} 

//array é uma lista/coleção de objetos
const Storage = { //preciso transformar um Array em uma String
    //para realizar esse processo, vou utilizar o JSON
    //parse vai transformar o array em string 
    get() {
      return JSON.parse(localStorage.getItem("dev.finances:transactions")) || 
      []
    },

    //sempre armazenamos chave e valor no local storage
    // todo objeto tem chave e valor
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify
        (transactions))
        
    }
}

const Transaction = {
    //adicionar transações,
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    }, 

    incomes() {
        let income = 0;
        // pegar todas as transações
        //para cada transação 
        Transaction.all.forEach(Transaction =>{
            //se a transação é maior que zero
            if (Transaction.amount > 0 ) {
                //somar a uma variavel e retornar a variavel 
                income += Transaction.amount;
            }
        
        })
        //somar a uma variavel e retornar a variavel 
        return income;

    },
    expenses(){
        let expense = 0;
        // pegar todas as transações
        //para cada transação 
        // refatoração - É NECESSÁRIO - att de melhorias 
        Transaction.all.forEach(Transaction =>{
            //se a transação é maior que zero
            if (Transaction.amount < 0 ) {
                //somar a uma variavel e retornar a variavel 
                expense += Transaction.amount;
            }
        
        })
        //se for - somar uma variavel e retornar a variavel 
        return expense;
    },
    total() {
        //entradas - saídas
        return Transaction.incomes() + Transaction.expenses();

    }
}
//Substituir os dados do html com os dados do javascript
//FORMATAÇÃO DA MOEDA
const Utils = {

    
    formatAmount(value){
        value = Number(value) * 100
        return value
    },

    formatDate(date){
        let splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : " "
//replace troca 
//  \ escape
// /  /  = definem a expressão regular
// g = realiza a pesquisa global
//  \D = busque apenas por números
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return (signal + value)
    }
}
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),


    addTransaction (transaction, index) { //index vai receber a posição do array armazenada no objeto
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) 
        tr.InnerHTML = index;
        //appendCHild é uma funcionalidade para adicioanr uma funcionalidade    
        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
          // se o dado é verdadeiro ou falso - ex: varial.A > (> - se é maior do que) 
         // 0 - valor 
        // ? entao
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)
        
    
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img class="icon-remove" onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação">
        </td>
    `
    return html

    },
    updateBalance(){
        document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses());
        document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = '';
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },
    validateFields(){
        // verificar se todas as informações foram preenchidas
        const { description, amount, date } = Form.getValues()
        
        if( description.trim() == "" || //verificando se o description/amount/date esta vazio
            amount.trim() == "" ||
            date.trim() == "") {
                throw new Error("Por favor Preencha os campos! ")
        }
    },

    formatValues(){
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)
        
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }

    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()
        
        try {
            Form.validateFields() 
            // dados formatados 
            const transaction = Form.formatValues()
            // salvar
            // atualizar a aplicação
            Transaction.add(transaction)
            // apagar os dados do formulario
            Form.clearFields()
            // modal feche
            Modal.close()            
        } catch (error) {
            alert(error.message)
        }



       
    }
}

const App = {
    init() {
        // for é uma  estrutura de repetição - ex: for (let i = 0; i < 3; i++){}
        //forEach é uma funcionalidade que existe para objetos do tipo Array
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()
        Storage.set(Transaction.all)
   
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}
App.init()


