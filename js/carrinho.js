class Carrinho {
    constructor() {
        this.itens = this.lerDoLocalStorage();
    }

    lerDoLocalStorage() {
        return JSON.parse(localStorage.getItem("carrinho")) || [];
    }

    salvarNoLocalStorage() {
        localStorage.setItem("carrinho", JSON.stringify(this.itens));
    }

    add(produto) {
        this.itens = this.lerDoLocalStorage(); 
        const existing = this.itens.find(p => p.id === produto.id);
        const quantidadeToAdd = produto.quantidade || 1;

        if (existing) {
            existing.quantidade += quantidadeToAdd;
        } else {
            this.itens.push({ ...produto, quantidade: quantidadeToAdd });
        }
        this.salvarNoLocalStorage();
    }

    remove(id) {
        this.itens = this.lerDoLocalStorage();
        this.itens = this.itens.filter(p => p.id !== id);
        this.salvarNoLocalStorage();
    }

    clear() {
        this.itens = [];
        this.salvarNoLocalStorage();
    }

    getItems() {
        this.itens = this.lerDoLocalStorage();
        return this.itens;
    }

    getTotal() {
        this.itens = this.lerDoLocalStorage();
        return this.itens.reduce((sum, p) => sum + (p.preco || 0) * p.quantidade, 0);
    }
}


const Cart = new Carrinho();
window.Cart = Cart;